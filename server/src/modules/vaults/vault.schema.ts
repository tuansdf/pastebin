import {
  CreateVaultRequest,
  DeleteVaultRequest,
  EncryptionConfigs,
  HashConfigs,
  VaultConfigs,
} from "@/modules/vaults/vault.type.js";
import { z } from "zod";

const MAX_CONTENT_SERVER = 100000;

const passwordConfigsSchema: z.ZodType<HashConfigs> = z.object(
  {
    keySize: z
      .number({
        required_error: "Invalid key size",
        invalid_type_error: "Invalid key size",
      })
      .min(1, "Invalid key size"),
    iterations: z
      .number({
        required_error: "Invalid iterations",
        invalid_type_error: "Invalid iterations",
      })
      .min(1, "Invalid iterations"),
    salt: z
      .string({
        required_error: "Invalid salt",
        invalid_type_error: "Invalid salt",
      })
      .min(1, "Invalid salt"),
    hasher: z
      .string({
        required_error: "Invalid hasher",
        invalid_type_error: "Invalid hasher",
      })
      .min(1, "Invalid hasher"),
  },
  {
    required_error: "Password configs is required",
    invalid_type_error: "Invalid password configs",
  },
);

const encryptionConfigsSchema: z.ZodType<EncryptionConfigs> = z.object(
  {
    nonce: z
      .string({
        required_error: "Invalid nonce",
        invalid_type_error: "Invalid nonce",
      })
      .min(1, "Invalid salt"),
  },
  {
    required_error: "Encryption configs is required",
    invalid_type_error: "Invalid encryption configs",
  },
);

const vaultConfigsSchema: z.ZodType<VaultConfigs> = z.object(
  {
    hash: passwordConfigsSchema.optional(),
    encryption: encryptionConfigsSchema.optional(),
  },
  { required_error: "Configs is required", invalid_type_error: "Invalid configs" },
);

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
  guestPassword: z.string().optional(),
  configs: vaultConfigsSchema.optional(),
  expiresAt: z.coerce.number().optional(),
});

export const deleteVaultSchema: z.ZodType<DeleteVaultRequest> = z.object({
  password: passwordSchema,
  raw: passwordSchema.optional(),
});
