"use client";

import { Editor, TLEventMapHandler, Tldraw } from "@tldraw/tldraw";
import "@tldraw/tldraw/tldraw.css";
import { useCallback, useEffect, useState } from "react";
import { CardShapeUtil } from "./CardShape/CardShapeUtil";
import { uiOverrides } from "./ui-overrides";
import { PressureEraserTool } from "./PressureEraseTool/PressureEraserTool";
import { ToolPressureEraseIcon } from "./PressureEraseTool/icon/tool-pressure-erase";
import { getAverageOfNumberList } from "@/app/modules/common/getAcerageOfNumberList";
import { strokePressureInfoAtom, useStrokePressureInfo } from "@/app/hooks";
import { useAtom } from "jotai";
import PPUndoGraph from "./PP-UndoGraph/layout";
import { getGradientColor } from "@/app/modules/note/getGradientColor";

const customShapeUtils = [CardShapeUtil];
const customTools = [PressureEraserTool];
let isFinishedDraw = false;
let drawingStrokeId: string = "";
let drawingPressureList: number[] = [];

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
  isHideUI?: boolean;
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
    isHideUI = false,
  } = props;
  const [editor, setEditor] = useState<Editor>();
  const [strokePressureInfo] = useAtom(strokePressureInfoAtom);
	const [pointerPosition, setPointerPosition] = useState({ x: 0, y: 0 });
	const [nowAvgPressure, setNowAvgPressure] = useState<number>(0);
  const { clearStrokePressureInfo, addStrokePressureInfo } =
    useStrokePressureInfo();

  const setAppToState = useCallback((editor: Editor) => {
    // debugMode解除
    editor.updateInstanceState({ isDebugMode: isDebugMode });
    editor.setCurrentTool(defaultCurrentTool);
    setEditor(editor);
  }, []);

  const finishDrawing = () => {
    isFinishedDraw = true;
    const avgPressure = getAverageOfNumberList(drawingPressureList);
    // FIXME: グループの筆圧情報を取得する
    const groupPressure = getAverageOfNumberList(drawingPressureList);
    addStrokePressureInfo(drawingStrokeId, 0, avgPressure, groupPressure);
    drawingStrokeId = "";
    drawingPressureList = [];
		setPointerPosition({ x: 0, y: 0 });
  };

  const drawing = (allRecords: any) => {
    if (
      allRecords[allRecords.length - 1].type === "draw" &&
      allRecords[allRecords.length - 1].props.isComplete === false
    ) {
			if (drawingPressureList.length === 0) {
				setPointerPosition({ x: allRecords[allRecords.length - 1].x, y: allRecords[allRecords.length-1].y });
			}
      isFinishedDraw = false;
      // console.log(allRecords[allRecords.length - 1]);
      // 筆圧を取得
			console.log(allRecords);
      const segments = allRecords[allRecords.length - 1].props.segments;
      const points = segments[0].points;
      const lastPoints = points[points.length - 1];
      const drawingPressure = lastPoints.z;
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
        const pressureList = points.map((point: any) => point.z);
        const avgPressure = getAverageOfNumberList(pressureList);
        const groupPressure = getAverageOfNumberList(pressureList);
        addStrokePressureInfo(record.id, 0, avgPressure, groupPressure);
      }
    });
  };

  useEffect(() => {
    if (!editor) return;

    function logChangeEvent(eventName: string) {
      // setStoreEvents((events) => [eventName, ...events])
    }

		// const handlePointerDown = (event: PointerEvent) => {
    //   setPointerPosition({ x: event.clientX, y: event.clientY });
    // };

		// const handlePointerMove = (event: PointerEvent) => {
		// 	// setPointerPosition({ x: event.clientX, y: event.clientY });
		// }


    // 何かChangeが行われたら発火
    const handleChangeEvent: TLEventMapHandler<"change"> = (change) => {
      const allRecords: any = editor.store.allRecords();

      // 筆記中
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
            logChangeEvent(
              `changed page (${from.currentPageId}, ${to.currentPageId})`
            );
          }
        }

        // Removed
        for (const record of Object.values(change.changes.removed)) {
          if (record.typeName === "shape") {
            handleResetStrokePressureInfo(allRecords);
          }
        }
      }
    };

    editor.on("change", handleChangeEvent);
		// window.addEventListener('pointerdown', handlePointerDown);
		// window.addEventListener('pointermove', handlePointerMove);
		// window.addEventListener('pointerup', handlePointerUp);

    // ボタンの表示
    const toolPressureEraesrButton = document.querySelector(
      'button[data-testid="tools.pressure-eraser"]'
    );
    if (toolPressureEraesrButton) {
      toolPressureEraesrButton.innerHTML = `<div style="display: flex; width: 18px; height: 18px; justify-content: center; align-items: center;">${ToolPressureEraseIcon}</div>`;
    }

    return () => {
      editor.off("change", handleChangeEvent);
    };
  }, [editor]);

  return (
    <div style={{ display: "flex" }}>
      <div style={{ width: width, height: height }}>
				{
					pointerPosition.x !== 0 && pointerPosition.y !== 0 &&
					<div className="moveNowBorderLinearProgress" style={{ 
						left: pointerPosition.x - 60, 
						top: pointerPosition.y - 40,
					}}>
						<div className="bar" style={{backgroundColor: getGradientColor(nowAvgPressure) + "aa", width: `${nowAvgPressure*100}px`}}></div>
					</div>
					// <div style={{ position: "absolute", left: pointerPosition.x, top: pointerPosition.y, zIndex: 999, width: `${nowAvgPressure}%`, // ゲージの幅を値に応じて変更
					// backgroundColor: "#f00",
					// height: '20px',
					// borderRadius: '4px',
					// background: 'linear-gradient(to right, blue, green, red)', // 青から緑、そして赤へのグラデーション
					// overflow: 'hidden'
					// }}>
					// </div>
				}
        <Tldraw
          onMount={setAppToState}
          shapeUtils={isIncludePressureEraser ? customShapeUtils : undefined}
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
      />
    </div>
  );
}
