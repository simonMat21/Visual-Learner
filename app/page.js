"use client";

import { useState } from "react";

export default function Home() {
  const [data, setData] = useState([]);
  return (
    <main>
      <h1 className="text-3xl font-bold underline">Algo visuvalizor</h1>
      <a href="/page_bubbleSort">bubbleSort</a>
      <br></br>
      <a href="/page_selectionSort">selectionSort</a>
      <br></br>
      <a href="/page_insertionSort">insertionSort</a>
      <br></br>
      <a href="/page_mergeSort">mergeSort</a>
      <br></br>
      <a href="/page_quickSort">quick sort</a>
      <br></br>
      <a href="/page_binarySearch">binary Search</a>
      <br></br>
      <a href="/page_animation_test">animation test</a>
    </main>
  );
}
