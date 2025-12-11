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
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white pt-5">
      <PhoneScreenBlock message="Please switch to desktop mode to view this website" />
      <div className="max-w-6xl mx-auto px-8 mb-12">
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-4 mt-4">
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
              className="w-64 h-6 "
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
        {/* Algorithm Info */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent mb-2">
              Linear Search
            </h1>
            <div className="inline-flex items-center space-x-4 text-sm bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-full px-4 py-2 mt-3 border border-green-400/30">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                Time: O(n)
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
              This search algorithm iterates through the array, comparing each
              element in the array with the target value. If equals, it stops
              and returns the corresponding index.
            </p>
            <p className="text-lg">
              It&apos;s called{" "}
              <span className="text-purple-400 font-semibold">
                &quot;linear&quot;
              </span>{" "}
              search because it moves through the array in a straight line — one
              element at a time — until it finds the target, much like flipping
              through pages of a book one by one.
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
          <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-yellow-300 mb-4 flex items-center">
              🔍 <span className="ml-2">Always Works</span>
            </h3>
            <p className="text-gray-300 leading-relaxed">
              Linear Search is one of the few algorithms which works on any
              dataset, whether the data is sorted or unsorted, or numerical or
              textual. So it is much more of a reliable option when quick setup
              matters more than speed.
            </p>
          </div>

          <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-cyan-300 mb-4 flex items-center">
              🧙‍♂️ <span className="ml-2">Variants in Practice</span>
            </h3>
            <p className="text-gray-300 leading-relaxed">
              Variants like{" "}
              <span className="text-cyan-400 font-semibold">
                Sentinel Linear Search
              </span>{" "}
              reduce the number of comparisons slightly, while{" "}
              <span className="text-cyan-400 font-semibold">
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
