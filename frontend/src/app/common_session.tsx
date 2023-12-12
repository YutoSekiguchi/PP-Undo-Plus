"use client";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useUser } from "./hooks";
import { getUserByEmail } from "./lib/user";

export default function CommonSession() {
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
  return <></>;
}