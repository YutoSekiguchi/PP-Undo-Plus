"use client";

import { useUser } from "@/app/hooks";
import { useSession, signIn } from "next-auth/react";
import { RightArrow } from "@/icons/RightArrow";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Props {
  lang: string | string[] | undefined;
}

export default function GoogleLoginButton(props: Props) {
  const { lang } = props;
  const { data: session } = useSession();
  const { user, initializeUser } = useUser();
  const router = useRouter();

  const handleClick = () => {
    if (
      !session ||
      !session.user ||
      session?.user?.email === null ||
      session?.user === null
    ) {
      signIn();
    } else {
      if (lang === "en") {
        router.push("/collections?lang=en");
      } else {
        router.push("/collections");
      }
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
            <Image src="/google.svg" width={28} height={28} alt="Google Icon" />
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
