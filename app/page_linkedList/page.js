"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import NumberInput from "../components/NumberInput";
import P5Sketch_linkedLise from "./P5Sketch_linkedList";

export default function Home() {
  const [data, setData] = useState([]);
  const [searchElem, setSearchElem] = useState();
  const [startBool, setStartBool] = useState(false);
  function handleClick(arr) {
    setData(arr);
    console.log("Button clicked!");
  }
  return (
    <main>
      <h1 className="text-3xl font-bold underline">Algo visuvalizor</h1>
      <NumberInput onSubmit={(arr) => handleClick(arr)} />
      <Input
        className="w-lg"
        placeholder="Enter number to search"
        value={searchElem}
        onChange={(e) => setSearchElem(Number(e.target.value))}
      />
      <Button
        onClick={() => setStartBool(true)}
        className="bg-blue-600 w-30 text-white px-4 py-2 rounded-xl border border-white hover:bg-blue-700 transition duration-200 shadow-md"
      >
        search
      </Button>
      <P5Sketch_linkedLise
        inputArray={data}
        searchElement={searchElem}
        startBool={startBool}
      />
    </main>
  );
}
