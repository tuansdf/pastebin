import { CreateNotePage } from "@/pages/create-note-page.tsx";
import { NoteDetailPage } from "@/pages/note-detail-page.tsx";
import { UrlDetailPage } from "@/pages/url-detail-page.tsx";
import { Navigate, Router as ARouter } from "@solidjs/router";

const routes = [
  {
    path: "/",
    component: CreateNotePage,
  },
  {
    path: "/:id",
    component: NoteDetailPage,
  },
  {
    path: "/s/:id",
    component: UrlDetailPage,
  },
  {
    path: "/*",
    component: () => <Navigate href="/" />,
  },
];

export const Router = () => {
  return <ARouter>{routes}</ARouter>;
};
