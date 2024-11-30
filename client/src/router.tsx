import { CreateNotePage } from "@/pages/CreateNotePage.tsx";
import { Route, Router as ARouter } from "@solidjs/router";

export const Router = () => {
  return (
    <ARouter>
      <Route path="/" component={CreateNotePage} />
    </ARouter>
  );
};
