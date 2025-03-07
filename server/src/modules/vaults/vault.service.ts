import { ENV } from "@/constants/env.constant.js";
import { hasher } from "@/lib/hasher.js";
import { generateId } from "@/lib/id.js";
import { vaultRepository } from "@/modules/vaults/vault.repository.js";
import { CreateVaultRequest, DeleteVaultRequest } from "@/modules/vaults/vault.type.js";
import { getVaultExpiredAt, getVaultIdSize, handleVaultPublicIdCollision } from "@/modules/vaults/vault.util.js";
import dayjs from "dayjs";

const HASHED_SUPER_PASSWORD = ENV.SUPER_PASSWORD ? hasher.sha256(ENV.SUPER_PASSWORD) : undefined;
const ID_REGEX = /^[a-zA-Z0-9]{8,64}$/;

class VaultService {
  public create = async (data: CreateVaultRequest, idSize: number) => {
    const expiresAt: number = getVaultExpiredAt(data.expiresAt);

    const publicId = await handleVaultPublicIdCollision(() => generateId(getVaultIdSize(idSize)));
    await vaultRepository.create({
      publicId,
      content: data.content,
      masterPassword: data.masterPassword,
      expiresAt,
    });
    return { id: publicId };
  };

  public getTopByPublicId = async (id: string): Promise<{ publicId: string; content: string | null } | null> => {
    if (!ID_REGEX.test(id)) return null;
    const now = dayjs().valueOf();

    const vault = await vaultRepository.findTopByPublicId(id);
    if (!vault || (vault.expiresAt && vault.expiresAt < now)) {
      return null;
    }

    return {
      publicId: id,
      content: vault.content,
    };
  };

  public deleteExpiredVaults = async () => {
    const date = dayjs().valueOf();
    await vaultRepository.deleteAllExpiresAtBefore(date);
    return date;
  };

  public deleteTopByPublicId = async (id: string, data: DeleteVaultRequest) => {
    if (HASHED_SUPER_PASSWORD && data.raw && HASHED_SUPER_PASSWORD === hasher.sha256(data.raw)) {
      await vaultRepository.deleteByPublicId(id);
      return;
    }
    const vault = await vaultRepository.findTopByPublicId(id);
    if (!vault || !data.password || vault.masterPassword !== data.password) {
      throw new Error();
    }
    await vaultRepository.deleteById(vault.id);
  };
}

export const vaultService = new VaultService();
