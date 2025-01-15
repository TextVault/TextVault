import { useParams } from "react-router-dom";
import { useTheme } from "next-themes";
import { Container, Flex, Heading } from "@chakra-ui/react";

import { TextVaultEditor } from "@/components/TextVaultEditor/TextVaultEditor";
import { useGetPaste } from "@/pages/view/public/api";
import { NotfoundError } from "@/shared/types/errors.ts";
import { CircularProgress } from "@/components/CircularProgress/CircularProgress";

export const PublicViewPage = () => {
  const { theme } = useTheme();
  const { id: pasteId } = useParams<{ id: string }>();
  const { data, isLoading } = useGetPaste(pasteId || "");

  if (isLoading) {
    return <CircularProgress />;
  }

  if (!data) {
    throw new NotfoundError(pasteId || "undefined");
  }

  return (
    <Flex alignItems={"center"} flexDirection={"column"} gap={4} justifyContent={"center"}>
      <Heading size={"5xl"}>{data.title}</Heading>
      <Container px={2} py={10} shadow={"lg"} width={"5xl"}>
        <TextVaultEditor
          language={data.language}
          loading={isLoading}
          readOnly={true}
          theme={theme}
          value={data.content}
        />
      </Container>
    </Flex>
  );
};
