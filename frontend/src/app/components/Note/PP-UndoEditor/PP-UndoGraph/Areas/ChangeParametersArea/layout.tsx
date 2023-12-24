import { EditorUtils } from "../../../util";
import "../area.css";

interface Props {
  id: number;
  editorUtils?: EditorUtils;
  isDemo: boolean;
}

export default function ChangeParametersArea(props: Props) {
  const { id, editorUtils, isDemo } = props;
  return (
    <div className="area parameter-area">
      <div className="title">
        <p className="text-center font-bold text-md mb-2">Coming Soon</p>
      </div>
    </div>
  );
}