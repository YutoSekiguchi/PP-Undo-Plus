import Sidebar from "@/app/components/collections/Sidebar/layout";

export default function Collection({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const lang = searchParams.lang;
  return (
    <div className="flex">
      <Sidebar lang={lang} />
    </div>
  )
}