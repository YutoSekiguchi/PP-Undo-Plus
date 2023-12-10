import { TLIDAndCreatedAtAndUpdatedAt } from "./common";

export interface TLPostUserData {
  Name: string;
  Password: string;
  DisplayName: string;
  Email: string;
  Image: string;
}

export interface TLUserData extends TLPostUserData, TLIDAndCreatedAtAndUpdatedAt {}