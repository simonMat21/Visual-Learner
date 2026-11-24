// Pseudocode, counters and legend for each sorting visualization.
// Line numbers in the sketches' narration refer to the indexes of `code`.

const COMPARE = { kind: "box-outline", label: "being compared" };
const FINAL = { kind: "box-good", label: "in its final place" };

export const SORT_GUIDES = {
  bubble: {
    code: [
      "for i ← 0 to n − 2:",
      "  swapped ← false",
      "  for j ← 0 to n − 2 − i:",
      "    if a[j] > a[j + 1]:",
      "      swap a[j], a[j + 1];  swapped ← true",
      "  if not swapped: stop  // already sorted",
      "  // the largest unsorted item is now at the end",
    ],
    stats: { comparisons: "Comparisons", swaps: "Swaps", passes: "Passes" },
    legend: [COMPARE, FINAL],
  },
  selection: {
    code: [
      "for i ← 0 to n − 2:",
      "  min ← i",
      "  for j ← i + 1 to n − 1:",
      "    if a[j] < a[min]:  min ← j",
      "  swap a[i], a[min]",
      "  // a[i] is now in its final place",
    ],
    stats: { comparisons: "Comparisons", swaps: "Swaps" },
    legend: [COMPARE, { kind: "tag", text: "min", label: "smallest so far" }, FINAL],
  },
  insertion: {
    code: [
      "for i ← 1 to n − 1:",
      "  j ← i            // pick up a[i]",
      "  while j > 0 and a[j − 1] > a[j]:",
      "    swap a[j − 1], a[j];  j ← j − 1",
      "  // a[0..i] is now sorted",
    ],
    stats: { comparisons: "Comparisons", swaps: "Shifts" },
    legend: [
      COMPARE,
      { kind: "tag", text: "key", label: "item being inserted" },
      { kind: "box-ring", label: "sorted part (so far)" },
      FINAL,
    ],
  },
  merge: {
    code: [
      "mergeSort(a):",
      "  if length(a) ≤ 1: return a",
      "  split a into a left and a right half",
      "  mergeSort(left);  mergeSort(right)",
      "  merge: repeatedly take the smaller front item",
    ],
    stats: { splits: "Splits", merges: "Merges", comparisons: "Comparisons" },
    legend: [],
  },
  quick: {
    code: [
      "quickSort(a, lo, hi):",
      "  if lo < hi:",
      "    pivot ← a[hi];  i ← lo",
      "    for j ← lo to hi − 1:",
      "      if a[j] < pivot:",
      "        swap a[i], a[j];  i ← i + 1",
      "    swap a[i], a[hi]   // pivot lands in place",
      "    quickSort(a, lo, i − 1);  quickSort(a, i + 1, hi)",
    ],
    stats: { comparisons: "Comparisons", swaps: "Swaps", partitions: "Partitions" },
    legend: [
      { kind: "tag", text: "pivot", label: "value we split around" },
      { kind: "tag", text: "i", label: "end of the “smaller” side" },
      FINAL,
    ],
  },
  heap: {
    code: [
      "for i ← n/2 − 1 down to 0: heapify(a, n, i)",
      "for end ← n − 1 down to 1:",
      "  swap a[0], a[end]   // largest goes to the end",
      "  heapify(a, end, 0)",
      "heapify(a, n, i):  largest of i and its children",
      "  if a child is larger: swap it up, heapify(child)",
    ],
    stats: { comparisons: "Comparisons", swaps: "Swaps" },
    legend: [FINAL],
  },
  count: {
    code: [
      "count[v] ← 0 for every value v",
      "for each x in a:  count[x] ← count[x] + 1",
      "k ← 0",
      "for v ← 0 to max:",
      "  repeat count[v] times:  a[k] ← v;  k ← k + 1",
    ],
    stats: { counted: "Items counted", written: "Items written" },
    legend: [],
  },
  radix: {
    code: [
      "for d in (ones, tens, hundreds):",
      "  stable-sort the items by digit d (0–9)",
      "// after the last digit everything is sorted",
    ],
    stats: { passes: "Digit passes" },
    legend: [],
  },
  bucket: {
    code: [
      "make 10 empty buckets: 0–9, 10–19, …, 90–99",
      "for each x in a:  put x into bucket ⌊x / 10⌋",
      "sort each bucket",
      "join the buckets in order",
    ],
    stats: { placed: "Items placed", sorted: "Buckets sorted" },
    legend: [],
  },
};
