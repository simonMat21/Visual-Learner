"use client";

import { useState } from "react";

import { Slider } from "@/components/ui/slider";
import NumberInput from "../components/NumberInput";

import CodeBlock from "../components/CodeBlock";
import P5Sketch from "./P5Sketch";

export default function Home() {
  const [AEBool, setAEBool] = useState(true);
  const [addForm, setAddForm] = useState({ val: [], pos: 0, start: false });
  const [animSpd, setAnimSpd] = useState(1);

  const codeSnippets = {
    javascript: `function greet(name) {
  return "Hello, " + name;
}`,
    python: `def greet(name):
    return "Hello, " + name`,
    cpp: `std::string greet(std::string name) {
    return "Hello, " + name;
}`,
  };
  const updateForm = (n, key, value) => {
    if (key !== "start" || AEBool) {
      if (n == 1) {
        setAddForm((prev) => ({ ...prev, [key]: value }));
      }
    }
  };
  return (
    <main className="main">
      <h1 className="heading tshad">Algo visuvalizor</h1>
      <NumberInput
        onSubmit={(arr) => {
          updateForm(1, "val", arr);
          updateForm(1, "start", true);
          setTimeout(() => updateForm(1, "start", false), 10);
        }}
      />
      <Slider
        defaultValue={[1]}
        min={0.5}
        max={1.5}
        step={0.01}
        onValueChange={([val]) => setAnimSpd(val)}
        className="w-64 h-6 "
      />
      <P5Sketch
        add={addForm}
        animSpd={animSpd}
        actionExicutable={(b) => setAEBool(b)}
      />
      <CodeBlock codeSnippets={codeSnippets} defaultLang="javascript" />
    </main>
  );
}
