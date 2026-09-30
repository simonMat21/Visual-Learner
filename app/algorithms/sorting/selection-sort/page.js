"use client";

import { useState, useEffect } from "react";

import { Slider } from "@/components/ui/slider";
import NumberInput from "@/components/NumberInput";

import { CodeBlock, TextBox } from "@/components/CodeBlock";
import PhoneScreenBlock from "@/components/phoneScreenBlocker";
import AdBanner from "@/components/AdBanner";

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
    <main className="vl-page">
      <PhoneScreenBlock message="Please switch to desktop mode to view this website" />

      {/* Title */}
      <div className="max-w-6xl mx-auto px-8 mb-6">
        <div className="vl-hero">
          <div>
            <h1 className="vl-title text-4xl mb-2">
              Selection Sort
            </h1>
            <div className="vl-meta mt-3">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-pen-rust rounded-full mr-2"></span>
                Time: O(n²)
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-pen-blue rounded-full mr-2"></span>
                Space: O(1)
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-pen-rust rounded-full mr-2"></span>
                Not Stable
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Visualization Section */}
      <div className="max-w-6xl mx-auto px-8 mb-12">
        <div className="vl-card p-6">
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
            How Selection Sort Works
          </h2>
          <div className="space-y-4 text-ink-2 leading-relaxed">
            <p className="text-lg">
              Selection Sort works by repeatedly finding the minimum element
              from the unsorted portion of the array and placing it at the
              beginning. The algorithm divides the array into two parts: a
              sorted portion (initially empty) and an unsorted portion.
            </p>
            <p className="text-lg">The algorithm follows these steps:</p>
            <ul className="list-disc ml-6 space-y-2">
              <li>
                <span className="text-pen-green font-semibold">
                  Find minimum:
                </span>{" "}
                Search for the smallest element in the unsorted portion
              </li>
              <li>
                <span className="text-pen-green font-semibold">Swap:</span>{" "}
                Exchange it with the first element of the unsorted portion
              </li>
              <li>
                <span className="text-pen-green font-semibold">
                  Expand sorted region:
                </span>{" "}
                Move the boundary between sorted and unsorted portions
              </li>
              <li>
                <span className="text-pen-green font-semibold">Repeat:</span>{" "}
                Continue until the entire array is sorted
              </li>
            </ul>
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

        {/* Performance Analysis */}
        <div className="vl-card p-8">
          <h2 className="vl-h2 mb-6">
            Algorithm Analysis
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="vl-note vl-note-green p-6">
              <h3 className="vl-h3 mb-2">
                Time Complexity
              </h3>
              <ul className="text-ink-2 space-y-2">
                <li>
                  • <span className="text-pen-rust font-semibold">Best:</span>{" "}
                  O(n²) - even if already sorted
                </li>
                <li>
                  •{" "}
                  <span className="text-pen-gold font-semibold">
                    Average:
                  </span>{" "}
                  O(n²)
                </li>
                <li>
                  • <span className="text-pen-rust font-semibold">Worst:</span>{" "}
                  O(n²) - reverse sorted
                </li>
                <li>
                  •{" "}
                  <span className="text-pen-blue font-semibold">
                    Comparisons:
                  </span>{" "}
                  Always (n-1) + (n-2) + ... + 1
                </li>
              </ul>
            </div>
            <div className="vl-note vl-note-blue p-6">
              <h3 className="vl-h3 mb-2">
                Key Properties
              </h3>
              <ul className="text-ink-2 space-y-2">
                <li>
                  •{" "}
                  <span className="text-pen-rust font-semibold">
                    Not stable:
                  </span>{" "}
                  relative order not preserved
                </li>
                <li>
                  •{" "}
                  <span className="text-pen-green font-semibold">
                    In-place:
                  </span>{" "}
                  requires only O(1) extra memory
                </li>
                <li>
                  •{" "}
                  <span className="text-pen-rust font-semibold">
                    Not adaptive:
                  </span>{" "}
                  always performs O(n²) comparisons
                </li>
                <li>
                  •{" "}
                  <span className="text-pen-blue font-semibold">
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
          <div className="vl-card p-6">
            <h3 className="vl-h3 mb-4">
               <span>Advantages</span>
            </h3>
            <ul className="text-ink-2 leading-relaxed space-y-2">
              <li>
                • <span className="text-pen-gold">Simple to understand</span>{" "}
                and implement
              </li>
              <li>
                •{" "}
                <span className="text-pen-gold">Minimum number of swaps</span>{" "}
                (at most n-1)
              </li>
              <li>
                • <span className="text-pen-gold">In-place sorting</span> - no
                extra memory needed
              </li>
              <li>
                •{" "}
                <span className="text-pen-gold">Performance independent</span>{" "}
                of input order
              </li>
              <li>
                •{" "}
                <span className="text-pen-gold">Good for small datasets</span>
              </li>
            </ul>
          </div>
          <div className="vl-card p-6">
            <h3 className="vl-h3 mb-4">
               <span>Disadvantages</span>
            </h3>
            <ul className="text-ink-2 leading-relaxed space-y-2">
              <li>
                • <span className="text-pen-rust">O(n²) time complexity</span> in
                all cases
              </li>
              <li>
                • <span className="text-pen-rust">Not stable</span> - changes
                relative order
              </li>
              <li>
                • <span className="text-pen-rust">Not adaptive</span> -
                doesn&apos;t benefit from partial sorting
              </li>
              <li>
                • <span className="text-pen-rust">Poor performance</span> on
                large datasets
              </li>
              <li>
                • <span className="text-pen-rust">More comparisons</span> than
                insertion sort
              </li>
            </ul>
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
