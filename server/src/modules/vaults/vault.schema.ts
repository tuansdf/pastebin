import { CreateVaultRequest, DeleteVaultRequest } from "@/modules/vaults/vault.type.js";
import { z } from "zod";

const MAX_CONTENT_SERVER = 100000;

const contentSchema = z
  .string({
    required_error: "Invalid content",
    invalid_type_error: "Invalid content",
  })
  .min(1, "Missing content");

export const passwordSchema = z
  .string({
    required_error: "Password is required",
    invalid_type_error: "Invalid password",
  })
  .min(32, "Must have at least 32 characters")
  .max(128, "Must have at most 128 characters");

export const createVaultRequestSchema: z.ZodType<CreateVaultRequest> = z.object({
  content: contentSchema.max(MAX_CONTENT_SERVER, "Invalid content"),
  masterPassword: passwordSchema.optional(),
  expiresAt: z.coerce.number().optional(),
});

export const deleteVaultSchema: z.ZodType<DeleteVaultRequest> = z.object({
  password: passwordSchema,
  raw: passwordSchema.optional(),
});
