import { Editor } from "@tldraw/tldraw";
import PPUndoArea from "./Areas/PP-UndoArea/layout";
import AllAveragePressurePieGraphArea from "./Areas/AllAveragePressurePieGraphArea/layout";
import { EditorUtils } from "../util";
import ButtonArea from "./Areas/ButtonArea/layout";
import ChangeParametersArea from "./Areas/ChangeParametersArea/layout";

interface Props {
  width: string | number;
  height: string | number;
  padding: string | number;
  background: string;
  isDebugMode?: boolean;
  editor?: Editor;
  hideAllAveragePressurePieGraph?: boolean;
  allAveragePressurePieGraphWidth?: string | number;
  buttonAreaWidth?: string | number;
  editorUtils?: EditorUtils;
  id: number;
  isDemo: boolean;
  handleResetStrokePressureInfo: (allRecords: any) => void;
}

export default function PPUndoGraph(props: Props) {
  const {
    width,
    height,
    padding,
    background,
    isDebugMode = false,
    hideAllAveragePressurePieGraph = false,
    allAveragePressurePieGraphWidth = "48%",
    buttonAreaWidth = "48%",
    editor,
    editorUtils,
    id,
    isDemo,
    handleResetStrokePressureInfo,
  } = props;
  return (
    <div>
      <div
        style={{
          width: width,
          height: height,
          padding: padding,
          background: background,
          border: "none",
          fontFamily: "monospace",
          fontSize: 12,
          borderLeft: "solid 2px #333",
          overflow: "auto",
        }}
      >
          <PPUndoArea
            editor={editor}
            id={id}
            editorUtils={editorUtils}
            isDemo={isDemo}
          />
        <div className="mt-4 flex justify-between">
          {!hideAllAveragePressurePieGraph && (
            <div style={{ width: allAveragePressurePieGraphWidth}}>
              <AllAveragePressurePieGraphArea />
            </div>
          )}
          {editorUtils && (
            <div style={{ width: buttonAreaWidth, }} className="">
              <ButtonArea
                editorUtils={editorUtils}
                id={id}
                width={width}
                height={height}
                background={background}
                isDemo={isDemo}
                handleResetStrokePressureInfo={handleResetStrokePressureInfo}
              />
            </div>
          )}
        </div>
        <div className="mt-4">
          <ChangeParametersArea
            id={id}
            editorUtils={editorUtils}
            isDemo={isDemo}
          />
        </div>
      </div>
    </div>
  );
}
