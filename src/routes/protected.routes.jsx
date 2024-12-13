import { Spin } from "antd";
import Admin from "../pages/admin/Admin";
import AdminTheater from "../pages/admin/AdminTheater";
import DashBoard from "../pages/admin/DashBoard";
import User from "../pages/user/User";
import { Suspense } from "react";
import CategoryManager from "../pages/admin/CategoryManager";
<<<<<<< HEAD
import MovieManager from "../pages/admin/MovieManager";
import NewsManager from "../pages/admin/NewsManager";
=======
import AdminScreenRoom from "../pages/admin/screenRoom/AdminScreenRoom";
import AdminScreenRoomDetail from "../pages/admin/screenRoom/AdminScreenRoomDetail";
>>>>>>> 5fb25d16694f0ec5214e535f08abc3721c05b732

const contentStyle = {
  padding: 50,
  background: "rgba(0, 0, 0, 0.05)",
  borderRadius: 4,
};
const content = <div style={contentStyle} />;
const LazyLoad = ({ children }) => {
  return (
    <Suspense
      fallback={
        <Spin tip="Đang tải..." size="large">
          {content}
        </Spin>
      }
    >
      {children}
    </Suspense>
  );
};
const protectedRouter = [
  {
    path: "/admin",
    element: <Admin />,
    children: [
      {
        index: true,
        element: <DashBoard />,
      },
      {
        path: "theaters",
        element: (
          <LazyLoad>
            <AdminTheater />
          </LazyLoad>
        ),
      },
      {
        path: "category",
        element: (
          <LazyLoad>
            <CategoryManager />
          </LazyLoad>
        ),
      },
      {
<<<<<<< HEAD
        path: "movie",
        element: (
          <LazyLoad>
            <MovieManager />
=======
        path: "screenRooms",
        element: (
          <LazyLoad>
            <AdminScreenRoom />
>>>>>>> 5fb25d16694f0ec5214e535f08abc3721c05b732
          </LazyLoad>
        ),
      },
      {
<<<<<<< HEAD
        path: "news",
        element: (
          <LazyLoad>
            <NewsManager />
=======
        path: "screenRoomDetail",
        element: (
          <LazyLoad>
            <AdminScreenRoomDetail />
>>>>>>> 5fb25d16694f0ec5214e535f08abc3721c05b732
          </LazyLoad>
        ),
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
