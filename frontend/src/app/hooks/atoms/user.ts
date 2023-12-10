import { TLUserData } from "@/@types/user";
import { atom } from "jotai";

export const userAtom = atom<TLUserData | null>(null);