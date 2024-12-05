import { createBrowserRouter } from "react-router-dom";
import Admin from "../pages/Admin";
import User from "../pages/User";

const protectedRouter = [
  {
    path: "/admin",
    element: <Admin />,
    children: [],
  },
  {
    path: "/user",
    element: <User />,
    children: [],
  },
];
export default protectedRouter;
