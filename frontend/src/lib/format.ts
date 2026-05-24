export function formatNullable(value: string | number | null | undefined) {
  return value ?? "-";
}
