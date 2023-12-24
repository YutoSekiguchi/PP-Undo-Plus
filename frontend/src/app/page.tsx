import "./components/common/animation.css";
import DemoButton from "./components/home/DemoButton/layout";
import GoogleLoginButton from "./components/home/GoogleLoginButton/layout";

export default function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const lang = searchParams.lang;

  const Welcome = () => {
    return <>{lang === "en" ? "Welcome" : "ようこそ"}</>;
  };

  const Description = () => {
    return (
      <>
        {lang === "en" ? (
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
          <Welcome />
        </div>
        <img src="/logo.png" className="w-1/3 mx-auto fuwafuwa" />
        <div className="text-center mt-4 flex justify-center items-center font-bold text-xl slow-start-smooth">
          <Description />
        </div>
        <div className="flex items-center justify-center">
          <div className="mr-4">
            <DemoButton lang={lang} />
          </div>
          <div className="ml-4">
            <GoogleLoginButton lang={lang} />
          </div>
        </div>
      </div>
    </main>
  );
}
