import { TLIDAndCreatedAtAndUpdatedAt } from "./common";

export interface TLStrokePressureInfoItem {
  groupID: string | number;
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

export interface TLStrokeTimeInfo {
  [id: string]: TLStrokeTimeInfoItem;
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

export interface TLNoteData extends TLPostNoteData, TLIDAndCreatedAtAndUpdatedAt{}