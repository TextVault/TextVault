"use client";

import { useSession } from "next-auth/react";

export default function Login() {
  useSession({ required: true });

  return <>Authenticating...</>;
}
