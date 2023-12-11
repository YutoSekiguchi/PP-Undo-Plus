import PPUndoEditor from "@/app/components/Note/PP-UndoEditor/layout"

export default function Note({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
	const mode = searchParams.mode;
	return (
		<PPUndoEditor width={'70vw'} height={'100vh'} isDisplayChangePageButton={false} isDemo={false} mode={mode} />
	)
}