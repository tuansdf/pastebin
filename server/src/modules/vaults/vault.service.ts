import { ENV } from "@/constants/env.constant.js";
import { hasher } from "@/lib/hasher.js";
import { generateId } from "@/lib/id.js";
import { vaultRepository } from "@/modules/vaults/vault.repository.js";
import { CreateVaultRequest, DeleteVaultRequest, VaultConfigs } from "@/modules/vaults/vault.type.js";
import {
  generateFakeContent,
  generateFakeEncryptionConfigs,
  generateFakeHashConfigs,
  getVaultExpiredAt,
  getVaultIdSize,
  handleVaultPublicIdCollision,
} from "@/modules/vaults/vault.util.js";
import dayjs from "dayjs";

const HASHED_SUPER_PASSWORD = ENV.SUPER_PASSWORD ? hasher.sha256(ENV.SUPER_PASSWORD) : undefined;
const ID_REGEX = /^[a-zA-Z0-9]+$/;

class VaultService {
  public create = async (data: CreateVaultRequest, idSize: number) => {
    let expiresAt: number = getVaultExpiredAt(data.expiresAt);

    const publicId = await handleVaultPublicIdCollision(() => generateId(getVaultIdSize(idSize)));
    await vaultRepository.create({
      publicId,
      content: data.content,
      masterPassword: data.masterPassword,
      guestPassword: data.guestPassword,
      configs: JSON.stringify(data.configs),
      expiresAt,
    });
    return { id: publicId };
  };

  public getTopByPublicId = async (
    id: string,
    guestPassword?: string | null,
  ): Promise<{ publicId: string; content: string | null; configs?: VaultConfigs } | null> => {
    if (!ID_REGEX.test(id)) return null;
    const now = dayjs().valueOf();

    const vault = await vaultRepository.findTopByPublicId(id);
    if (
      !vault ||
      (vault.guestPassword && vault.guestPassword !== guestPassword) ||
      (vault.expiresAt && vault.expiresAt < now)
    ) {
      const base = id + (guestPassword || "");
      return {
        publicId: id,
        content: generateFakeContent(base),
        configs: { hash: generateFakeHashConfigs(base), encryption: generateFakeEncryptionConfigs(base) },
      };
    }
    let configs = this.parseVaultConfigs(vault.configs!);

    return {
      publicId: id,
      content: vault.content,
      configs,
    };
  };

  public deleteExpiredVaults = async () => {
    const date = dayjs().valueOf();
    await vaultRepository.deleteAllExpiresAtBefore(date);
    return date;
  };

  private parseVaultConfigs = (configs?: string | null): VaultConfigs | undefined => {
    if (!configs) return;
    try {
      return JSON.parse(configs) as VaultConfigs;
    } catch {}
  };

  public getVaultConfigs = async (id: string): Promise<VaultConfigs> => {
    const vault = await vaultRepository.findTopByPublicId(id);
    const configs = this.parseVaultConfigs(vault?.configs);
    if (!configs) {
      return {
        hash: generateFakeHashConfigs(id),
        encryption: generateFakeEncryptionConfigs(id),
      };
    }
    return configs;
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
