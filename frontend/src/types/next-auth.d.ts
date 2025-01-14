import { JWT } from "next-auth/jwt";
import NextAuth from "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string | undefined;
  }
}
declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: DefaultSession["user"];
    expires: DefaultSession["expires"];
    accessToken: string;
  }
}
