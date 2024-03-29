import { TLIDAndCreatedAtAndUpdatedAt } from "./common";

export interface TLStrokePressureInfoItem {
  groupID: number;
  avg: number;
  group: number;
}

export interface TLStrokeTimeAndLengthInfoItem {
  drawTime: number;
  startTime: number;
  len: number;
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
  StrokeTimeInfo: string;
  OperationJsonPath: string;
}

export interface TLPostNoteLogData {
  NoteID: number;
  Snapshot: string;
  SvgPath: string;
}

export interface TLNoteData extends TLPostNoteData, TLIDAndCreatedAtAndUpdatedAt{}

export interface TLNoteLogData extends TLPostNoteLogData, TLIDAndCreatedAtAndUpdatedAt{}