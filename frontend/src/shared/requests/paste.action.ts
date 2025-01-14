"use client";
import { apiInstance } from "@/src/shared/apiInstance";

const pastes = "/pastes";
const pastesId = "/pastes/{id}";

export const getPaste = async (pasteId: string) => {
  return apiInstance.GET(pastesId, {
    params: {
      path: {
        id: pasteId,
      },
    },
  });
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

  return apiInstance.POST(pastes, {
    body: { title: title, language: language, content: paste },
    headers: headers,
  });
};

export const deletePaste = async (pasteId: string, token?: string) => {
  let headers = {
    Authorization: `Bearer ${token}`,
  };

  return apiInstance.DELETE(pastesId, { params: { path: { id: pasteId } }, headers: headers });
};
