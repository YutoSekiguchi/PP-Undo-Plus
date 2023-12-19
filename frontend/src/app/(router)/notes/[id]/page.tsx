import PPUndoEditor from "@/app/components/Note/PP-UndoEditor/layout"

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
		<PPUndoEditor width={'70vw'} height={'100vh'} isDisplayChangePageButton={false} isDemo={false} lang={lang} id={id} />
	)
}