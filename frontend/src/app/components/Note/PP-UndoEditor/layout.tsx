"use client";

import {
  Editor,
  StoreSnapshot,
  TLEventMapHandler,
  TLRecord,
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
  TLNoteData,
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
  const [wTime, setWTime] = useState<number>(0.5);
  const [wPressure, setWPressure] = useState<number>(0.5);
  const [wDistance, setWDistance] = useState<number>(0.5);
  const [pMode, setPMode] = useState<"grouping" | "average">("grouping");
  const maxTime = 30000;
  const maxPressure = 1;
  const maxDistance = 1000;
  const scoreThreshold = 0.25;

  const {
    // strokeTimeInfo,
    clearStrokePressureInfo,
    addStrokePressureInfo,
    addStrokeTimeInfo,
    addNoteOperationInfo,
    initializeNoteOperationInfo,
    initializeStrokePressureInfo,
    initializeStrokeTimeInfo,
    clearStrokeInfo,
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
      addStrokePressureInfo(drawingStrokeId, 1, avgPressure, avgPressure);
      drawingStrokeId = "";
      drawingPressureList = [];
      setPointerPosition({ x: 0, y: 0 });
      startTime = 0;
      endTime = 0;
    } else {
      // Calculate the minimum distance
      const lastRecordX = lastRecord.x;
      const lastRecordY = lastRecord.y;
      const lastRecordPoints = lastRecord.props.segments[0].points;
      const secondLastRecordX = secondLastRecord.x;
      const secondLastRecordY = secondLastRecord.y;
      const secondLastRecordPoints = secondLastRecord.props.segments[0].points;
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
        strokePressureInfo[secondLastRecord.id].avg;
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
      if (score > scoreThreshold) {
        isCreateNewGroup = true;
      }

      if (isCreateNewGroup) {
        addStrokePressureInfo(
          drawingStrokeId,
          strokePressureInfo[secondLastRecord.id].groupID + 1,
          avgPressure,
          avgPressure
        );
      } else {
        addStrokePressureInfo(
          drawingStrokeId,
          strokePressureInfo[secondLastRecord.id].groupID,
          avgPressure,
          strokePressureInfo[secondLastRecord.id].group
        );
      }
      console.log(strokePressureInfo);
      drawingStrokeId = "";
      drawingPressureList = [];
      setPointerPosition({ x: 0, y: 0 });
      startTime = 0;
      endTime = 0;
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
    }

    if (
      allRecords[allRecords.length - 1].type === "draw" &&
      allRecords[allRecords.length - 1].props.isComplete === true &&
      isFinishedDraw === false
    ) {
      finishDrawing();
    }
  };

  useEffect(() => {
    if (isResetStrokePressure) {
      handleResetStrokePressureInfo(editorUtils?.getAllRecords());
      setIsResetStrokePressure(false);
    }
  }, [isResetStrokePressure]);

  const handleResetStrokePressureInfo = (allRecords: any) => {
    clearStrokePressureInfo();
    allRecords.forEach((record: any, index: number) => {
      console.log(record, index);
      if (record.typeName === "shape" && record.type === "draw") {
        // const points = record.props.segments[0].points;
        // const pressureList = points.map((point: any) =>
        //   point.z >= 1 ? 1 : point.z
        // );
        // const avgPressure = getAverageOfNumberList(pressureList);
        console.log(strokePressureInfoStore);
        const info = strokePressureInfoStore[record.id];
        addStrokePressureInfo(record.id, info.groupID, info.avg, info.group);
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
    console.log(editorUtils?.getAllRecords());
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
          noteData.SvgPath = filename;
          noteData.OperationJsonPath = operationFilename;
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
      initializeStrokePressureInfo(JSON.parse(res.PressureInfo));
      initializeStrokeTimeInfo(JSON.parse(res.StrokeTimeInfo));
      setWasDrawingStrokeNum(
        Object.keys(JSON.parse(res.StrokeTimeInfo)).length
      );
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

  return (
    <div style={{ display: "flex" }}>
      {/* <div style={{ width: width, height: height }}>
        {container && ReactDOM.createPortal(<BackButton />, container)}
        {pointerPosition.x !== 0 && pointerPosition.y !== 0 && editorUtils && (
          <NowAvgPressureGauge
            pointerPosition={pointerPosition}
            nowAvgPressure={nowAvgPressure}
            editorUtils={editorUtils}
          />
        )}
        <Tldraw
          onMount={setAppToState}
          // shapeUtils={undefined}
          tools={isIncludePressureEraser ? customTools : undefined}
          overrides={isIncludePressureEraser ? uiOverrides : undefined}
          hideUi={isHideUI}
        />
      </div> */}
      <div style={{ width: width, height: height, position: "relative" }}>
        {container && ReactDOM.createPortal(<BackButton />, container)}
        {pointerPosition.x !== 0 && pointerPosition.y !== 0 && editorUtils && (
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
        {pMode === "grouping" && (
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
            />
          </div>
        )}
      </div>
      <PPUndoGraph
        width={graphWidth}
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
        pMode={pMode}
        setPMode={setPMode}
      />
    </div>
  );
}
