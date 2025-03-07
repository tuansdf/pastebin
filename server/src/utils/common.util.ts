import { ID_ALPHABET, MIN_ID_SIZE } from "@/constants/common.constant.js";
import { customAlphabet } from "nanoid";

const idNano = customAlphabet(ID_ALPHABET, MIN_ID_SIZE);
export const generateId = (size: number = MIN_ID_SIZE) => {
  return idNano(size);
};

export const boundNumber = (current: number, min: number, max: number) => {
  if (min >= max) return current;
  if (current < min) return min;
  if (current > max) return max;
  return current;
};
