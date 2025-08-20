"use client";

import { useState, useEffect } from "react";

import { Slider } from "@/components/ui/slider";
import NumberInput from "@/components/NumberInput";

import { CodeBlock, TextBox } from "@/components/CodeBlock";
import PhoneScreenBlock from "@/components/phoneScreenBlocker";

import P5Sketch from "./P5Sketch";

export default function Home() {
  const [AEBool, setAEBool] = useState(true);
  const [addForm, setAddForm] = useState({ val: [], pos: 0, start: false });
  const [animSpd, setAnimSpd] = useState(1);

  const codeSnippets = {
    c: `void selectionSort(int arr[], int n) {
  for (int i = 0; i < n - 1; i++) {
    int min_idx = i;
    
    for (int j = i + 1; j < n; j++) {
      if (arr[j] < arr[min_idx])
        min_idx = j;
    }
    
    // Swap the found minimum element with the first element
    int temp = arr[min_idx];
    arr[min_idx] = arr[i];
    arr[i] = temp;
  }
}
`,
    js: `function selectionSort(arr) {
  let n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }

    // Swap the found minimum element with the first element
    [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
  }
  return arr;
}
`,
    py: `def selection_sort(arr):
  n = len(arr)
  for i in range(n - 1):
    min_idx = i
    
    for j in range(i + 1, n):
      if arr[j] < arr[min_idx]:
        min_idx = j
    
    // Swap the found minimum element with the first element
    arr[i], arr[min_idx] = arr[min_idx], arr[i]
`,
    cpp: `void selectionSort(std::vector<int>& arr) {
  int n = arr.size();
  for (int i = 0; i < n - 1; ++i) {
    int min_idx = i;
    
    for (int j = i + 1; j < n; ++j) {
      if (arr[j] < arr[min_idx])
        min_idx = j;
    }
    
    // Swap the found minimum element with the first element
    std::swap(arr[i], arr[min_idx]);
  }
}
`,
    idea: `Repeat n times:
  Find the minimum element in the unsorted part
  Swap it with the first unsorted element
  Move the boundary of the sorted part one step forward
`,
  };

  const updateForm = (n, key, value) => {
    if (key !== "start" || AEBool) {
      if (n == 1) {
        setAddForm((prev) => ({ ...prev, [key]: value }));
      }
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 50, behavior: "smooth" }); // or 'auto'
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white pt-5">
      <PhoneScreenBlock message="Please switch to desktop mode to view this website" />

      {/* Visualization Section */}
      <div className="max-w-6xl mx-auto px-8 mb-12">
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
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
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent mb-2">
              Selection Sort
            </h1>
            <div className="inline-flex items-center space-x-4 text-sm bg-gradient-to-r from-green-400/20 to-teal-400/20 rounded-full px-4 py-2 mt-3 border border-green-400/30">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                Time: O(n²)
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                Space: O(1)
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                Not Stable
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-green-300 mb-4 flex items-center">
            <span className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3 text-sm">
              🎯
            </span>
            How Selection Sort Works
          </h2>
          <div className="space-y-4 text-gray-300 leading-relaxed">
            <p className="text-lg">
              Selection Sort works by repeatedly finding the minimum element
              from the unsorted portion of the array and placing it at the
              beginning. The algorithm divides the array into two parts: a
              sorted portion (initially empty) and an unsorted portion.
            </p>
            <p className="text-lg">The algorithm follows these steps:</p>
            <ul className="list-disc ml-6 space-y-2">
              <li>
                <span className="text-green-400 font-semibold">
                  Find minimum:
                </span>{" "}
                Search for the smallest element in the unsorted portion
              </li>
              <li>
                <span className="text-green-400 font-semibold">Swap:</span>{" "}
                Exchange it with the first element of the unsorted portion
              </li>
              <li>
                <span className="text-green-400 font-semibold">
                  Expand sorted region:
                </span>{" "}
                Move the boundary between sorted and unsorted portions
              </li>
              <li>
                <span className="text-green-400 font-semibold">Repeat:</span>{" "}
                Continue until the entire array is sorted
              </li>
            </ul>
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

        {/* Performance Analysis */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-blue-300 mb-6 flex items-center">
            <span className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3 text-sm">
              📊
            </span>
            Algorithm Analysis
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-green-500/10 to-teal-500/10 border border-green-500/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-300 mb-2">
                Time Complexity
              </h3>
              <ul className="text-gray-300 space-y-2">
                <li>
                  • <span className="text-red-400 font-semibold">Best:</span>{" "}
                  O(n²) - even if already sorted
                </li>
                <li>
                  •{" "}
                  <span className="text-yellow-400 font-semibold">
                    Average:
                  </span>{" "}
                  O(n²)
                </li>
                <li>
                  • <span className="text-red-400 font-semibold">Worst:</span>{" "}
                  O(n²) - reverse sorted
                </li>
                <li>
                  •{" "}
                  <span className="text-blue-400 font-semibold">
                    Comparisons:
                  </span>{" "}
                  Always (n-1) + (n-2) + ... + 1
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-300 mb-2">
                Key Properties
              </h3>
              <ul className="text-gray-300 space-y-2">
                <li>
                  •{" "}
                  <span className="text-red-400 font-semibold">
                    Not stable:
                  </span>{" "}
                  relative order not preserved
                </li>
                <li>
                  •{" "}
                  <span className="text-green-400 font-semibold">
                    In-place:
                  </span>{" "}
                  requires only O(1) extra memory
                </li>
                <li>
                  •{" "}
                  <span className="text-orange-400 font-semibold">
                    Not adaptive:
                  </span>{" "}
                  always performs O(n²) comparisons
                </li>
                <li>
                  •{" "}
                  <span className="text-blue-400 font-semibold">
                    Minimum swaps:
                  </span>{" "}
                  at most n-1 swaps
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Comparisons & Use Cases */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-amber-300 mb-4 flex items-center">
              🏆 <span className="ml-2">Advantages</span>
            </h3>
            <ul className="text-gray-300 leading-relaxed space-y-2">
              <li>
                • <span className="text-amber-400">Simple to understand</span>{" "}
                and implement
              </li>
              <li>
                •{" "}
                <span className="text-amber-400">Minimum number of swaps</span>{" "}
                (at most n-1)
              </li>
              <li>
                • <span className="text-amber-400">In-place sorting</span> - no
                extra memory needed
              </li>
              <li>
                •{" "}
                <span className="text-amber-400">Performance independent</span>{" "}
                of input order
              </li>
              <li>
                •{" "}
                <span className="text-amber-400">Good for small datasets</span>
              </li>
            </ul>
          </div>
          <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-red-300 mb-4 flex items-center">
              ⚠️ <span className="ml-2">Disadvantages</span>
            </h3>
            <ul className="text-gray-300 leading-relaxed space-y-2">
              <li>
                • <span className="text-red-400">O(n²) time complexity</span> in
                all cases
              </li>
              <li>
                • <span className="text-red-400">Not stable</span> - changes
                relative order
              </li>
              <li>
                • <span className="text-red-400">Not adaptive</span> -
                doesn&apos;t benefit from partial sorting
              </li>
              <li>
                • <span className="text-red-400">Poor performance</span> on
                large datasets
              </li>
              <li>
                • <span className="text-red-400">More comparisons</span> than
                insertion sort
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Spacer */}
        <div className="h-12"></div>
      </div>
    </main>
  );
}
