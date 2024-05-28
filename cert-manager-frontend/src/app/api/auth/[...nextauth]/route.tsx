import NextAuth, { AuthOptions, DefaultSession, User } from "next-auth";
import { DefaultJWT, JWT } from "next-auth/jwt";
import KeycloakProvider, { KeycloakProfile } from "next-auth/providers/keycloak";

async function refreshAccessToken(token: JWT) {
  try {
    const url = `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/token`;
    const response = await fetch(url, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.KEYCLOAK_CLIENT_ID,
        client_secret: process.env.KEYCLOAK_CLIENT_SECRET,
        grant_type: "refresh_token",
        refresh_token: token.refreshToken!,
      }),
      method: "POST",
      cache: "no-store"
    });
    const refreshedTokens = await response.json();
    if (!response.ok) {
      throw refreshedTokens
    }
    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: refreshedTokens.expires_at! * 1000,
      idToken: refreshedTokens.idToken ?? token.idToken,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    console.log(error)
    return {
      ...token,
      error: "RefreshAccessTokenError",
    }
  }
 }

const authOptions: AuthOptions = {
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_CLIENT_ID,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
      issuer: process.env.KEYCLOAK_ISSUER,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile}) {
      const keycloakProfile = profile as KeycloakProfile;
      // Initial sign in
      if (account && user) {
        return {
          accessToken: account.access_token,
          accessTokenExpires: account.expires_at! * 1000,
          idToken: account.id_token,
          refreshToken: account.refresh_token,
          roles: keycloakProfile?.resource_access['cert-manager-client']?.roles,
          user,
        }
      }

      // Return previous token if the access token has not expired yet
      if (token.accessTokenExpires && Date.now() < token.accessTokenExpires) {
        return token;
      }

      // Access token has expired, try to update it
      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      if (token) {
        session.user = token.user;
        session.accessToken = token.accessToken;
        session.error = token.error;
        session.roles = token.roles;
      }
      return session;
    }
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST, authOptions };

declare module "next-auth/jwt" {
  interface JWT extends Record<string, unknown>, DefaultJWT {
    accessToken?: string;
    accessTokenExpires?: number;
    refreshToken?: string;
    roles?: string[];
    user?: User;
    error?: string;
  }
}

declare module "next-auth" {
  interface Session extends DefaultSession {
    user?: User;
    accessToken?: string;
    error?: string;
    roles?: string[];
  }
}