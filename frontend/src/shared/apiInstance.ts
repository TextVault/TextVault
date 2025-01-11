import { Api } from "@/src/shared/gen/api";

export const apiInstance = new Api({
  baseUrl: process.env.TEXTVAULT_BACKEND_URL,
  baseApiParams: {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  },
});
