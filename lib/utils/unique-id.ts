/**
 * crypto.randomUUID() only works in secure contexts (HTTPS/localhost) — it's
 * undefined and throws on plain HTTP, which broke uploads on a misconfigured
 * domain. This has no security requirement (just needs to avoid collisions in
 * a storage path), so a plain random string works everywhere unconditionally.
 */
export function uniqueId(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
}
