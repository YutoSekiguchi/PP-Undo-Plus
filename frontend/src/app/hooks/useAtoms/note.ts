import { useAtom } from "jotai";
import { strokePressureInfoAtom } from "@/app/hooks/atoms/note";
import { TLStrokePressureInfo } from "@/app/types/note";

export const useStrokePressureInfo = () => {
  const [strokePressureInfo, setStrokePressureInfo] = useAtom(
    strokePressureInfoAtom
  );

  const addStrokePressureInfo = (
    id: string,
    groupID: string | number,
    avg: number,
    group: number
  ) => {
    setStrokePressureInfo((prev: TLStrokePressureInfo) => ({
      ...prev,
      [id]: {
        groupID,
        avg,
        group,
      },
    }));
  };

  const initializeStrokePressureInfo = (
    strokePressureInfo: TLStrokePressureInfo
  ) => {
    setStrokePressureInfo(strokePressureInfo);
  };

  const clearStrokePressureInfo = () => {
    setStrokePressureInfo({});
  };

  return {
    strokePressureInfo,
    addStrokePressureInfo,
    initializeStrokePressureInfo,
    clearStrokePressureInfo,
  };
};
