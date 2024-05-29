import { Editor } from "@tldraw/tldraw";
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
      <div className="title">
        <p className="text-center font-bold text-md mb-2">PP-Editor</p>
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
