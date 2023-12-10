import "./components/common/animation.css"
import GoogleLoginButton from "./components/home/GoogleLoginButton/layout"

export default function Home() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <div className="text-xl font-bold text-center mb-2 smooth">
          ようこそ
        </div>
				<img src="/logo.png" className="w-1/3 mx-auto fuwafuwa" />
				<div className="text-center mt-4 flex justify-center items-center font-bold text-xl slow-start-smooth">
					<h1 className="title">PP-Undo&nbsp;</h1>Plusを使ってみましょう
				</div>
				<div className="mx-auto">
					<GoogleLoginButton />
				</div>
        {/* {
          user?
          <>
            <div className="text-2xl font-bold text-center">
              {user.Name}さん
            </div>
            <div className="mt-4" onClick={handleStart}>
              <SubmitButton label={"今すぐ始める"} />
            </div>
          </>
          :
          <div className="mt-4" onClick={handleLoginPage}>
              <SubmitButton label={"ログインして始める"} />
            </div>
        } */}
      </div>
    </main>
	)
}