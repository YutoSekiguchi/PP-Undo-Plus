import { Dispatch, SetStateAction, useState } from "react";
import { EditorUtils } from "../../../util";
import LogList from "../../LogList/layout";
import { TLGroupVisualMode } from "@/@types/note";

interface Props {
  editorUtils: EditorUtils;
  id: number;
  width: string | number;
  height: string | number;
  background: string;
  isDemo: boolean;
  handleResetStrokePressureInfo: (allRecords: any) => void;
  pMode: "average" | "grouping";
  setPMode: Dispatch<SetStateAction<"grouping" | "average">>;
  setIsShowLayer: Dispatch<SetStateAction<boolean>>;
  groupVisualMode: TLGroupVisualMode;
  setGroupVisualMode: Dispatch<SetStateAction<TLGroupVisualMode>>;
  setIsSettingOpen: Dispatch<SetStateAction<boolean>>;
}

export default function ButtonArea(props: Props) {
  const {
    editorUtils,
    id,
    width,
    height,
    background,
    isDemo,
    handleResetStrokePressureInfo,
    pMode,
    setPMode,
    setIsShowLayer,
    groupVisualMode,
    setGroupVisualMode,
    setIsSettingOpen
  } = props;
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const togglePMode = () => {
    setPMode(pMode === "average" ? "grouping" : "average");
  }

  const RedoButton = () => {
    return (
      <div className="flex items-center justify-around">
        {isOpen && (
          <LogList
            id={id}
            editorUtils={editorUtils}
            width={width}
            height={height}
            background={background}
            handleClose={handleClose}
            isDemo={isDemo}
            handleResetStrokePressureInfo={handleResetStrokePressureInfo}
          />
        )}
        {/* <div className="title">
          <p className="text-center font-bold text-md">Redo</p>
        </div> */}
        <div className="button-list flex flex-col items-center">
          <button
            className="history-button text-center bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-2 px-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out"
            onClick={handleOpen}
          >
            History
          </button>
        </div>
      </div>
    );
  };

  const PModeSwitch = () => {
    return (
      <div className="p-mode-switch-container my-4 flex items-center justify-around">
        {/* <div className="title">
          <p className="text-center font-bold text-md">Mode</p>
        </div> */}
        <div className="p-mode-switch flex justify-center items-center">
          <div
            className={`switch ${
              pMode === "average" ? "left" : "right"
            } bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-2 px-4 rounded-full cursor-pointer transition-all text-center`}
            onClick={togglePMode}
          >
            {pMode === "average" ? "Average" : "Grouping"}
          </div>
        </div>
      </div>
    );
  };

  const SettingButton = () => {
    return (
      <div className="flex items-center justify-around">
        {/* <div className="title">
          <p className="text-center font-bold text-md">Settings</p>
        </div> */}
        <div className="button-list flex flex-col items-center">
          <button
            className="history-button text-center bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-2 px-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out"
            onClick={() => setIsSettingOpen(true)}
          >
            Setting
          </button>
        </div>
      </div>
    );
  }

  const CheckLayerButton = () => {
    return (
      <div className="flex items-center justify-around">
        {/* <div className="title">
          <p className="text-center font-bold text-md">Check Layer</p>
        </div> */}
        <div className="button-list flex flex-col items-center">
          <button
            className="history-button text-center bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold py-2 px-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out"
            onClick={() => {setIsShowLayer(true)}}
          >
            Layer
          </button>
        </div>
      </div>
    );
  }

  const ChangeGroupVisualButton = () => {
    const nextMode = () => {
      switch (groupVisualMode) {
        case "area":
          return "line";
        case "line":
          return "none";
        case "none":
          return "area";
        default:
          return "none";
      }
    };

    const buttonText = () => {
      switch (groupVisualMode) {
        case "area":
          return "Area";
        case "line":
          return "Line";
        case "none":
          return "None";
        default:
          return "Unknown";
      }
    };

    return (
      <div className="flex items-center justify-around">
        <div className="button-list flex flex-col items-center">
          <button
            className="history-button text-center bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-2 px-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out"
            onClick={() => setGroupVisualMode(nextMode())}
          >
            {buttonText()}
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="area my-auto">
        <div className="flex flex-col gap-4 items-center justify-center mt-4">
          <div className="flex gap-2">
            <RedoButton />
            <CheckLayerButton />
          </div>
          <div className="flex gap-2">
            <SettingButton />
            <ChangeGroupVisualButton />
          </div>
        </div>
      </div>
    </>
  );
}
