import { TLCollectionData } from "@/@types/collection";
import { deleteNote } from "@/app/lib/note";
import { AddNoteIcon } from "@/icons/AddNote";
import { MenuDotIcon } from "@/icons/MenuDot";

interface Props {
  lang: string | string[] | undefined;
  selectedCollection: TLCollectionData;
  handleAddNoteIconClick: () => void;
  isNoteSelectMode: boolean;
  setIsNoteSelectMode: (isNoteSelectMode: boolean) => void;
  selectedNoteIDs: number[];
  setSelectedNoteIDs: (selectedNoteIDs: number[]) => void;
}

export default function NoteListHeader(props: Props) {
  const {
    lang,
    selectedCollection,
    handleAddNoteIconClick,
    isNoteSelectMode,
    setIsNoteSelectMode,
    selectedNoteIDs,
    setSelectedNoteIDs,
  } = props;

  const handleClickMenuDotIcon = () => {
    setIsNoteSelectMode(true);
  };

  const handleClickCancel = () => {
    setSelectedNoteIDs([]);
    setIsNoteSelectMode(false);
  };

  const handleClickDelete = async () => {
    if (selectedNoteIDs.length === 0) return;
    const canDelete = confirm(
      lang === "en"
        ? "Are you sure you want to delete the selected notes?"
        : "選択したノートを削除してもよろしいですか？"
    );
    if (!canDelete) return;

    for (let i = 0; i < selectedNoteIDs.length; i++) {
      const res = await deleteNote(selectedNoteIDs[i]);
      if (res === null) {
        if (lang === "en") {
          alert("Failed to delete note");
        } else {
          alert("ノートの削除に失敗しました");
        }
        return;
      }
    }
    setSelectedNoteIDs([]);
    setIsNoteSelectMode(false);
  };

  return (
    <div className="notelist-header flex justify-between items-center w-full p-4">
      <div className="notelist-header-title grow text-center text-sm">
        {selectedCollection.Title}
      </div>
      <div className="notelist-header-icon-list text-sky-500 flex justify-items-center">
        {isNoteSelectMode ? (
          <>
            <div
              className="notelist-header--menu-icon text-sm text-red-500 mr-12 cursor-pointer"
              onClick={handleClickDelete}
            >
              {lang === "en" ? "Delete" : "削除する"}
            </div>
            <div
              className="notelist-header--menu-icon text-sm mr-2 cursor-pointer"
              onClick={handleClickCancel}
            >
              {lang === "en" ? "Cancel" : "キャンセル"}
            </div>
          </>
        ) : (
          <>
            <div
              className="notelist-header--menu-icon mr-6 cursor-pointer"
              onClick={handleAddNoteIconClick}
            >
              <AddNoteIcon />
            </div>
            <div
              className="notelist-header--menu-icon mr-2 cursor-pointer"
              onClick={handleClickMenuDotIcon}
            >
              <MenuDotIcon />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
