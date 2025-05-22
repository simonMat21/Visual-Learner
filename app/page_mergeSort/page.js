"use client";

import { useState } from "react";

import NumberInput from "../components/NumberInput";
import P5Sketch_mergeSort from "./P5Sketch_mergeSort";

export default function Home() {
  const [data, setData] = useState([]);
  return (
    <main>
      <h1 className="text-3xl font-bold underline">Algo visuvalizor</h1>
      <NumberInput onSubmit={(arr) => setData(arr)} />
      <P5Sketch_mergeSort inputArray={data} />
    </main>
  );
}
