import { TLCollectionData } from "@/@types/collection";
import { TLNoteData } from "@/@types/note";
import { getNotesByCollectionID, updateNote } from "@/app/lib/note";
import { useEffect, useState } from "react";
import "./style.css";
import { formatDate } from "@/app/modules/common/formatDate";
import { useRouter } from "next/navigation";
import { useStrokePressureInfo } from "@/app/hooks";
import Image from "next/image";
import { Lang } from "@/app/components/common/lang";

interface Props {
  lang: string | string[] | undefined;
  selectedCollection: TLCollectionData;
  handleAddNoteIconClick: () => void;
  isNoteSelectMode: boolean;
  selectedNoteIDs: number[];
  setSelectedNoteIDs: (selectedNoteIDs: number[]) => void;
}

export default function NoteListMain(props: Props): JSX.Element {
  const {
    lang,
    selectedCollection,
    handleAddNoteIconClick,
    isNoteSelectMode,
    selectedNoteIDs,
    setSelectedNoteIDs,
  } = props;
  const [noteList, setNoteList] = useState<TLNoteData[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();
  const { clearStrokeInfo } = useStrokePressureInfo();
  const l =
    lang === undefined || Array.isArray(lang) ? new Lang() : new Lang(lang);

  const [editingNote, setEditingNote] = useState<{
    id: number;
    title: string;
  } | null>(null);

  const handleEditTitle = async (noteData: TLNoteData, title: string) => {
    if (noteData.Title === title) return;
    noteData.Title = title;
    const res = await updateNote(noteData);
    if (res === null) {
      alert(l.failedToUpdateNoteTitle());
      return;
    }
    setNoteList((prevNotes) =>
      prevNotes.map((note) =>
        note.ID === noteData.ID ? { ...note, Title: title } : note
      )
    );
    setEditingNote(null);
  };

  const EditTitleInput = ({ note }: { note: TLNoteData }) => {
    const [newTitle, setNewTitle] = useState(note.Title);

    return (
      <input
        className="notelist-main-item-edit-input text-center"
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
        onBlur={() => handleEditTitle(note, newTitle)}
        autoFocus
      />
    );
  };

  const handleClickNote = (noteID: number) => {
    if (isNoteSelectMode) {
      if (selectedNoteIDs.includes(noteID)) {
        setSelectedNoteIDs(selectedNoteIDs.filter((id) => id !== noteID));
      } else {
        setSelectedNoteIDs([...selectedNoteIDs, noteID]);
      }
      return;
    }
    try {
      clearStrokeInfo();
      router.push(`/notes/${noteID}`);
    } catch (err) {
      alert(l.failedToMovePage());
    }
  };

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    e.currentTarget.src =
      "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
  };

  useEffect(() => {
    if (selectedCollection === null) return;
    const fetchNoteList = async () => {
      const res = await getNotesByCollectionID(selectedCollection.ID);
      if (res === null) return;
      setNoteList(res);
    };

    fetchNoteList();
  }, [selectedCollection, isNoteSelectMode]);

  const AddNoteBlock = () => {
    const handleAddNote = () => {
      setIsProcessing(true);
      handleAddNoteIconClick();
      setIsProcessing(false);
    };
    return (
      <div
        className="notelist-main-add-item cursor-pointer mx-auto"
        onClick={!isProcessing ? handleAddNote : undefined}
      >
        <div className="notelist-main-add-item-icon text-center border-dashed border rounded-md border-sky-500 text-sky-500">
          <p>+</p>
        </div>
        <div className="notelist-main-add-item-title text-xs text-sky-500 mt-2 text-center">
          {l.add()}...
        </div>
      </div>
    );
  };

  return (
    <div className="notelist-main">
      <AddNoteBlock />
      {noteList.map((note: TLNoteData, i: number) => {
        return (
          <div key={i} className="notelist-main-item text-xs mx-auto">
            <div
              className={`notelist-main-item-img mb-2 relative`}
              onClick={() => handleClickNote(note.ID)}
            >
              {note.SvgPath !== "" ? (
                <Image
                  src={
                    process.env.FILE_SERVER_URL +
                    "/svgs/" +
                    note.SvgPath +
                    ".svg"
                  }
                  className={`note-img hover:opacity-50 hover:bg-gray-200 ${
                    selectedNoteIDs.includes(note.ID) && "selected-note-img"
                  }`}
                  width={130}
                  height={170}
                  alt="note image"
                  onError={handleImageError}
                />
              ) : (
                <div
                  className={`default-note-img ${
                    selectedNoteIDs.includes(note.ID) && "selected-note-img"
                  }`}
                ></div>
              )}
              {selectedNoteIDs.includes(note.ID) && (
                <div className="notelist-main-item-selected absolute right-0 top-0">
                  <div className="flex items-center justify-center w-4 h-4 rounded-full bg-sky-500 border border-sky-500">
                    <p className="text-white text-xs">✓</p>
                  </div>
                </div>
              )}
            </div>
            <div className="notelist-main-item-title text-center truncate">
              {editingNote?.id === note.ID ? (
                <EditTitleInput note={note} />
              ) : (
                <span
                  onClick={() =>
                    setEditingNote({ id: note.ID, title: note.Title })
                  }
                >
                  {note.Title}
                </span>
              )}
            </div>
            <div className="notelist-main-item-date text-gray-400 text-center cursor-default">
              {formatDate(note.UpdatedAt)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
