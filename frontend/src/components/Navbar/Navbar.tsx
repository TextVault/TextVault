import { Link } from "react-router-dom";
import { Flex, HStack, IconButton } from "@chakra-ui/react";
import { Text } from "@chakra-ui/react/typography";
import { BiMoon, BiSun, BiLogoGithub } from "react-icons/bi";

import { LogoIcon } from "@/shared/ui/icons.tsx";
import { useOidc } from "@/shared/api/oidc.ts";
import { AuthenticatedMenu, UnauthenticatedMenu } from "@/components/Navbar/Menu";
import { Tag } from "@/components/ui/tag.tsx";
import { useColorMode } from "@/components/ui/color-mode.tsx";

export const Navbar = () => {
  const { isUserLoggedIn } = useOidc();
  const { toggleColorMode, colorMode } = useColorMode();

  return (
    <HStack
      alignItems={"center"}
      height={"16"}
      justifyContent={"space-around"}
      position={"sticky"}
      width={"full"}
    >
      <Flex key={"logo"} alignItems={"center"} as={Link} gap={1} to={"/"}>
        <LogoIcon />
        <Text as={"span"} display={"inline"} fontWeight="bold" textStyle={"md"}>
          TextVault
        </Text>
        <Tag colorPalette="blue">Beta</Tag>
      </Flex>

      <Flex alignItems={"center"} flexDirection={"row"} gap={2}>
        <Link aria-label="Github" to={"https://github.com/wtf-keaton/"}>
          <BiLogoGithub />
        </Link>
        <IconButton size="sm" variant="surface" onClick={toggleColorMode}>
          {colorMode === "light" ? <BiSun /> : <BiMoon />}
        </IconButton>
        {isUserLoggedIn ? <AuthenticatedMenu /> : <UnauthenticatedMenu />}
      </Flex>
    </HStack>
  );
};
