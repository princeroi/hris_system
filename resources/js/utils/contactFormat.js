export function formatContactNumber(number) {
  if (!number) return "";

  const digits = number.toString().replace(/\D/g, "");

  // Mobile: 09XX XXX XXXX (e.g. 0917 123 4567)
  if (digits.length === 11 && digits.startsWith("0")) {
    return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
  }

  // Mobile with country code: +63 9XX XXX XXXX
  if (digits.length === 12 && digits.startsWith("63")) {
    return `+63 ${digits.slice(2, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`;
  }

  // Mobile with country code, no leading +: 639XXXXXXXXX
  if (digits.length === 13 && digits.startsWith("639")) {
    return `+63 ${digits.slice(2, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`;
  }

  // Landline with area code: (0XX) XXXX XXXX (e.g. Manila (02) 8123 4567)
  if (digits.length === 10 && digits.startsWith("0")) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 7)} ${digits.slice(7)}`;
  }

  // Fallback: return original
  return number;
}