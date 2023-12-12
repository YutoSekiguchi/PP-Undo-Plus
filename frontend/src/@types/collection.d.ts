import { TLIDAndCreatedAtAndUpdatedAt } from "./common";

export interface TLPostCollectionData {
  UserID: number;
  Title: string;
}

export interface TLCollectionData extends TLPostCollectionData, TLIDAndCreatedAtAndUpdatedAt {}