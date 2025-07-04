"use client";

import { useState } from "react";

import P5Sketch_bubbleSort from "./P5Sketch_bubbleSort";
import NumberInput from "../components/NumberInput";

export default function Home() {
  const [data, setData] = useState([]);
  return (
    <main className="main">
      <h1 className="heading tshad">Algo Visualiser</h1>
      <NumberInput onSubmit={(arr) => setData(arr)} />
      <P5Sketch_bubbleSort inputArray={data} />
    </main>
  );
}
