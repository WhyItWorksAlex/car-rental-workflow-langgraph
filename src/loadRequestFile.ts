import fs from "node:fs/promises";
import path from "node:path";

/** Keys starting with "_" are template hints only (e.g. _fields) and are not sent to the workflow. */
export function stripTemplateMeta(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(stripTemplateMeta);
  }

  if (typeof value !== "object" || value === null) {
    return value;
  }

  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>)
      .filter(([key]) => !key.startsWith("_"))
      .map(([key, val]) => [key, stripTemplateMeta(val)]),
  );
}

export async function loadRequestFile(filePath: string) {
  const absolutePath = path.resolve(filePath);
  const raw = await fs.readFile(absolutePath, "utf-8");
  const parsed: unknown = JSON.parse(raw);
  return stripTemplateMeta(parsed);
}
