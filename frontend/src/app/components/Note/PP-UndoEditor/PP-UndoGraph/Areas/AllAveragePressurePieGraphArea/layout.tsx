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
      for (const id in strokePressureInfo) {
        avgTmp += strokePressureInfo[id]["avg"];
      }
      avgTmp /= Object.keys(strokePressureInfo).length;

      setValue(Math.round(avgTmp * 100) / 100 || 0);
    }
  }, [strokePressureInfo]);

  return (
    <div className="area">
      <div className="title">
        <p className="text-center font-bold text-md mb-2">
          All Average Pressure
        </p>
      </div>
      <div className="text-center relative w-full">
        <div className="absolute text-center top-1/2 left-1/2 doughnut-graph-value">
          <p className="font-bold">{value}</p>
        </div>
        <AllPressureAveragePieGraph
          data={graphData}
          options={doughnutOptions}
        />
      </div>
    </div>
  );
}
