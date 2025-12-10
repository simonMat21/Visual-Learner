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
    js: `// Heap Sort Implementation
function heapSort(arr) {
  const n = arr.length;
  
  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i);
  }
  
  // Extract elements from heap one by one
  for (let i = n - 1; i > 0; i--) {
    // Move current root to end
    [arr[0], arr[i]] = [arr[i], arr[0]];
    
    // Call heapify on the reduced heap
    heapify(arr, i, 0);
  }
  return arr;
}

function heapify(arr, n, i) {
  let largest = i; // Initialize largest as root
  let left = 2 * i + 1; // left child
  let right = 2 * i + 2; // right child
  
  // If left child is larger than root
  if (left < n && arr[left] > arr[largest]) {
    largest = left;
  }
  
  // If right child is larger than largest so far
  if (right < n && arr[right] > arr[largest]) {
    largest = right;
  }
  
  // If largest is not root
  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    heapify(arr, n, largest); // Recursively heapify
  }
}`,
    c: `#include <stdio.h>

void heapify(int arr[], int n, int i) {
    int largest = i; // Initialize largest as root
    int left = 2 * i + 1; // left child
    int right = 2 * i + 2; // right child
    
    // If left child is larger than root
    if (left < n && arr[left] > arr[largest])
        largest = left;
    
    // If right child is larger than largest so far
    if (right < n && arr[right] > arr[largest])
        largest = right;
    
    // If largest is not root
    if (largest != i) {
        // Swap
        int temp = arr[i];
        arr[i] = arr[largest];
        arr[largest] = temp;
        
        // Recursively heapify the affected sub-tree
        heapify(arr, n, largest);
    }
}

void heapSort(int arr[], int n) {
    // Build heap (rearrange array)
    for (int i = n / 2 - 1; i >= 0; i--)
        heapify(arr, n, i);
    
    // One by one extract an element from heap
    for (int i = n - 1; i > 0; i--) {
        // Move current root to end
        int temp = arr[0];
        arr[0] = arr[i];
        arr[i] = temp;
        
        // Call heapify on the reduced heap
        heapify(arr, i, 0);
    }
}`,
    py: `def heapify(arr, n, i):
    largest = i  # Initialize largest as root
    left = 2 * i + 1  # left child
    right = 2 * i + 2  # right child
    
    # If left child exists and is greater than root
    if left < n and arr[left] > arr[largest]:
        largest = left
    
    # If right child exists and is greater than largest so far
    if right < n and arr[right] > arr[largest]:
        largest = right
    
    # If largest is not root
    if largest != i:
        arr[i], arr[largest] = arr[largest], arr[i]
        heapify(arr, n, largest)  # Recursively heapify

def heap_sort(arr):
    n = len(arr)
    
    # Build a maxheap
    for i in range(n // 2 - 1, -1, -1):
        heapify(arr, n, i)
    
    # Extract elements one by one
    for i in range(n - 1, 0, -1):
        arr[i], arr[0] = arr[0], arr[i]  # swap
        heapify(arr, i, 0)
    
    return arr`,
    cpp: `#include <vector>
#include <algorithm>

void heapify(std::vector<int>& arr, int n, int i) {
    int largest = i; // Initialize largest as root
    int left = 2 * i + 1; // left child
    int right = 2 * i + 2; // right child
    
    // If left child is larger than root
    if (left < n && arr[left] > arr[largest])
        largest = left;
    
    // If right child is larger than largest so far
    if (right < n && arr[right] > arr[largest])
        largest = right;
    
    // If largest is not root
    if (largest != i) {
        std::swap(arr[i], arr[largest]);
        heapify(arr, n, largest); // Recursively heapify
    }
}

void heapSort(std::vector<int>& arr) {
    int n = arr.size();
    
    // Build heap (rearrange array)
    for (int i = n / 2 - 1; i >= 0; i--)
        heapify(arr, n, i);
    
    // Extract elements from heap one by one
    for (int i = n - 1; i > 0; i--) {
        std::swap(arr[0], arr[i]); // Move current root to end
        heapify(arr, i, 0); // Call heapify on reduced heap
    }
}`,
    idea: `Heap Sort Steps:
1. Build a max heap from input array
2. Swap root (maximum) with last element
3. Reduce heap size and heapify root
4. Repeat until heap size is 1

Time: O(n log n) always
Space: O(1) in-place sorting
Not stable but consistent performance`,
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
        <AdBanner position="bottom" size="responsive" adTest="off" />
        {/* Algorithm Info */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-2">
              Heap Sort
            </h1>
            <div className="inline-flex items-center space-x-4 text-sm bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-full px-4 py-2 mt-3 border border-green-400/30">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                Time: O(n log n)
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></span>
                Space: O(1)
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                Not Stable
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-green-300 mb-4 flex items-center">
            <span className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3 text-sm">
              🏔️
            </span>
            How Heap Sort Works
          </h2>
          <div className="space-y-4 text-gray-300 leading-relaxed">
            <p className="text-lg">
              Heap Sort is a comparison-based sorting algorithm that uses a
              binary heap data structure. It works by first building a max heap
              from the input data, then repeatedly extracting the maximum
              element and placing it at the end of the sorted portion.
            </p>
            <p className="text-lg">
              The algorithm consists of two main phases:
            </p>
            <ul className="list-disc ml-6 space-y-2">
              <li>
                <span className="text-green-400 font-semibold">Heapify:</span>{" "}
                Build a max heap from the unsorted array
              </li>
              <li>
                <span className="text-green-400 font-semibold">
                  Extract-Max:
                </span>{" "}
                Repeatedly remove the root (max element) and restore heap
                property
              </li>
              <li>
                The extracted elements form the sorted array in descending order
              </li>
              <li>
                Since we want ascending order, we place elements at the end of
                the array
              </li>
            </ul>
          </div>
        </div>

        {/* Code Block */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-emerald-300 mb-6 flex items-center">
            <span className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center mr-3 text-sm">
              💻
            </span>
            Implementation
          </h2>
          <CodeBlock
            codeSnippets={codeSnippets}
            defaultLang="js"
            height="1100px"
          />
        </div>

        {/* Heap Properties */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-blue-300 mb-6 flex items-center">
            <span className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3 text-sm">
              🔍
            </span>
            Heap Properties & Analysis
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-300 mb-2">
                Heap Structure
              </h3>
              <ul className="text-gray-300 space-y-2">
                <li>
                  •{" "}
                  <span className="text-green-400 font-semibold">
                    Complete binary tree
                  </span>
                </li>
                <li>• Parent at index i, children at 2i+1 and 2i+2</li>
                <li>• Max heap: parent ≥ children</li>
                <li>• Height: O(log n)</li>
              </ul>
            </div>
            <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-300 mb-2">
                Complexity Analysis
              </h3>
              <ul className="text-gray-300 space-y-2">
                <li>
                  •{" "}
                  <span className="text-blue-400 font-semibold">
                    Build heap:
                  </span>{" "}
                  O(n)
                </li>
                <li>
                  •{" "}
                  <span className="text-blue-400 font-semibold">
                    Extract max:
                  </span>{" "}
                  O(log n)
                </li>
                <li>
                  • <span className="text-blue-400 font-semibold">Total:</span>{" "}
                  O(n log n)
                </li>
                <li>
                  • <span className="text-blue-400 font-semibold">Space:</span>{" "}
                  O(1) in-place
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Advantages & Disadvantages */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-emerald-300 mb-4 flex items-center">
              ✅ <span className="ml-2">Advantages</span>
            </h3>
            <ul className="text-gray-300 leading-relaxed space-y-2">
              <li>
                •{" "}
                <span className="text-emerald-400">Guaranteed O(n log n)</span>{" "}
                worst-case
              </li>
              <li>
                • <span className="text-emerald-400">In-place sorting</span>{" "}
                (O(1) space)
              </li>
              <li>
                •{" "}
                <span className="text-emerald-400">Consistent performance</span>{" "}
                across all inputs
              </li>
              <li>
                •{" "}
                <span className="text-emerald-400">Good cache performance</span>
              </li>
            </ul>
          </div>
          <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-red-300 mb-4 flex items-center">
              ❌ <span className="ml-2">Disadvantages</span>
            </h3>
            <ul className="text-gray-300 leading-relaxed space-y-2">
              <li>
                • <span className="text-red-400">Not stable</span> (doesn&apos;t
                preserve order)
              </li>
              <li>
                • <span className="text-red-400">Slower than quicksort</span> in
                average case
              </li>
              <li>
                • <span className="text-red-400">Complex implementation</span>
              </li>
              <li>
                • <span className="text-red-400">Poor performance</span> on
                small arrays
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
