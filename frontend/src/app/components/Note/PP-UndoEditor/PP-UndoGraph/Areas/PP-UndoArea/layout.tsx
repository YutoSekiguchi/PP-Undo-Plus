import { Editor } from "tldraw";
import PPUndoLineGraph from "../../LineGraph/PP-Undo/layout";
import PPUndoSlider from "./Slider/layout";
import "../area.css";
import { EditorUtils } from "../../../util";

interface Props {
  editor?: Editor;
  id: number;
  editorUtils?: EditorUtils;
  pMode: "average" | "grouping";
  isDemo: boolean;
}

export default function PPUndoArea(props: Props) {
  const { editor, id, editorUtils, pMode, isDemo } = props;
  return (
    <div className="area">
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 8,
      }}>
        <span className="section-title" style={{ margin: 0 }}>
          Pressure Threshold
        </span>
        <span style={{
          fontSize: 10,
          fontWeight: 500,
          padding: "2px 8px",
          borderRadius: 6,
          background: pMode === "average"
            ? "rgba(139, 92, 246, 0.15)"
            : "rgba(6, 182, 212, 0.15)",
          color: pMode === "average" ? "#a78bfa" : "#67e8f9",
          border: `1px solid ${pMode === "average" ? "rgba(139, 92, 246, 0.25)" : "rgba(6, 182, 212, 0.25)"}`,
        }}>
          {pMode}
        </span>
      </div>
      <PPUndoSlider
        editor={editor}
        id={id}
        editorUtils={editorUtils}
        pMode={pMode}
        isDemo={isDemo}
      />
      <PPUndoLineGraph pMode={pMode} />
    </div>
  );
}
