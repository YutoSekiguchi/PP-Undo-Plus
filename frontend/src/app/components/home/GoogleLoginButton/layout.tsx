"use client";

import { useUser } from "@/app/hooks";
import { useSession, signIn } from "next-auth/react";
import { RightArrow } from "@/icons/RightArrow";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Lang } from "../../common/lang";

interface Props {
  lang: string | string[] | undefined;
}

export default function GoogleLoginButton(props: Props) {
  const { lang } = props;
  const { data: session } = useSession();
  const { user } = useUser();
  const router = useRouter();
  const l =
    lang === undefined || Array.isArray(lang) ? new Lang() : new Lang(lang);

  const handleClick = () => {
    if (
      !session ||
      !session.user ||
      session?.user?.email === null ||
      session?.user === null
    ) {
      signIn();
    } else {
      router.push(l.collectionsURL());
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
            <span className="ml-2">{l.loginWithGoogle()}</span>
          </>
        ) : (
          <>
            <span className="mr-2">{l.start()}</span>
            <RightArrow />
          </>
        )}
      </div>
    </div>
  );
}
