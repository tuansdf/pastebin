import { BACKEND_BASE_URL } from "@/constants/env.constant.ts";
import { CreateVaultResponse, GetOneVaultResponse } from "@/types/vault.type.ts";
import { decryptText } from "@/utils/crypto.util.ts";

export const createVault = async (data: any): Promise<CreateVaultResponse | null> => {
  const res = await fetch(`${BACKEND_BASE_URL}/api/vaults`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) return null;
  return await res.json();
};

export const getVault = async (id: string): Promise<GetOneVaultResponse | null> => {
  const res = await fetch(`${BACKEND_BASE_URL}/api/vaults/${id}`, {
    method: "GET",
  });
  if (!res.ok) return null;
  return await res.json();
};

export const getVaultAndDecryptContent = async (id?: string): Promise<string | undefined> => {
  if (!id) return;

  const data = await getVault(id || "");
  if (!data) return;

  const nonce = data.configs?.encryption?.nonce;
  const password = location.hash.startsWith("#") ? location.hash.substring(1) : location.hash;
  if (!data.content || !nonce || !password) return;

  const decrypted = await decryptText(data.content, password, nonce);
  if (!decrypted) return;

  return decrypted;
};
