import { useState, useEffect, PointerEvent } from "react";
import "./slider.css";
import { Editor, TLGroupShape, TLShapeId } from "@tldraw/tldraw";
import { strokePressureInfoAtom } from "@/app/hooks";
import { useAtom } from "jotai";
import { EditorUtils } from "../../util";
import { generateRandomString } from "@/app/modules/common/generateRandomString";
import uploadSvg from "@/app/lib/upload/svg";
import { createNoteLog } from "@/app/lib/note_log";
import { TLPostNoteLogData } from "@/@types/note";

interface Props {
  editor?: Editor;
  id: number;
  editorUtils?: EditorUtils;
}

export default function PPUndoSlider(props: Props) {
  const { editor, id, editorUtils } = props;
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
    const erasingShapeIds = editor.erasingShapeIds;
    const erasing = new Set<TLShapeId>(erasingShapeIds);
    const currentPageShapes = editor.currentPageShapes;

    for (const shape of currentPageShapes) {
      if (editor.isShapeOfType<TLGroupShape>(shape, "group")) continue;
      if (strokePressureInfo[shape.id] === undefined) continue;
      const avgPressure = strokePressureInfo[shape.id]["avg"];
      if (avgPressure < sliderPressure) {
        erasing.add(shape.id);
      } else {
        erasing.delete(shape.id);
      }
    }

    editor.setErasingShapes(Array.from(erasing));
  };

  const handlePointerUp = async(e: PointerEvent<HTMLInputElement>) => {
    if (editor === undefined || editorUtils === undefined) return;
    const target = e.target as HTMLInputElement;
    const value = parseInt(target.value) / 100;
    const snapshot = editorUtils.getSnapshot();
    const svg = await getSvgAsString();
    const filename = `log-${generateRandomString()}`
    if (svg) {
      await uploadSvg(svg, filename);
    }

    const logData: TLPostNoteLogData = {
      NoteID: id,
      Snapshot: JSON.stringify(snapshot),
      SvgPath: filename,
    }
    await createNoteLog(logData);

    // ストロークの削除
    const eraseShapeIds = editor.currentPageState.erasingShapeIds;
    editor.deleteShapes(eraseShapeIds);
    editor.setErasingShapes([]);

    setSliderValue(0);
  };

  return (
    <div>
      <input
        type="range"
        id="myRange"
        min="0"
        max="100"
        value={sliderValue}
        onChange={(e) => handleChangeSliderValue(parseInt(e.target.value))}
        onPointerUp={(e) => handlePointerUp(e)}
      />
    </div>
  );
}
