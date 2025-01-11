"use server";

import { apiInstance } from "@/src/shared/apiInstance";

export const getPaste = async (pasteId: string) => {
  return apiInstance.pastes.pastesDetail(pasteId);
};

export const createPaste = async (
  title: string,
  language: string,
  paste: string,
  token?: string
) => {
  let headers = {};

  if (token !== undefined) {
    headers = {
      Authorization: `Bearer ${token}`,
    };
  }

  return apiInstance.pastes.pastesCreate(
    { title: title, language: language, content: paste },
    {
      headers: headers,
    }
  );
};

export const fetchPasteData = async (pasteId: string) => {
  return await apiInstance.pastes.pastesDetail(pasteId);
};

export const deletePaste = async (pasteId: string, token?: string) => {
  let headers = {
    Authorization: `Bearer ${token}`,
  };

  return apiInstance.pastes.pastesDelete(pasteId, { headers: headers });
};
