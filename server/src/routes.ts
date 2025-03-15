import { createVaultRequestSchema, deleteVaultSchema } from "@/modules/vaults/vault.schema.js";
import { vaultService } from "@/modules/vaults/vault.service.js";
import { Hono } from "hono";

export const routes = new Hono();

routes.get("/health", () => {
  return new Response("OK");
});

routes.post("/vaults", async (c) => {
  const idSize = Number(c.req.query("size") || "");
  const expiresTime = Number(c.req.query("time") || "");
  const body = createVaultRequestSchema.parse(await c.req.json());
  const result = await vaultService.create(body, { idSize, expiresTime });
  return Response.json(result);
});

routes.get("/vaults/:id", async (c) => {
  const id = c.req.param("id") || "";
  const result = await vaultService.getTopByPublicId(id);
  return Response.json(result);
});

routes.get("/vaults/:id/delete", async (c) => {
  const id = c.req.param("id") || "";
  const body = await c.req.json();
  const data = await deleteVaultSchema.parseAsync(body);
  await vaultService.deleteTopByPublicId(id, data);
  return Response.json(null);
});

routes.get("/jobs/vaults/expired/delete", async () => {
  const result = await vaultService.deleteExpiredVaults();
  return Response.json({ message: result });
});
