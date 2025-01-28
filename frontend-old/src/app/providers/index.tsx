import { ErrorBoundary } from "react-error-boundary";
import { QueryClientProvider } from "@tanstack/react-query";
import { Outlet } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { ThemeProvider } from "next-themes";

import { OidcProvider } from "@/shared/api/oidc.ts";
import { RootLayout } from "@/shared/ui/layout.tsx";
import { nativeClient } from "@/shared/api/queryClient.ts";
import { Toaster } from "@/components/ui/toaster";
import { systemTheme } from "@/shared/config/theme.ts";
import { Fallback } from "@/components/Fallback/Fallback";

export const Providers = () => {
  return (
    <ChakraProvider value={systemTheme}>
      <ThemeProvider attribute={"class"} disableTransitionOnChange={true}>
        <OidcProvider fallback={<Fallback/>}>
          <QueryClientProvider client={nativeClient}>
            <RootLayout>
              <ErrorBoundary fallback={<Fallback/>}>
                <Outlet />
                <Toaster />
              </ErrorBoundary>
            </RootLayout>
          </QueryClientProvider>
        </OidcProvider>
      </ThemeProvider>
    </ChakraProvider>
  );
};
