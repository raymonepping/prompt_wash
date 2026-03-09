import crypto from "node:crypto";

export function createFingerprint(value) {
  return `pw_${crypto.createHash("sha256").update(value).digest("hex").slice(0, 8)}`;
}
