"use client";

import { useState } from "react";

import { Slider } from "@/components/ui/slider";
import NumberInput from "../components/NumberInput";

import { CodeBlock, TextBox } from "../components/CodeBlock";
import PhoneScreenBlock from "../components/phoneScreenBlocker";

import P5Sketch from "./P5Sketch";

export default function Home() {
  const [AEBool, setAEBool] = useState(true);
  const [addForm, setAddForm] = useState({ val: [], pos: 0, start: false });
  const [animSpd, setAnimSpd] = useState(1);

  const codeSnippets = {
    js: `function bubbleSort(arr) {
  let n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        // swap
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }
    if (!swapped) break;
  }
  return arr;
}
`,
    py: `def greet(name):
    return "Hello, " + name`,
    cpp: `std::string greet(std::string name) {
    return "Hello, " + name;
}`,
    idea: `# first loop with i as element
    # second loop with j as element
        if j>i:
            swap their postions
            
or

Repeat n times:
    Compare each pair of adjacent items
    Swap them if they are in the wrong order`,
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
      <PhoneScreenBlock message="Please switch to desktop mode to view this website" />
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
      <h1>Bubble Sort </h1>
      <h1>Time comlexity O(n), space complexity O(n) stable</h1>
      <p>
        This sorting algorithm compares the adjacent elements and sort them if
        they are in the wrong order. It repeats this process n<sup>2</sup> times
        for the array to be sorted
      </p>
      <p>
        It's called "bubble" sort because smaller elements slowly "bubble up" to
        the top (beginning) of the array with each pass, like bubbles rising in
        water.
      </p>
      <CodeBlock codeSnippets={codeSnippets} defaultLang="js" height="500px" />
      {/* <TextBox code="[1,2,3,4]"></TextBox> */}
      <p>
        If you take a boarder look, it is like taking the biggest one and
        placing it at the end of the array and repeats this process till it is
        sorted.Bubble Sort is a stable sort, meaning that elements with equal
        values maintain their relative order after sorting — important for
        multi-level sorting (like sorting by grade, then by name).
      </p>
      <br></br>
      <h2>🧪 It’s a Good Stress Test</h2>
      <p>
        Bubble Sort is sometimes used in embedded or very low-level testing as a
        "canary" algorithm to validate a basic sorting function.
      </p>
      <br></br>
      <h2>🧙‍♂️ Not Used in Practice — But Variants Are!</h2>
      <p>
        Bubble Sort is too slow for large datasets. But variants like Cocktail
        Shaker Sort (a bidirectional version of Bubble Sort) are more efficient
        in some situations.
      </p>
    </main>
  );
}
