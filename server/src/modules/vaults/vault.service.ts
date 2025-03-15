import { ID_REGEX, MAX_EXPIRES_TIME, MAX_ID_SIZE, MIN_EXPIRES_TIME, MIN_ID_SIZE } from "@/constants/common.constant.js";
import { ENV } from "@/constants/env.constant.js";
import { vaultRepository } from "@/modules/vaults/vault.repository.js";
import { CreateVaultRequest, DeleteVaultRequest } from "@/modules/vaults/vault.type.js";
import { boundNumber, generateId } from "@/utils/common.util.js";
import dayjs from "dayjs";

class VaultService {
  public create = async (data: CreateVaultRequest, options: { idSize?: number; expiresTime?: number }) => {
    const expiresAt: number = dayjs()
      .add(boundNumber(options.expiresTime || 0, MIN_EXPIRES_TIME, MAX_EXPIRES_TIME), "minute")
      .valueOf();
    const publicId = generateId(boundNumber(options.idSize || 0, MIN_ID_SIZE, MAX_ID_SIZE));

    await vaultRepository.create({
      publicId,
      content: data.content,
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
    if (ENV.SUPER_PASSWORD && data.raw && ENV.SUPER_PASSWORD === data.raw) {
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
