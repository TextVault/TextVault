import { LoaderFunctionArgs, Route, Routes } from "react-router-dom";

import { getOidc } from "@/shared/api/oidc";
import { Providers } from "@/app/providers";
import { PastesPage } from "@/pages/pastes/ui";
import { CreatePastePage } from "@/pages/createPaste/index.ts";
import { PublicViewPage } from "@/pages/view/public";

export const router = (
  <Routes>
    <Route element={<Providers />} path="/">
      <Route index element={<CreatePastePage />} />
      <Route element={<PastesPage />} loader={protectedRouteLoader} path="/pastes" />
      <Route path={"/view"}>
        <Route element={<PublicViewPage />} path={"/view/p/:id"} />
      </Route>
    </Route>
  </Routes>
);

async function protectedRouteLoader({ request }: LoaderFunctionArgs) {
  const oidc = await getOidc();

  if (oidc.isUserLoggedIn) {
    return null;
  }

  await oidc.login({
    // The loader function is invoked by react-router before the browser URL is updated to the target protected route URL.
    // Therefore, we need to specify where the user should be redirected after the login process completes.
    redirectUrl: request.url,

    // Explanation:
    // The 'doesCurrentHrefRequiresAuth' parameter informs oidc-spa whether it is acceptable to redirect the user to the current URL
    // if the user abandons the authentication process. This is crucial to prevent the user from being immediately redirected
    // back to the login page when pressing the back button from the login pages.
    // If the user navigated directly to the protected route (e.g., by clicking a link to your application from an external site),
    // then the current URL requires authentication.
    // Conversely, if the user navigated from an unprotected route within your application to the protected route,
    // then the current URL does not require authentication.
    doesCurrentHrefRequiresAuth: window.location.href === request.url,
  });

  // Never here, the login method redirects the user to the identity provider.
}
