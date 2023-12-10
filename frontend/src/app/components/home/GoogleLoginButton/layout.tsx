"use client";

import { useUser } from "@/app/hooks";
import { useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { getUserByEmail } from "@/app/services/user";

export default function GoogleLoginButton() {
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

  return (
    <div className="flex justify-center items-center">
      <div
        className="flex justify-center items-center cursor-pointer px-6 py-4 mt-12 border border-gray-500 rounded-lg"
        onClick={() => signIn()}
      >
        <img src="/google.svg" className="w-8 h-8" />
        <span className="ml-2">Googleでログイン</span>
      </div>
    </div>
  );
}
