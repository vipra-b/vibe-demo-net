import { createBrowserRouter } from "react-router";
import Root from "./pages/Root";
import Home from "./pages/Home";
import Browse from "./pages/Browse";
import ContentDetail from "./pages/ContentDetail";
import Profile from "./pages/Profile";
import Connections from "./pages/Connections";
import NotFound from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "browse", Component: Browse },
      { path: "content/:id", Component: ContentDetail },
      { path: "profile", Component: Profile },
      { path: "connections", Component: Connections },
      { path: "*", Component: NotFound },
    ],
  },
]);
