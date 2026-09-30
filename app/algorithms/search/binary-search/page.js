"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { CodeBlock } from "@/components/CodeBlock";
import PhoneScreenBlock from "@/components/phoneScreenBlocker";
import AdBanner from "@/components/AdBanner";

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
     case C: target < mid element => we search the lower (or left) part of the array`,
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
    <main className="vl-page">
      <PhoneScreenBlock message="Please switch to desktop mode to view this website" />

      {/* Title */}
      <div className="max-w-6xl mx-auto px-8 mb-6">
        <div className="vl-hero">
          <div>
            <h1 className="vl-title text-4xl mb-2">
              Binary Search
            </h1>
            <div className="vl-meta mt-3">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-pen-rust rounded-full mr-2"></span>
                Time: O(log(n))
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-pen-blue rounded-full mr-2"></span>
                Space: O(1)
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 mb-12">
        <div className="vl-card p-6">
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
            >
              {" "}
              search
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
              <span className="text-ink-2 text-sm">Speed:</span>
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
        <AdBanner position="bottom" size="responsive" adTest="off" />

        {/* Description */}
        <div className="vl-card p-8">
          <h2 className="vl-h2 mb-4">
            How It Works
          </h2>
          <div className="space-y-4 text-ink-2 leading-relaxed">
            <p className="text-lg">
              This search algorithm repeatedly reduces the search area by half on
              each iteration. Binary search only works on a sorted list. It
              repeats this process{" "}
              <span className="text-pen-rust font-semibold">log₂(n)</span>{" "}
              times when the target doesn&apos;t exist or if the target is the
              first or last element.
            </p>
            <p className="text-lg">
              It&apos;s called{" "}
              <span className="text-pen-plum font-semibold">
                &quot;Binary&quot;
              </span>{" "}
              search because the algorithm repeatedly divides the search area
              into two (uses binary decision) at each step.
            </p>
          </div>
        </div>

        {/* Code Block */}
        <div className="vl-card p-8">
          <h2 className="vl-h2 mb-6">
            Implementation
          </h2>
          <CodeBlock
            codeSnippets={codeSnippets}
            defaultLang="js"
            height="500px"
          />
        </div>

        {/* Detailed Explanation */}
        <div className="vl-card p-8">
          <h2 className="vl-h2 mb-6">
            Deeper Look
          </h2>
          <div className="space-y-6">
            <div className="vl-note vl-note-plum p-6">
              <p className="text-ink-2 text-lg leading-relaxed">
                Binary Search is a fast searching algorithm that works on a
                sorted array by repeatedly dividing the search space in half to
                locate a target value. Starting with the middle element, the
                algorithm compares this element with the target: if they match,
                the search ends; if the target is smaller, the search continues
                in the left half; if larger, in the right half. This halving
                process is repeated until the target is found or the search
                space is empty.
              </p>
              <p className="text-ink-2 text-lg leading-relaxed">
                It is most suited for searching in large datasets instead of
                linear search.
              </p>
            </div>
          </div>
        </div>

        {/* Fun Facts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="vl-card p-6">
            <h3 className="vl-h3 mb-4">
               <span>Constrained but effective</span>
            </h3>
            <p className="text-ink-2 leading-relaxed">
              Since binary search requires a sorted array, we may need to sort
              the dataset before searching. In exchange for some extra steps, it
              overtakes linear search by time taken. Perfect for large datasets.
            </p>
          </div>

          <div className="vl-card p-6">
            <h3 className="vl-h3 mb-4">
               <span>Variants in Practice</span>
            </h3>
            <p className="text-ink-2 leading-relaxed">
              Binary Search is good for even large datasets but there exists
              variants like{" "}
              <span className="text-pen-blue font-semibold">
                Ternery search
              </span>{" "}
              which divides by 3 and{" "}
              <span className="text-pen-blue font-semibold">
                Exponential Search
              </span>{" "}
              which scans exponentially and uses binary search in a found range
              (useful for unbounded arrays).
            </p>
          </div>
        </div>

        {/* Bottom Banner Ad */}
        <AdBanner
          position="bottom"
          size="responsive"
          adTest="off"
          adSlot="9575932649"
        />

        {/* Bottom Spacer */}
        <div className="h-12"></div>
      </div>
    </main>
  );
}
