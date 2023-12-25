"use client";

import { useLoading, useSelectedCollection, useUser } from "@/app/hooks";
import "./style.css";
import NoteListHeader from "./Header/layout";
import NoteListMain from "./Main/layout";
import { useRouter } from "next/navigation";
import { TLPostNoteData } from "@/@types/note";
import { createNote } from "@/app/lib/note";
import { updateCollection } from "@/app/lib/collection";
import { useEffect, useState } from "react";
import LoadingScreen from "@/app/Loading";

interface Props {
  lang: string | string[] | undefined;
}

export default function NoteList(props: Props): JSX.Element {
  const { lang } = props;
  const { selectedCollection } = useSelectedCollection();
  const router = useRouter();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isNoteSelectMode, setIsNoteSelectMode] = useState<boolean>(false);
  const [selectedNoteIDs, setSelectedNoteIDs] = useState<number[]>([]);

  const handleAddNoteIconClick = async () => {
    if (selectedCollection === null) return;
    setIsLoading(true);
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
      PressureInfo: "",
      StrokeTimeInfo: "",
      OperationJsonPath: "",
    };
    const res = await createNote(data);
    if (res === null) {
      setIsLoading(false);
      alert(
        `${
          lang === "en" ? "Failed to create note" : "ノートの作成に失敗しました"
        }`
      );
      return;
    }
    await updateCollection(selectedCollection);
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    router.push(`/notes/${res.ID}`);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    if (selectedCollection) {
      timer;
    }
    return () => clearTimeout(timer);
  }, [selectedCollection]);

  return (
    <div className="note-list bg-gray-100">
      {selectedCollection && (
        <>
          <NoteListHeader
            selectedCollection={selectedCollection}
            lang={lang}
            handleAddNoteIconClick={handleAddNoteIconClick}
            isNoteSelectMode={isNoteSelectMode}
            setIsNoteSelectMode={setIsNoteSelectMode}
            selectedNoteIDs={selectedNoteIDs}
            setSelectedNoteIDs={setSelectedNoteIDs}
          />
          <NoteListMain
            selectedCollection={selectedCollection}
            lang={lang}
            handleAddNoteIconClick={handleAddNoteIconClick}
            isNoteSelectMode={isNoteSelectMode}
            selectedNoteIDs={selectedNoteIDs}
            setSelectedNoteIDs={setSelectedNoteIDs}
          />
        </>
      )}
      {isLoading && <LoadingScreen />}
    </div>
  );
}
