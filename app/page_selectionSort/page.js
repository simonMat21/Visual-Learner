"use client";

import { useState } from "react";

import NumberInput from "../components/NumberInput";
import P5Sketch_selectionSort from "../components/P5Sketch_selectionSort";

export default function Home() {
  const [data, setData] = useState([]);
  return (
    <main>
      <h1 className="text-3xl font-bold underline">Algo visuvalizor</h1>
      <NumberInput onSubmit={(arr) => setData(arr)} />
      <P5Sketch_selectionSort inputArray={data} />
    </main>
  );
}
