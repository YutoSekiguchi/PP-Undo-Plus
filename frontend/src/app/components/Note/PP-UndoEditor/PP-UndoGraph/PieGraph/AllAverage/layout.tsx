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
import { Doughnut } from "react-chartjs-2";

interface Props {
  data: any;
  options: any;
}

export default function AllPressureAveragePieGraph(props: Props) {
  const { data, options } = props;
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

  return (
    <Doughnut
      data={data}
      options={options}
      className="doughnuts"
      id="chart-key"
    />
  );
}
