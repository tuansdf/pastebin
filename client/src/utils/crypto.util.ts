import { DEFAULT_NONCE_SIZE, DEFAULT_PASSWORD_SIZE } from "@/contants/common.constant";
import { xchacha20poly1305 } from "@noble/ciphers/chacha";
import { bytesToHex, hexToBytes } from "@noble/ciphers/utils";
import { randomBytes } from "@noble/ciphers/webcrypto";
import { base64 } from "@scure/base";
import Pako from "pako";

export const encryptText = async (contentStr: string, passwordHex: string, nonceHex: string): Promise<string> => {
  const start = performance.now();
  try {
    const nonce = hexToBytes(nonceHex);
    const password = hexToBytes(passwordHex);
    const cipher = xchacha20poly1305(password, nonce);
    let content = Pako.deflate(contentStr);
    let encrypted = cipher.encrypt(content);
    return base64.encode(encrypted);
  } catch (e) {
    return "";
  } finally {
    console.info("EPERF: " + (performance.now() - start) + " ms");
  }
};

export const decryptText = async (content64: string, passwordHex: string, nonceHex: string): Promise<string> => {
  const start = performance.now();
  try {
    const content = base64.decode(content64);
    const password = hexToBytes(passwordHex);
    const nonce = hexToBytes(nonceHex);
    const cipher = xchacha20poly1305(password, nonce);
    return Pako.inflate(cipher.decrypt(content), { to: "string" });
  } catch (e) {
    return "";
  } finally {
    console.info("DPERF: " + (performance.now() - start) + " ms");
  }
};

export const generateEncryptionConfigs = () => {
  return {
    nonce: bytesToHex(randomBytes(DEFAULT_NONCE_SIZE)),
  };
};

export const generatePassword = (size: number = DEFAULT_PASSWORD_SIZE) => {
  return bytesToHex(randomBytes(size));
};
