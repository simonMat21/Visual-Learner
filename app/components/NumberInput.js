"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function NumberInput() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState([]);

  const handleConvert = () => {
    const arr = input
      .split(",")
      .map((val) => val.trim())
      .filter((val) => val !== "")
      .map((val) => Number(val))
      .filter((num) => !isNaN(num));

    setOutput(arr);
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <Input
        placeholder="Enter numbers separated by commas"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <Button onClick={handleConvert}>Convert to Array</Button>
      <div className="text-muted-foreground">Output: [{output.join(", ")}]</div>
    </div>
  );
}
