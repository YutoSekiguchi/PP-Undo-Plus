import { TLCollectionData } from "@/@types/collection";
import { atom } from "jotai";

export const selectedCollectionAtom = atom<TLCollectionData | null>(null);
