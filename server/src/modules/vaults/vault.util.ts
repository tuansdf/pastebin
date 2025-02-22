import { DEFAULT_NOTE_ID_SIZE, MAX_EXPIRES_TIME } from "@/constants/common.constant.js";
import { vaultRepository } from "@/modules/vaults/vault.repository.js";
import { handleRetry } from "@/utils/common.util.js";
import dayjs from "dayjs";

export const handleVaultPublicIdCollision = async (randomFn: () => string) => {
  return await handleRetry({
    resultFn: randomFn,
    shouldRetryFn: vaultRepository.existsByPublicId,
  });
};

export const getVaultExpiredAt = (expiresTime?: number): number => {
  let result = dayjs();
  // TODO: fix temporarily for frontend
  // if (!expiresTime) return result.valueOf();
  // if (expiresTime < MIN_EXPIRES_TIME) expiresTime = MIN_EXPIRES_TIME;
  // if (expiresTime > MAX_EXPIRES_TIME) expiresTime = MAX_EXPIRES_TIME;
  // return result.add(expiresTime, "minute").valueOf();
  return result.add(MAX_EXPIRES_TIME, "minute").valueOf();
};

export const getVaultIdSize = (type?: number): number => {
  return DEFAULT_NOTE_ID_SIZE;
  // TODO: fix temporarily for frontend
  // if (!type || type > MAX_ID_SIZE) return MAX_ID_SIZE;
  // if (type < MIN_ID_SIZE) return MIN_ID_SIZE;
  // return type;
};
