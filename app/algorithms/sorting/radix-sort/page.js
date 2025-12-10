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
    js: `// Radix Sort Implementation (for non-negative integers)
function radixSort(arr) {
  if (arr.length === 0) return arr;
  
  // Find the maximum number to know number of digits
  const max = Math.max(...arr);
  
  // Do counting sort for every digit
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    countingSortByDigit(arr, exp);
  }
  
  return arr;
}

function countingSortByDigit(arr, exp) {
  const n = arr.length;
  const output = new Array(n);
  const count = new Array(10).fill(0);
  
  // Store count of occurrences of each digit
  for (let i = 0; i < n; i++) {
    const digit = Math.floor(arr[i] / exp) % 10;
    count[digit]++;
  }
  
  // Change count[i] so it contains actual position of digit in output
  for (let i = 1; i < 10; i++) {
    count[i] += count[i - 1];
  }
  
  // Build the output array
  for (let i = n - 1; i >= 0; i--) {
    const digit = Math.floor(arr[i] / exp) % 10;
    output[count[digit] - 1] = arr[i];
    count[digit]--;
  }
  
  // Copy the output array to arr
  for (let i = 0; i < n; i++) {
    arr[i] = output[i];
  }
}

// Alternative LSD (Least Significant Digit) implementation
function radixSortLSD(arr, base = 10) {
  if (arr.length === 0) return arr;
  
  const max = Math.max(...arr);
  const maxDigits = Math.floor(Math.log(max) / Math.log(base)) + 1;
  
  for (let digit = 0; digit < maxDigits; digit++) {
    const buckets = Array.from({ length: base }, () => []);
    
    for (let num of arr) {
      const digitValue = Math.floor(num / Math.pow(base, digit)) % base;
      buckets[digitValue].push(num);
    }
    
    arr = [].concat(...buckets);
  }
  
  return arr;
}`,
    c: `#include <stdio.h>
#include <stdlib.h>

// Function to get maximum value in array
int getMax(int arr[], int n) {
    int max = arr[0];
    for (int i = 1; i < n; i++) {
        if (arr[i] > max)
            max = arr[i];
    }
    return max;
}

// Counting sort function for a particular digit represented by exp
void countSort(int arr[], int n, int exp) {
    int output[n]; // output array
    int count[10] = {0}; // count array for digits 0-9
    
    // Store count of occurrences of each digit
    for (int i = 0; i < n; i++)
        count[(arr[i] / exp) % 10]++;
    
    // Change count[i] so it contains actual position of digit in output
    for (int i = 1; i < 10; i++)
        count[i] += count[i - 1];
    
    // Build the output array
    for (int i = n - 1; i >= 0; i--) {
        output[count[(arr[i] / exp) % 10] - 1] = arr[i];
        count[(arr[i] / exp) % 10]--;
    }
    
    // Copy the output array to arr
    for (int i = 0; i < n; i++)
        arr[i] = output[i];
}

// Main function to implement radix sort
void radixSort(int arr[], int n) {
    // Find the maximum number to know number of digits
    int max = getMax(arr, n);
    
    // Do counting sort for every digit
    for (int exp = 1; max / exp > 0; exp *= 10)
        countSort(arr, n, exp);
}

// Function to print array
void printArray(int arr[], int n) {
    for (int i = 0; i < n; i++)
        printf("%d ", arr[i]);
    printf("\\n");
}

// Example usage
int main() {
    int arr[] = {170, 45, 75, 90, 2, 802, 24, 66};
    int n = sizeof(arr) / sizeof(arr[0]);
    
    printf("Original array: ");
    printArray(arr, n);
    
    radixSort(arr, n);
    
    printf("Sorted array: ");
    printArray(arr, n);
    return 0;
}`,
    py: `def radix_sort(arr):
    if not arr:
        return arr
    
    # Find the maximum number to know number of digits
    max_num = max(arr)
    
    # Do counting sort for every digit
    exp = 1
    while max_num // exp > 0:
        counting_sort_by_digit(arr, exp)
        exp *= 10
    
    return arr

def counting_sort_by_digit(arr, exp):
    n = len(arr)
    output = [0] * n
    count = [0] * 10
    
    # Store count of occurrences of each digit
    for i in range(n):
        digit = (arr[i] // exp) % 10
        count[digit] += 1
    
    # Change count[i] so it contains actual position of digit in output
    for i in range(1, 10):
        count[i] += count[i - 1]
    
    # Build the output array
    for i in range(n - 1, -1, -1):
        digit = (arr[i] // exp) % 10
        output[count[digit] - 1] = arr[i]
        count[digit] -= 1
    
    # Copy the output array to arr
    for i in range(n):
        arr[i] = output[i]

# Alternative bucket-based implementation
def radix_sort_buckets(arr, base=10):
    if not arr:
        return arr
    
    max_num = max(arr)
    max_digits = len(str(max_num))
    
    for digit in range(max_digits):
        buckets = [[] for _ in range(base)]
        
        for num in arr:
            digit_value = (num // (base ** digit)) % base
            buckets[digit_value].append(num)
        
        arr = []
        for bucket in buckets:
            arr.extend(bucket)
    
    return arr`,
    cpp: `#include <vector>
#include <algorithm>
#include <queue>
#include <cmath>

class RadixSort {
public:
    static void radixSort(std::vector<int>& arr) {
        if (arr.empty()) return;
        
        int maxVal = *std::max_element(arr.begin(), arr.end());
        
        for (int exp = 1; maxVal / exp > 0; exp *= 10) {
            countingSortByDigit(arr, exp);
        }
    }

private:
    static void countingSortByDigit(std::vector<int>& arr, int exp) {
        int n = arr.size();
        std::vector<int> output(n);
        std::vector<int> count(10, 0);
        
        // Store count of occurrences of each digit
        for (int i = 0; i < n; i++) {
            count[(arr[i] / exp) % 10]++;
        }
        
        // Change count[i] so it contains actual position
        for (int i = 1; i < 10; i++) {
            count[i] += count[i - 1];
        }
        
        // Build the output array
        for (int i = n - 1; i >= 0; i--) {
            output[count[(arr[i] / exp) % 10] - 1] = arr[i];
            count[(arr[i] / exp) % 10]--;
        }
        
        // Copy output array to arr
        for (int i = 0; i < n; i++) {
            arr[i] = output[i];
        }
    }
};

// Alternative using queues (bucket sort approach)
class RadixSortBuckets {
public:
    static void radixSort(std::vector<int>& arr, int base = 10) {
        if (arr.empty()) return;
        
        int maxVal = *std::max_element(arr.begin(), arr.end());
        int maxDigits = static_cast<int>(std::log(maxVal) / std::log(base)) + 1;
        
        for (int digit = 0; digit < maxDigits; digit++) {
            std::vector<std::queue<int>> buckets(base);
            
            // Distribute numbers into buckets
            for (int num : arr) {
                int digitValue = (num / static_cast<int>(std::pow(base, digit))) % base;
                buckets[digitValue].push(num);
            }
            
            // Collect numbers from buckets
            arr.clear();
            for (auto& bucket : buckets) {
                while (!bucket.empty()) {
                    arr.push_back(bucket.front());
                    bucket.pop();
                }
            }
        }
    }
};`,
    idea: `Radix Sort Steps (Non-comparison based):
1. Find maximum number to determine digits
2. For each digit position (units, tens, hundreds...):
   - Use counting sort on that digit
   - Maintain stability throughout
3. After processing all digits, array is sorted

Time: O(d × (n + k)) where d=digits, k=range
Space: O(n + k)
Stable and efficient for integers`,
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

      {/* Header Section */}
      {/* <div className="text-center py-12 px-8">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
          Algorithm Visualizer
        </h1>
        <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto"></div>
      </div> */}

      {/* Controls Section */}
      {/* <div className="max-w-6xl mx-auto px-8 mb-1">
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6"></div>
      </div> */}

      {/* Visualization Section */}
      <div className="max-w-6xl mx-auto px-8 mb-12">
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex flex-col items-center space-y-6">
            <NumberInput
              valRange={[0, 1000]}
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
                onValueChange={([val]) => setAnimSpd(val)}
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
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">
              Radix Sort
            </h1>
            <div className="inline-flex items-center space-x-4 text-sm bg-gradient-to-r from-indigo-400/20 to-purple-400/20 rounded-full px-4 py-2 mt-3 border border-indigo-400/30">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-indigo-400 rounded-full mr-2"></span>
                Time: O(d × (n + k))
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                Space: O(n + k)
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                Stable & Non-comparison
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-indigo-300 mb-4 flex items-center">
            <span className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center mr-3 text-sm">
              🔢
            </span>
            How Radix Sort Works
          </h2>
          <div className="space-y-4 text-gray-300 leading-relaxed">
            <p className="text-lg">
              Radix Sort is a non-comparison based sorting algorithm that sorts
              integers by processing individual digits. It works by sorting the
              numbers digit by digit, starting from the least significant digit
              (rightmost) to the most significant digit (leftmost).
            </p>
            <p className="text-lg">
              The key insight is to use a stable sorting algorithm (like
              counting sort) for each digit position:
            </p>
            <ul className="list-disc ml-6 space-y-2">
              <li>
                <span className="text-indigo-400 font-semibold">
                  Find maximum:
                </span>{" "}
                Determine the number of digits needed
              </li>
              <li>
                <span className="text-indigo-400 font-semibold">
                  Process digits:
                </span>{" "}
                Sort by each digit position using counting sort
              </li>
              <li>
                <span className="text-indigo-400 font-semibold">
                  Maintain stability:
                </span>{" "}
                Preserve relative order of equal elements
              </li>
              <li>
                <span className="text-indigo-400 font-semibold">
                  Linear time:
                </span>{" "}
                Achieves O(d×(n+k)) where d is digit count
              </li>
            </ul>
          </div>
        </div>

        {/* Code Block */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-purple-300 mb-6 flex items-center">
            <span className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-3 text-sm">
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

        {/* Algorithm Analysis */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-blue-300 mb-6 flex items-center">
            <span className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3 text-sm">
              📊
            </span>
            Algorithm Analysis
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-indigo-300 mb-2">
                Time Complexity
              </h3>
              <ul className="text-gray-300 space-y-2">
                <li>
                  •{" "}
                  <span className="text-indigo-400 font-semibold">
                    Best/Average/Worst:
                  </span>{" "}
                  O(d × (n + k))
                </li>
                <li>
                  • <span className="text-indigo-400 font-semibold">d:</span>{" "}
                  number of digits
                </li>
                <li>
                  • <span className="text-indigo-400 font-semibold">n:</span>{" "}
                  number of elements
                </li>
                <li>
                  • <span className="text-indigo-400 font-semibold">k:</span>{" "}
                  range of digits (usually 10)
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
                  <span className="text-green-400 font-semibold">
                    Non-comparison based:
                  </span>{" "}
                  doesn&apos;t compare elements
                </li>
                <li>
                  •{" "}
                  <span className="text-green-400 font-semibold">Stable:</span>{" "}
                  maintains relative order
                </li>
                <li>
                  •{" "}
                  <span className="text-green-400 font-semibold">
                    Linear time:
                  </span>{" "}
                  when d is constant
                </li>
                <li>
                  •{" "}
                  <span className="text-green-400 font-semibold">
                    External sorting:
                  </span>{" "}
                  works well with large data
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Variants & Applications */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-violet-300 mb-4 flex items-center">
              🔄 <span className="ml-2">Radix Sort Variants</span>
            </h3>
            <ul className="text-gray-300 leading-relaxed space-y-2">
              <li>
                •{" "}
                <span className="text-violet-400">
                  LSD (Least Significant Digit):
                </span>{" "}
                Start from rightmost digit
              </li>
              <li>
                •{" "}
                <span className="text-violet-400">
                  MSD (Most Significant Digit):
                </span>{" "}
                Start from leftmost digit
              </li>
              <li>
                • <span className="text-violet-400">Binary radix sort:</span>{" "}
                Base-2 for binary data
              </li>
              <li>
                • <span className="text-violet-400">String radix sort:</span>{" "}
                For lexicographic ordering
              </li>
            </ul>
          </div>
          <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-emerald-300 mb-4 flex items-center">
              🎯 <span className="ml-2">Best Use Cases</span>
            </h3>
            <ul className="text-gray-300 leading-relaxed space-y-2">
              <li>
                • <span className="text-emerald-400">Integer sorting:</span>{" "}
                Fixed-width integers
              </li>
              <li>
                • <span className="text-emerald-400">String sorting:</span>{" "}
                Fixed-length strings
              </li>
              <li>
                • <span className="text-emerald-400">Database indexing:</span>{" "}
                Numeric keys
              </li>
              <li>
                • <span className="text-emerald-400">External sorting:</span>{" "}
                Large datasets on disk
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
