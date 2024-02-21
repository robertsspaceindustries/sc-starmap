export default function sortByCode(a: string, b: string) {
  const codeA = a.toUpperCase();
  const codeB = b.toUpperCase();
  if (codeA < codeB) return -1;
  if (codeA > codeB) return 1;
  return 0;
}
