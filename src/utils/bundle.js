import path from "node:path";

export function sanitizeBundleName(value) {
  const fallback = "promptwash-bundle";

  if (!value || typeof value !== "string") {
    return fallback;
  }

  const cleaned = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return cleaned || fallback;
}

export function buildBundlePaths(baseDir, name, provider) {
  const safeName = sanitizeBundleName(name);
  const bundleDir = path.join(baseDir, safeName);

  return {
    bundle_dir: bundleDir,
    prompt_json: path.join(bundleDir, "prompt.json"),
    rendered_txt: path.join(bundleDir, `rendered.${provider}.txt`),
    check_report: path.join(bundleDir, "check.md"),
    manifest_json: path.join(bundleDir, "manifest.json"),
  };
}

export function buildBundleManifest({
  name,
  provider,
  source,
  inputPath,
  files,
  promptObject,
}) {
  return {
    bundle_name: name,
    provider,
    source,
    input_path: inputPath ?? null,
    generated_at: new Date().toISOString(),
    fingerprint: promptObject.fingerprint ?? null,
    intent: promptObject.intent ?? "",
    audience: promptObject.audience ?? "",
    output_format: promptObject.ir?.output_format ?? "",
    files,
  };
}