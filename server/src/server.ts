import { ENV } from "@/constants/env.constant.js";
import "dotenv/config";
import { routes } from "@/routes.js";
import { exceptionUtils } from "@/utils/exception.util.js";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { secureHeaders } from "hono/secure-headers";
import "@/constants/env.constant.js";
import "@/db/db.js";

const app = new Hono();

app.use(cors());
app.use(secureHeaders());

app.route("/api", routes);

app.notFound(() => {
  return Response.json({ message: "Not Found" }, { status: 404 });
});
app.onError((err) => {
  const [status, response] = exceptionUtils.getResponse(err);
  return Response.json(response, { status: status });
});

const port = ENV.PORT || 5000;
console.log(`Server is running on port ${port}`);

export default {
  fetch: app.fetch,
  port,
};
