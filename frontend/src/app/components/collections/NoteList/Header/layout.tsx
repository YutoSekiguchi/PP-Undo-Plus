import { TLCollectionData } from "@/@types/collection";
import { TLPostNoteData } from "@/@types/note";
import { useUser } from "@/app/hooks";
import { createNote } from "@/app/lib/note";
import { AddNoteIcon } from "@/icons/AddNote";
import { MenuDotIcon } from "@/icons/MenuDot";
import { useRouter } from "next/navigation";

interface Props {
  lang: string | string[] | undefined;
  selectedCollection: TLCollectionData;
}

export default function NoteListHeader(props: Props) {
  const { lang, selectedCollection } = props;
  const router = useRouter();
  const { user } = useUser();

  const handleAddNoteIconClick = async () => {
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
    router.push(`/notes?id=${res.ID}&lang=${lang}`);
  };

  return (
    <div className="notelist-header flex justify-between items-center w-full p-4">
      <div className="notelist-header-title grow text-center text-sm">
        {selectedCollection.Title}
      </div>
      <div className="notelist-header-icon-list text-sky-500 flex justify-items-center">
        <div
          className="notelist-header--menu-icon mr-6 cursor-pointer"
          onClick={handleAddNoteIconClick}
        >
          <AddNoteIcon />
        </div>
        <div className="notelist-header--menu-icon mr-2 cursor-pointer">
          <MenuDotIcon />
        </div>
      </div>
    </div>
  );
}
