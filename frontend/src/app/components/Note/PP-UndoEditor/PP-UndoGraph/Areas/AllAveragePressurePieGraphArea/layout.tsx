import { useEffect, useState } from "react";
import AllPressureAveragePieGraph from "../../PieGraph/AllAverage/layout";
import "../area.css";
import { AllPressureAveragePieGraphConfig } from "../../configs/all-pressure-average-pie-graph";
import { useAtom } from "jotai";
import { strokePressureInfoAtom } from "@/app/hooks";

export default function AllAveragePressurePieGraphArea() {
  const [value, setValue] = useState<number>(0);
  const [strokePressureInfo] = useAtom(strokePressureInfoAtom);

  const { datasets, graphLabel, doughnutOptions } =
    AllPressureAveragePieGraphConfig();

  const graphData = {
    labels: graphLabel,
    datasets: [
      {
        ...datasets,
        ...{ data: [value, 1 - value] },
      },
    ],
  };

  useEffect(() => {
    if (strokePressureInfo) {
      let avgTmp = 0;
      let count = 0;
      for (const id in strokePressureInfo) {
        if (!strokePressureInfo[id]["avg"]) continue;
        avgTmp += strokePressureInfo[id]["avg"];
        count++;
      }
      if (count > 0) avgTmp /= count;
      setValue(Math.round(avgTmp * 100) / 100 || 0);
    }
  }, [strokePressureInfo]);

  const getPressureLabel = (v: number) => {
    if (v === 0) return "No data";
    if (v < 0.3) return "Light";
    if (v < 0.5) return "Moderate";
    if (v < 0.7) return "Firm";
    return "Heavy";
  };

  return (
    <div className="area" style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minWidth: 0,
      flexShrink: 0,
      width: "auto",
    }}>
      <span className="section-title" style={{ alignSelf: "flex-start" }}>Avg. Pressure</span>
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <div style={{
          position: "relative",
          width: 90,
          height: 90,
        }}>
          <div style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
          }}>
            <div style={{
              fontSize: 18,
              fontWeight: 700,
              fontVariantNumeric: "tabular-nums",
              color: value > 0 ? "#c4b5fd" : "rgba(255, 255, 255, 0.2)",
              lineHeight: 1,
            }}>
              {value > 0 ? value.toFixed(2) : "—"}
            </div>
          </div>
          <AllPressureAveragePieGraph
            data={graphData}
            options={doughnutOptions}
          />
        </div>
        <span style={{
          fontSize: 10,
          fontWeight: 500,
          color: "rgba(255, 255, 255, 0.3)",
          marginTop: 4,
        }}>
          {getPressureLabel(value)}
        </span>
      </div>
    </div>
  );
}
