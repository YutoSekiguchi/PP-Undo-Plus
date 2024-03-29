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
import { TLNoteData } from "@/@types/note";
import { generateRandomString } from "@/app/modules/common/generateRandomString";
import {
  noteOperationInfoAtom,
  strokeTimeInfoAtom,
} from "@/app/hooks/atoms/note";
import LoadingScreen from "@/app/Loading";

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
    graphWidth = "30vw",
    graphHeight = "100vh",
    graphPadding = 8,
    graphBackground = "#343541",
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
  const [pointerPosition, setPointerPosition] = useState({ x: 0, y: 0 });
  const [nowAvgPressure, setNowAvgPressure] = useState<number>(0);
  const {
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
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const setAppToState = useCallback((editor: Editor) => {
    // debugMode解除
    editor.updateInstanceState({ isDebugMode: isDebugMode });

    editor.setCurrentTool(defaultCurrentTool);
    setEditor(editor);
    setEditorUtils(new EditorUtils(editor));
  }, []);

  const finishDrawing = () => {
    isFinishedDraw = true;
    const avgPressure = getAverageOfNumberList(drawingPressureList);
    // FIXME: グループの筆圧情報を取得する
    const groupPressure = getAverageOfNumberList(drawingPressureList);
    endTime = performance.now();
    const drawTime = endTime - startTime;
    addStrokePressureInfo(drawingStrokeId, 0, avgPressure, groupPressure);
    addStrokeTimeInfo(
      drawingStrokeId,
      drawTime,
      startTime,
      drawingPressureList.length
    );
    // FIXME: draw以外のoperationも追加する
    addNoteOperationInfo("draw", drawingStrokeId, startTime);
    drawingStrokeId = "";
    drawingPressureList = [];
    setPointerPosition({ x: 0, y: 0 });
    startTime = 0;
    endTime = 0;
  };

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
      console.log(allRecords);
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

  const handleResetStrokePressureInfo = (allRecords: any) => {
    clearStrokePressureInfo();
    allRecords.forEach((record: any) => {
      if (record.typeName === "shape" && record.type === "draw") {
        const points = record.props.segments[0].points;
        const pressureList = points.map((point: any) => point.z >= 1? 1: point.z);
        const avgPressure = getAverageOfNumberList(pressureList);
        const groupPressure = getAverageOfNumberList(pressureList);
        addStrokePressureInfo(record.id, 0, avgPressure, groupPressure);
      }
    });
  };

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
      setIsLoading(true);
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
            if (lang === "en") {
              alert("Failed to save note.");
            } else {
              alert("ノートの保存に失敗しました");
            }
            return;
          }
          clearStrokeInfo();
          router.back();
        } catch (err) {
          if (lang === "en") {
            alert("Failed to save note.");
          } else {
            alert("ノートの保存に失敗しました");
          }
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
        &lt;{lang === "en" ? "Page" : "ページ"}
      </button>
    );
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

    const handleChangeEvent: TLEventMapHandler<"change"> = async (change) => {
      const allRecords: TLRecord[] = editorUtils.getAllRecords();

      drawing(allRecords);
      if (change.source === "user") {
        // Added
        for (const record of Object.values(change.changes.added)) {
          if (record.typeName === "shape") {
            if (Object.keys(change.changes.updated).length === 0) {
              handleResetStrokePressureInfo(allRecords);
            }
          }
        }

        // Updated
        for (const [from, to] of Object.values(change.changes.updated)) {
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
            handleResetStrokePressureInfo(allRecords);
          }
        }
      } else {
        console.log(change);
      }
    };

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
      {isLoading && <LoadingScreen />}
      <div style={{ width: width, height: height }}>
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
      />
    </div>
  );
}
