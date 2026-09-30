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
    js: `// Bucket Sort (for numbers in [0, 1))
function bucketSort(arr) {
  const n = arr.length;
  const buckets = Array.from({ length: n }, () => []);
  // 1. Scatter: Place elements in buckets
  for (let i = 0; i < n; i++) {
    const idx = Math.floor(n * arr[i]);
    buckets[idx].push(arr[i]);
  }
  // 2. Sort each bucket
  for (let i = 0; i < n; i++) {
    buckets[i].sort((a, b) => a - b);
  }
  // 3. Gather: Concatenate buckets
  return [].concat(...buckets);
}
`,
    py: `def bucket_sort(arr):
    n = len(arr)
    buckets = [[] for _ in range(n)]
    # 1. Scatter
    for x in arr:
        idx = int(n * x)
        buckets[idx].append(x)
    # 2. Sort buckets
    for bucket in buckets:
        bucket.sort()
    # 3. Gather
    result = []
    for bucket in buckets:
        result.extend(bucket)
    return result
`,
    cpp: `// Bucket Sort (for numbers in [0, 1))
#include <vector>
#include <algorithm>
std::vector<float> bucketSort(const std::vector<float>& arr) {
    int n = arr.size();
    std::vector<std::vector<float>> buckets(n);
    for (float x : arr) {
        int idx = n * x;
        buckets[idx].push_back(x);
    }
    for (auto& bucket : buckets) {
        std::sort(bucket.begin(), bucket.end());
    }
    std::vector<float> result;
    for (const auto& bucket : buckets) {
        result.insert(result.end(), bucket.begin(), bucket.end());
    }
    return result;
}
`,
    idea: `Bucket Sort Steps:
1. Divide input into k buckets
2. Scatter elements into buckets
3. Sort each bucket (often insertion sort)
4. Concatenate buckets for final sorted array

Best: O(n + k) if uniform
Worst: O(n^2) if all in one bucket
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
              Bucket Sort
            </h1>
            <div className="vl-meta mt-3">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-pen-blue rounded-full mr-2"></span>
                Time: O(n + k)
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-pen-blue rounded-full mr-2"></span>
                Space: O(n + k)
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-pen-green rounded-full mr-2"></span>
                Stable (if stable sort used in buckets)
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
            How Bucket Sort Works
          </h2>
          <div className="space-y-4 text-ink-2 leading-relaxed">
            <p className="text-lg">
              Bucket Sort distributes the elements of an array into a number of
              buckets. Each bucket is then sorted individually, either using a
              different sorting algorithm or recursively applying bucket sort.
            </p>
            <p className="text-lg">
              It is especially effective when input is uniformly distributed
              over a range. The overall process is:
            </p>
            <ul className="list-disc ml-6 space-y-2">
              <li>Divide the interval [min, max] into k buckets.</li>
              <li>Scatter the input elements into the buckets.</li>
              <li>Sort each bucket (often with insertion sort).</li>
              <li>Concatenate all buckets to get the sorted array.</li>
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

        {/* Properties & Insights */}
        <div className="vl-card p-8">
          <h2 className="vl-h2 mb-6">
            Key Properties & Insights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="vl-note vl-note-blue p-6">
              <h3 className="vl-h3 mb-2">
                Bucket Index Formula
              </h3>
              <p className="text-lg text-center text-pen-blue font-bold mb-2">
                index = ⌊ k × (A[i] - min) / (max - min + 1) ⌋
              </p>
              <ul className="text-sm text-ink-2 space-y-1">
                <li>• k = number of buckets</li>
                <li>• min, max = range of input</li>
                <li>• A[i] = element value</li>
              </ul>
            </div>
            <div className="vl-note vl-note-blue p-6">
              <h3 className="vl-h3 mb-2">
                Complexity
              </h3>
              <ul className="text-ink-2 space-y-2">
                <li>• Best: O(n + k) (uniform distribution)</li>
                <li>• Worst: O(n²) (all elements in one bucket)</li>
                <li>• Space: O(n + k)</li>
                <li>• Stable if bucket sort is stable</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Applications */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="vl-card p-6">
            <h3 className="vl-h3 mb-4">
               <span>Applications</span>
            </h3>
            <ul className="text-ink-2 leading-relaxed space-y-2">
              <li>
                •{" "}
                <span className="text-pen-green">Floating point sorting</span>
              </li>
              <li>
                •{" "}
                <span className="text-pen-green">
                  Uniformly distributed data
                </span>
              </li>
              <li>
                •{" "}
                <span className="text-pen-green">
                  Histogram-based algorithms
                </span>
              </li>
              <li>
                •{" "}
                <span className="text-pen-green">
                  External sorting (large datasets)
                </span>
              </li>
            </ul>
          </div>
          <div className="vl-card p-6">
            <h3 className="vl-h3 mb-4">
               <span>Tips & Insights</span>
            </h3>
            <ul className="text-ink-2 leading-relaxed space-y-2">
              <li>• Choose bucket count based on data distribution</li>
              <li>• Use insertion sort for small buckets</li>
              <li>• Not comparison-based: exploits distribution</li>
              <li>• Works best for continuous, uniform data</li>
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
