import { TLNoteOperationInfo, TLStrokePressureInfo, TLStrokeTimeInfo } from "@/@types/note";
import { atom } from "jotai";

export const strokePressureInfoAtom = atom<TLStrokePressureInfo>({});

export const strokePressureInfoStoreAtom = atom<TLStrokePressureInfo>({});

export const strokeTimeInfoAtom = atom<TLStrokeTimeInfo>({});

export const noteOperationInfoAtom = atom<TLNoteOperationInfo[]>([]);