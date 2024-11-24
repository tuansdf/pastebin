import { DEFAULT_NOTE_ID_SIZE, ID_ALPHABET } from "@/constants/common.constant.js";
import { customAlphabet } from "nanoid";

const idNano = customAlphabet(ID_ALPHABET, DEFAULT_NOTE_ID_SIZE);
export const generateId = (size: number = DEFAULT_NOTE_ID_SIZE) => {
  return idNano(size);
};
