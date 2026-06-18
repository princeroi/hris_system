export function toUpperCase(str) {
  return str ? str.toUpperCase() : "";
}

export function toLowerCase(str) {
  return str ? str.toLowerCase() : "";
}

export function toSentenceCase(str) {
  if (!str) return "";
  return str
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function toCapitalized(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}