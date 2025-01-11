import NextAuth from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";

const KEYCLOAK_CLIENT_ID = "textvault-test";
const KEYCLOAK_CLIENT_SECRET = "dShjBAXS8xBecH5nMdDyh9Li0eC5Xit2";
const KEYCLOAK_URL = "https://auth.bytes2b.ru";
const KEYCLOAK_REALM = "Dev";

const KEYCLOAK_ISSUER = `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}`;
const handler = NextAuth({
  pages: {
    signIn: "/api/signin",
  },
  providers: [
    // Configure Keycloak as the authentication provider
    KeycloakProvider({
      clientId: KEYCLOAK_CLIENT_ID,
      clientSecret: KEYCLOAK_CLIENT_SECRET,
      issuer: KEYCLOAK_ISSUER,
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
      }

      return token;
    },
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token from a provider.
      session.accessToken = token.accessToken as string;

      return session;
    },
  },
});

export { handler as GET, handler as POST };
