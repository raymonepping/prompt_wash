import crypto from "node:crypto";

export function createFingerprint(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}
