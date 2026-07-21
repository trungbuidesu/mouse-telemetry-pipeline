import { createBrowserRouter } from "react-router-dom";

import { DashboardPage } from "@/pages/DashboardPage";
import { HomePage } from "@/pages/HomePage";
import { ResultPage } from "@/pages/ResultPage";
import { TrainerPage } from "@/pages/TrainerPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/play",
    element: <TrainerPage />,
  },
  {
    path: "/result/:sessionId",
    element: <ResultPage />,
  },
  {
    path: "/dashboard",
    element: <DashboardPage />,
  },
]);

