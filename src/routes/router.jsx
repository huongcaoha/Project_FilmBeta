import { createBrowserRouter } from "react-router-dom";
import publicRouter from "./public.routes";
import protectedRouter from "./protected.routes";

const mergeRouter = [...publicRouter, ...protectedRouter];
const routers = createBrowserRouter(mergeRouter);
export default routers;
