"use client";

import { useState } from "react";

import NumberInput from "../components/NumberInput";
import P5Sketch_quickSort from "./P5Sketch_quickSort";

export default function Home() {
  const [data, setData] = useState([]);
  return (
    <main className="main">
      <h1 className="heading tshad">Algo visuvalizor</h1>
      <NumberInput onSubmit={(arr) => setData(arr)} />
      <P5Sketch_quickSort inputArray={data} />
    </main>
  );
}
