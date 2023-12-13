import { Editor } from "@tldraw/tldraw";
import PPUndoArea from "./Areas/PP-UndoArea/layout";
import AllAveragePressurePieGraphArea from "./Areas/AllAveragePressurePieGraphArea/layout";

interface Props {
  width: string | number;
  height: string | number;
  padding: string | number;
  background: string;
  isDebugMode?: boolean;
  editor?: Editor;
  hideAllAveragePressurePieGraph?: boolean;
  allAveragePressurePieGraphWidth?: string | number;
}

export default function PPUndoGraph(props: Props) {
  const {
    width,
    height,
    padding,
    background,
    isDebugMode = false,
    hideAllAveragePressurePieGraph = false,
    allAveragePressurePieGraphWidth = "50%",
    editor
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
        <PPUndoArea editor={editor} />
        <div className="mt-4">
          {
            !hideAllAveragePressurePieGraph &&
            <div style={{ width: allAveragePressurePieGraphWidth }}>
              <AllAveragePressurePieGraphArea />
            </div>
          }
        </div>
      </div>
    </div>
  );
}
