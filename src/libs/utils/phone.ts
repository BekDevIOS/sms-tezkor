export function normalizePhone(phone: string): string | null {
  if (/[^\d\s+()-.]/.test(phone)) return null;
  const digits = phone.replace(/\D/g, '');

  // Uzbekistan: +998901234567, 998901234567, 901234567, 0901234567.
  if (digits.length === 12 && digits.startsWith('998')) return `+${digits}`;
  if (digits.length === 9) return `+998${digits}`;
  if (digits.length === 10 && digits.startsWith('0')) return `+998${digits.slice(1)}`;

  // South Korea: +821012345678, 821012345678, 01012345678.
  if (digits.startsWith('82') && digits.length >= 10 && digits.length <= 12) return `+${digits}`;
  if (digits.startsWith('0') && digits.length >= 9 && digits.length <= 11) return `+82${digits.slice(1)}`;

  return null;
}
