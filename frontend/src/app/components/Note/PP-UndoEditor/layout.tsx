"use client";

import {
  DefaultDashStyle,
  Editor,
  StoreSnapshot,
  TLEventMapHandler,
  TLParentId,
  TLRecord,
  TLShapeId,
  Tldraw,
} from "@tldraw/tldraw";
import "@tldraw/tldraw/tldraw.css";
import { useCallback, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { uiOverrides } from "./ui-overrides";
import { PressureEraserTool } from "./PressureEraseTool/PressureEraserTool";
import { ToolPressureEraseIcon } from "./PressureEraseTool/icon/tool-pressure-erase";
import { getAverageOfNumberList } from "@/app/modules/common/getAcerageOfNumberList";
import { strokePressureInfoAtom, useStrokePressureInfo } from "@/app/hooks";
import { useAtom } from "jotai";
import PPUndoGraph from "./PP-UndoGraph/layout";
import NowAvgPressureGauge from "./NowAvgPressureGauge/layout";
import { EditorUtils } from "./util";
import uploadSvg from "@/app/lib/upload/svg";
import uploadJson from "@/app/lib/upload/json";
import { useRouter } from "next/navigation";
import { getNoteByID, updateNote } from "@/app/lib/note";
import {
  TLCamera,
  TLGroupDrawArea,
  TLGroupVisualMode,
  TLNoteData,
  TLNoteSettings,
  TLStrokePressureInfo,
} from "@/@types/note";
import { generateRandomString } from "@/app/modules/common/generateRandomString";
import {
  noteOperationInfoAtom,
  strokePressureInfoStoreAtom,
  strokeTimeInfoAtom,
} from "@/app/hooks/atoms/note";
import calculateDistance from "@/app/modules/note/calculateDistance";
import { Lang } from "../../common/lang";
import GroupAreaVisualizer from "./Grouping/GroupAreaVisualizer";
import PPLayer from "./Layer/layout";
import PPLayerVisualizer from "./Layer/layout";
import { isEnclosing } from "@/app/modules/note/isStrokeEnclosing";
import SettingModal from "./Settings/layout";

// const customShapeUtils = [CardShapeUtil];
const customTools = [PressureEraserTool];
let isFinishedDraw = false;
let drawingStrokeId: string = "";
let drawingPressureList: number[] = [];
let noteData: TLNoteData | null = null;
let startTime: number = 0;
let endTime: number = 0;

interface Props {
  width: string | number;
  height: string | number;
  graphWidth?: string | number;
  graphHeight?: string | number;
  graphPadding?: string | number;
  graphBackground?: string;
  defaultCurrentTool?: "eraser" | "draw" | "select" | "hand";
  isDebugMode?: boolean;
  isIncludePressureEraser?: boolean;
  isDisplayChangePageButton?: boolean;
  isHideUI?: boolean;
  isDemo?: boolean;
  mode?: string | string[] | undefined;
  lang?: string | string[] | undefined;
  id?: string | string[] | undefined;
}

export default function PPUndoEditor(props: Props) {
  const {
    width,
    height,
    graphWidth = "25vw",
    graphHeight = "100vh",
    graphPadding = 8,
    graphBackground = "#1e1e1e",
    defaultCurrentTool = "draw",
    isDebugMode = false,
    isIncludePressureEraser = true,
    isDisplayChangePageButton = true,
    isHideUI = false,
    isDemo = false,
    mode,
    lang,
    id,
  } = props;
  const [editor, setEditor] = useState<Editor>();
  const [strokeTimeInfo] = useAtom(strokeTimeInfoAtom);
  const [noteOperationInfo] = useAtom(noteOperationInfoAtom);
  const [strokePressureInfo] = useAtom(strokePressureInfoAtom);
  const [strokePressureInfoStore] = useAtom(strokePressureInfoStoreAtom);
  const [pointerPosition, setPointerPosition] = useState({ x: 0, y: 0 });
  const [nowAvgPressure, setNowAvgPressure] = useState<number>(0);
  const [wasDrawingStrokeNum, setWasDrawingStrokeNum] = useState<number>(0);
  const [isResetStrokePressure, setIsResetStrokePressure] =
    useState<boolean>(false);
  const [camera, setCamera] = useState<TLCamera>({ x: 0, y: 0, z: 1 });
  const [groupAreas, setGroupAreas] = useState<TLGroupDrawArea[]>([]);
  const [wTime, setWTime] = useState<number>(0.7);
  const [wPressure, setWPressure] = useState<number>(0.25);
  const [wDistance, setWDistance] = useState<number>(0.5);
  const [boundaryValue, setBoundaryValue] = useState<number>(0.3);
  const [isOperatingGroupID, setIsOperatingGroupID] = useState<number | null>(
    null
  );
  const [pMode, setPMode] = useState<"grouping" | "average">("grouping");
  const [isShowLayer, setIsShowLayer] = useState<boolean>(false);
  const [isEnclose, setIsEnclose] = useState<boolean>(false);
  const [
    avgPressureForUpdateGroupPressures,
    setAvgPressureForUpdateGroupPressures,
  ] = useState<number[]>([]);
  const [groupVisualMode, setGroupVisualMode] =
    useState<TLGroupVisualMode>("area");
  const [enclosingStroke, setEncloseStroke] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
    pressure: number;
  } | null>(null);
  const [settings, setSettings] = useState<TLNoteSettings>({availableEnclosed: true})
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const maxTime = 30000;
  const maxPressure = 1;
  const maxDistance = 1000;

  const {
    // strokeTimeInfo,
    clearStrokePressureInfo,
    addStrokePressureInfo,
    addStrokeTimeInfo,
    addNoteOperationInfo,
    initializeNoteOperationInfo,
    initializeStrokeTimeInfo,
    clearStrokeInfo,
    onlyInitializeStrokePressureInfo,
    onlyInitializeStrokePressureInfoStore,
  } = useStrokePressureInfo();
  const [editorUtils, setEditorUtils] = useState<EditorUtils>();
  const [container, setContainer] = useState<HTMLElement | null>(null);

  const l =
    lang === undefined || Array.isArray(lang) ? new Lang() : new Lang(lang);

  const setAppToState = useCallback((editor: Editor) => {
    // debugMode解除
    editor.updateInstanceState({ isDebugMode: isDebugMode });
    editor.setCurrentTool(defaultCurrentTool);
    setEditor(editor);
    setEditorUtils(new EditorUtils(editor));
  }, []);

  const finishDrawing = () => {
    isFinishedDraw = true;
    endTime = performance.now();
    const drawTime = endTime - startTime;

    addStrokeTimeInfo(
      drawingStrokeId,
      drawTime,
      startTime,
      drawingPressureList.length
    );
    // FIXME: draw以外のoperationも追加する
    addNoteOperationInfo("draw", drawingStrokeId, startTime);
    if (editorUtils === undefined) return;
    const erasingShapeIds = editorUtils.getErasingShapes();
    if (erasingShapeIds.length > 0) {
      editorUtils.deleteShapes(erasingShapeIds);
    }
    editorUtils.setErasingShapes([]);
  };

  const findStrokeGroup = (records: any[]) => {
    if (editorUtils === undefined) return;
    let isCreateNewGroup = false;
    console.log(strokeTimeInfo);
    // FIXME: Undo時の条件にも対応させる
    const lastDrawEndTime =
      Object.keys(strokeTimeInfo).length === wasDrawingStrokeNum + 1 ||
      Object.keys(strokeTimeInfo).length < 2
        ? 0
        : strokeTimeInfo[
            Object.keys(strokeTimeInfo)[Object.keys(strokeTimeInfo).length - 2]
          ].startTime +
          strokeTimeInfo[
            Object.keys(strokeTimeInfo)[Object.keys(strokeTimeInfo).length - 2]
          ].drawTime;
    const drawStartTime =
      strokeTimeInfo[
        Object.keys(strokeTimeInfo)[Object.keys(strokeTimeInfo).length - 1]
      ].startTime;
    const diffTime = drawStartTime - lastDrawEndTime;

    const avgPressure = getAverageOfNumberList(drawingPressureList);

    const lastRecord =
      records[records.length - 1].type === "draw"
        ? records[records.length - 1]
        : null;
    const secondLastRecord =
      records[records.length - 2].type === "draw"
        ? records[records.length - 2]
        : null;
    if (secondLastRecord === null) {
      isCreateNewGroup = true;
      addStrokePressureInfo(
        drawingStrokeId,
        groupAreas.length + 1,
        avgPressure,
        avgPressure,
        editorUtils.getShapeColor(drawingStrokeId as TLParentId)
      );
      drawingStrokeId = "";
      drawingPressureList = [];
      setPointerPosition({ x: 0, y: 0 });
      startTime = 0;
      endTime = 0;
    } else {
      // Calculate the minimum distance
      try {
        const lastRecordX = lastRecord.x;
        const lastRecordY = lastRecord.y;
        const lastRecordPoints = lastRecord.props.segments[0].points;
        const secondLastRecordX = secondLastRecord.x;
        const secondLastRecordY = secondLastRecord.y;
        const secondLastRecordPoints =
          secondLastRecord.props.segments[0].points;
        const minDistance = calculateDistance(
          lastRecordX,
          lastRecordY,
          lastRecordPoints,
          secondLastRecordX,
          secondLastRecordY,
          secondLastRecordPoints
        );

        // Calculate the pressure difference
        const secondLastStrokePressure =
          strokePressureInfo[secondLastRecord.id] &&
          strokePressureInfo[secondLastRecord.id].avg
            ? strokePressureInfo[secondLastRecord.id].avg
            : secondLastRecordPoints
                .map((point: any) => (point.z >= 1 ? 1 : point.z))
                .reduce((a: number, b: number) => a + b) /
              secondLastRecordPoints.length;
        const diffPressure = Math.abs(avgPressure - secondLastStrokePressure);

        // Calculate the score
        const timeScore = diffTime / maxTime;
        const pressureScore = diffPressure / maxPressure;
        const distanceScore = minDistance / maxDistance;
        const score =
          wTime * timeScore +
          wPressure * pressureScore +
          wDistance * distanceScore;
        console.log(score);
        if (score >= boundaryValue) {
          isCreateNewGroup = true;
        }
        console.log(editorUtils.getAllRecords());
        if (isCreateNewGroup) {
          if (
            strokePressureInfo[secondLastRecord.id] &&
            strokePressureInfo[secondLastRecord.id].groupID
          ) {
            addStrokePressureInfo(
              drawingStrokeId,
              strokePressureInfo[secondLastRecord.id].groupID + 1,
              avgPressure,
              avgPressure,
              editorUtils.getShapeColor(drawingStrokeId as TLParentId)
            );
          } else if (
            strokePressureInfo[lastRecord.id] &&
            strokePressureInfo[lastRecord.id].groupID
          ) {
            addStrokePressureInfo(
              drawingStrokeId,
              strokePressureInfo[lastRecord.id].groupID + 1,
              avgPressure,
              avgPressure,
              editorUtils.getShapeColor(drawingStrokeId as TLParentId)
            );
          } else {
            // strokePressureInfoの中で最も大きいgroupIDを取得
            const groupIDs = Object.values(strokePressureInfo).map(
              (info) => info.groupID
            );
            const maxGroupID = Math.max(...groupIDs);
            addStrokePressureInfo(
              drawingStrokeId,
              maxGroupID,
              avgPressure,
              avgPressure,
              editorUtils.getShapeColor(drawingStrokeId as TLParentId)
            );
          }
        } else {
          if (
            strokePressureInfo[secondLastRecord.id] &&
            strokePressureInfo[secondLastRecord.id].groupID
          ) {
            addStrokePressureInfo(
              drawingStrokeId,
              strokePressureInfo[secondLastRecord.id].groupID,
              avgPressure,
              strokePressureInfo[secondLastRecord.id].group,
              editorUtils.getShapeColor(drawingStrokeId as TLParentId)
            );
          } else if (
            strokePressureInfo[lastRecord.id] &&
            strokePressureInfo[lastRecord.id].groupID
          ) {
            addStrokePressureInfo(
              drawingStrokeId,
              strokePressureInfo[lastRecord.id].groupID,
              avgPressure,
              strokePressureInfo[lastRecord.id].group,
              editorUtils.getShapeColor(drawingStrokeId as TLParentId)
            );
          } else {
            // strokePressureInfoの中で最も大きいgroupIDを取得
            const groupIDs = Object.values(strokePressureInfo).map(
              (info) => info.groupID
            );
            const maxGroupID = Math.max(...groupIDs);
            // groupAreaでmaxGroupIDと一致する要素のgroupPressureを取得
            const groupPressure = groupAreas.filter(
              (area) => area.groupID === maxGroupID
            )[0]
              ? groupAreas.filter((area) => area.groupID === maxGroupID)[0]
                  .groupPressure
              : 0;
            addStrokePressureInfo(
              drawingStrokeId,
              maxGroupID,
              avgPressure,
              groupPressure ?? 0,
              editorUtils.getShapeColor(drawingStrokeId as TLParentId)
            );
          }
        }
        drawingStrokeId = "";
        drawingPressureList = [];
        setPointerPosition({ x: 0, y: 0 });
        startTime = 0;
        endTime = 0;
      } catch (e) {
        console.error(e);
        alert(
          "Failed to draw stroke. Sorry for the inconvenience. Please try again."
        );
        editorUtils.undo();
      }
    }
  };

  useEffect(() => {
    // Processing for grouping
    if (
      Object.keys(strokeTimeInfo).length !== 0 &&
      isFinishedDraw &&
      editorUtils
    ) {
      const allRecords: any[] = editorUtils.getAllRecords();
      findStrokeGroup(allRecords);
    }
  }, [strokeTimeInfo]);

  let enclosingStrokeIds: TLShapeId[] = [];

  const drawing = (allRecords: any) => {
    if (
      allRecords[allRecords.length - 1].type === "draw" &&
      allRecords[allRecords.length - 1].props.isComplete === false
    ) {
      if (drawingPressureList.length === 0) {
        setPointerPosition({
          x: allRecords[allRecords.length - 1].x,
          y: allRecords[allRecords.length - 1].y,
        });
        startTime = performance.now();
      }
      isFinishedDraw = false;
      const segments = allRecords[allRecords.length - 1].props.segments;
      const points = segments[0].points;
      const lastPoints = points[points.length - 1];
      const drawingPressure = lastPoints.z >= 1 ? 1 : lastPoints.z;
      drawingStrokeId = allRecords[allRecords.length - 1].id;
      drawingPressureList.push(drawingPressure);
      setNowAvgPressure(getAverageOfNumberList(drawingPressureList));
      // setNowAvgPressure(Math.random());

      // ===================================================================
      // 囲って消す処理
      if (settings.availableEnclosed) {
        if (editorUtils !== undefined) {
          const gridSize = 10; // グリッドのサイズを適切に設定
          const densityThreshold = 2; // グリッドセルの密度の閾値を設定
          const areaThreshold = 2; // 十分な密度を持つセルの数の閾値を設定
          const centerThreshold = 2;
          const intersectionThreshold = 3; // 自己交差の閾値を設定
  
          const isEnclosingStroke = isEnclosing(
            points,
            gridSize,
            densityThreshold,
            areaThreshold,
            intersectionThreshold,
            centerThreshold
          );
  
          setIsEnclose(isEnclosingStroke);
  
          console.log(isEnclosingStroke);
          console.log(enclosingStrokeIds);
        }
      }
      // ここまで
      // ===================================================================
    }

    if (
      allRecords[allRecords.length - 1].type === "draw" &&
      allRecords[allRecords.length - 1].props.isComplete === true &&
      isFinishedDraw === false
    ) {
      enclosingStrokeIds = [];
      finishDrawing();
    }
  };

  useEffect(() => {
    if (settings.availableEnclosed) {
    if (isEnclose && editorUtils !== undefined) {
      const allRecords: any[] = editorUtils.getAllRecords();
      const enclosedStrokeIds = allRecords
        .filter(
          (record: any) =>
            record.type === "draw" &&
            record.id !== drawingStrokeId &&
            editorUtils.isStrokeEnclosed(
              record,
              allRecords[allRecords.length - 1]
            )
        )
        .map((record: any) => record.id);

      enclosedStrokeIds.forEach((id: TLShapeId) => {
        if (!enclosingStrokeIds.includes(id)) {
          switch (pMode) {
            case "grouping":
              if (nowAvgPressure >= strokePressureInfo[id].group) {
                enclosingStrokeIds.push(id);
              }
              break;
            case "average":
              if (nowAvgPressure >= strokePressureInfo[id].avg) {
                enclosingStrokeIds.push(id);
              }
              break;
            default:
              break;
          }
        }
      });

      const currentStrokeId = allRecords[allRecords.length - 1].id;
      if (!enclosingStrokeIds.includes(currentStrokeId)) {
        enclosingStrokeIds.push(currentStrokeId);
        editorUtils.setEnclosingShapeStyles(currentStrokeId, "red");
      }
      editorUtils.setErasingShapes(enclosingStrokeIds);
    }
    }
  }, [isEnclose]);

  useEffect(() => {
    if (isResetStrokePressure) {
      const allRecords = editorUtils?.getAllRecords()
      handleResetStrokePressureInfo(allRecords);
      setIsResetStrokePressure(false);
    }
  }, [isResetStrokePressure, isShowLayer]);

  const handleResetStrokePressureInfo = (allRecords: any) => {
    if (editorUtils === undefined) return;
    clearStrokePressureInfo();
    allRecords.forEach((record: any, _: number) => {
      if (record.typeName === "shape" && record.type === "draw") {
        // const points = record.props.segments[0].points;
        // const pressureList = points.map((point: any) =>
        //   point.z >= 1 ? 1 : point.z
        // );
        // const avgPressure = getAverageOfNumberList(pressureList);
        const info = strokePressureInfoStore[record.id];
        if (info) {
          addStrokePressureInfo(
            record.id,
            info.groupID,
            info.avg,
            info.group,
            editorUtils.getShapeColor(record.id as TLParentId)
          );
        }
      }
    });
  };

  useEffect(() => {
    // strokePressureInfoが{}だったらreturn
    if (
      strokePressureInfo === undefined ||
      strokePressureInfo === null
      // Object.keys(strokePressureInfo).length === 0
    ) {
      return;
    }
    const tmpDrawAreas = editorUtils?.getGroupDrawAreas(strokePressureInfo);
    if (tmpDrawAreas) {
      setGroupAreas(tmpDrawAreas);
    }
  }, [strokePressureInfo]);

  const getSvgAsString = async () => {
    if (!editorUtils) return;
    const svg = await editorUtils.getSvg().then((svg) => svg);
    if (svg) {
      const svgString = new XMLSerializer().serializeToString(svg);
      return svgString;
    }
    return;
  };

  const updateGroupPressure = (
    groupArea: TLGroupDrawArea,
    avgPressure: number
  ) => {
    // Get the ids from groupArea that are in strokePressureInfo, and set their group to avgPressure
    if (editorUtils === undefined) return;
    const groupAreaIds = groupArea.ids;
    console.log(groupAreas);
    for (const id of groupAreaIds) {
      if (strokePressureInfo[id]) {
        addStrokePressureInfo(
          id,
          groupArea.groupID,
          strokePressureInfo[id].avg,
          avgPressure,
          editorUtils.getShapeColor(id as TLParentId)
        );
      }
    }
  };

  // グループの合体処理
  const combineGroupArea = (
    fromGroupArea: TLGroupDrawArea,
    toGroupArea: TLGroupDrawArea
  ) => {
    if (editorUtils === undefined) return;
    const fromGroupAreaIds = fromGroupArea.ids;
    // const toGroupAreaIds = toGroupArea.ids;
    // fromGroupAreaのgroupIDとavgをtoGroupAreaのものに変更
    for (const id of fromGroupAreaIds) {
      if (strokePressureInfo[id]) {
        addStrokePressureInfo(
          id,
          toGroupArea.groupID,
          strokePressureInfo[id].avg,
          toGroupArea.groupPressure,
          editorUtils.getShapeColor(id as TLParentId)
        );
      }
    }
  };

  const BackButton = () => {
    const router = useRouter();

    const handleBack = async () => {
      if (!isDemo && id && editorUtils && noteData) {
        try {
          const svg = await getSvgAsString();
          const filename =
            noteData.SvgPath === "" || noteData.SvgPath === null
              ? `${generateRandomString()}`
              : noteData.SvgPath;
          if (svg) {
            await uploadSvg(svg, filename);
          }

          const operationJson = { data: noteOperationInfo };
          const operationFilename =
            noteData.OperationJsonPath === "" ||
            noteData.OperationJsonPath === null
              ? `${generateRandomString()}`
              : noteData.OperationJsonPath;
          await uploadJson(
            JSON.stringify(operationJson),
            "operations",
            operationFilename
          );
          const snapshot = editorUtils.getSnapshot();
          noteData.StrokeTimeInfo = strokeTimeInfo
            ? JSON.stringify(strokeTimeInfo)
            : "";
          noteData.Snapshot = snapshot ? JSON.stringify(snapshot) : "";
          noteData.PressureInfo = JSON.stringify(strokePressureInfo);
          noteData.AllPressureInfo = JSON.stringify(strokePressureInfoStore);
          noteData.SvgPath = filename;
          noteData.OperationJsonPath = operationFilename;
          noteData.WTime = wTime;
          noteData.WPressure = wPressure;
          noteData.WDistance = wDistance;
          noteData.boundaryValue = boundaryValue;
          const res = await updateNote(noteData);
          if (res == null) {
            alert(l.failedToSaveNote());
            return;
          }
          clearStrokeInfo();
          router.back();
        } catch (err) {
          alert(l.failedToSaveNote());
          return;
        }
      } else {
        clearStrokeInfo();
        router.back();
      }
    };

    return (
      <button
        onClick={handleBack}
        className="back-button cursor-pointer text-sky-500 pl-2 hover:text-sky-300 text-xs whitespace-nowrap"
        style={{ pointerEvents: "all" }}
      >
        &lt;{l.page()}
      </button>
    );
  };

  const handleChangeEvent: TLEventMapHandler<"change"> = async (change) => {
    if (!editor || !editorUtils) return;
    const allRecords: TLRecord[] = editorUtils.getAllRecords();
    drawing(allRecords);
    if (change.source === "user") {
      // Added
      for (const record of Object.values(change.changes.added)) {
        if (record.typeName === "shape") {
          if (Object.keys(change.changes.updated).length === 0) {
            setIsResetStrokePressure(true);
            // handleResetStrokePressureInfo(allRecords);
          }
        }
      }

      // Updated
      for (const [from, to] of Object.values(change.changes.updated)) {
        if (from.typeName === "camera" && to.typeName === "camera") {
          // zoom etc.
          setCamera({ x: to.x, y: to.y, z: to.z });
        }
        // if (from.typeName !== "pointer") {
        //   console.log(change.changes.updated)
        // }
        if (
          from.typeName === "instance" &&
          to.typeName === "instance" &&
          from.currentPageId !== to.currentPageId
        ) {
          console.log(from, to);
        }
      }

      // Removed
      for (const record of Object.values(change.changes.removed)) {
        if (record.typeName === "shape") {
          setIsResetStrokePressure(true);
        }
      }
    } else {
      console.log(change);
    }
  };

  useEffect(() => {
    if (!editor || !editorUtils) return;

    const fetchNoteData = async () => {
      if (isDemo || !id) return;
      const res = await getNoteByID(Number(id));
      if (res === null) return;
      noteData = res;
      const snapshot = res.Snapshot;
      if (snapshot === "" || snapshot === null) return;
      editorUtils.loadSnapshot(JSON.parse(snapshot));
      onlyInitializeStrokePressureInfo(JSON.parse(res.PressureInfo));
      onlyInitializeStrokePressureInfoStore(JSON.parse(res.AllPressureInfo));
      initializeStrokeTimeInfo(JSON.parse(res.StrokeTimeInfo));
      setWasDrawingStrokeNum(
        Object.keys(JSON.parse(res.StrokeTimeInfo)).length
      );
      setWTime(res.WTime);
      setWPressure(res.WPressure);
      setWDistance(res.WDistance);
      setBoundaryValue(res.BoundaryValue);
      editorUtils.setStrokeShape("solid");
      editorUtils.setStrokeSize("s");
      const operationJson = await fetch(
        `${process.env.FILE_SERVER_URL}/json/operations/${res.OperationJsonPath}.json`
      )
        .then((response) => response.json())
        .catch((err) => {
          console.log(err);
          alert("Failed to load operation history data");
        });
      initializeNoteOperationInfo(operationJson.data);
    };

    fetchNoteData();

    const element = document.querySelector(".tlui-layout__top__left");
    setContainer(element as HTMLElement);

    editorUtils.setStrokeShape("solid");
    editorUtils.setStrokeSize("s");

    editor.on("change", handleChangeEvent);
    // ボタンの表示
    const toolPressureEraesrButton = document.querySelector(
      'button[data-testid="tools.pressure-eraser"]'
    );
    if (toolPressureEraesrButton) {
      toolPressureEraesrButton.innerHTML = `<div style="display: flex; width: 18px; height: 18px; justify-content: center; align-items: center;">${ToolPressureEraseIcon}</div>`;
    }

    if (!isDisplayChangePageButton) {
      const changePageButton: any = document.querySelector(
        ".tlui-page-menu__trigger"
      );
      if (changePageButton) {
        changePageButton.style.display = "none";
      }
    }

    return () => {
      editor.off("change", handleChangeEvent);
    };
  }, [editor]);

  useEffect(() => {
    // groupVisualModeが変更されたら、描画の更新
    if (editorUtils === undefined || strokePressureInfo === undefined) return;
    switch (groupVisualMode) {
      case "area":
        editorUtils.setColorOfShapes(strokePressureInfo);
        break;
      case "line":
        editorUtils.setColorOfGroupingShapes(strokePressureInfo);
        break;
      case "none":
        editorUtils.setColorOfShapes(strokePressureInfo);
        break;
      default:
        break;
    }
  }, [groupVisualMode]);

  return (
    <>
      {isShowLayer && (
        <div>
          <PPLayerVisualizer
            groupAreas={groupAreas}
            editorUtils={editorUtils}
            setIsShowLayer={setIsShowLayer}
          />
        </div>
      )}
      <div style={{ display: isShowLayer ? "hidden" : "flex" }}>
        <div style={{ width: width, height: height, position: "relative" }}>
          {container && ReactDOM.createPortal(<BackButton />, container)}
          {pointerPosition.x !== 0 &&
            pointerPosition.y !== 0 &&
            editorUtils && (
              <NowAvgPressureGauge
                pointerPosition={pointerPosition}
                nowAvgPressure={nowAvgPressure}
                editorUtils={editorUtils}
              />
            )}
          <Tldraw
            onMount={setAppToState}
            tools={isIncludePressureEraser ? customTools : undefined}
            overrides={isIncludePressureEraser ? uiOverrides : undefined}
            hideUi={isHideUI}
          />
          {pMode === "grouping" && groupVisualMode === "area" && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                zIndex: 999,
                pointerEvents: "none",
              }}
            >
              <GroupAreaVisualizer
                groupAreas={groupAreas}
                width={width.toString()}
                height={height.toString()}
                zoomLevel={camera.z}
                offsetX={camera.x}
                offsetY={camera.y}
                updateGroupPressure={updateGroupPressure}
                combineGroupArea={combineGroupArea}
                isOperatingGroupID={isOperatingGroupID}
                setIsOperatingGroupID={setIsOperatingGroupID}
                setAvgPressureForUpdateGroupPressure={
                  setAvgPressureForUpdateGroupPressures
                }
                avgPressureForUpdateGroupPressure={
                  avgPressureForUpdateGroupPressures
                }
              />
            </div>
          )}
        </div>
        <PPUndoGraph
          width={`calc(100vw - ${width})`}
          height={graphHeight}
          padding={graphPadding}
          background={graphBackground}
          editor={editor}
          editorUtils={editorUtils}
          id={Number(id)}
          isDemo={isDemo}
          handleResetStrokePressureInfo={handleResetStrokePressureInfo}
          wTime={wTime}
          setWTime={setWTime}
          wPressure={wPressure}
          setWPressure={setWPressure}
          wDistance={wDistance}
          setWDistance={setWDistance}
          boundaryValue={boundaryValue}
          setBoundaryValue={setBoundaryValue}
          pMode={pMode}
          setPMode={setPMode}
          setIsSettingOpen={setIsSettingsOpen}
          setIsShowLayer={setIsShowLayer}
          groupVisualMode={groupVisualMode}
          setGroupVisualMode={setGroupVisualMode}
        />
      </div>
      {isSettingsOpen && (
      <SettingModal
        settings={settings}
        setSettings={setSettings}
        pMode={pMode}
        setPMode={setPMode}
        onClose={() => setIsSettingsOpen(false)}
      />
    )}
    </>
  );
}
