import Footer from "../layout/Footer";
import Header from "../layout/Header";

import NotFoundPage from "../pages/user/NotFoundPage";

import ShowTime from "../pages/permitAll/ShowTime";
import Movie from "../pages/user/Movie";
import MovieDetail from "../pages/user/MovieDetail";
import MoviesShowing from "../pages/user/MoviesShowing";
import MoviesComingSoon from "../pages/user/MoviesComingSoon";
import ListNews from "../pages/user/ListNews";
import MoviesNew from "../pages/user/MoviesNew";

import NewsDetail from "../pages/user/NewsDetail";

import LoginAdmin from "../pages/admin/LoginAdmin";
import Register from "../pages/user/Register";
import Login from "../pages/user/LoginUser";

import TicketPrice from "../pages/user/TicketPrice";
import Franchise from "../pages/user/Franchise";

import Home from "../pages/permitAll/Home";
import Demo from "../pages/Demo";
import Banner from "../pages/user/Banner";

const publicRouter = [
  {
    path: "/",
    element: <Home />,
    children: [
      {
        path: "", // Đây là trang con mặc định khi vào "/"
        element: <Banner />,
        children: [
          {
            path: "",
            element: <MoviesShowing />,
          },
        ], // Hiển thị trang MoviesShowing
      },
      {
        path: "movies",
        element: <Movie />,
        children: [
          {
            index: true,
            element: <MoviesShowing />,
          },
          {
            path: "showing", // Đường dẫn "/movies/showing"
            element: <MoviesShowing />,
          },
          {
            path: "coming_soon",
            element: <MoviesComingSoon />,
          },
          {
            path: "special",
            element: <MoviesNew />,
          },
        ],
      },
      {
        path: "movies/:movieId",
        element: <MovieDetail />,
      },
      {
        path: "news",
        element: <ListNews />,
      },
      {
        path: "/news/:newsId",
        element: <NewsDetail />,
      },
      {
        path: "/showTime",
        element: <ShowTime />,
      },
      {
        path: "ticket_price",
        element: <TicketPrice />,
      },
      {
        path: "franchise",
        element: <Franchise />,
      },
    ],
  },

  /**
   * nơi viết thêm router sau dòng này
   *  */

  {
    path: "login",
    element: (
      <>
        <Header />
        <Login />
        <Footer />
      </>
    ),
  },
  {
    path: "register",
    element: (
      <>
        <Header />
        <Register />
        <Footer />
      </>
    ),
  },
  {
    path: "loginadmin",
    element: (
      <>
        <LoginAdmin />
      </>
    ),
  },
  {
    path: "demo",
    element: <Demo></Demo>,
  },

  /**
   * không đc viết router sau dòng này , phải để not found page ở dưới dùng nhé
   *  */
  {
    path: "*",
    element: <NotFoundPage />,
  },
];
export default publicRouter;
