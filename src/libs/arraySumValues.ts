
export default function arraySumValues(values: number[]): number {
  return values.reduce((a, b) => a + b, 0);
}