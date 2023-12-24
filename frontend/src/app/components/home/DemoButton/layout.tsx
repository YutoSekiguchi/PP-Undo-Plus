"use client";

import { useRouter } from "next/navigation";

interface Props {
  lang: string | string[] | undefined;
}

export default function DemoButton(props: Props) {
  const { lang } = props;
  const router = useRouter();
  const moveDemoNotePage = () => {
    router.push(`/demo`);
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className="flex justify-center items-center cursor-pointer px-4 py-5 mt-12 border rounded-lg text-gray-600 hover:bg-gray-100"
        onClick={moveDemoNotePage}
      >
        {lang === "en" ? (
          <span className="ml-2">Try Demo</span>
        ) : (
          <span className="ml-2">デモを試す</span>
        )}
      </div>
    </div>
  );
}
