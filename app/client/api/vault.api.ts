import { CreateVaultRequest, CreateVaultResponse, DeleteVaultRequest, VaultConfigs } from "@/.server/vault.type";
import axios from "axios";

export const createVault = async (data: CreateVaultRequest, type: number) => {
  const response = await axios.post<CreateVaultResponse>(`/api/vaults?type=${type}`, data);
  return response.data;
};

export const deleteVault = async (id: string, data: DeleteVaultRequest) => {
  const res = await axios.post<null>(`/api/vaults/${id}/delete`, data);
  return res.data;
};

export const getVaultConfigs = async (id: string) => {
  const res = await axios.get<VaultConfigs>(`/api/vaults/${id}/configs`);
  return res.data;
};
