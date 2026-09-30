"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

import NumberInput from "@/components/NumberInput";
import PhoneScreenBlock from "@/components/phoneScreenBlocker";
import { CodeBlock } from "@/components/CodeBlock";
import AdBanner from "@/components/AdBanner";

import P5Sketch from "./P5Sketch";

export default function Home() {
  const [AEBool, setAEBool] = useState(true);
  const [addForm, setAddForm] = useState({ val: [], pos: 0, start: false });
  const [searchForm, setSearchForm] = useState({ val: 0, start: false });
  const [animSpd, setAnimSpd] = useState(1);

  const updateForm = (n, key, value) => {
    if (key !== "start" || AEBool) {
      if (n == 1) {
        setAddForm((prev) => ({ ...prev, [key]: value }));
      } else if (n == 2) {
        setSearchForm((prev) => ({ ...prev, [key]: value }));
      }
    }
  };

  const codeSnippets = {
    c: `int linearSearch(int arr[], int n, int target) {
      for (int i = 0; i < n; i++) {
          if (arr[i] == target)
              return i; // Found at index i
      }
      return -1; // Not found
  }`,
    js: `function linearSearch(arr, target) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === target) return i; // Found
    }
    return -1; // Not found
  }`,
    py: `def linear_search(arr, target):
      for i in range(len(arr)):
          if arr[i] == target:
              return i  # Found
      return -1  # Not found`,
    cpp: `int linearSearch(const std::vector<int>& arr, int target) {
      for (int i = 0; i < arr.size(); ++i) {
          if (arr[i] == target)
              return i; // Found
      }
      return -1; // Not found
  }`,
    idea: `# Loop through each element in the list
      if current element == target:
          return index
      else:
          continue to next

  or

  Repeat for each item in the list:
      Compare item with target
      If equal, return its position
  If no match found, return -1`,
  };

  return (
    <main className="vl-page">
      <PhoneScreenBlock message="Please switch to desktop mode to view this website" />

      {/* Title */}
      <div className="max-w-6xl mx-auto px-8 mb-6">
        <div className="vl-hero">
          <div>
            <h1 className="vl-title text-4xl mb-2">
              Linear Search
            </h1>
            <div className="vl-meta mt-3">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-pen-rust rounded-full mr-2"></span>
                Time: O(n)
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
        <div className="vl-card p-4 mt-4">
          <div className="flex flex-col items-center">
            <div className="flex gap-12">
              <NumberInput
                onSubmit={(arr) => {
                  updateForm(1, "val", arr);
                  updateForm(1, "start", true);
                  setTimeout(() => updateForm(1, "start", false), 10);
                }}
              />
              <div key={1} className="flex items-center gap-2 mb-5 rounded-5">
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
              className="w-64 h-6"
            />
          </div>
          <P5Sketch
            add={addForm}
            srch={searchForm}
            animSpd={animSpd}
            actionExicutable={(b) => setAEBool(b)}
          />
        </div>
      </div>
      {/*Contents*/}
      <div className="max-w-6xl mx-auto px-8 space-y-8">
        <AdBanner position="bottom" size="responsive" adTest="off" />

        {/* Description */}
        <div className="vl-card p-8">
          <h2 className="vl-h2 mb-4">
            How It Works
          </h2>
          <div className="space-y-4 text-ink-2 leading-relaxed">
            <p className="text-lg">
              This search algorithm iterates through the array, comparing each
              element in the array with the target value. If equals, it stops
              and returns the corresponding index.
            </p>
            <p className="text-lg">
              It&apos;s called{" "}
              <span className="text-pen-plum font-semibold">
                &quot;linear&quot;
              </span>{" "}
              search because it moves through the array in a straight line — one
              element at a time — until it finds the target, much like flipping
              through pages of a book one by one.
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
                Linear Search checks every element in the array one by one from
                the beginning, and stops when it finds a match. The array is not
                required to be sorted, making it useful to find a value in raw
                data. But the speed of this search is very slow, especially for
                large arrays, but it shines in situations where minimal overhead
                and universal applicability are key.
              </p>
            </div>
          </div>
        </div>

        {/* Fun Facts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="vl-card p-6">
            <h3 className="vl-h3 mb-4">
               <span>Always Works</span>
            </h3>
            <p className="text-ink-2 leading-relaxed">
              Linear Search is one of the few algorithms which works on any
              dataset, whether the data is sorted or unsorted, or numerical or
              textual. So it is much more of a reliable option when quick setup
              matters more than speed.
            </p>
          </div>

          <div className="vl-card p-6">
            <h3 className="vl-h3 mb-4">
               <span>Variants in Practice</span>
            </h3>
            <p className="text-ink-2 leading-relaxed">
              Variants like{" "}
              <span className="text-pen-blue font-semibold">
                Sentinel Linear Search
              </span>{" "}
              reduce the number of comparisons slightly, while{" "}
              <span className="text-pen-blue font-semibold">
                Recursive Linear Search
              </span>{" "}
              offers a functional approach in languages that support recursion.
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
