// ChangeParametersArea.tsx
import { EditorUtils } from "../../../util";
import "../area.css";
import { Dispatch, SetStateAction } from "react";

interface Props {
  id: number;
  editorUtils?: EditorUtils;
  isDemo: boolean;
  wTime: number;
  setWTime: Dispatch<SetStateAction<number>>;
  wPressure: number;
  setWPressure: Dispatch<SetStateAction<number>>;
  wDistance: number;
  setWDistance: Dispatch<SetStateAction<number>>;
  boundaryValue: number;
  setBoundaryValue: Dispatch<SetStateAction<number>>;
}

interface SliderRowProps {
  label: string;
  id: string;
  value: number;
  onChange: (v: number) => void;
}

function SliderRow({ label, id, value, onChange }: SliderRowProps) {
  return (
    <div className="slider-container">
      <p className="w-20">{label}</p>
      <div className="slider-wrapper">
        <input
          type="range"
          id={id}
          min="0"
          max="1"
          step="0.01"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
        />
        <div className="slider-track">
          <div
            className="slider-fill"
            style={{ width: `${value * 100}%` }}
          />
        </div>
        <div
          className="slider-thumb"
          style={{ left: `${value * 100}%` }}
        />
      </div>
      <span className="slider-value">{value.toFixed(2)}</span>
    </div>
  );
}

export default function ChangeParametersArea(props: Props) {
  const {
    id,
    editorUtils,
    isDemo,
    wTime,
    setWTime,
    wPressure,
    setWPressure,
    wDistance,
    setWDistance,
    boundaryValue,
    setBoundaryValue,
  } = props;

  return (
    <div className="area parameter-area">
      <div className="title">
        Parameters
      </div>
      <div className="sliders">
        <SliderRow
          label="Time"
          id={`wTime-${id}`}
          value={wTime}
          onChange={setWTime}
        />
        <SliderRow
          label="Pressure"
          id={`wPressure-${id}`}
          value={wPressure}
          onChange={setWPressure}
        />
        <SliderRow
          label="Distance"
          id={`wDistance-${id}`}
          value={wDistance}
          onChange={setWDistance}
        />
        <SliderRow
          label="Boundary"
          id={`boundaryValue-${id}`}
          value={boundaryValue}
          onChange={setBoundaryValue}
        />
      </div>
    </div>
  );
}
