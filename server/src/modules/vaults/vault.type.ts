import { VaultTable } from "@/db/entities/vault.entity.js";

export type Vault = typeof VaultTable.$inferSelect;
export type VaultCreate = typeof VaultTable.$inferInsert;

export type HashConfigs = {
  keySize?: number;
  iterations?: number;
  salt?: string;
  hasher?: string;
};

export type EncryptionConfigs = {
  nonce: string;
};

export type VaultConfigs = {
  hash: HashConfigs;
  encryption: EncryptionConfigs;
};

export type CreateVaultRequest = {
  content: string;
  configs: VaultConfigs;
  expiresAt?: number;
  masterPassword?: string;
  guestPassword?: string;
};

export type DeleteVaultRequest = {
  password: string;
  raw?: string;
};
