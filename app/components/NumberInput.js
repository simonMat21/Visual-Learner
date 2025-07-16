"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function NumberInput({
  btnName = "button",
  onSubmit,
  valRange = [0, 100],
  lenRange = [5, 10],
}) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState([]);

  function generateRandomArray() {
    const length =
      Math.floor(Math.random() * (lenRange[1] - lenRange[0])) + lenRange[0]; // Random length between 7 and 10
    const array = [];

    for (let i = 0; i < length; i++) {
      const randomNum =
        Math.floor(Math.random() * (valRange[1] - valRange[0])) + valRange[0]; // Random number between 0 and 100
      array.push(randomNum);
    }

    setInput(array.join(", "));
    setOutput(array);
  }

  const handleConvert = () => {
    const arr = input
      .split(",")
      .map((val) => val.trim())
      .filter((val) => val !== "")
      .map((val) => Number(val))
      .filter((num) => !isNaN(num));

    setOutput(arr);
    onSubmit(arr.slice(0, 10).filter((a) => a >= 0 && a <= 100));
  };

  return (
    <div className="max-w-lg flex gap-4 mb-5">
      <Button className="dobtn" onClick={generateRandomArray}>
        RandomArray
      </Button>

      <Input
        placeholder="Enter numbers separated by commas"
        value={input}
        className="inpbox"
        onChange={(e) => setInput(e.target.value)}
      />
      <Button onClick={handleConvert} className="dobtn">
        {btnName}
      </Button>

      {/* <div className="text-muted-foreground">Output: [{output.join(", ")}]</div> */}
    </div>
  );
}
