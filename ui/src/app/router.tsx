import { createBrowserRouter } from "react-router-dom";

import { AppShell } from "./layout/AppShell";
import ExperimentsPage from "../pages/ExperimentsPage";
import LibraryPage from "../pages/LibraryPage";
import RunsPage from "../pages/RunsPage";
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
      {
        path: "runs",
        element: <RunsPage />,
      },
      {
        path: "library",
        element: <LibraryPage />,
      },
      {
        path: "experiments",
        element: <ExperimentsPage />,
      },
    ],
  },
]);
