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
    <main className="vl-page">
      <PhoneScreenBlock message="Please switch to desktop mode to view this website" />

      {/* Title */}
      <div className="max-w-6xl mx-auto px-8 mb-6">
        <div className="vl-hero">
          <div>
            <h1 className="vl-title text-4xl mb-2">
              Insertion Sort
            </h1>
            <div className="vl-meta mt-3">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-pen-gold rounded-full mr-2"></span>
                Best: O(n)
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-pen-rust rounded-full mr-2"></span>
                Worst: O(n²)
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-pen-green rounded-full mr-2"></span>
                Stable & Adaptive
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
            How Insertion Sort Works
          </h2>
          <div className="space-y-4 text-ink-2 leading-relaxed">
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
                <span className="text-pen-gold font-semibold">
                  Sorted portion:
                </span>{" "}
                Elements at the beginning (initially just the first element)
              </li>
              <li>
                <span className="text-pen-gold font-semibold">
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
        <div className="vl-card p-8">
          <h2 className="vl-h2 mb-6">
            Implementation
          </h2>
          <CodeBlock
            codeSnippets={codeSnippets}
            defaultLang="js"
            height="1000px"
          />
        </div>

        {/* Performance Analysis */}
        <div className="vl-card p-8">
          <h2 className="vl-h2 mb-6">
            Performance Analysis
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="vl-note vl-note-gold p-6">
              <h3 className="vl-h3 mb-2">
                Time Complexity
              </h3>
              <ul className="text-ink-2 space-y-2">
                <li>
                  •{" "}
                  <span className="text-pen-green font-semibold">
                    Best case:
                  </span>{" "}
                  O(n) - already sorted
                </li>
                <li>
                  •{" "}
                  <span className="text-pen-gold font-semibold">
                    Average case:
                  </span>{" "}
                  O(n²)
                </li>
                <li>
                  •{" "}
                  <span className="text-pen-rust font-semibold">
                    Worst case:
                  </span>{" "}
                  O(n²) - reverse sorted
                </li>
                <li>
                  • <span className="text-pen-blue font-semibold">Space:</span>{" "}
                  O(1) in-place
                </li>
              </ul>
            </div>
            <div className="vl-note vl-note-green p-6">
              <h3 className="vl-h3 mb-2">
                Key Properties
              </h3>
              <ul className="text-ink-2 space-y-2">
                <li>
                  •{" "}
                  <span className="text-pen-green font-semibold">Stable:</span>{" "}
                  maintains relative order
                </li>
                <li>
                  •{" "}
                  <span className="text-pen-green font-semibold">
                    Adaptive:
                  </span>{" "}
                  efficient for nearly sorted data
                </li>
                <li>
                  •{" "}
                  <span className="text-pen-green font-semibold">Online:</span>{" "}
                  can sort data as it arrives
                </li>
                <li>
                  •{" "}
                  <span className="text-pen-green font-semibold">
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
          <div className="vl-card p-6">
            <h3 className="vl-h3 mb-4">
               <span>Best Use Cases</span>
            </h3>
            <ul className="text-ink-2 leading-relaxed space-y-2">
              <li>
                • <span className="text-pen-green">Small datasets</span>{" "}
                (typically n &lt; 50)
              </li>
              <li>
                • <span className="text-pen-green">Nearly sorted arrays</span>
              </li>
              <li>
                • <span className="text-pen-green">Online algorithms</span>{" "}
                (data arrives over time)
              </li>
              <li>
                • <span className="text-pen-green">Hybrid sorting</span> (part
                of quicksort/mergesort)
              </li>
              <li>
                •{" "}
                <span className="text-pen-green">Simple implementation</span>{" "}
                needed
              </li>
            </ul>
          </div>
          <div className="vl-card p-6">
            <h3 className="vl-h3 mb-4">
               <span>Compared to Other Sorts</span>
            </h3>
            <ul className="text-ink-2 leading-relaxed space-y-2">
              <li>
                • <span className="text-pen-plum">vs Bubble Sort:</span> More
                efficient, fewer swaps
              </li>
              <li>
                • <span className="text-pen-plum">vs Selection Sort:</span>{" "}
                Adaptive, better for partial sorting
              </li>
              <li>
                • <span className="text-pen-plum">vs Quick Sort:</span> Better
                for small arrays, stable
              </li>
              <li>
                • <span className="text-pen-plum">vs Merge Sort:</span>{" "}
                In-place, but slower for large data
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
