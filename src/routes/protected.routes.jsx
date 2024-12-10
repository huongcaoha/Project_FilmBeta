import { Suspense } from "react";
import Admin from "../pages/admin/Admin";
import DashBoard from "../pages/admin/DashBoard";
import User from "../pages/user/User";
import { Spin } from "antd";
import CategoryManager from "../pages/admin/CategoryManager";
import ProductManager from "../pages/admin/ProductManager";

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
        path: "category",
        element: (
          <LazyLoad>
            <CategoryManager />
          </LazyLoad>
        ),
      },
      {
        path: "product",
        element: (
          <LazyLoad>
            <ProductManager />
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
