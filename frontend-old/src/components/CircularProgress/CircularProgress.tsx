import { Flex } from "@chakra-ui/react";

import { ProgressCircleRing, ProgressCircleRoot } from "@/components/ui/progress-circle.tsx";

export const CircularProgress = () => {
  return (
    <Flex asChild alignItems={"center"} flexDirection={"column"} gap={4} justifyContent={"center"}>
      <ProgressCircleRoot size="md" value={null}>
        <ProgressCircleRing cap="round" />
      </ProgressCircleRoot>
    </Flex>
  );
};
