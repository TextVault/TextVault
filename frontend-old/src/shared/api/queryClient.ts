import createFetchClient from "openapi-fetch";
import createClient from "openapi-react-query";
import { QueryClient } from "@tanstack/react-query";

import { type paths } from "@/shared/api/schema";

export const rawClient = createFetchClient<paths>({
  baseUrl: import.meta.env.VITE_TEXTVAULT_BACKEND_URL,
});
console.log(import.meta.env.VITE_TEXTVAULT_BACKEND_URL);

export const queryClient = createClient(rawClient);

export const nativeClient = new QueryClient();
