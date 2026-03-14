import { StrictMode, useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

import "./index.css";
import Cookies from "js-cookie";
import { decryptData, encryptData } from "./utils/encryption/encrypt";
import { AuthenticationContext } from "@/contexts/AuthenticationContext";
import NotFound from "./components/NotFound/NotFound";

// Create a new router instance
const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
  defaultNotFoundComponent: NotFound,
  context: {
    auth: {
      isAuthenticated: false,
      position: "oo",
    },
  },
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Wrap router in a context provider to pass authentication state
const RouterWrapper = () => {
  // Hooks for Authentication

  // TODO: This NEEEDS to change to a jwt signed by the backend.
  // Anyone can edit an unsigned cookie, so this auth is effectively useless
  // TODO: This should also be in a separate AuthProvider component, not in the main.tsx file
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [position, setPosition] = useState("oo"); //Change maybe? verv?
  const [hasLoadedAuth, setHasLoadedAuth] = useState(false);

  // Checks if the user is logged in when the page loads
  useEffect(() => {
    const data = decryptData(Cookies.get("fgData") || "");
    if (data !== "") {
      const parsedData = JSON.parse(data);
      setIsAuthenticated(parsedData.isAuthenticated);
      setPosition(parsedData.position);
    }
    setHasLoadedAuth(true);
  }, []);

  // Saves authentication status for the user as a cookie when authentication is changed
  useEffect(() => {
    if (!hasLoadedAuth) return;

    const data = {
      isAuthenticated,
      position,
    };
    Cookies.set("fgData", encryptData(JSON.stringify(data)));

    // Invalidate router to block/allow access to authenticated pages
    void router.invalidate();
  }, [isAuthenticated, position, hasLoadedAuth]);

  const authContextValue = useMemo(
    () => ({
      isAuthenticated,
      setIsAuthenticated,
      position,
      setPosition,
    }),
    [isAuthenticated, position],
  );

  // If we have not yet laoded auth, we we dont render right away
  // Potentially bad for load time, but I have not noticed a performance impact
  if (!hasLoadedAuth) {
    return null;
  }

  return (
    <AuthenticationContext.Provider value={authContextValue}>
      <RouterProvider
        router={router}
        context={{
          auth: {
            isAuthenticated,
            position,
          },
        }}
      />
    </AuthenticationContext.Provider>
  );
};

// Render the app
const rootElement = document.getElementById("root");
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <RouterWrapper />
    </StrictMode>,
  );
}
