/**
 * Returns the file extension from a filename (e.g. "page.tsx" → "tsx").
 * Handles no extension (e.g. "Dockerfile") by returning "".
 */
export function getExtension(name: string): string {
  const last = name.split(".").pop();
  return last && last !== name ? last.toLowerCase() : "";
}
