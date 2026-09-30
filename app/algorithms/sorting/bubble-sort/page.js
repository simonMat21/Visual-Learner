"use client";

import { useState, useEffect } from "react";

import { Slider } from "@/components/ui/slider";
import NumberInput from "@/components/NumberInput";

import { CodeBlock, TextBox } from "@/components/CodeBlock";
import PhoneScreenBlock from "@/components/phoneScreenBlocker";
import AdSense from "@/components/AdSense";
import AdBanner from "@/components/AdBanner";

import P5Sketch from "./P5Sketch";

export default function Home() {
  const [AEBool, setAEBool] = useState(true);
  const [addForm, setAddForm] = useState({ val: [], pos: 0, start: false });
  const [animSpd, setAnimSpd] = useState(1);

  const codeSnippets = {
    c: `void bubbleSort(int arr[], int n) {
  for (int i = 0; i < n - 1; i++) {
    // Optimization: Track if any swap was made
    int swapped = 0; 
    
    for (int j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        // Swap
        int temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        swapped = 1;
      }
    }

    if (!swapped) break; // If no swaps were made, the array is sorted
  }
}`,
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
    py: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        swapped = False
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        if not swapped:
            break`,
    cpp: `void bubbleSort(std::vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; ++i) {
        bool swapped = false;
        for (int j = 0; j < n - i - 1; ++j) {
            if (arr[j] > arr[j + 1]) {
                std::swap(arr[j], arr[j + 1]);
                swapped = true;
            }
        }
        if (!swapped) break;
    }
}`,
    idea: `Repeat n times:
  Compare each pair of adjacent items
  Swap them if they are in the wrong order
  If no swaps were made during a pass, break early (array is sorted)`,
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
              Bubble Sort
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
                <span className="w-2 h-2 bg-pen-green rounded-full mr-2"></span>
                Stable
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
            How It Works
          </h2>
          <div className="space-y-4 text-ink-2 leading-relaxed">
            <p className="text-lg">
              This sorting algorithm compares the adjacent elements and sorts
              them if they are in the wrong order. It repeats this process{" "}
              <span className="text-pen-rust font-semibold">n²</span> times
              for the array to be sorted.
            </p>
            <p className="text-lg">
              It&apos;s called{" "}
              <span className="text-pen-plum font-semibold">
                &quot;bubble&quot;
              </span>{" "}
              sort because smaller elements slowly &quot;bubble up&quot; to the
              top (beginning) of the array with each pass, like bubbles rising
              in water.
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

        {/* Mid-content Ad */}
        {/* <AdSense
          adSlot="5174363643"
          adFormat="auto"
          adTest="off"
          className="my-8 flex justify-center"
          responsive={true}
        /> */}

        {/* Detailed Explanation */}
        <div className="vl-card p-8">
          <h2 className="vl-h2 mb-6">
            Deeper Look
          </h2>
          <div className="space-y-6">
            <div className="vl-note vl-note-plum p-6">
              <p className="text-ink-2 text-lg leading-relaxed">
                If you take a broader look, it is like taking the biggest
                element and placing it at the end of the array, then repeating
                this process until the array is sorted. Bubble Sort is a{" "}
                <span className="text-pen-green font-semibold">
                  stable sort
                </span>
                , meaning that elements with equal values maintain their
                relative order after sorting — important for multi-level sorting
                (like sorting by grade, then by name).
              </p>
            </div>
          </div>
        </div>

        {/* Fun Facts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="vl-card p-6">
            <h3 className="vl-h3 mb-4">
               <span>Stress Test</span>
            </h3>
            <p className="text-ink-2 leading-relaxed">
              Bubble Sort is sometimes used in embedded or very low-level
              testing as a &quot;canary&quot; algorithm to validate a basic
              sorting function.
            </p>
          </div>

          <div className="vl-card p-6">
            <h3 className="vl-h3 mb-4">
               <span>Variants in Practice</span>
            </h3>
            <p className="text-ink-2 leading-relaxed">
              Bubble Sort is too slow for large datasets. But variants like{" "}
              <span className="text-pen-blue font-semibold">
                Cocktail Shaker Sort
              </span>
              (a bidirectional version) are more efficient in some situations.
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
