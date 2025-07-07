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
    <main className="main">
      <h1 className="heading tshad">Algo Visualiser</h1>
      <div className="flex justify-center items-start  px-6 mt-2 gap-48">
        <NumberInput onSubmit={(arr) => handleClick(arr)} />
        <div className="flex">
          <Input
            className="inpbox"
            placeholder="Enter number to search"
            value={searchElem}
            onChange={(e) => setSearchElem(Number(e.target.value))}
          />
          <Button onClick={() => setStartBool(true)} className="dobtn">
            search
          </Button>
        </div>
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
