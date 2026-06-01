/**
 * Escape regex metacharacters so untrusted user input is matched literally.
 * Prevents ReDoS / catastrophic backtracking when building a Mongo `$regex`
 * from a search string. Use with `{ $regex: escapeRegex(text), $options: 'i' }`
 * instead of `new RegExp(text, 'i')`.
 */
export function escapeRegex(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
