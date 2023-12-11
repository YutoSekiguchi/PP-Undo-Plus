"use client";

import { useUser } from "@/app/hooks";
import { useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { getUserByEmail } from "@/app/lib/user";
import { RightArrow } from "@/icons/RightArrow";

interface Props {
  lang: string | string[] | undefined;
}

export default function GoogleLoginButton(props: Props) {
  const { lang } = props;
  const { data: session } = useSession();
  const { user, initializeUser } = useUser();

  useEffect(() => {
    const getUserData = async () => {
      if (
        session &&
        session.user?.email !== null &&
        session.user &&
        session.user.email
      ) {
        const res = await getUserByEmail(session.user.email);
        if (res === null || user !== null) return;
        initializeUser(res);
      }
    };
    getUserData();
  }, [session?.user]);

  const handleClick = () => {
    if (
      !session ||
      !session.user ||
      session?.user?.email === null ||
      session?.user === null
    ) {
      signIn();
    } else {
      console.log("already logged in");
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className="flex justify-center items-center cursor-pointer px-6 py-4 mt-12 border border-gray-500 rounded-lg hover:bg-gray-100"
        onClick={handleClick}
      >
        {user === null ? (
          <>
            <img src="/google.svg" className="w-8 h-8" />
            {lang === "en" ? (
              <span className="ml-2">Login with Google</span>
            ) : (
              <span className="ml-2">Googleでログイン</span>
            )}
          </>
        ) : (
          <>
            {lang === "en" ? (
              <span className="mr-2">Start</span>
            ) : (
              <span className="mr-2">始める</span>
            )}
            <RightArrow />
          </>
        )}
      </div>
    </div>
  );
}
