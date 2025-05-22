"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

import NumberInput from "../components/NumberInput";
import P5Sketch_binarySearch from "./P5Sketch_binarySearch";

export default function Home() {
  const [data, setData] = useState([]);
  const [data1, setData1] = useState([]);
  function handleClick() {
    console.log("Button clicked!");
  }
  return (
    <main>
      <h1 className="text-3xl font-bold underline">Algo visuvalizor</h1>
      <NumberInput onSubmit={(arr) => setData(arr)} />
      <NumberInput btnName="Search" onSubmit={(num) => console.log(num[0])} />
      <P5Sketch_binarySearch inputArray={data} />
    </main>
  );
}
