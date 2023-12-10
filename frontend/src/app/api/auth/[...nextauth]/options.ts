import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { TLPostUserData } from "@/@types/user";
import { signin } from "@/app/services/user";

type ClientType = {
  clientId: string;
  clientSecret: string;
};

export const options: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    } as ClientType),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn(params) {
      const profile = params.profile;
      if (profile === undefined) {
        return Promise.resolve(false);
      }
      const data: TLPostUserData = {
        Name: profile.name!,
        DisplayName: profile.name!,
        Email: profile.email!,
        Password: "",
        Image: params.user.image!,
      };
      const userData = await signin(data);
      userData;
      if (userData === null || userData === undefined) {
        return Promise.resolve(false);
      }
      return Promise.resolve(true);
    },
  },
};