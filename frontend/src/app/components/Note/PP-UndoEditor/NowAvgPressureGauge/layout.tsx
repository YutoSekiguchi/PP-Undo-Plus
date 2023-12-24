import { getGradientColor } from "@/app/modules/note/getGradientColor";
import { EditorUtils } from "../util";

interface Props {
  pointerPosition: { x: number; y: number };
  nowAvgPressure: number;
  editorUtils: EditorUtils;
}

export default function NowAvgPressureGauge(props: Props) {
  const { pointerPosition, nowAvgPressure, editorUtils } = props;
  return (
    <div
      className="moveNowBorderLinearProgress"
      style={{
        left:
          (pointerPosition.x + editorUtils.getCameraData().x) *
          editorUtils.getCameraData().z,
        top:
          (pointerPosition.y + editorUtils.getCameraData().y) *
            editorUtils.getCameraData().z -
          40,
      }}
    >
      <div
        className="bar"
        style={{
          backgroundColor: getGradientColor(nowAvgPressure) + "aa",
          width: `${nowAvgPressure * 100}px`,
        }}
      ></div>
    </div>
  );
}
