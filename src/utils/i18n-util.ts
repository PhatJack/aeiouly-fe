/**
 * Merges translation message objects with conflict detection.
 * Each message file should export an object with unique top-level namespace keys.
 * For example: auth.json exports { "auth": {...} }, setting.json exports { "setting": {...} }
 * This prevents key collisions between different message files.
 *
 * @param messageSources - Array of message objects to merge, typically loaded from JSON files
 * @returns Merged message object with all keys from all sources
 */
export function mergeMessages(
  ...messageSources: Record<string, unknown>[]
): Record<string, unknown> {
  const merged: Record<string, unknown> = {};
  const conflicts = new Set<string>();

  for (const source of messageSources) {
    for (const key in source) {
      if (key in merged) {
        conflicts.add(key);
      }
      merged[key] = source[key];
    }
  }

  if (conflicts.size > 0) {
    console.warn(
      `[i18n] Warning: Duplicate keys found in message files: ${Array.from(conflicts).join(', ')}. ` +
        'Later files will overwrite earlier ones. Ensure each message file uses unique top-level namespace keys.'
    );
  }

  return merged;
}
