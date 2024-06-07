import { useAtom } from "jotai";
import { noteOperationInfoAtom, strokePressureInfoAtom, strokePressureInfoStoreAtom, strokeTimeInfoAtom } from "@/app/hooks/atoms/note";
import { TLNoteOperationInfo, TLStrokePressureInfo, TLStrokeTimeInfo } from "@/@types/note";

export const useStrokePressureInfo = () => {
  const [strokePressureInfo, setStrokePressureInfo] = useAtom(
    strokePressureInfoAtom
  );
  const [strokePressureInfoStore, setStrokePressureInfoStore] = useAtom(strokePressureInfoStoreAtom);
  const [strokeTimeInfo, setStrokeTimeInfo] = useAtom(strokeTimeInfoAtom);
  const [noteOperationInfo, setNoteOperationInfo] = useAtom(noteOperationInfoAtom);

  const addStrokePressureInfo = (
    id: string,
    groupID: number,
    avg: number,
    group: number,
    color: "black" | "blue" | "green" | "grey" | "light-blue" | "light-green" | "light-red" | "light-violet" | "orange" | "red" | "violet" | "yellow"
  ) => {
    setStrokePressureInfo((prev: TLStrokePressureInfo) => ({
      ...prev,
      [id]: {
        groupID,
        avg,
        group,
        color,
      },
    }));
    setStrokePressureInfoStore((prev: TLStrokePressureInfo) => ({
      ...prev,
      [id]: {
        groupID,
        avg,
        group,
        color,
      },
    }));
  };

  const addStrokeTimeInfo = (
    id: string,
    drawTime: number,
    startTime: number,
    len: number,
  ) => {
    setStrokeTimeInfo((prev: TLStrokeTimeInfo) => ({
      ...prev,
      [id]: {
        drawTime,
        startTime,
        len,
      },
    }));
  };

  const addNoteOperationInfo = (
    operation: string,
    strokeID: string,
    time: number,
  ) => {
    setNoteOperationInfo((prev: TLNoteOperationInfo[]) => ([
      ...prev,
      {
        operation,
        strokeID,
        time,
      },
    ]));
  }

  const initializeStrokePressureInfo = (
    strokePressureInfo: TLStrokePressureInfo
  ) => {
    setStrokePressureInfo(strokePressureInfo);
    setStrokePressureInfoStore(strokePressureInfo);
  };

  const onlyInitializeStrokePressureInfo = (
    strokePressureInfo: TLStrokePressureInfo
  ) => {
    setStrokePressureInfo(strokePressureInfo);
  }

  const onlyInitializeStrokePressureInfoStore = (
    strokePressureInfo: TLStrokePressureInfo
  ) => {
    setStrokePressureInfoStore(strokePressureInfo);
  }

  const initializeStrokeTimeInfo = (
    strokeTimeInfo: TLStrokeTimeInfo
  ) => {
    setStrokeTimeInfo(strokeTimeInfo);
  }

  const initializeNoteOperationInfo = (
    noteOperationInfo: TLNoteOperationInfo[]
  ) => {
    setNoteOperationInfo(noteOperationInfo);
  }

  const clearStrokePressureInfo = () => {
    setStrokePressureInfo({});
  };

  const clearStrokeTimeInfo = () => {
    setStrokeTimeInfo({});
  }

  const clearNoteOperationInfo = () => {
    setNoteOperationInfo([]);
  }

  const clearStrokePressureInfoStore = () => {
    setStrokePressureInfoStore({});
  }

  const clearStrokeInfo = () => {
    clearStrokePressureInfo();
    clearStrokePressureInfoStore();
    clearStrokeTimeInfo();
    clearNoteOperationInfo();
  }



  return {
    strokePressureInfo,
    addStrokePressureInfo,
    initializeStrokePressureInfo,
    clearStrokePressureInfo,
    strokeTimeInfo,
    addStrokeTimeInfo,
    initializeStrokeTimeInfo,
    clearStrokeTimeInfo,
    noteOperationInfo,
    addNoteOperationInfo,
    initializeNoteOperationInfo,
    clearNoteOperationInfo,
    clearStrokeInfo,
    strokePressureInfoStore,
    clearStrokePressureInfoStore,
    onlyInitializeStrokePressureInfo,
    onlyInitializeStrokePressureInfoStore
  };
};
