import { useState } from "react";
import { EditorUtils } from "../../../util";
import LogList from "../../LogList/layout";

interface Props {
  editorUtils: EditorUtils;
  id: number;
  width: string | number;
  height: string | number;
  background: string;
}

export default function ButtonArea(props: Props) {
  const { editorUtils, id, width, height, background } = props;

  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
  }

  const handleClose = () => {
    setIsOpen(false);
  }

  return (
    <div className="area">
      {
        isOpen &&
        <LogList id={id} editorUtils={editorUtils} width={width} height={height} background={background} handleClose={handleClose} />
      }
      <div className="title">
        <p className="text-center font-bold text-md mb-2">
          Redo
        </p>
      </div>
      <div className="button-list flex flex-col items-center">
        <button className="history-button text-center hover:opacity-80 text-xs md:text-sm rounded-lg mt-1 mb-2 py-2 px-1 md:px-4" onClick={handleOpen}>
          History
        </button>
      </div>
    </div>
  );
}