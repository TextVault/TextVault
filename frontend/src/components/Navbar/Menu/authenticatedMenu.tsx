import { Link } from "react-router-dom";
import { HStack, Link as ChakraLink, Stack, Text } from "@chakra-ui/react";

import { useOidc } from "@/shared/api/oidc.ts";
import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from "@/components/ui/menu";
import { Button } from "@/components/ui/button.tsx";
import { Avatar } from "@/components/ui/avatar.tsx";

export const AuthenticatedMenu = () => {
  const { logout, oidcTokens } = useOidc();

  const handleLogout = async () => {
    if (!logout) {
      return;
    }
    await logout({
      redirectTo: "home",
    });
  };

  return (
    <MenuRoot>
      <MenuTrigger asChild>
        <Button variant={"plain"}>
          <HStack key={oidcTokens?.decodedIdToken.email} gap="4">
            <Avatar name={oidcTokens?.decodedIdToken.preferred_username} size="lg" />
            <Stack gap="0">
              <Text fontWeight="medium">{oidcTokens?.decodedIdToken.preferred_username}</Text>
              <Text color="fg.muted" textStyle="sm">
                {oidcTokens?.decodedIdToken.email}
              </Text>
            </Stack>
          </HStack>
        </Button>
      </MenuTrigger>
      <MenuContent aria-label="User menu actions">
        <MenuItem asChild value="pastes">
          <ChakraLink asChild justifyContent={"center"}>
            <Link to={"/pastes"}>My pastes</Link>
          </ChakraLink>
        </MenuItem>
        <MenuItem asChild _hover={{ color: "fg.error" }} color="fg.error" value="logout">
          <Button variant={"plain"} onClick={handleLogout}>
            Log Out
          </Button>
        </MenuItem>
      </MenuContent>
    </MenuRoot>
  );
};
