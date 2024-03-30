import PPUndoEditor from "@/app/components/Note/PP-UndoEditor/layout";

export default function NoteDemo() {
  return (
    <PPUndoEditor
      width={"75vw"}
      height={"100vh"}
      isDisplayChangePageButton={false}
      isDemo={false}
      mode={"demo"}
    />
  );
}
