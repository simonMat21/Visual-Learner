"use client";

import React from "react";
import { useReducer } from "react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

import NumberInput from "../components/NumberInput";
import P5Sketch_binarySearch from "./P5Sketch_binarySearch";

export default function Home() {
  const [data, setData] = useState([]);
  const [searchElem, setSearchElem] = useState();
  const [startBool, setStartBool] = useState(false);
  function handleClick(arr) {
    setData(arr);
  }
  const [animSpd, setAnimSpd] = useState(1);

  return (
    <main className="flex flex-col items-center min-h-screen px-4">
      <h1 className="text-6xl font-bold mb-6 mt-4 text-red-600 text-shadow">
        Algo visuvalizor
      </h1>
      <div className="flex justify-center items-start  px-6 mt-6">
        <NumberInput onSubmit={(arr) => handleClick(arr)} />
        <Input
          className="w-65 bg-black text-red-600 rounded-2xl placeholder:text-white placeholder:opacity-20 ml-[200px]"
          placeholder="Enter number to search"
          value={searchElem}
          onChange={(e) => setSearchElem(Number(e.target.value))}
        />
        <Button
          onClick={() => setStartBool(true)}
          className="bg-black w-30 text-[#e5e695] rounded-2xl border
               hover:bg-black hover:bg-opacity-60 hover:cursor-pointer transition-transform duration-200 shadow-md ml-3 hover:scale-105"
        >
          search
        </Button>
      </div>
      <Slider
        defaultValue={[1]}
        min={0.5}
        max={1.5}
        step={0.01}
        onValueChange={([val]) => setAnimSpd(val)}
        className="w-64 h-6 "
      />
      <P5Sketch_binarySearch
        animSpd={animSpd}
        inputArray={data}
        searchElement={searchElem}
        startBool={startBool}
      />
    </main>
  );
}
