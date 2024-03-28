import Image from "next/image";
import "./components/common/animation.css";
import DemoButton from "./components/home/DemoButton/layout";
import GoogleLoginButton from "./components/home/GoogleLoginButton/layout";
import { Lang } from "./components/common/lang";

export default function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const lang = searchParams.lang === undefined || Array.isArray(searchParams.lang) ? new Lang() : new Lang(searchParams.lang);

  const Description = () => {
    return (
      <>
        {lang.nowLang() === "en" ? (
          <>
            <p>Let's use&nbsp;</p>
            <h1 className="title">PP-Undo&nbsp;</h1>
            <p>Plus</p>
          </>
        ) : (
          <>
            <h1 className="title">PP-Undo&nbsp;</h1>
            <p>Plusを使ってみましょう</p>
          </>
        )}
      </>
    );
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <div className="text-xl font-bold text-center mb-2 smooth">
          {lang.welcome()}
        </div>
        <Image src="/logo.png" width={150} height={150} alt="logo" className="mx-auto fuwafuwa" />
        <div className="text-center mt-4 flex justify-center items-center font-bold text-xl slow-start-smooth">
          <Description />
        </div>
        <div className="flex items-center justify-center">
          <div className="mr-4">
            <DemoButton lang={searchParams.lang} />
          </div>
          <div className="ml-4">
            <GoogleLoginButton lang={searchParams.lang} />
          </div>
        </div>
      </div>
    </main>
  );
}
