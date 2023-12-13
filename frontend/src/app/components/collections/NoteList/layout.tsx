"use client";

import { useLoading, useSelectedCollection, useUser } from "@/app/hooks";
import "./style.css";
import NoteListHeader from "./Header/layout";
import NoteListMain from "./Main/layout";
import { useRouter } from "next/navigation";
import { TLPostNoteData } from "@/@types/note";
import { createNote } from "@/app/lib/note";
import { updateCollection } from "@/app/lib/collection";

interface Props {
  lang: string | string[] | undefined;
}

export default function NoteList(props: Props) {
  const { lang } = props;
  const { selectedCollection } = useSelectedCollection();
  const router = useRouter();
  const { user } = useUser();

  const handleAddNoteIconClick = async () => {
    if (selectedCollection === null) return;
    if (user === null) {
      alert(
        `${lang === "en" ? "Please login again" : "ログインし直してください"}`
        );
        return;
      }
    const data: TLPostNoteData = {
      NoteCollectionID: selectedCollection.ID,
      UserID: user.ID,
      Title: "Untitled",
      SvgPath: "",
      Snapshot: "",
    };
    const res = await createNote(data);
    if (res === null) {
      alert(
        `${
          lang === "en" ? "Failed to create note" : "ノートの作成に失敗しました"
        }`
      );
      return;
    }
    await updateCollection(selectedCollection)
    if (lang !== undefined) {router.push(`/note?id=${res.ID}&lang=${lang}`)} else {
      router.push(`/note?id=${res.ID}`);
    }
  };

  return (
    <div className="note-list bg-gray-100">
      {
        selectedCollection &&
        <>
          <NoteListHeader selectedCollection={selectedCollection} lang={lang} handleAddNoteIconClick={handleAddNoteIconClick} />
          <NoteListMain selectedCollection={selectedCollection} lang={lang} handleAddNoteIconClick={handleAddNoteIconClick} />
        </>
      }
    </div>
  );
}