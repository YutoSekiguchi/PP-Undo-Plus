export interface TLStrokePressureInfoItem {
  groupID: string | number;
  avg: number;
  group: number;
}

export type TLStrokePressureInfo = {
  [id: string]: TLStrokePressureInfoItem;
}