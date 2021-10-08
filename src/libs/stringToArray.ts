export default function stringToArray(string: string, wordMinLength = 2): string[] {
  const result = String(string)
    .split(/[\s,.;:]+/)
    .map(s => s.trim());

  if (wordMinLength > 0)
    return result.filter(i => i.length >= wordMinLength);

  return result;
}