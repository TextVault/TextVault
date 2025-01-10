"use server";

import { request } from "@/services/requestService";

export const fetchUserPastes = async (token?: string) => {
  return request.get("/account/pastes", { Authorization: `Bearer ${token}` });
};
