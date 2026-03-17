import { RouterProvider } from "react-router";
import { router } from "./routes";
import AnalyticsBoot from "./AnalyticsBoot";

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <AnalyticsBoot />
    </>
  );
}