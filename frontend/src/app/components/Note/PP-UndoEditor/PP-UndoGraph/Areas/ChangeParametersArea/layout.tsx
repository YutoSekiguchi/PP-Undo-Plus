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
        <p className="text-center font-bold text-sm mb-1">Parameters</p>
      </div>
      <div className="sliders">
        <div className="slider-container">
          <p className="w-20">Time</p>
          <div className="slider-wrapper">
            <input
              type="range"
              id={`wTime-${id}`}
              min="0"
              max="1"
              step="0.01"
              value={wTime}
              onChange={(e) => setWTime(Number(e.target.value))}
            />
            <div className="slider-track">
              <div
                className="slider-fill"
                style={{ width: `${wTime * 100}%` }}
              ></div>
            </div>
            <div
              className="slider-thumb"
              style={{ left: `${wTime * 100}%` }}
            ></div>
          </div>
          {wTime && <span className="slider-value">{wTime.toFixed(2)}</span>}
        </div>
        <div className="slider-container">
          <p className="w-20">Pressure</p>
          <div className="slider-wrapper">
            <input
              type="range"
              id={`wPressure-${id}`}
              min="0"
              max="1"
              step="0.01"
              value={wPressure}
              onChange={(e) => setWPressure(Number(e.target.value))}
            />
            <div className="slider-track">
              <div
                className="slider-fill"
                style={{ width: `${wPressure * 100}%` }}
              ></div>
            </div>
            <div
              className="slider-thumb"
              style={{ left: `${wPressure * 100}%` }}
            ></div>
          </div>
          {wPressure && <span className="slider-value">{wPressure.toFixed(2)}</span>}
        </div>
        <div className="slider-container">
          <p className="w-20">Distance</p>
          <div className="slider-wrapper">
            <input
              type="range"
              id={`wDistance-${id}`}
              min="0"
              max="1"
              step="0.01"
              value={wDistance}
              onChange={(e) => setWDistance(Number(e.target.value))}
            />
            <div className="slider-track">
              <div
                className="slider-fill"
                style={{ width: `${wDistance * 100}%` }}
              ></div>
            </div>
            <div
              className="slider-thumb"
              style={{ left: `${wDistance * 100}%` }}
            ></div>
          </div>
          {wDistance && <span className="slider-value">{wDistance.toFixed(2)}</span>}
        </div>
        <div className="slider-container">
          <p className="w-20">WA</p>
          <div className="slider-wrapper">
            <input
              type="range"
              id={`boundaryValue-${id}`}
              min="0"
              max="1"
              step="0.01"
              value={boundaryValue}
              onChange={(e) => setBoundaryValue(Number(e.target.value))}
            />
            <div className="slider-track">
              <div
                className="slider-fill"
                style={{ width: `${boundaryValue * 100}%` }}
              ></div>
            </div>
            <div
              className="slider-thumb"
              style={{ left: `${boundaryValue * 100}%` }}
            ></div>
          </div>
          {boundaryValue && <span className="slider-value">{boundaryValue.toFixed(2)}</span>}
        </div>
      </div>
    </div>
  );
}
