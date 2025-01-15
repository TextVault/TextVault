import { queryClient } from "@/shared/api/queryClient.ts";

export const useGetPaste = (pasteId: string) => {
  return queryClient.useQuery("get", "/pastes/{id}", {
    params: {
      path: {
        id: pasteId,
      },
    },
  });
};
