class Base64 {
  public encode(text: string | Uint8Array) {
    return Buffer.from(text).toString("base64");
  }
}

export const base64 = new Base64();
