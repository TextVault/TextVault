import { queryClient } from "@/shared/api/queryClient.ts";

export const useDeletePaste = () => queryClient.useMutation("delete", "/pastes/{id}");
export const useUserPastes = (limit: number, offset: number, token: string) =>
  queryClient.useQuery("get", "/pastes", {
    params: {
      query: {
        limit: limit,
        offset: offset,
      },
    },
    headers: { Authorization: `Bearer ${token}` },
  });
