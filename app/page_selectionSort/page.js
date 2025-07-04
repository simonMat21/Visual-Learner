"use client";

import { useState } from "react";

import NumberInput from "../components/NumberInput";
import P5Sketch_selectionSort from "./P5Sketch_selectionSort";

export default function Home() {
  const [data, setData] = useState([]);
  return (
    <main className="main">
      <h1 className="heading tshad">Algo Visualiser</h1>
      <NumberInput onSubmit={(arr) => setData(arr)} />
      <P5Sketch_selectionSort inputArray={data} />
    </main>
  );
}
