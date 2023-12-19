import { Editor } from "@tldraw/tldraw";
import PPUndoArea from "./Areas/PP-UndoArea/layout";
import AllAveragePressurePieGraphArea from "./Areas/AllAveragePressurePieGraphArea/layout";
import { EditorUtils } from "../util";
import ButtonArea from "./Areas/ButtonArea/layout";

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
    id
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
        <PPUndoArea editor={editor} id={id} editorUtils={editorUtils} />
        <div className="mt-4 flex justify-between">
          {
            !hideAllAveragePressurePieGraph &&
            <div style={{ width: allAveragePressurePieGraphWidth }}>
              <AllAveragePressurePieGraphArea />
            </div>
          }
          {
            editorUtils &&
            <div style={{ width: buttonAreaWidth }} className="">
              <ButtonArea editorUtils={editorUtils} />
            </div>
          }
        </div>
      </div>
    </div>
  );
}
