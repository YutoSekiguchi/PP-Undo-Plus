import { useState, useEffect, PointerEvent } from "react";
import "./slider.css";
import { Editor, TLGroupShape, TLShapeId } from "tldraw";
import { strokePressureInfoAtom } from "@/app/hooks";
import { useAtom } from "jotai";
import { EditorUtils } from "../../../../util";
import { generateRandomString } from "@/app/modules/common/generateRandomString";
import uploadSvg from "@/app/lib/upload/svg";
import { createNoteLog } from "@/app/lib/note_log";
import { TLPostNoteLogData } from "@/@types/note";

interface Props {
  editor?: Editor;
  id: number;
  editorUtils?: EditorUtils;
  pMode: "average" | "grouping";
  isDemo: boolean;
}

export default function PPUndoSlider(props: Props) {
  const { editor, id, editorUtils, pMode, isDemo } = props;
  const [sliderValue, setSliderValue] = useState(0);
  const [strokePressureInfo] = useAtom(strokePressureInfoAtom);

  useEffect(() => {
    updateSliderBackground(sliderValue);
  }, [sliderValue]);

  const updateSliderBackground = (value: number) => {
    const range: HTMLInputElement | null = document.querySelector("#myRange");
    if (range) {
      range.style.background = `linear-gradient(to right, blue 0%, fuchsia ${value}%, black ${value}%, black 100%)`;
    }
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

  const handleChangeSliderValue = (value: number) => {
    setSliderValue(value);
    const sliderPressure = value / 100;
    if (editor === undefined) return;

    // 削除予定のストロークの更新
    const erasingShapeIds = editor.getErasingShapeIds();
    const erasing = new Set<TLShapeId>(erasingShapeIds);
    const currentPageShapes = editor.getCurrentPageShapes();

    for (const shape of currentPageShapes) {
      if (editor.isShapeOfType<TLGroupShape>(shape, "group")) continue;
      if (strokePressureInfo[shape.id] === undefined) continue;
      let targetPressure = 0;
      if (pMode === "average") {
        targetPressure = strokePressureInfo[shape.id]["avg"];
      } else if (pMode === "grouping") {
        targetPressure = strokePressureInfo[shape.id]["group"];
      }
      if (targetPressure < sliderPressure) {
        erasing.add(shape.id);
      } else {
        erasing.delete(shape.id);
      }
    }
    editor.setErasingShapes(Array.from(erasing));
  };

  const handleSliderRelease = async () => {
    if (editor === undefined || editorUtils === undefined) return;

    const snapshot = editorUtils.getSnapshot();
    const svg = await getSvgAsString();
    const filename = `log-${generateRandomString()}`;

    // ストロークの削除
    const eraseShapeIds = editor.getCurrentPageState().erasingShapeIds;
    if (eraseShapeIds.length === 0) {
      editor.setErasingShapes([]);
      setSliderValue(0);
      return;
    }

    if (svg) {
      uploadSvg(svg, filename).catch((err) => {
        console.error(err);
      });
    }

    if (!isDemo) {
      const logData: TLPostNoteLogData = {
        NoteID: id,
        Snapshot: JSON.stringify(snapshot),
        SvgPath: filename,
      };
      createNoteLog(logData)
        .then(() => {})
        .catch((err) => {
          console.error(err);
        });
    }

    editor.deleteShapes(eraseShapeIds);
    editor.setErasingShapes([]);
    setSliderValue(0);
  };

  return (
    <div
      style={{
        position: "relative",
        padding: "10px",
        marginLeft: "-20px",
        marginRight: "-20px",
      }}
      onPointerUpCapture={handleSliderRelease}
      // onPointerLeave={handleSliderRelease}
    >
      <input
        type="range"
        id="myRange"
        min="0"
        max="100"
        value={sliderValue}
        onChange={(e) => handleChangeSliderValue(parseInt(e.target.value))}
      />
    </div>
  );
}
