import { TLCollectionData } from "@/@types/collection";
import { updateCollection } from "@/app/lib/collection";
import { deleteNote } from "@/app/lib/note";
import { AddNoteIcon } from "@/icons/AddNote";
import { MenuDotIcon } from "@/icons/MenuDot";
import { useState } from "react";
import "./style.css";
import { Lang } from "@/app/components/common/lang";

interface Props {
  lang: string | string[] | undefined;
  selectedCollection: TLCollectionData;
  handleAddNoteIconClick: () => void;
  isNoteSelectMode: boolean;
  setIsNoteSelectMode: (isNoteSelectMode: boolean) => void;
  selectedNoteIDs: number[];
  setSelectedNoteIDs: (selectedNoteIDs: number[]) => void;
}

export default function NoteListHeader(props: Props): JSX.Element {
  const {
    lang,
    selectedCollection,
    handleAddNoteIconClick,
    isNoteSelectMode,
    setIsNoteSelectMode,
    selectedNoteIDs,
    setSelectedNoteIDs,
  } = props;

  const [isEditCollection, setIsCollection] = useState<boolean>(false);
  const l =
    lang === undefined || Array.isArray(lang) ? new Lang() : new Lang(lang);
  const handleClickMenuDotIcon = () => {
    setIsNoteSelectMode(true);
  };

  const handleClickCancel = () => {
    setSelectedNoteIDs([]);
    setIsNoteSelectMode(false);
  };

  const handleClickDelete = async () => {
    if (selectedNoteIDs.length === 0) return;
    const canDelete = confirm(l.confirmDeleteNote());
    if (!canDelete) return;

    for (let i = 0; i < selectedNoteIDs.length; i++) {
      const res = await deleteNote(selectedNoteIDs[i]);
      if (res === null) {
        alert(l.failedToDeleteNote());
        return;
      }
    }
    setSelectedNoteIDs([]);
    setIsNoteSelectMode(false);
  };

  const handleEditCollectionTitle = async (
    collectionData: TLCollectionData,
    title: string
  ) => {
    if (collectionData.Title === title) return;
    collectionData.Title = title;
    const res = await updateCollection(collectionData);
    if (res === null) {
      alert(l.failedToUpdateCollectionTitle());
      return;
    }
    setIsCollection(false);
  };

  const EditTitleInput = ({
    selectedCollection,
  }: {
    selectedCollection: TLCollectionData;
  }) => {
    const [newCollectionTitle, setNewCollectionTitle] = useState(
      selectedCollection.Title
    );
    return (
      <div className="w-1/2 mx-auto">
        <input
          className="notetitle-input text-center"
          value={newCollectionTitle}
          onChange={(e) => setNewCollectionTitle(e.target.value)}
          onBlur={() =>
            handleEditCollectionTitle(selectedCollection, newCollectionTitle)
          }
          autoFocus
        />
      </div>
    );
  };

  return (
    <div className="notelist-header flex justify-between items-center w-full p-4">
      <div className="notelist-header-title grow text-center text-sm">
        {isEditCollection ? (
          <EditTitleInput selectedCollection={selectedCollection} />
        ) : (
          <div
            className="notelist-header-title-text text-center text-sm cursor-pointer"
            onClick={() => setIsCollection(true)}
          >
            {selectedCollection.Title}
          </div>
        )}
      </div>
      <div className="notelist-header-icon-list text-sky-500 flex justify-items-center">
        {isNoteSelectMode ? (
          <>
            <div
              className="notelist-header--menu-icon text-sm text-red-500 mr-12 cursor-pointer"
              onClick={handleClickDelete}
            >
              {l.delete()}
            </div>
            <div
              className="notelist-header--menu-icon text-sm mr-2 cursor-pointer"
              onClick={handleClickCancel}
            >
              {l.cancel()}
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
