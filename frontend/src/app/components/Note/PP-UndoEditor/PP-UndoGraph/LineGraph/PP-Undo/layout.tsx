"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { PPUndoGraphConfig } from "../../configs/ppundo-graph";
import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { strokePressureInfoAtom } from "@/app/hooks";

export default function PPUndoLineGraph() {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    ArcElement
  );
  ChartJS.defaults.scales.linear.min = 0;

  const { SPLIT_PRESSURE_NUM, xLabels, datasets, options } =
    PPUndoGraphConfig();

  const [strokePressureInfo] = useAtom(strokePressureInfoAtom);

  const [data, setData] = useState<number[]>([]);
  const graphData = {
    labels: xLabels,
    datasets: [{ ...datasets, ...{ data: data } }],
  };

  useEffect(() => {
    const setGraphData = () => {
      let tmp: number[] = [...Array(SPLIT_PRESSURE_NUM + 1)].fill(0);
      for (const id in strokePressureInfo) {
        const pressure = strokePressureInfo[id]["avg"];
        const j = Math.round(pressure * 100) / 100;
        tmp[Math.ceil(j * SPLIT_PRESSURE_NUM)] += 1;
      }
      setData(tmp);
    };
    setGraphData();
  }, [strokePressureInfo, SPLIT_PRESSURE_NUM]);

  return (
    <Line
      className="graph"
      height={200}
      data={graphData}
      options={options}
      id="pressure-line-graph"
    />
  );
}
