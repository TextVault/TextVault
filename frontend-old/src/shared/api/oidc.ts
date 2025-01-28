import { createReactOidc } from "oidc-spa/react";
import { z } from "zod";

export const {
  OidcProvider,
  /**
   * Note: If you have multiple OidcProvider in your app
   * you do not need to use the useClient hook that that corresponds
   * to the above OidcProvider.
   */
  useOidc,
  /**
   * This is useful to use the oidc API outside of React.
   */
  getOidc,
} = createReactOidc({
  // If you don't have the parameters right away, it's the case for example
  // if you get the oidc parameters from an API you can pass a promise that
  // resolves to the parameters. `createReactOidc(prParams)`.
  // You can also pass an async function that returns the parameters.
  // `createReactOidc(async () => params)`. It will be called when the <OidcProvider />
  // is first mounted or when getOidc() is called.

  issuerUri: import.meta.env.VITE_OIDC_ISSUER,
  clientId: import.meta.env.VITE_OIDC_CLIENT_ID,
  publicUrl: import.meta.env.BASE_URL,
  decodedIdTokenSchema: z.object({
    sub: z.string(),
    preferred_username: z.string(),
    email: z.string(),
  }),
  autoLogoutParams: { redirectTo: "current page" }, // Default
  doEnableDebugLogs: true,
});
