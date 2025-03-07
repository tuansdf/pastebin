import { VaultTable } from "@/db/entities/vault.entity.js";

export type Vault = typeof VaultTable.$inferSelect;
export type VaultCreate = typeof VaultTable.$inferInsert;

export type CreateVaultRequest = {
  content: string;
  expiresAt?: number;
  masterPassword?: string;
};

export type DeleteVaultRequest = {
  password: string;
  raw?: string;
};
