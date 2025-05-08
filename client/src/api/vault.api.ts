import { AUTH_STORAGE_KEY } from "@/constants/common.constant.ts";
import { BACKEND_BASE_URL } from "@/constants/env.constant.ts";
import { CreateVaultResponse, GetOneVaultResponse } from "@/types/vault.type.ts";
import { decryptText } from "@/utils/crypto.util.ts";

export const createVault = async (
  data: Record<string, unknown>,
  options: { size?: number; time?: number }
): Promise<CreateVaultResponse | null> => {
  const res = await fetch(`${BACKEND_BASE_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": localStorage.getItem(AUTH_STORAGE_KEY) || ""
    },
    body: JSON.stringify({ ...data, idSize: options.size || "", expireMinutes: options.time || "" })
  });
  if (!res.ok) return null;
  return await res.json();
};

export const getVault = async (id: string): Promise<GetOneVaultResponse | null> => {
  const res = await fetch(`${BACKEND_BASE_URL}/${id}`, {
    method: "GET"
  });
  if (!res.ok) return null;
  return await res.json();
};

export const getVaultAndDecryptContent = async (id?: string): Promise<string | undefined> => {
  if (!id) return;

  const data = await getVault(id || "");
  if (!data) return;

  const password = location.hash.startsWith("#") ? location.hash.substring(1) : location.hash;
  if (!data.content || !password) return;

  const decrypted = await decryptText(data.content, password);
  if (!decrypted) return;

  return decrypted;
};
