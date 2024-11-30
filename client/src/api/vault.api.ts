import { BACKEND_BASE_URL } from "@/contants/env.constant.ts";

export const createVault = async (data: any) => {
  const res = await fetch(BACKEND_BASE_URL + "/api/vaults", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) return null;
  return await res.json();
};
