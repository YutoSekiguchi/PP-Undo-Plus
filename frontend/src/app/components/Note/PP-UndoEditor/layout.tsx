"use client";

import {
  Box,
  DefaultKeyboardShortcutsDialog,
  DefaultKeyboardShortcutsDialogContent,
  DefaultToolbar,
  DefaultToolbarContent,
  Editor,
  SVGContainer,
  TLComponents,
  TLEventMapHandler,
  TLImageShape,
  TLParentId,
  TLRecord,
  TLShapeId,
  TLShapePartial,
  Tldraw,
  TldrawUiMenuItem,
  getIndicesBetween,
  react,
  sortByIndex,
  track,
  useEditor,
  useIsToolSelected,
  useTools,
} from "tldraw";
import "tldraw/tldraw.css";
import { useCallback, useEffect, useMemo, useState } from "react";
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
} from "@/@types/note";
import { generateRandomString } from "@/app/modules/common/generateRandomString";
import {
  noteOperationInfoAtom,
  pModeAtom,
  strokePressureInfoStoreAtom,
  strokeTimeInfoAtom,
} from "@/app/hooks/atoms/note";
import calculateDistance from "@/app/modules/note/calculateDistance";
import { Lang } from "../../common/lang";
import GroupAreaVisualizer from "./Grouping/GroupAreaVisualizer";
import PPLayerVisualizer from "./Layer/layout";
import { isEnclosing } from "@/app/modules/note/isStrokeEnclosing";
import SettingModal from "./Settings/layout";
import { PdfEditor } from "./PdfEditor/PdfEditor";
import { Pdf, PdfPicker } from "./PdfEditor/PdfPicker";
// import "./PdfEditor/pdf-editor.css";
import { ExportPdfButton } from "./PdfEditor/ExportPdfButton";
import { PPUndoBasicIcon } from "@/icons/PPUndoBasic";

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
  height?: string | number;
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

export type PdfState =
  | {
      phase: "pick";
    }
  | {
      phase: "edit";
      pdf: Pdf | null;
    };

export default function PPUndoEditor(props: Props) {
  const {
    width,
    height = "100vh",
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
  const [boundaryValue, setBoundaryValue] = useState<number>(0.25);
  const [isOperatingGroupID, setIsOperatingGroupID] = useState<number | null>(
    null
  );
  const [pMode, setPMode] = useAtom(pModeAtom);
  const [isShowLayer, setIsShowLayer] = useState<boolean>(false);
  const [isEnclose, setIsEnclose] = useState<boolean>(false);
  const [
    avgPressureForUpdateGroupPressures,
    setAvgPressureForUpdateGroupPressures,
  ] = useState<number[]>([]);
  const [pressureOfPPUndoBasic, setPressureOfPPUndoBasic] = useState<number[]>(
    []
  );
  const [groupVisualMode, setGroupVisualMode] =
    useState<TLGroupVisualMode>("area");
  const [enclosingStroke, setEncloseStroke] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
    pressure: number;
  } | null>(null);
  const [settings, setSettings] = useState<TLNoteSettings>({
    availableEnclosed: false,
    maxDeleteStrokeNum: 20,
  });
  const [pdfState, setPdfState] = useState<PdfState>({ phase: "pick" });
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
      const allRecords = editorUtils?.getAllRecords();
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

    setPPUndoBasic(editor);

    return () => {
      editor.off("change", handleChangeEvent);
    };
  }, [editor]);

  useEffect(() => {
    if (!editor || !editorUtils) return;
    setPPUndoBasic(editor);
  }, [editor?.getCanUndo()]);

  const setPPUndoBasic = (editor: Editor) => {
    // 与えられたpressureの値によって最新のストロークから順に削除
    let pressureListOfPPUndoBasic: number[] = [];
    const determineStrokesToDelete = (
      pressure: number,
      deleteStroke?: boolean
    ) => {
      if (editorUtils === undefined || !pressure) return;
      const MAX_DELETE_STROKE_NUM = settings.maxDeleteStrokeNum;
      const allRecords = editorUtils.getAllRecords();
      const allStrokeIds = allRecords
        .filter((record: any) => record.type === "draw")
        .map((record: any) => record.id);
      let deleteStrokeIds: TLShapeId[] = [];
      const deleteStrokeNum = Math.floor(pressure * MAX_DELETE_STROKE_NUM);
      for (let i = 0; i < deleteStrokeNum; i++) {
        if (i >= allStrokeIds.length) {
          break;
        }
        deleteStrokeIds.push(allStrokeIds[allStrokeIds.length - i - 1]);
      }
      editorUtils.setErasingShapes(deleteStrokeIds);
      if (deleteStroke) {
        // deleteStrokeIdsの長さの回数だけundoする
        for (let i = 0; i < deleteStrokeIds.length; i++) {
          editorUtils.undo();
        }
        editorUtils.setErasingShapes([]);
      }
    };

    const handlePointerDownOfPPUndoBasic = (event: PointerEvent) => {
      if (event.pressure > 0) {
        // setPressureOfPPUndoBasic((prev) => [...prev, event.pressure]);
        pressureListOfPPUndoBasic.push(event.pressure);
        const avgPressure = getAverageOfNumberList(pressureListOfPPUndoBasic);
        determineStrokesToDelete(avgPressure);
        // console.log("Pointer down pressure:", event.pressure);
      }
    };

    const handlePointerMoveOfPPUndoBasic = (event: PointerEvent) => {
      if (event.pressure > 0) {
        // setPressureOfPPUndoBasic((prev) => [...prev, event.pressure]);
        // 平均値を求める
        // const avgPressure = getAverageOfNumberList(pressureOfPPUndoBasic);
        pressureListOfPPUndoBasic.push(event.pressure);
        const avgPressure = getAverageOfNumberList(pressureListOfPPUndoBasic);
        determineStrokesToDelete(avgPressure);
        // console.log("Pointer move pressure:", event.pressure);
      }
    };

    const handlePointerUpOfPPUndoBasic = (event: PointerEvent) => {
      const avgPressure = getAverageOfNumberList(pressureListOfPPUndoBasic);
      determineStrokesToDelete(avgPressure, true);
      pressureListOfPPUndoBasic = [];
      // setPressureOfPPUndoBasic([]);
    };

    const addButtonToToolbar = () => {
      const toolbarElement = document.querySelector(
        ".tlui-buttons__horizontal"
      );
      if (toolbarElement) {
        let newButton = document.querySelector(".pp-undo-basic-button");
        console.log(editor.getCanUndo());
        const svgIcon = `<div style="display: flex; width: 18px; height: 18px; justify-content: center; align-items: center; color: ${
          editor.getCanUndo() ? "black" : "lightgray"
        };">${PPUndoBasicIcon}</div>`;
        if (!newButton) {
          newButton = document.createElement("button");
          newButton.className =
            "tlui-button tlui-button__icon pp-undo-basic-button";
          newButton.addEventListener("pointerdown", (event) =>
            handlePointerDownOfPPUndoBasic(event as PointerEvent)
          );
          newButton.addEventListener("pointermove", (event) =>
            handlePointerMoveOfPPUndoBasic(event as PointerEvent)
          );
          newButton.addEventListener("pointerup", (event) =>
            handlePointerUpOfPPUndoBasic(event as PointerEvent)
          );
          newButton.addEventListener("contextmenu", (event) => {
            event.preventDefault();
          });

          const allButtons = toolbarElement.querySelectorAll("button");
          if (allButtons.length >= 6) {
            toolbarElement.insertBefore(
              newButton,
              allButtons[6].parentNode === toolbarElement ? allButtons[6] : null
            );
          } else {
            toolbarElement.appendChild(newButton);
          }
        }
        newButton.innerHTML = svgIcon;
      }
    };

    addButtonToToolbar();
  };

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

  const components: TLComponents = {
    Toolbar: (props) => {
      const tools = useTools();
      const isStickerSelected = useIsToolSelected(tools["card"]);
      return (
        <DefaultToolbar {...props}>
          <TldrawUiMenuItem {...tools["card"]} isSelected={isStickerSelected} />
          <DefaultToolbarContent />
        </DefaultToolbar>
      );
    },
    KeyboardShortcutsDialog: (props) => {
      const tools = useTools();
      return (
        <DefaultKeyboardShortcutsDialog {...props}>
          <DefaultKeyboardShortcutsDialogContent />
          {/* Ideally, we'd interleave this into the tools group */}
          <TldrawUiMenuItem {...tools["card"]} />
        </DefaultKeyboardShortcutsDialog>
      );
    },
  };

  const pdfComponent = useMemo<TLComponents>(
    () => ({
      PageMenu: null,
      InFrontOfTheCanvas: () =>
        pdfState.phase === "edit" && pdfState.pdf !== null ? (
          <PageOverlayScreen pdf={pdfState.pdf} />
        ) : null,
      SharePanel: () =>
        pdfState.phase === "edit" && pdfState.pdf !== null ? (
          <ExportPdfButton pdf={pdfState.pdf} />
        ) : null,
    }),
    [pdfState]
  );

  const PageOverlayScreen = track(function PageOverlayScreen({
    pdf,
  }: {
    pdf: Pdf;
  }) {
    const editor = useEditor();

    const viewportPageBounds = editor.getViewportPageBounds();
    const viewportScreenBounds = editor.getViewportScreenBounds();

    const relevantPageBounds = pdf.pages
      .map((page) => {
        if (!viewportPageBounds.collides(page.bounds)) return null;
        const topLeft = editor.pageToViewport(page.bounds);
        const bottomRight = editor.pageToViewport({
          x: page.bounds.maxX,
          y: page.bounds.maxY,
        });
        return new Box(
          topLeft.x,
          topLeft.y,
          bottomRight.x - topLeft.x,
          bottomRight.y - topLeft.y
        );
      })
      .filter((bounds): bounds is Box => bounds !== null);

    function pathForPageBounds(bounds: Box) {
      return `M ${bounds.x} ${bounds.y} L ${bounds.maxX} ${bounds.y} L ${bounds.maxX} ${bounds.maxY} L ${bounds.x} ${bounds.maxY} Z`;
    }

    const viewportPath = `M 0 0 L ${viewportScreenBounds.w} 0 L ${viewportScreenBounds.w} ${viewportScreenBounds.h} L 0 ${viewportScreenBounds.h} Z`;

    return (
      <>
        <SVGContainer className="PageOverlayScreen-screen">
          <path
            d={`${viewportPath} ${relevantPageBounds
              .map(pathForPageBounds)
              .join(" ")}`}
            fillRule="evenodd"
          />
        </SVGContainer>
        {relevantPageBounds.map((bounds, i) => (
          <div
            key={i}
            className="PageOverlayScreen-outline"
            style={{
              width: bounds.w,
              height: bounds.h,
              transform: `translate(${bounds.x}px, ${bounds.y}px)`,
            }}
          />
        ))}
      </>
    );
  });

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
          {pdfState.phase === "edit" && pdfState.pdf ? (
            <div className="PdfEditor">
              <Tldraw
                onMount={(editor) => {
                  setAppToState(editor);
                  if (pdfState.pdf) {
                    editor.updateInstanceState({ isDebugMode: false });
                    editor.createAssets(
                      pdfState.pdf.pages.map((page) => ({
                        id: page.assetId,
                        typeName: "asset",
                        type: "image",
                        meta: {},
                        props: {
                          w: page.bounds.w,
                          h: page.bounds.h,
                          fileSize: -1,
                          mimeType: "image/png",
                          src: page.src,
                          name: "page",
                          isAnimated: false,
                        },
                      }))
                    );
                    editor.createShapes(
                      pdfState.pdf.pages.map(
                        (page): TLShapePartial<TLImageShape> => ({
                          id: page.shapeId,
                          type: "image",
                          x: page.bounds.x,
                          y: page.bounds.y,
                          isLocked: true,
                          props: {
                            assetId: page.assetId,
                            w: page.bounds.w,
                            h: page.bounds.h,
                          },
                        })
                      )
                    );

                    const shapeIds = pdfState.pdf.pages.map(
                      (page) => page.shapeId
                    );
                    const shapeIdSet = new Set(shapeIds);

                    // Don't let the user unlock the pages
                    editor.sideEffects.registerBeforeChangeHandler(
                      "shape",
                      (prev, next) => {
                        if (!shapeIdSet.has(next.id)) return next;
                        if (next.isLocked) return next;
                        return { ...prev, isLocked: true };
                      }
                    );

                    // Make sure the shapes are below any of the other shapes
                    const makeSureShapesAreAtBottom = () => {
                      const shapes = shapeIds
                        .map((id) => editor.getShape(id)!)
                        .sort(sortByIndex);
                      const pageId = editor.getCurrentPageId();

                      const siblings =
                        editor.getSortedChildIdsForParent(pageId);
                      const currentBottomShapes = siblings
                        .slice(0, shapes.length)
                        .map((id) => editor.getShape(id)!);

                      if (
                        currentBottomShapes.every(
                          (shape, i) => shape.id === shapes[i].id
                        )
                      )
                        return;

                      const otherSiblings = siblings.filter(
                        (id) => !shapeIdSet.has(id)
                      );
                      const bottomSibling = otherSiblings[0];
                      const lowestIndex = editor.getShape(bottomSibling)!.index;

                      const indexes = getIndicesBetween(
                        undefined,
                        lowestIndex,
                        shapes.length
                      );
                      editor.updateShapes(
                        shapes.map((shape, i) => ({
                          id: shape.id,
                          type: shape.type,
                          isLocked: shape.isLocked,
                          index: indexes[i],
                        }))
                      );
                    };

                    makeSureShapesAreAtBottom();
                    editor.sideEffects.registerAfterCreateHandler(
                      "shape",
                      makeSureShapesAreAtBottom
                    );
                    editor.sideEffects.registerAfterChangeHandler(
                      "shape",
                      makeSureShapesAreAtBottom
                    );

                    // Constrain the camera to the bounds of the pages
                    const targetBounds = pdfState.pdf.pages.reduce(
                      (acc, page) => acc.union(page.bounds),
                      pdfState.pdf.pages[0].bounds.clone()
                    );

                    const updateCameraBounds = (isMobile: boolean) => {
                      editor.setCameraOptions({
                        constraints: {
                          bounds: targetBounds,
                          padding: { x: isMobile ? 16 : 164, y: 64 },
                          origin: { x: 0.5, y: 0 },
                          initialZoom: "fit-x-100",
                          baseZoom: "default",
                          behavior: "contain",
                        },
                      });
                      editor.setCamera(editor.getCamera(), { reset: true });
                    };

                    let isMobile = editor.getViewportScreenBounds().width < 840;

                    react("update camera", () => {
                      const isMobileNow =
                        editor.getViewportScreenBounds().width < 840;
                      if (isMobileNow === isMobile) return;
                      isMobile = isMobileNow;
                      updateCameraBounds(isMobile);
                    });

                    updateCameraBounds(isMobile);
                  }
                }}
                tools={isIncludePressureEraser ? customTools : undefined}
                overrides={isIncludePressureEraser ? uiOverrides : undefined}
                // overrides={uiOverrides}
                components={{ ...components, ...pdfComponent }}
                // assetUrls={customAssetUrls}
                hideUi={isHideUI}
              />
            </div>
          ) : (
            <Tldraw
              onMount={setAppToState}
              tools={isIncludePressureEraser ? customTools : undefined}
              overrides={isIncludePressureEraser ? uiOverrides : undefined}
              components={components}
              // overrides={uiOverrides}
              // assetUrls={customAssetUrls}
              hideUi={isHideUI}
            />
          )}
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
          onOpenPdf={(pdf: Pdf | null) =>
            setPdfState({ phase: "edit", pdf: pdf })
          }
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
