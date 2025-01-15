import React from "react";
import { Container, Flex, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";

import { Navbar } from "@/components/Navbar/Navbar.tsx";
import { generateColor } from "@/shared/utils/generateColor.ts";
import { Button } from "@/components/ui/button";
import { RandomHeart } from "@/shared/ui/randomHeart.tsx";

export const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const randomColor = generateColor();

  return (
    <Flex
      _dark={{ bg: "gray.950" }}
      _light={{ bg: "gray.50" }}
      flexDirection={"column"}
      height={"100vh"}
      justify={"space-between"}
      width={"100vw"}
    >
      <Navbar />
      <Container>{children}</Container>
      <Flex
        alignItems={"center"}
        justifyContent={"center"}
        py={3}
        verticalAlign={"baseline"}
        width={"full"}
      >
        <Flex asChild gap={1} justifyContent={"center"} verticalAlign={"baseline"}>
          <Button
            asChild
            className="flex gap-1 text-current justify-center align-baseline"
            color={"primary"}
            variant={"plain"}
          >
            <Link to={"https://github.com/wtf-keaton/TextVault"}>
              <Text>With</Text>
              <RandomHeart color={randomColor} />
              <Text>by</Text>
              <Text color={randomColor}> wtf-keaton</Text>
              <Text>&</Text>
              <Text color={randomColor}> mrmamongo</Text>
            </Link>
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};
