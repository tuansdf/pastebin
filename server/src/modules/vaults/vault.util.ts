import {
  DEFAULT_HASHER,
  DEFAULT_ITERATIONS,
  DEFAULT_KEY_SIZE,
  FAKE_NONCE_SIZE,
  FAKE_SALT_SIZE,
  MAX_EXPIRES_TIME,
  MAX_ID_SIZE,
  MIN_EXPIRES_TIME,
  MIN_ID_SIZE,
} from "@/constants/common.constant.js";
import { ENV } from "@/constants/env.constant.js";
import { base64 } from "@/lib/base64.js";
import { hasher } from "@/lib/hasher.js";
import { vaultRepository } from "@/modules/vaults/vault.repository.js";
import { HashConfigs } from "@/modules/vaults/vault.type.js";
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
  if (!expiresTime) return result.valueOf();
  if (expiresTime < MIN_EXPIRES_TIME) expiresTime = MIN_EXPIRES_TIME;
  if (expiresTime > MAX_EXPIRES_TIME) expiresTime = MAX_EXPIRES_TIME;
  return result.add(expiresTime, "minute").valueOf();
};

export const getVaultIdSize = (type?: number): number => {
  if (!type || type > MAX_ID_SIZE) return MAX_ID_SIZE;
  if (type < MIN_ID_SIZE) return MIN_ID_SIZE;
  return type;
};

const createBase = (base: string) => {
  return hasher.sha256(base + ENV.SALT);
};

const BASE_CONTENT_EXTRA = "content" + ENV.SALT;
const BASE_SALT_EXTRA = "salt" + ENV.SALT;
const BASE_ENCRYPTION_EXTRA = "encryption" + ENV.SALT;

const HEX_ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz";
const MIN_ROUNDS = 2;
const MAX_ROUNDS = 16;
export const generateFakeContent = (base: string): string => {
  base = createBase(base + BASE_CONTENT_EXTRA).toLowerCase();
  let rounds = HEX_ALPHABET.indexOf(base[0]!);
  if (rounds < MIN_ROUNDS) rounds = MIN_ROUNDS;
  if (rounds > MAX_ROUNDS) rounds = MAX_ROUNDS;
  const all: string[] = [];
  for (let i = 0; i < rounds; i++) {
    all.push(hasher.sha256(base.slice(0, 5 + i)));
  }
  return base64.encode(all.join(""));
};

export const generateFakeHashConfigs = (base: string): HashConfigs => {
  base = createBase(base + BASE_SALT_EXTRA);
  return {
    keySize: DEFAULT_KEY_SIZE,
    iterations: DEFAULT_ITERATIONS,
    hasher: DEFAULT_HASHER,
    salt: base.substring(0, FAKE_SALT_SIZE),
  };
};

export const generateFakeEncryptionConfigs = (base: string) => {
  base = createBase(base + BASE_ENCRYPTION_EXTRA);
  return {
    nonce: base.substring(0, FAKE_NONCE_SIZE),
  };
};
