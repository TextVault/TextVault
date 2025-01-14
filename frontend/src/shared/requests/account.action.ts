"use server";

import { apiInstance } from "@/src/shared/apiInstance";

export const fetchUserPastes = async (limit: number, offset: number, token?: string) => {
  return apiInstance.account.pastesList(
    {
      limit: limit,
      offset: offset,
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};
