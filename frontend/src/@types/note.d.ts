import { TLIDAndCreatedAtAndUpdatedAt } from "./common";

export interface TLStrokePressureInfoItem {
  groupID: string | number;
  avg: number;
  group: number;
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
}

export interface TLNoteData extends TLPostNoteData, TLIDAndCreatedAtAndUpdatedAt{}