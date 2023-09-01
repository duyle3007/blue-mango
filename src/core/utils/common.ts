export function comparator(
  a: string | number,
  b: string | number,
  order: "asc" | "desc" = "asc"
) {
  const comparationResult = {
    asc: a < b ? -1 : 1,
    desc: a > b ? -1 : 1,
  };
  return comparationResult[order];
}
