import crypto from "crypto";

class Hasher {
  public sha256(input: string) {
    return crypto.createHash("sha256").update(input).digest("hex");
  }
}

export const hasher = new Hasher();
