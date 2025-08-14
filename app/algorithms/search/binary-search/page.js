"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { CodeBlock } from "@/components/CodeBlock";
import PhoneScreenBlock from "@/components/phoneScreenBlocker";

import NumberInput from "@/components/NumberInput";

import P5Sketch from "./P5Sketch";

export default function Home() {
  const [AEBool, setAEBool] = useState(true);
  const [addForm, setAddForm] = useState({ val: [], pos: 0, start: false });
  const [searchForm, setSearchForm] = useState({ val: 0, start: false });
  const [animSpd, setAnimSpd] = useState(1);

  const codeSnippets = {
    c: `int binarySearch(int arr[], int n, int target) {
  int high = n -1;
  int low = 0;
  while (high >= low) {
    mid = low + (high - low) / 2;
    if (arr[mid] == target) return mid;

    if (target > arr[mid])  low = mid + 1;
    else  high = mid - 1;
  }

  return -1;
}`,
  js: `function binarySearch(arr, target) {
  let high = arr.length;
  let low = 0;
  while (high >= low) {
    let mid = low + (high - low) / 2;
    if (arr[mid] === target) return mid;

    if (target > arr[mid])  low = mid + 1;
    else  high = mid - 1;
  }
  return -1;
}
`,
  py: `def binarySearch(arr: list[int], target: int) -> int:
  high: int = len(arr)
  low: int = 0;
  while high >= low:
    mid: int = low + (high - low) // 2;
    if arr[mid] == target:  return mid

    if target > arr[mid]: low = mid + 1;
    else  high = mid - 1;
  return -1`,
  cpp: `int binarySearch(std::vector<int>& arr, int target) {
  int high = arr.size();
  int low = 0;
  while (high >= low) {
    int mid = low + (high - low) / 2;
    if (arr[mid] == target) return mid;

    if (target > arr[mid])  low = mid + 1;
    else  high = mid - 1;
  }
  return -1;
}`,
  idea: `The idea is to shrik the search area on each iteration. Requires a sorted array.
(Note:Assuming we use an array in ascending order)
Repeat log₂(n) times:
  1) calculate the middle element.
  2) case A: middle element is target => we return the index.
     case B: target > mid element => we search the upper (or right) part of the array
     case C: target < mid element => we search the lower (or left) part of the array`
  };

  const updateForm = (n, key, value) => {
  if (key !== "start" || AEBool) {
    if (n == 1) {
    setAddForm((prev) => ({ ...prev, [key]: value }));
    } else if (n == 2) {
    setSearchForm((prev) => ({ ...prev, [key]: value }));
    }
  }
  };
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white pt-5">
      <PhoneScreenBlock message="Please switch to desktop mode to view this website" />
      <div className="max-w-6xl mx-auto px-8 mb-12">
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
          <div key={1} className="flex justify-center gap-4 mb-4 rounded-5">
            <Input
              className="inpbox"
              placeholder="Enter number to search"
              onChange={(e) => updateForm(2, "val", Number(e.target.value))}
            />
            <Button
              onClick={() => {
              updateForm(2, "start", true);
              setTimeout(() => updateForm(2, "start", false), 10);
              }}
              className="dobtn"
            > search
            </Button>
          </div>
          <div className="flex flex-col items-center space-y-6">
            <NumberInput
              onSubmit={(arr) => {
              updateForm(1, "val", arr);
              updateForm(1, "start", true);
              setTimeout(() => updateForm(1, "start", false), 10);
              }}
            />
            <div className="flex items-center space-x-4">
              <span className="text-gray-300 text-sm">Speed:</span>
              <Slider
                defaultValue={[1]}
                min={0.5}
                max={1.5}
                step={0.01}
                onValueChange={([val]) => setAnimSpd(2 - val)}
                className="w-64 h-6"
              />
            </div>
          </div>
          <P5Sketch
            add={addForm}
            srch={searchForm}
            animSpd={animSpd}
            actionExicutable={(b) => setAEBool(b)}
          />
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-8 space-y-8">
        {/* Algorithm Info */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent mb-2">
              Binary Search
            </h1>
            <div className="inline-flex items-center space-x-4 text-sm bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-full px-4 py-2 mt-3 border border-green-400/30">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                Time: O(log(n))
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                Space: O(1)
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-blue-300 mb-4 flex items-center">
            <span className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3 text-sm">
              💡
            </span>
            How It Works
          </h2>
          <div className="space-y-4 text-gray-300 leading-relaxed">
            <p className="text-lg">
              This search algorithm repeatedly reduces the search are by half on each iteration.
              Binary search only works on a sorted list. It repeats this process{" "}
              <span className="text-orange-400 font-semibold">log₂(n)</span> times when the
              target doesn&apos;t exist or if the target is the first or last element.
            </p>
            <p className="text-lg">
              It&apos;s called{" "}
              <span className="text-purple-400 font-semibold">
                &quot;Binary&quot;
              </span>{" "}
              search because the algorithm repeatedly divides the search area into two (uses binary decision) at each step.
            </p>
          </div>
        </div>

        {/* Code Block */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-green-300 mb-6 flex items-center">
            <span className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3 text-sm">
              💻
            </span>
            Implementation
          </h2>
          <CodeBlock
            codeSnippets={codeSnippets}
            defaultLang="js"
            height="500px"
          />
        </div>

        {/* Detailed Explanation */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-purple-300 mb-6 flex items-center">
            <span className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-3 text-sm">
              🔍
            </span>
            Deeper Look
          </h2>
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-6">
              <p className="text-gray-300 text-lg leading-relaxed">
                Binary Search is a fast searching algorithm that works on a sorted array
                by repeatedly dividing the search space in half to locate a target value.
                Starting with the middle element, the algorithm compares this element with the 
                target: if they match, the search ends; if the target is smaller, the search
                continues in the left half; if larger, in the right half.
                This halving process is repeated until the target is found or the search space is empty.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed">
                It is most suited for searching in large datasets instead of linear search.
              </p>
            </div>
          </div>
        </div>

        {/* Fun Facts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-yellow-300 mb-4 flex items-center">
              🧪 <span className="ml-2">Constrained but effective</span>
            </h3>
            <p className="text-gray-300 leading-relaxed">
              Since binary search requires a sorted array, we may need to sort the dataset before searching.
              In exchange for some extra steps, it overtakes linear search by time taken.
              Perfect for large datasets.
            </p>
          </div>

          <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-cyan-300 mb-4 flex items-center">
              🧙‍♂️ <span className="ml-2">Variants in Practice</span>
            </h3>
            <p className="text-gray-300 leading-relaxed">
              Binary Search is good for even large datasets but there exists variants like{" "}
              <span className="text-cyan-400 font-semibold">
                Ternery search
              </span>{" "} which divides by 3 and{" "}
              <span className="text-cyan-400 font-semibold">
                Exponential Search
              </span>{" "}
              which scans exponentially and uses binary search in a found range (useful for unbounded arrays).
            </p>
          </div>
        </div>

        {/* Bottom Spacer */}
        <div className="h-12"></div>
      </div>
      
  </main>
  );
}
