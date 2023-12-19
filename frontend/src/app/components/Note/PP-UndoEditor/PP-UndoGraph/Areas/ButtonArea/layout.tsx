import { useState } from "react";
import { EditorUtils } from "../../../util";

interface Props {
  editorUtils: EditorUtils;
  id: number;
}

export default function ButtonArea(props: Props) {
  const { editorUtils, id } = props;

  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
  }

  return (
    <div className="area">
      <div className="title">
        <p className="text-center font-bold text-md mb-2">
          Redo
        </p>
      </div>
      <div className="button-list flex flex-col items-center">
        <button className="history-button text-center hover:opacity-80 text-xs md:text-sm rounded-lg mt-1 mb-2 py-2 px-1 md:px-4">
          History
        </button>
      </div>
    </div>
  );
}