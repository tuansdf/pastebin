import { DEFAULT_PASSWORD_SIZE } from "@/constants/common.constant";
import { xchacha20poly1305 } from "@noble/ciphers/chacha";
import { managedNonce, randomBytes } from "@noble/ciphers/webcrypto";
import { base64urlnopad } from "@scure/base";
import Pako from "pako";

const encryptFn = managedNonce(xchacha20poly1305);
const base64Encode = base64urlnopad.encode;
const base64Decode = base64urlnopad.decode;

export const encryptText = async (contentStr: string, password64: string): Promise<string> => {
  const start = performance.now();
  try {
    const password = base64Decode(password64);
    const cipher = encryptFn(password);
    let content = Pako.deflate(contentStr);
    let encrypted = cipher.encrypt(content);
    return base64Encode(encrypted);
  } catch (e) {
    return "";
  } finally {
    console.info("EPERF: " + (performance.now() - start) + " ms");
  }
};

export const decryptText = async (content64: string, password64: string): Promise<string> => {
  const start = performance.now();
  try {
    const content = base64Decode(content64);
    const password = base64Decode(password64);
    const cipher = encryptFn(password);
    return Pako.inflate(cipher.decrypt(content), { to: "string" });
  } catch (e) {
    return "";
  } finally {
    console.info("DPERF: " + (performance.now() - start) + " ms");
  }
};

export const generatePassword = (size: number = DEFAULT_PASSWORD_SIZE) => {
  return base64Encode(randomBytes(size));
};
