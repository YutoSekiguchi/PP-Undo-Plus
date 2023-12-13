import { TLCollectionData } from "@/@types/collection";
import { AddNoteIcon } from "@/icons/AddNote";
import { MenuDotIcon } from "@/icons/MenuDot";

interface Props {
  lang: string | string[] | undefined;
  selectedCollection: TLCollectionData;
  handleAddNoteIconClick: () => void;
}

export default function NoteListHeader(props: Props) {
  const { lang, selectedCollection, handleAddNoteIconClick } = props;

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
