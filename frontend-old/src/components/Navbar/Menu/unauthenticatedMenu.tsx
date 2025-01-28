import { Flex } from "@chakra-ui/react";

import { useOidc } from "@/shared/api/oidc.ts";
import { Button } from "@/components/ui/button.tsx";

export const UnauthenticatedMenu = () => {
  const { login } = useOidc();
  const handleSignin = async () => {
    if (!login) {
      return;
    }
    await login({
      doesCurrentHrefRequiresAuth: false,
    });
  };

  const handleSignup = async () => {
    if (!login) {
      return;
    }
    await login({
      doesCurrentHrefRequiresAuth: false,
    });
  };

  return (
    <Flex gap={2}>
      <Button colorPalette={"blue"} size={"sm"} variant="solid" onClick={() => handleSignup()}>
        Sign up
      </Button>
      <Button size={"sm"} variant="outline" onClick={() => handleSignin()}>
        Log in
      </Button>
    </Flex>
  );
};
