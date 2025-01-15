import { Button, Center, Container, Flex, Heading, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import { PastesTable } from "./PastesTable";

import { useOidc } from "@/shared/api/oidc.ts";
import { queryClient } from "@/shared/api/queryClient.ts";
import { CircularProgress } from "@/components/CircularProgress/CircularProgress";
import { PastesPagination } from "@/pages/pastes/ui/PastesPagination.tsx";
import { toaster } from "@/shared/ui/toaster.ts";

export const PastesPage = () => {
  const { oidcTokens } = useOidc({ assertUserLoggedIn: true });
  const naviage = useNavigate();

  const { mutateAsync } = queryClient.useMutation("delete", "/pastes/{id}"); // TODO: Extract to /api

  const {
    data: pastes,
    isLoading,
    refetch,
  } = queryClient.useQuery("get", "/pastes", {
    params: {
      query: {
        limit: 100,
        offset: 0,
      },
    },
    headers: { Authorization: `Bearer ${oidcTokens.accessToken}` },
  }); // TODO: Extract to /api
  const handleDeletePaste = async (pasteId: string) => {
    try {
      await mutateAsync({
        params: { path: { id: pasteId } },
        headers: { Authorization: `Bearer ${oidcTokens.accessToken}` },
      });
      toaster.success({ title: "Paste successfully deleted" });
      await refetch();
    } catch (error) {
      toaster.error({
        title: `Failed to delete paste: ${(error as Error).message || JSON.stringify(error)}`,
      });
    }
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <Flex
      alignItems={"center"}
      background={"bg.panel"}
      colorPalette={"blue"}
      flexDirection={"column"}
      gap={4}
      justifyContent={"center"}
    >
      <Heading size={"5xl"}>
        Your{" "}
        <Text as={"span"} color={"blue.700"}>
          pastes
        </Text>
      </Heading>
      <Container padding={4} shadow={"lg"} width={"5xl"}>
        {pastes?.length === 0 ? (
          <Center flexDirection={"column"} gap={2}>
            <Text color={"gray.400"}>No pastes yet</Text>

            <Button
              colorScheme={"blue"}
              padding={10}
              size={"lg"}
              variant={"ghost"}
              onClick={() => {
                naviage("/");
              }}
            >
              <Heading color={"blue.700"} size={"4xl"}>
                Create New!
              </Heading>
            </Button>
          </Center>
        ) : (
          <>
            <PastesTable handleDeletePaste={handleDeletePaste} pastes={pastes || []} />
            <Flex justifyContent={"end"} mt={2}>
              <PastesPagination count={pastes?.length || 0} page={1} pageSize={100} />
            </Flex>
          </>
        )}
      </Container>
    </Flex>
  );
};
