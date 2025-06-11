"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import NumberInput from "../components/NumberInput";
import P5Sketch_mergeSort from "./P5Sketch_testPage";

export default function Home() {
  const [data, setData] = useState([]);
  const [searchElem, setSearchElem] = useState();
  const [searchPos, setSearchPos] = useState();
  const [startBool, setStartBool] = useState(false);
  let arr = [];
  return (
    <main>
      <h1 className="text-3xl font-bold underline">Algo visuvalizor</h1>
      <NumberInput onSubmit={(arr) => setData(arr)} />
      <Input
        className="w-lg"
        placeholder="Enter number to search"
        value={searchElem}
        onChange={(e) => setSearchElem(Number(e.target.value))}
      />
      <Input
        className="w-lg"
        placeholder="Enter position"
        value={searchPos}
        onChange={(e) => setSearchPos(Number(e.target.value))}
      />
      <Button
        onClick={() => {
          setStartBool(true);
          setTimeout(() => setStartBool(false), 10);
        }}
        className="bg-blue-600 w-30 text-white px-4 py-2 rounded-xl border border-white hover:bg-blue-700 transition duration-200 shadow-md"
      >
        add
      </Button>
      <P5Sketch_mergeSort
        inputArray={data}
        add={{ add: startBool, val: searchElem, pos: searchPos }}
      />
    </main>
  );
}
