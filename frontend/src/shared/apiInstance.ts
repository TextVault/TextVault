"use client";

import createClient from "openapi-fetch";

import { type paths } from "@/src/shared/gen/schema";

export const apiInstance = createClient<paths>({
  baseUrl: process.env.NEXT_PUBLIC_TEXTVAULT_BACKEND_URL,
});
