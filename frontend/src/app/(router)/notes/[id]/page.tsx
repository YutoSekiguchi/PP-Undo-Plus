import PPUndoEditor from "@/app/components/Note/PP-UndoEditor/layout"
import { useRouter } from "next/router";

export default function Note({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
	const lang = searchParams.lang;

	const router = useRouter();
	const { id } = router.query;
	return (
		<PPUndoEditor width={'70vw'} height={'100vh'} isDisplayChangePageButton={false} isDemo={false} lang={lang} id={id} />
	)
}