import { queryClient } from "@/shared/api/queryClient.ts";

export const useCreatePaste = () => {
  return queryClient.useMutation("post", "/pastes");
};
