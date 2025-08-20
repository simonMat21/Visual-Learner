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
    js: `// Insertion Sort Implementation
function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let key = arr[i];
    let j = i - 1;
    
    // Move elements of arr[0..i-1] that are greater than key
    // one position ahead of their current position
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j = j - 1;
    }
    arr[j + 1] = key;
  }
  return arr;
}

// Alternative with binary search for position finding
function binaryInsertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let key = arr[i];
    let left = 0, right = i;
    
    // Find position to insert using binary search
    while (left < right) {
      let mid = Math.floor((left + right) / 2);
      if (arr[mid] > key) {
        right = mid;
      } else {
        left = mid + 1;
      }
    }
    
    // Shift elements and insert
    for (let j = i - 1; j >= left; j--) {
      arr[j + 1] = arr[j];
    }
    arr[left] = key;
  }
  return arr;
}`,
    c: `#include <stdio.h>

void insertionSort(int arr[], int n) {
    int i, key, j;
    for (i = 1; i < n; i++) {
        key = arr[i];
        j = i - 1;
        
        // Move elements of arr[0..i-1] that are greater than key
        // one position ahead of their current position
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j = j - 1;
        }
        arr[j + 1] = key;
    }
}

// Function to print array
void printArray(int arr[], int size) {
    int i;
    for (i = 0; i < size; i++)
        printf("%d ", arr[i]);
    printf("\n");
}

// Example usage
int main() {
    int arr[] = {64, 34, 25, 12, 22, 11, 90};
    int n = sizeof(arr) / sizeof(arr[0]);
    
    printf("Original array: ");
    printArray(arr, n);
    
    insertionSort(arr, n);
    
    printf("Sorted array: ");
    printArray(arr, n);
    return 0;
}`,
    py: `def insertion_sort(arr):
    # Start from the second element (index 1)
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        
        # Move elements of arr[0..i-1] that are greater than key
        # one position ahead of their current position
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        
        arr[j + 1] = key
    
    return arr

# Recursive implementation
def insertion_sort_recursive(arr, n=None):
    if n is None:
        n = len(arr)
    
    # Base case
    if n <= 1:
        return arr
    
    # Sort first n-1 elements
    insertion_sort_recursive(arr, n - 1)
    
    # Insert last element at its correct position
    last = arr[n - 1]
    j = n - 2
    
    while j >= 0 and arr[j] > last:
        arr[j + 1] = arr[j]
        j -= 1
    
    arr[j + 1] = last
    return arr`,
    cpp: `#include <vector>
#include <iostream>

void insertionSort(std::vector<int>& arr) {
    int n = arr.size();
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        
        // Move elements greater than key one position ahead
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j = j - 1;
        }
        arr[j + 1] = key;
    }
}

// Template version for any comparable type
template<typename T>
void insertionSort(std::vector<T>& arr) {
    for (size_t i = 1; i < arr.size(); i++) {
        T key = arr[i];
        int j = i - 1;
        
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}`,
    idea: `Insertion Sort Steps:
1. Start from second element (index 1)
2. Compare current element with previous elements
3. Shift larger elements one position right
4. Insert current element at correct position
5. Repeat for all elements

Time: O(n²) worst case, O(n) best case
Space: O(1) in-place sorting
Adaptive: efficient for partially sorted arrays`,
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
            <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-2">
              Insertion Sort
            </h1>
            <div className="inline-flex items-center space-x-4 text-sm bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-full px-4 py-2 mt-3 border border-yellow-400/30">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                Best: O(n)
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                Worst: O(n²)
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                Stable & Adaptive
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-yellow-300 mb-4 flex items-center">
            <span className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center mr-3 text-sm">
              🃏
            </span>
            How Insertion Sort Works
          </h2>
          <div className="space-y-4 text-gray-300 leading-relaxed">
            <p className="text-lg">
              Insertion Sort builds the sorted array one element at a time by
              repeatedly taking an element from the unsorted portion and
              inserting it into its correct position in the sorted portion. It
              works similarly to how you might sort playing cards in your hands.
            </p>
            <p className="text-lg">
              The algorithm divides the array into two parts:
            </p>
            <ul className="list-disc ml-6 space-y-2">
              <li>
                <span className="text-yellow-400 font-semibold">
                  Sorted portion:
                </span>{" "}
                Elements at the beginning (initially just the first element)
              </li>
              <li>
                <span className="text-yellow-400 font-semibold">
                  Unsorted portion:
                </span>{" "}
                Remaining elements to be processed
              </li>
              <li>
                For each element in the unsorted portion, find its correct
                position in the sorted portion
              </li>
              <li>Shift elements as needed and insert the current element</li>
            </ul>
          </div>
        </div>

        {/* Code Block */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-orange-300 mb-6 flex items-center">
            <span className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mr-3 text-sm">
              💻
            </span>
            Implementation
          </h2>
          <CodeBlock
            codeSnippets={codeSnippets}
            defaultLang="js"
            height="1000px"
          />
        </div>

        {/* Performance Analysis */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-blue-300 mb-6 flex items-center">
            <span className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3 text-sm">
              📊
            </span>
            Performance Analysis
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-yellow-300 mb-2">
                Time Complexity
              </h3>
              <ul className="text-gray-300 space-y-2">
                <li>
                  •{" "}
                  <span className="text-green-400 font-semibold">
                    Best case:
                  </span>{" "}
                  O(n) - already sorted
                </li>
                <li>
                  •{" "}
                  <span className="text-yellow-400 font-semibold">
                    Average case:
                  </span>{" "}
                  O(n²)
                </li>
                <li>
                  •{" "}
                  <span className="text-red-400 font-semibold">
                    Worst case:
                  </span>{" "}
                  O(n²) - reverse sorted
                </li>
                <li>
                  • <span className="text-blue-400 font-semibold">Space:</span>{" "}
                  O(1) in-place
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-r from-green-500/10 to-teal-500/10 border border-green-500/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-300 mb-2">
                Key Properties
              </h3>
              <ul className="text-gray-300 space-y-2">
                <li>
                  •{" "}
                  <span className="text-green-400 font-semibold">Stable:</span>{" "}
                  maintains relative order
                </li>
                <li>
                  •{" "}
                  <span className="text-green-400 font-semibold">
                    Adaptive:
                  </span>{" "}
                  efficient for nearly sorted data
                </li>
                <li>
                  •{" "}
                  <span className="text-green-400 font-semibold">Online:</span>{" "}
                  can sort data as it arrives
                </li>
                <li>
                  •{" "}
                  <span className="text-green-400 font-semibold">
                    In-place:
                  </span>{" "}
                  requires only O(1) extra memory
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Use Cases & Comparisons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-emerald-300 mb-4 flex items-center">
              🎯 <span className="ml-2">Best Use Cases</span>
            </h3>
            <ul className="text-gray-300 leading-relaxed space-y-2">
              <li>
                • <span className="text-emerald-400">Small datasets</span>{" "}
                (typically n &lt; 50)
              </li>
              <li>
                • <span className="text-emerald-400">Nearly sorted arrays</span>
              </li>
              <li>
                • <span className="text-emerald-400">Online algorithms</span>{" "}
                (data arrives over time)
              </li>
              <li>
                • <span className="text-emerald-400">Hybrid sorting</span> (part
                of quicksort/mergesort)
              </li>
              <li>
                •{" "}
                <span className="text-emerald-400">Simple implementation</span>{" "}
                needed
              </li>
            </ul>
          </div>
          <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-purple-300 mb-4 flex items-center">
              🔄 <span className="ml-2">Compared to Other Sorts</span>
            </h3>
            <ul className="text-gray-300 leading-relaxed space-y-2">
              <li>
                • <span className="text-purple-400">vs Bubble Sort:</span> More
                efficient, fewer swaps
              </li>
              <li>
                • <span className="text-purple-400">vs Selection Sort:</span>{" "}
                Adaptive, better for partial sorting
              </li>
              <li>
                • <span className="text-purple-400">vs Quick Sort:</span> Better
                for small arrays, stable
              </li>
              <li>
                • <span className="text-purple-400">vs Merge Sort:</span>{" "}
                In-place, but slower for large data
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
