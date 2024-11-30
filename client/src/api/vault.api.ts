import { BACKEND_BASE_URL } from "@/contants/env.constant.ts";
import { CreateVaultResponse, GetOneVaultResponse } from "@/types/vault.type.ts";

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