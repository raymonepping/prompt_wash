import { createBrowserRouter } from "react-router-dom";

import { AppShell } from "./layout/AppShell";
import WorkspacePage from "../pages/WorkspacePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      {
        index: true,
        element: <WorkspacePage />,
      },
    ],
  },
]);