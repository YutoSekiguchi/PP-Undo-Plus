import { Editor } from "@tldraw/tldraw";
import PPUndoLineGraph from "../../LineGraph/PP-Undo/layout";
import PPUndoSlider from "../../Slider/layout";
import "../area.css";

interface Props { 
  editor?: Editor;
}

export default function PPUndoArea(props: Props) {
  const { editor } = props;
  return (
    <div className="area">
      <div className="title">
        <p className="text-center font-bold text-md mb-2">
          PP-Undo
        </p>
      </div>
      <PPUndoSlider editor={editor} />
      <PPUndoLineGraph />
    </div>
  );
}