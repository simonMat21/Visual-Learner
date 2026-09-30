"use client";

import { useState, useEffect } from "react";

import { Slider } from "@/components/ui/slider";
import NumberInput from "@/components/NumberInput";

import { CodeBlock } from "@/components/CodeBlock";
import PhoneScreenBlock from "@/components/phoneScreenBlocker";
import AdBanner from "@/components/AdBanner";

import P5Sketch from "./P5Sketch";

export default function Home() {
  const [AEBool, setAEBool] = useState(true);
  const [addForm, setAddForm] = useState({ val: [], pos: 0, start: false });
  const [animSpd, setAnimSpd] = useState(1);

  const codeSnippets = {
    js: `// Count Sort (for non-negative integers)
function countSort(arr) {
  if (arr.length === 0) return arr;
  
  // Find the maximum element
  const max = Math.max(...arr);
  const count = new Array(max + 1).fill(0);
  
  // Count occurrences of each element
  for (let i = 0; i < arr.length; i++) {
    count[arr[i]]++;
  }
  
  // Reconstruct the sorted array
  const result = [];
  for (let i = 0; i <= max; i++) {
    while (count[i] > 0) {
      result.push(i);
      count[i]--;
    }
  }
  return result;
}`,
    py: `def count_sort(arr):
    if not arr:
        return arr
    
    max_val = max(arr)
    count = [0] * (max_val + 1)
    
    # Count occurrences
    for num in arr:
        count[num] += 1
    
    # Reconstruct sorted array
    result = []
    for i in range(len(count)):
        result.extend([i] * count[i])
    
    return result`,
    cpp: `// Count Sort for non-negative integers
#include <vector>
#include <algorithm>
std::vector<int> countSort(const std::vector<int>& arr) {
    if (arr.empty()) return arr;
    
    int maxVal = *std::max_element(arr.begin(), arr.end());
    std::vector<int> count(maxVal + 1, 0);
    
    // Count occurrences
    for (int num : arr) {
        count[num]++;
    }
    
    // Reconstruct sorted array
    std::vector<int> result;
    for (int i = 0; i <= maxVal; i++) {
        while (count[i] > 0) {
            result.push_back(i);
            count[i]--;
        }
    }
    return result;
}`,
    idea: `Count Sort Steps:
1. Find max element to determine range
2. Create count array of size max+1
3. Count occurrences of each element
4. Reconstruct sorted array from counts

Time: O(n + k) where k is range
Space: O(k)
Works only for non-negative integers`,
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
              Count Sort
            </h1>
            <div className="vl-meta mt-3">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-pen-plum rounded-full mr-2"></span>
                Time: O(n + k)
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-pen-blue rounded-full mr-2"></span>
                Space: O(k)
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
            How Count Sort Works
          </h2>
          <div className="space-y-4 text-ink-2 leading-relaxed">
            <p className="text-lg">
              Count Sort is a non-comparison based sorting algorithm that counts
              the occurrences of each distinct element in the array. It works by
              determining the range of input data and counting how many times
              each value appears.
            </p>
            <p className="text-lg">
              The algorithm is particularly efficient when the range of input
              data (k) is not significantly larger than the number of elements
              (n). The steps are:
            </p>
            <ul className="list-disc ml-6 space-y-2">
              <li>Find the maximum element to determine the range.</li>
              <li>Create a count array to store frequencies.</li>
              <li>Count occurrences of each element.</li>
              <li>Reconstruct the sorted array using the count information.</li>
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
            height="650px"
          />
        </div>

        {/* Properties & Analysis */}
        <div className="vl-card p-8">
          <h2 className="vl-h2 mb-6">
            Algorithm Analysis
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="vl-note vl-note-plum p-6">
              <h3 className="vl-h3 mb-2">
                Time Complexity
              </h3>
              <ul className="text-ink-2 space-y-2">
                <li>
                  • <span className="text-pen-plum font-semibold">Best:</span>{" "}
                  O(n + k)
                </li>
                <li>
                  •{" "}
                  <span className="text-pen-plum font-semibold">
                    Average:
                  </span>{" "}
                  O(n + k)
                </li>
                <li>
                  •{" "}
                  <span className="text-pen-plum font-semibold">Worst:</span>{" "}
                  O(n + k)
                </li>
                <li>• where k is the range of input</li>
              </ul>
            </div>
            <div className="vl-note vl-note-blue p-6">
              <h3 className="vl-h3 mb-2">
                Key Properties
              </h3>
              <ul className="text-ink-2 space-y-2">
                <li>• Non-comparison based algorithm</li>
                <li>• Stable sorting (maintains relative order)</li>
                <li>• Works only with non-negative integers</li>
                <li>• Efficient when k is not much larger than n</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Applications & Limitations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="vl-card p-6">
            <h3 className="vl-h3 mb-4">
               <span>Best Use Cases</span>
            </h3>
            <ul className="text-ink-2 leading-relaxed space-y-2">
              <li>
                •{" "}
                <span className="text-pen-green">
                  Small range of integers
                </span>
              </li>
              <li>
                •{" "}
                <span className="text-pen-green">
                  Frequency counting problems
                </span>
              </li>
              <li>
                •{" "}
                <span className="text-pen-green">
                  As subroutine in radix sort
                </span>
              </li>
              <li>
                •{" "}
                <span className="text-pen-green">
                  When stability is required
                </span>
              </li>
            </ul>
          </div>
          <div className="vl-card p-6">
            <h3 className="vl-h3 mb-4">
               <span>Limitations</span>
            </h3>
            <ul className="text-ink-2 leading-relaxed space-y-2">
              <li>• Only works with non-negative integers</li>
              <li>• Space complexity increases with range</li>
              <li>• Inefficient when range is much larger than n</li>
              <li>• Cannot handle floating-point numbers directly</li>
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
