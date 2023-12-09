import { getGradientColor } from "@/app/modules/note/getGradientColor";

interface Props {
  pointerPosition: { x: number, y: number };
  nowAvgPressure: number;
}

export default function NowAvgPressureGauge(props: Props) {
  const { pointerPosition, nowAvgPressure } = props;
  return (
    <div className="moveNowBorderLinearProgress" style={{ 
      left: pointerPosition.x - 60, 
      top: pointerPosition.y - 40,
    }}>
      <div className="bar" style={{backgroundColor: getGradientColor(nowAvgPressure) + "aa", width: `${nowAvgPressure*100}px`}}></div>
    </div>
  );
}