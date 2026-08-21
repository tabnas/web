// The error registry, assembled once.
//
// A code can be declared in three places — the engine's own catalogue, a
// grammar plugin's `tabnas.plugin.json`, and a plugin's C ABI — and two codes
// in the fleet are claimed by more than one. /errors/<code> already reasons
// about that; this puts the same assembly behind /errors.json,
// /errors/<code>.json and the enum in /openapi.json, so the three cannot
// describe different sets.

import registry from "./data/error-codes.json";
import plugindata from "./data/plugins.json";
import { SITE_URL } from "./openapi";

export interface ErrorEntry {
  code: string;
  /** The message template. Null for a code whose text lives in its own plugin. */
  message: string | null;
  hint: string | null;
  /** Which runtimes raise it, for engine codes. */
  runtime: "both" | "ts" | "go" | null;
  /** Raised by the engine itself, so any grammar can produce it. */
  engine: boolean;
  /** Grammar plugins that declare it in their descriptor. */
  packages: string[];
  /** Packages whose C ABI declares it — a different envelope from a diagnostic. */
  abi: string[];
  url: string;
}

export function errorRegistry(): { engine: string; codes: ErrorEntry[] } {
  const engineCodes = new Map(registry.codes.map((c) => [c.code, c]));

  const packages = new Map<string, string[]>();
  const abi = new Map<string, string[]>();
  for (const plugin of plugindata.plugins) {
    for (const code of plugin.errorCodes) {
      packages.set(code, [...(packages.get(code) ?? []), plugin.name]);
    }
    for (const code of plugin.clib?.errorCodes ?? []) {
      abi.set(code, [...(abi.get(code) ?? []), plugin.name]);
    }
  }

  const codes = [...new Set([...engineCodes.keys(), ...packages.keys(), ...abi.keys()])]
    .sort()
    .map((code): ErrorEntry => {
      const entry = engineCodes.get(code);
      return {
        code,
        message: entry?.message ?? null,
        hint: entry?.hint ?? null,
        runtime: (entry?.runtime as ErrorEntry["runtime"]) ?? null,
        engine: Boolean(entry),
        packages: packages.get(code) ?? [],
        abi: abi.get(code) ?? [],
        url: `${SITE_URL}/errors/${code}`,
      };
    });

  return { engine: registry.engine, codes };
}
