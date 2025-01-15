"use client";

import { useNavigate } from "react-router-dom";
import { Container, Flex, Heading } from "@chakra-ui/react";

import { CreatePasteForm } from "@/pages/createPaste/ui/CreatePasteForm.tsx";
import { useCreatePaste } from "@/pages/createPaste/api";
import { useOidc } from "@/shared/api/oidc.ts";
import { CreatePasteSchema } from "@/pages/createPaste/types.ts";
import { toaster } from "@/shared/ui/toaster.ts";

export const CreatePastePage = () => {
  const { oidcTokens } = useOidc({ assertUserLoggedIn: false });
  const { mutateAsync } = useCreatePaste();
  const navigate = useNavigate();

  const handleSubmit = async (data: CreatePasteSchema) => {
    try {
      const { id } = await mutateAsync({
        body: {
          ...data,
          language: data.language[0],
        },
        headers: { Authorization: `Bearer ${oidcTokens?.accessToken}` },
      });

      toaster.success({ title: `Paste created successfully` });
      navigate(`/view/p/${id}`);
    } catch {
      toaster.error({ title: "Failed to create paste" });
    }
  };

  return (
    <Flex alignItems={"center"} flexDirection={"column"} gap={4} justifyContent={"center"}>
      <Flex alignItems={"center"} justifyContent={"center"} maxWidth={"xl"} textAlign={"center"}>
        <Heading size="5xl">Write your</Heading>
        <Heading size="5xl" textStyle={"cyan"}>
          code
        </Heading>
      </Flex>
      <Container height={"full"} mx={"auto"} px={"32"} width={"fit"}>
        <CreatePasteForm onSubmit={handleSubmit} />
      </Container>
    </Flex>
  );
};
