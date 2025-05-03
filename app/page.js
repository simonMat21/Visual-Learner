"use client";

import { useState } from "react";

import P5Sketch_bubbleSort from "./components/P5Sketch_bubbleSort";
import P5Sketch_selctionSort from "./components/P5Sketch_selectionSort";
import P5Sketch_insertionSort from "./components/P5Sketch_insertionSort";
import NumberInput from "./components/NumberInput";

export default function Home() {
  const [data, setData] = useState([]);
  return (
    <main>
      <h1 className="text-3xl font-bold underline">Algo visuvalizor</h1>
      <NumberInput onSubmit={(arr) => setData(arr)} />
      <P5Sketch_insertionSort inputArray={data} />
    </main>
  );
}
