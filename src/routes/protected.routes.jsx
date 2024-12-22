import { Spin } from "antd";
import Admin from "../pages/admin/Admin";
import AdminTheater from "../pages/admin/AdminTheater";
import DashBoard from "../pages/admin/DashBoard";
import User from "../pages/user/User";
import { Suspense } from "react";
import CategoryManager from "../pages/admin/CategoryManager";
import MovieManager from "../pages/admin/MovieManager";
import NewsManager from "../pages/admin/NewsManager";
import AdminScreenRoom from "../pages/admin/screenRoom/AdminScreenRoom";
import AdminScreenRoomDetail from "../pages/admin/screenRoom/AdminScreenRoomDetail";
import AdminShowTime from "../pages/admin/adminShowTime/AdminShowTime";
import AdminBooking from "../pages/admin/adminBooking/AdminBooking";
import CommentManager from "../pages/admin/CommentManager";

import AdminUserManager from "../pages/admin/AdminUserManager";
import BannerManager from "../pages/admin/BannerManager";

import BookingTicket from "../pages/user/BookingTicket";
import ComboFood from "../pages/admin/food/ComboFood";
import Payment from "../pages/user/Payment";
import GiftPage from "../pages/user/GiftPage";
import AdminGift from "../pages/admin/AdminGift";

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
        path: "screenRooms",
        element: (
          <LazyLoad>
            <AdminScreenRoom />
          </LazyLoad>
        ),
      },
      {
        path: "screenRoomDetail",
        element: (
          <LazyLoad>
            <AdminScreenRoomDetail />
          </LazyLoad>
        ),
      },
      {
        path: "showTimes",
        element: (
          <LazyLoad>
            <AdminShowTime />
          </LazyLoad>
        ),
      },
      {
        path: "bookings",
        element: (
          <LazyLoad>
            <AdminBooking />
          </LazyLoad>
        ),
      },
      {
        path: "news",
        element: (
          <LazyLoad>
            <NewsManager />
          </LazyLoad>
        ),
      },
      {
        path: "movie",
        element: (
          <LazyLoad>
            <MovieManager />
          </LazyLoad>
        ),
      },
      {
        path: "comment",
        element: (
          <LazyLoad>
            <CommentManager />
          </LazyLoad>
        ),
      },
      {
        path: "banners",
        element: (
          <LazyLoad>
            <BannerManager />
          </LazyLoad>
        ),
      },
      {
        path: "users",
        element: (
          <LazyLoad>
            <AdminUserManager />
          </LazyLoad>
        ),
      },
      {
        path: "foods",
        element: (
          <LazyLoad>
            <ComboFood />
          </LazyLoad>
        ),
      },
      {
        path: "gifts",
        element: (
          <LazyLoad>
            <AdminGift />
          </LazyLoad>
        ),
      },
    ],
  },
  {
    path: "/user",
    element: <User />,
    children: [
      {
        path: "bookingTicket",
        element: (
          <LazyLoad>
            <BookingTicket />
          </LazyLoad>
        ),
      },
      {
        path: "payment",
        element: (
          <LazyLoad>
            <Payment />
          </LazyLoad>
        ),
      },

      {
        path: "gifts",
        element: (
          <LazyLoad>
            <GiftPage />,
          </LazyLoad>
        ),
      },
    ],
  },
];
export default protectedRouter;
