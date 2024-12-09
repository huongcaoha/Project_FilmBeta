import Admin from "../pages/admin/Admin";
import DashBoard from "../pages/admin/DashBoard";
import User from "../pages/user/User";

const protectedRouter = [
  {
    path: "/admin",
    element: <Admin />,
    children: [
      {
        index: true,
        element: <DashBoard />,
      },
    ],
  },
  {
    path: "/user",
    element: <User />,
    children: [],
  },
];
export default protectedRouter;
