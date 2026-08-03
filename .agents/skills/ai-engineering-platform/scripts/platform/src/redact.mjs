const STRING_RULES = [
  [/\bAuthorization\s*:\s*Bearer\s+[^\s;,]+/gi, "Authorization: Bearer [REDACTED_TOKEN]"],
  [/\bBearer\s+[A-Za-z0-9._~+\/-]{12,}/gi, "Bearer [REDACTED_TOKEN]"],
  [/\b(?:sk|rk|pk)-[A-Za-z0-9_-]{16,}\b/g, "[REDACTED_API_KEY]"],
  [/\b(password|passwd|secret|api[_-]?key)\s*[:=]\s*[^\s;,]+/gi, "$1=[REDACTED_SECRET]"],
  [/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, "[REDACTED_EMAIL]"]
];

export function redactSensitive(value) {
  if (typeof value === "string") return STRING_RULES.reduce((text, [pattern, replacement]) => text.replace(pattern, replacement), value);
  if (Array.isArray(value)) return value.map(redactSensitive);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, entry]) => {
      if (/token|password|secret|authorization|api[_-]?key/i.test(key)) return [key, "[REDACTED_SECRET]"];
      return [key, redactSensitive(entry)];
    }));
  }
  return value;
}
