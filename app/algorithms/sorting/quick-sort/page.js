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
    js: `// Quick Sort Implementation
function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    // Partition the array and get pivot index
    let pivotIndex = partition(arr, low, high);
    
    // Recursively sort elements before and after partition
    quickSort(arr, low, pivotIndex - 1);
    quickSort(arr, pivotIndex + 1, high);
  }
  return arr;
}

function partition(arr, low, high) {
  // Choose the rightmost element as pivot
  let pivot = arr[high];
  let i = low - 1; // Index of smaller element
  
  for (let j = low; j < high; j++) {
    // If current element is smaller than or equal to pivot
    if (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]]; // Swap elements
    }
  }
  
  // Place pivot in correct position
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}

// Alternative with random pivot
function quickSortRandomized(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    // Randomize pivot to avoid worst case
    let randomIndex = Math.floor(Math.random() * (high - low + 1)) + low;
    [arr[randomIndex], arr[high]] = [arr[high], arr[randomIndex]];
    
    let pivotIndex = partition(arr, low, high);
    quickSortRandomized(arr, low, pivotIndex - 1);
    quickSortRandomized(arr, pivotIndex + 1, high);
  }
  return arr;
}`,
    c: `#include <stdio.h>
#include <stdlib.h>

void swap(int* a, int* b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

int partition(int arr[], int low, int high) {
    int pivot = arr[high]; // Choose rightmost element as pivot
    int i = (low - 1); // Index of smaller element
    
    for (int j = low; j <= high - 1; j++) {
        // If current element is smaller than or equal to pivot
        if (arr[j] <= pivot) {
            i++; // Increment index of smaller element
            swap(&arr[i], &arr[j]);
        }
    }
    swap(&arr[i + 1], &arr[high]);
    return (i + 1);
}

void quickSort(int arr[], int low, int high) {
    if (low < high) {
        // Partition the array
        int pi = partition(arr, low, high);
        
        // Recursively sort elements before and after partition
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}

// Function to print array
void printArray(int arr[], int size) {
    for (int i = 0; i < size; i++)
        printf("%d ", arr[i]);
    printf("\\n");
}

// Example usage
int main() {
    int arr[] = {64, 34, 25, 12, 22, 11, 90};
    int n = sizeof(arr) / sizeof(arr[0]);
    
    printf("Original array: ");
    printArray(arr, n);
    
    quickSort(arr, 0, n - 1);
    
    printf("Sorted array: ");
    printArray(arr, n);
    return 0;
}`,
    py: `def quick_sort(arr, low=0, high=None):
    if high is None:
        high = len(arr) - 1
    
    if low < high:
        # Partition the array
        pivot_index = partition(arr, low, high)
        
        # Recursively sort elements before and after partition
        quick_sort(arr, low, pivot_index - 1)
        quick_sort(arr, pivot_index + 1, high)
    
    return arr

def partition(arr, low, high):
    # Choose the rightmost element as pivot
    pivot = arr[high]
    i = low - 1  # Index of smaller element
    
    for j in range(low, high):
        # If current element is smaller than or equal to pivot
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]  # Swap
    
    # Place pivot in correct position
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1

# In-place version with different pivot strategies
def quick_sort_median_of_three(arr, low=0, high=None):
    if high is None:
        high = len(arr) - 1
    
    if low < high:
        # Use median-of-three pivot selection
        median_of_three(arr, low, high)
        pivot_index = partition(arr, low, high)
        
        quick_sort_median_of_three(arr, low, pivot_index - 1)
        quick_sort_median_of_three(arr, pivot_index + 1, high)
    
    return arr

def median_of_three(arr, low, high):
    mid = (low + high) // 2
    if arr[mid] < arr[low]:
        arr[low], arr[mid] = arr[mid], arr[low]
    if arr[high] < arr[low]:
        arr[low], arr[high] = arr[high], arr[low]
    if arr[high] < arr[mid]:
        arr[mid], arr[high] = arr[high], arr[mid]`,
    cpp: `#include <vector>
#include <algorithm>
#include <random>

class QuickSort {
public:
    static void quickSort(std::vector<int>& arr, int low, int high) {
        if (low < high) {
            int pi = partition(arr, low, high);
            quickSort(arr, low, pi - 1);
            quickSort(arr, pi + 1, high);
        }
    }
    
    static void quickSort(std::vector<int>& arr) {
        quickSort(arr, 0, arr.size() - 1);
    }

private:
    static int partition(std::vector<int>& arr, int low, int high) {
        int pivot = arr[high]; // Choose rightmost as pivot
        int i = low - 1; // Index of smaller element
        
        for (int j = low; j < high; j++) {
            if (arr[j] <= pivot) {
                i++;
                std::swap(arr[i], arr[j]);
            }
        }
        std::swap(arr[i + 1], arr[high]);
        return i + 1;
    }
};

// Randomized version to avoid worst case
class RandomizedQuickSort {
public:
    static void quickSort(std::vector<int>& arr, int low, int high) {
        if (low < high) {
            randomizedPartition(arr, low, high);
            int pi = partition(arr, low, high);
            quickSort(arr, low, pi - 1);
            quickSort(arr, pi + 1, high);
        }
    }

private:
    static void randomizedPartition(std::vector<int>& arr, int low, int high) {
        std::random_device rd;
        std::mt19937 gen(rd());
        std::uniform_int_distribution<> dis(low, high);
        int randomIndex = dis(gen);
        std::swap(arr[randomIndex], arr[high]);
    }
    
    static int partition(std::vector<int>& arr, int low, int high) {
        int pivot = arr[high];
        int i = low - 1;
        
        for (int j = low; j < high; j++) {
            if (arr[j] <= pivot) {
                i++;
                std::swap(arr[i], arr[j]);
            }
        }
        std::swap(arr[i + 1], arr[high]);
        return i + 1;
    }
};`,
    idea: `Quick Sort Steps (Divide & Conquer):
1. Choose a pivot element from array
2. Partition: rearrange so elements < pivot are before it
3. Recursively apply to sub-arrays before and after pivot

Time: O(n log n) average, O(n²) worst
Space: O(log n) recursion stack
In-place but not stable`,
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
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent mb-2">
              Quick Sort
            </h1>
            <div className="inline-flex items-center space-x-4 text-sm bg-gradient-to-r from-red-400/20 to-orange-400/20 rounded-full px-4 py-2 mt-3 border border-red-400/30">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                Average: O(n log n)
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                Worst: O(n²)
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                Space: O(log n)
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-red-300 mb-4 flex items-center">
            <span className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-3 text-sm">
              ⚡
            </span>
            How Quick Sort Works
          </h2>
          <div className="space-y-4 text-gray-300 leading-relaxed">
            <p className="text-lg">
              Quick Sort is a highly efficient divide-and-conquer algorithm that
              works by selecting a &apos;pivot&apos; element and partitioning
              the array around it. Elements smaller than the pivot go to the
              left, larger elements go to the right.
            </p>
            <p className="text-lg">The algorithm follows these key steps:</p>
            <ul className="list-disc ml-6 space-y-2">
              <li>
                <span className="text-red-400 font-semibold">
                  Choose Pivot:
                </span>{" "}
                Select an element as the pivot (often the last element)
              </li>
              <li>
                <span className="text-red-400 font-semibold">Partition:</span>{" "}
                Rearrange array so elements &lt; pivot are before it, elements
                &gt; pivot are after
              </li>
              <li>
                <span className="text-red-400 font-semibold">Recursion:</span>{" "}
                Apply quick sort to the sub-arrays on both sides of the pivot
              </li>
              <li>
                <span className="text-red-400 font-semibold">Base Case:</span>{" "}
                Single elements or empty arrays are already sorted
              </li>
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
            height="800px"
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
            <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-red-300 mb-2">
                Time Complexity
              </h3>
              <ul className="text-gray-300 space-y-2">
                <li>
                  • <span className="text-green-400 font-semibold">Best:</span>{" "}
                  O(n log n) - balanced partitions
                </li>
                <li>
                  •{" "}
                  <span className="text-yellow-400 font-semibold">
                    Average:
                  </span>{" "}
                  O(n log n)
                </li>
                <li>
                  • <span className="text-red-400 font-semibold">Worst:</span>{" "}
                  O(n²) - already sorted with bad pivot
                </li>
                <li>
                  •{" "}
                  <span className="text-blue-400 font-semibold">
                    Recurrence:
                  </span>{" "}
                  T(n) = T(k) + T(n-k-1) + O(n)
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-r from-green-500/10 to-teal-500/10 border border-green-500/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-300 mb-2">
                Space & Properties
              </h3>
              <ul className="text-gray-300 space-y-2">
                <li>
                  • <span className="text-green-400 font-semibold">Space:</span>{" "}
                  O(log n) recursion stack
                </li>
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
                  sorts within original array
                </li>
                <li>
                  •{" "}
                  <span className="text-yellow-400 font-semibold">
                    Cache-friendly:
                  </span>{" "}
                  good locality of reference
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Pivot Strategies & Optimizations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-amber-300 mb-4 flex items-center">
              🎯 <span className="ml-2">Pivot Selection Strategies</span>
            </h3>
            <ul className="text-gray-300 leading-relaxed space-y-2">
              <li>
                • <span className="text-amber-400">First/Last element:</span>{" "}
                Simple but can be O(n²)
              </li>
              <li>
                • <span className="text-amber-400">Random pivot:</span> Avoids
                worst case on sorted data
              </li>
              <li>
                • <span className="text-amber-400">Median-of-three:</span>{" "}
                Better performance, less variance
              </li>
              <li>
                • <span className="text-amber-400">Median-of-medians:</span>{" "}
                Guarantees O(n log n) but complex
              </li>
            </ul>
          </div>
          <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-cyan-300 mb-4 flex items-center">
              🚀 <span className="ml-2">Why Quick Sort is Popular</span>
            </h3>
            <ul className="text-gray-300 leading-relaxed space-y-2">
              <li>
                • <span className="text-cyan-400">Fast in practice:</span> Low
                constant factors
              </li>
              <li>
                • <span className="text-cyan-400">Cache efficient:</span> Good
                memory access patterns
              </li>
              <li>
                • <span className="text-cyan-400">In-place sorting:</span>{" "}
                Minimal extra memory
              </li>
              <li>
                • <span className="text-cyan-400">Widely implemented:</span>{" "}
                Standard library choice
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
