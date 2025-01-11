import { signIn } from "next-auth/react";

export async function GET(req: Request) {
  const searchParams = new URL(req.url).searchParams;

  return signIn("keycloak", { redirectTo: searchParams.get("callbackUrl") ?? "" });
}
