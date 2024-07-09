import PPUndoEditor from "@/app/components/Note/PP-UndoEditor/layout";

export default function Note({
  searchParams,
  params,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
  params: { id: string };
}) {
  const lang = searchParams.lang;
  const id = params.id;

  return (
    <PPUndoEditor
      width={"75vw"}
      isDisplayChangePageButton={false}
      isDemo={false}
      lang={lang}
      id={id}
    />
  );
}
