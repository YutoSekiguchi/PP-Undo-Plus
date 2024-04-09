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
import { Lang } from "../../common/lang";

interface Props {
  lang: string | string[] | undefined;
}

export default function NoteList(props: Props): JSX.Element {
  const { lang } = props;
  const { selectedCollection } = useSelectedCollection();
  const router = useRouter();
  const { user } = useUser();
  const [isNoteSelectMode, setIsNoteSelectMode] = useState<boolean>(false);
  const [selectedNoteIDs, setSelectedNoteIDs] = useState<number[]>([]);
  const l =
    lang === undefined || Array.isArray(lang) ? new Lang() : new Lang(lang);

  const handleAddNoteIconClick = async () => {
    if (selectedCollection === null) return;
    if (user === null) {
      alert(l.loginAgain());
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
      WPressure: 0.5,
      WTime: 0.5,
      WDistance: 0.5,
      boundaryValue: 0.3,
    };
    const res = await createNote(data);
    if (res === null) {
      alert(l.failedToCreateNote());
      return;
    }
    await updateCollection(selectedCollection);
    router.push(`/notes/${res.ID}`);
  };

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
    </div>
  );
}
