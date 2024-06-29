import { TLIDAndCreatedAtAndUpdatedAt } from "./common";

export interface TLStrokePressureInfoItem {
  groupID: number;
  avg: number;
  group: number;
  color: "black" | "blue" | "green" | "grey" | "light-blue" | "light-green" | "light-red" | "light-violet" | "orange" | "red" | "violet" | "yellow";
}

export interface TLStrokeTimeAndLengthInfoItem {
  drawTime: number;
  startTime: number;
  len: number;
}

export interface TLCamera {
  x: number;
  y: number;
  z: number;
}

export interface TLNoteOperationInfo {
  operation: string;
  strokeID: string;
  time: number;
}

export interface TLStrokeGroupInfo {
  GroupID: string | number;
  Top: number;
  Left: number;
  Width: number;
  Height: number;
}

export interface TLGroupDrawArea {
  ids: string[];
  left: number;
  top: number;
  width: number;
  height: number;
  groupID: number;
  groupPressure: number;
}

export interface TLStrokeTimeInfo {
  [id: string]: TLStrokeTimeAndLengthInfoItem;
}

export type TLStrokePressureInfo = {
  [id: string]: TLStrokePressureInfoItem;
}

export interface TLPostNoteData {
  NoteCollectionID: number;
  UserID: number;
  Title: string;
  SvgPath: string;
  Snapshot: string;
  PressureInfo: string;
  AllPressureInfo: string;
  StrokeTimeInfo: string;
  OperationJsonPath: string;
  WPressure: number;
  WTime: number;
  WDistance: number;
  boundaryValue: number;
}

export interface TLPostNoteLogData {
  NoteID: number;
  Snapshot: string;
  SvgPath: string;
}

export interface TLNoteSettings {
  availableEnclosed: boolean;
}

export type TLGroupVisualMode = "area" | "line" | "none";

export interface TLNoteData extends TLPostNoteData, TLIDAndCreatedAtAndUpdatedAt{}

export interface TLNoteLogData extends TLPostNoteLogData, TLIDAndCreatedAtAndUpdatedAt{}