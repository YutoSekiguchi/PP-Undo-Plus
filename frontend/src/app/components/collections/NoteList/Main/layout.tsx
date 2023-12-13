import { TLCollectionData } from "@/@types/collection";
import { TLNoteData } from "@/@types/note";
import { getNotesByCollectionID, updateNote } from "@/app/lib/note";
import { useEffect, useState } from "react";
import "./style.css";
import { formatDate } from "@/app/modules/common/formatDate";
import { useRouter } from "next/navigation";

interface Props {
  lang: string | string[] | undefined;
  selectedCollection: TLCollectionData;
  handleAddNoteIconClick: () => void;
}

export default function NoteListMain(props: Props) {
  const { lang, selectedCollection, handleAddNoteIconClick } = props;
  const [noteList, setNoteList] = useState<TLNoteData[]>([]);
  const router = useRouter();

  const [editingNote, setEditingNote] = useState<{ id: number; title: string } | null>(null);

  
  const handleEditTitle = async(noteData: TLNoteData, title: string) => {
    if (noteData.Title === title) return;
    noteData.Title = title;
    const res = await updateNote(noteData);
    if (res === null) {
      if (lang === "en") {
        alert("Failed to update note title");
      } else {
        alert("ノートタイトルの更新に失敗しました");
      }
      return;
    }
    setNoteList((prevNotes) =>
    prevNotes.map((note) => (note.ID === noteData.ID ? { ...note, Title: title } : note))
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
    try {
      if (lang !== undefined) {
        router.push(`/note?id=${noteID}&lang=${lang}`);
      } else {
        router.push(`/note?id=${noteID}`);
      }
    } catch (err) {
      if (lang === "en") {
        alert("Failed to move to note page");
      } else {
        alert("ノートページへの移動に失敗しました");
      }
    }
  }

  useEffect(() => {
    if (selectedCollection === null) return;
    const fetchNoteList = async () => {
      const res = await getNotesByCollectionID(selectedCollection.ID);
      if (res === null) return;
      setNoteList(res);
    }

    fetchNoteList();
  }, [selectedCollection]);

  const AddNoteBlock = () => {
    return (
      <div className="notelist-main-add-item cursor-pointer mx-auto" onClick={handleAddNoteIconClick}>
        <div className="notelist-main-add-item-icon text-center border-dashed border rounded-md border-sky-500 text-sky-500">
          <p>+</p>
        </div>
        <div className="notelist-main-add-item-title text-xs text-sky-500 mt-2 text-center">
          {lang === "en" ? "Add..." : "追加..."}
        </div>
      </div>
    );
  }

  return (
    <div className="notelist-main">
      <AddNoteBlock />
      {
        noteList.map((note: TLNoteData, i: number) => {
          return (
            <div key={i} className="notelist-main-item text-xs mx-auto">
              <div className="notelist-main-item-img mb-2" onClick={() => handleClickNote(note.ID)}>
                {
                  note.SvgPath !== "" ?
                  <img src={note.SvgPath} className="note-img" />
                  :
                  <div className="default-note-img"></div>
                }
              </div>
              <div className="notelist-main-item-title text-center">
                {editingNote?.id === note.ID ? (
                  <EditTitleInput note={note} />
                ) : (
                  <span onClick={() => setEditingNote({ id: note.ID, title: note.Title })}>
                    {note.Title}
                  </span>
                )}
              </div>
              <div className="notelist-main-item-date text-gray-400 text-center cursor-default">
                {formatDate(note.UpdatedAt)}
              </div>
            </div>
          )
        })
      }
      
    </div>
  );
}