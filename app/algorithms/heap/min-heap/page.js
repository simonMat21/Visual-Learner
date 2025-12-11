"use client";

import { useState, useEffect } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { CodeBlock, TextBox } from "@/components/CodeBlock";
import PhoneScreenBlock from "@/components/phoneScreenBlocker";
import AdBanner from "@/components/AdBanner";

import P5Sketch from "./P5Sketch";

export default function Home() {
  const [AEBool, setAEBool] = useState(true);
  const [addForm, setAddForm] = useState({ val: 0, pos: 0, start: false });
  const [searchForm, setSearchForm] = useState({
    val: 0,
    start: false,
  });
  const [deleteForm, setDeleteForm] = useState({
    pos: 0,
    start: false,
  });

  const [animSpd, setAnimSpd] = useState(1);

  const codeSnippets = {
    js: `// Min Heap Implementation
class MinHeap {
  constructor() {
    this.heap = [];
  }
  
  // Helper methods
  getParentIndex(index) {
    return Math.floor((index - 1) / 2);
  }
  
  getLeftChildIndex(index) {
    return 2 * index + 1;
  }
  
  getRightChildIndex(index) {
    return 2 * index + 2;
  }
  
  hasParent(index) {
    return this.getParentIndex(index) >= 0;
  }
  
  hasLeftChild(index) {
    return this.getLeftChildIndex(index) < this.heap.length;
  }
  
  hasRightChild(index) {
    return this.getRightChildIndex(index) < this.heap.length;
  }
  
  parent(index) {
    return this.heap[this.getParentIndex(index)];
  }
  
  leftChild(index) {
    return this.heap[this.getLeftChildIndex(index)];
  }
  
  rightChild(index) {
    return this.heap[this.getRightChildIndex(index)];
  }
  
  swap(index1, index2) {
    [this.heap[index1], this.heap[index2]] = [this.heap[index2], this.heap[index1]];
  }
  
  // Insert element
  insert(value) {
    this.heap.push(value);
    this.heapifyUp();
  }
  
  // Remove and return minimum element
  extractMin() {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop();
    
    const min = this.heap[0];
    this.heap[0] = this.heap.pop();
    this.heapifyDown();
    return min;
  }
  
  // Get minimum without removing
  peek() {
    return this.heap.length > 0 ? this.heap[0] : null;
  }
  
  // Restore heap property upward
  heapifyUp() {
    let index = this.heap.length - 1;
    while (this.hasParent(index) && this.parent(index) > this.heap[index]) {
      this.swap(this.getParentIndex(index), index);
      index = this.getParentIndex(index);
    }
  }
  
  // Restore heap property downward
  heapifyDown() {
    let index = 0;
    while (this.hasLeftChild(index)) {
      let smallerChildIndex = this.getLeftChildIndex(index);
      
      if (this.hasRightChild(index) && 
          this.rightChild(index) < this.leftChild(index)) {
        smallerChildIndex = this.getRightChildIndex(index);
      }
      
      if (this.heap[index] < this.heap[smallerChildIndex]) {
        break;
      }
      
      this.swap(index, smallerChildIndex);
      index = smallerChildIndex;
    }
  }
  
  size() {
    return this.heap.length;
  }
  
  isEmpty() {
    return this.heap.length === 0;
  }
}`,
    c: `#include <stdio.h>
#include <stdlib.h>

typedef struct {
    int* heap;
    int size;
    int capacity;
} MinHeap;

MinHeap* createMinHeap(int capacity) {
    MinHeap* heap = malloc(sizeof(MinHeap));
    heap->heap = malloc(capacity * sizeof(int));
    heap->size = 0;
    heap->capacity = capacity;
    return heap;
}

int parent(int i) { return (i - 1) / 2; }
int leftChild(int i) { return 2 * i + 1; }
int rightChild(int i) { return 2 * i + 2; }

void swap(int* a, int* b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

void heapifyUp(MinHeap* heap, int index) {
    while (index > 0 && heap->heap[parent(index)] > heap->heap[index]) {
        swap(&heap->heap[parent(index)], &heap->heap[index]);
        index = parent(index);
    }
}

void heapifyDown(MinHeap* heap, int index) {
    int smallest = index;
    int left = leftChild(index);
    int right = rightChild(index);
    
    if (left < heap->size && heap->heap[left] < heap->heap[smallest]) {
        smallest = left;
    }
    
    if (right < heap->size && heap->heap[right] < heap->heap[smallest]) {
        smallest = right;
    }
    
    if (smallest != index) {
        swap(&heap->heap[index], &heap->heap[smallest]);
        heapifyDown(heap, smallest);
    }
}

void insert(MinHeap* heap, int value) {
    if (heap->size >= heap->capacity) {
        printf("Heap overflow\\n");
        return;
    }
    
    heap->heap[heap->size] = value;
    heap->size++;
    heapifyUp(heap, heap->size - 1);
}

int extractMin(MinHeap* heap) {
    if (heap->size <= 0) {
        printf("Heap is empty\\n");
        return -1;
    }
    
    if (heap->size == 1) {
        heap->size--;
        return heap->heap[0];
    }
    
    int root = heap->heap[0];
    heap->heap[0] = heap->heap[heap->size - 1];
    heap->size--;
    heapifyDown(heap, 0);
    
    return root;
}

int peek(MinHeap* heap) {
    if (heap->size <= 0) return -1;
    return heap->heap[0];
}`,
    py: `class MinHeap:
    def __init__(self):
        self.heap = []
    
    def _parent(self, index):
        return (index - 1) // 2
    
    def _left_child(self, index):
        return 2 * index + 1
    
    def _right_child(self, index):
        return 2 * index + 2
    
    def _has_parent(self, index):
        return self._parent(index) >= 0
    
    def _has_left_child(self, index):
        return self._left_child(index) < len(self.heap)
    
    def _has_right_child(self, index):
        return self._right_child(index) < len(self.heap)
    
    def _swap(self, index1, index2):
        self.heap[index1], self.heap[index2] = self.heap[index2], self.heap[index1]
    
    def insert(self, value):
        self.heap.append(value)
        self._heapify_up()
    
    def extract_min(self):
        if len(self.heap) == 0:
            return None
        if len(self.heap) == 1:
            return self.heap.pop()
        
        min_value = self.heap[0]
        self.heap[0] = self.heap.pop()
        self._heapify_down()
        return min_value
    
    def peek(self):
        return self.heap[0] if self.heap else None
    
    def _heapify_up(self):
        index = len(self.heap) - 1
        while (self._has_parent(index) and 
               self.heap[self._parent(index)] > self.heap[index]):
            self._swap(self._parent(index), index)
            index = self._parent(index)
    
    def _heapify_down(self):
        index = 0
        while self._has_left_child(index):
            smaller_child_index = self._left_child(index)
            
            if (self._has_right_child(index) and 
                self.heap[self._right_child(index)] < self.heap[smaller_child_index]):
                smaller_child_index = self._right_child(index)
            
            if self.heap[index] < self.heap[smaller_child_index]:
                break
            
            self._swap(index, smaller_child_index)
            index = smaller_child_index
    
    def size(self):
        return len(self.heap)
    
    def is_empty(self):
        return len(self.heap) == 0`,
    cpp: `#include <vector>
#include <stdexcept>

class MinHeap {
private:
    std::vector<int> heap;
    
    int parent(int index) { return (index - 1) / 2; }
    int leftChild(int index) { return 2 * index + 1; }
    int rightChild(int index) { return 2 * index + 2; }
    
    bool hasParent(int index) { return parent(index) >= 0; }
    bool hasLeftChild(int index) { return leftChild(index) < heap.size(); }
    bool hasRightChild(int index) { return rightChild(index) < heap.size(); }
    
    void heapifyUp() {
        int index = heap.size() - 1;
        while (hasParent(index) && heap[parent(index)] > heap[index]) {
            std::swap(heap[parent(index)], heap[index]);
            index = parent(index);
        }
    }
    
    void heapifyDown() {
        int index = 0;
        while (hasLeftChild(index)) {
            int smallerChildIndex = leftChild(index);
            
            if (hasRightChild(index) && 
                heap[rightChild(index)] < heap[leftChild(index)]) {
                smallerChildIndex = rightChild(index);
            }
            
            if (heap[index] < heap[smallerChildIndex]) {
                break;
            }
            
            std::swap(heap[index], heap[smallerChildIndex]);
            index = smallerChildIndex;
        }
    }

public:
    void insert(int value) {
        heap.push_back(value);
        heapifyUp();
    }
    
    int extractMin() {
        if (heap.empty()) {
            throw std::runtime_error("Heap is empty");
        }
        
        if (heap.size() == 1) {
            int min = heap[0];
            heap.pop_back();
            return min;
        }
        
        int min = heap[0];
        heap[0] = heap.back();
        heap.pop_back();
        heapifyDown();
        return min;
    }
    
    int peek() const {
        if (heap.empty()) {
            throw std::runtime_error("Heap is empty");
        }
        return heap[0];
    }
    
    int size() const {
        return heap.size();
    }
    
    bool isEmpty() const {
        return heap.empty();
    }
    
    void printHeap() const {
        for (int val : heap) {
            std::cout << val << " ";
        }
        std::cout << std::endl;
    }
};`,
    idea: `Min Heap Properties:
1. Complete binary tree (all levels filled except possibly last)
2. Parent ≤ children (min heap property)
3. Root contains minimum element
4. Array representation: parent at i, children at 2i+1 and 2i+2

Operations:
- Insert: Add to end, heapify up - O(log n)
- Extract Min: Remove root, move last to root, heapify down - O(log n)
- Peek: Return root - O(1)

Used in: Priority queues, heap sort, Dijkstra's algorithm, Huffman coding`,
  };

  const updateForm = (n, key, value) => {
    if (key !== "start" || AEBool) {
      if (n == 1) {
        setAddForm((prev) => ({ ...prev, [key]: value }));
      } else if (n == 2) {
        setDeleteForm((prev) => ({ ...prev, [key]: value }));
      } else if (n == 3) {
        setSearchForm((prev) => ({ ...prev, [key]: value }));
      }
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 50, behavior: "smooth" });
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white pt-5">
      <PhoneScreenBlock message="Please switch to desktop mode to view this website" />

      {/* Visualization Section */}
      <div className="max-w-6xl mx-auto px-8 mb-12">
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex flex-col items-center space-y-6">
            <div className="flex gap-6">
              <div className="flex items-center gap-3">
                <Input
                  className="w-52 inpbox"
                  placeholder="Enter number to add"
                  onChange={(e) => updateForm(1, "val", Number(e.target.value))}
                />
                <Button
                  className="dobtn"
                  onClick={() => {
                    updateForm(1, "start", true);
                    setTimeout(() => updateForm(1, "start", false), 10);
                  }}
                >
                  Add
                </Button>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  onClick={() => {
                    updateForm(2, "start", true);
                    setTimeout(() => updateForm(2, "start", false), 10);
                  }}
                  className="dobtn"
                >
                  Extract Min
                </Button>
              </div>
            </div>

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
            dlt={deleteForm}
            srch={searchForm}
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
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
              Min Heap
            </h1>
            <div className="inline-flex items-center space-x-4 text-sm bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full px-4 py-2 mt-3 border border-blue-400/30">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                Insert: O(log n)
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-cyan-400 rounded-full mr-2"></span>
                Extract Min: O(log n)
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                Peek: O(1)
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-blue-300 mb-4 flex items-center">
            <span className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3 text-sm">
              🔻
            </span>
            How Min Heap Works
          </h2>
          <div className="space-y-4 text-gray-300 leading-relaxed">
            <p className="text-lg">
              A Min Heap is a complete binary tree where every parent node is
              less than or equal to its children. The minimum element is always
              at the root, making it perfect for priority queues and efficiently
              finding the smallest element.
            </p>
            <p className="text-lg">Key properties of Min Heap:</p>
            <ul className="list-disc ml-6 space-y-2">
              <li>
                <span className="text-blue-400 font-semibold">
                  Heap Property:
                </span>{" "}
                Parent ≤ children for all nodes
              </li>
              <li>
                <span className="text-blue-400 font-semibold">
                  Complete Tree:
                </span>{" "}
                All levels filled except possibly the last
              </li>
              <li>
                <span className="text-blue-400 font-semibold">
                  Array Representation:
                </span>{" "}
                Parent at index i, children at 2i+1 and 2i+2
              </li>
              <li>
                <span className="text-blue-400 font-semibold">
                  Root Minimum:
                </span>{" "}
                Smallest element always at index 0
              </li>
              <li>
                <span className="text-blue-400 font-semibold">
                  Efficient Operations:
                </span>{" "}
                Insert and extract in O(log n) time
              </li>
            </ul>
          </div>
        </div>

        {/* Code Block */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-cyan-300 mb-6 flex items-center">
            <span className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center mr-3 text-sm">
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

        {/* Operations Analysis */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-purple-300 mb-6 flex items-center">
            <span className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-3 text-sm">
              📊
            </span>
            Operations Analysis
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-300 mb-2">
                Time Complexity
              </h3>
              <ul className="text-gray-300 space-y-2">
                <li>
                  • <span className="text-blue-400 font-semibold">Insert:</span>{" "}
                  O(log n) - heapify up
                </li>
                <li>
                  •{" "}
                  <span className="text-blue-400 font-semibold">
                    Extract Min:
                  </span>{" "}
                  O(log n) - heapify down
                </li>
                <li>
                  • <span className="text-green-400 font-semibold">Peek:</span>{" "}
                  O(1) - just return root
                </li>
                <li>
                  •{" "}
                  <span className="text-cyan-400 font-semibold">
                    Build Heap:
                  </span>{" "}
                  O(n) from array
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-purple-300 mb-2">
                Space Complexity
              </h3>
              <ul className="text-gray-300 space-y-2">
                <li>
                  •{" "}
                  <span className="text-purple-400 font-semibold">
                    Storage:
                  </span>{" "}
                  O(n) for n elements
                </li>
                <li>
                  •{" "}
                  <span className="text-purple-400 font-semibold">
                    Array-based:
                  </span>{" "}
                  No extra pointer overhead
                </li>
                <li>
                  •{" "}
                  <span className="text-purple-400 font-semibold">
                    In-place:
                  </span>{" "}
                  Operations use O(1) extra space
                </li>
                <li>
                  •{" "}
                  <span className="text-purple-400 font-semibold">
                    Cache-friendly:
                  </span>{" "}
                  Good memory locality
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Applications & Use Cases */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-emerald-300 mb-4 flex items-center">
              🎯 <span className="ml-2">Applications</span>
            </h3>
            <ul className="text-gray-300 leading-relaxed space-y-2">
              <li>
                • <span className="text-emerald-400">Priority Queues:</span>{" "}
                Process scheduling, event simulation
              </li>
              <li>
                •{" "}
                <span className="text-emerald-400">
                  Dijkstra&apos;s Algorithm:
                </span>{" "}
                Shortest path finding
              </li>
              <li>
                • <span className="text-emerald-400">Huffman Coding:</span> Data
                compression algorithms
              </li>
              <li>
                • <span className="text-emerald-400">A* Search:</span>{" "}
                Pathfinding in games and robotics
              </li>
              <li>
                • <span className="text-emerald-400">Median Finding:</span>{" "}
                Using two heaps (min + max)
              </li>
            </ul>
          </div>
          <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-violet-300 mb-4 flex items-center">
              ⚡ <span className="ml-2">Advantages</span>
            </h3>
            <ul className="text-gray-300 leading-relaxed space-y-2">
              <li>
                • <span className="text-violet-400">Efficient min access:</span>{" "}
                O(1) to find minimum
              </li>
              <li>
                •{" "}
                <span className="text-violet-400">Logarithmic operations:</span>{" "}
                Insert/delete in O(log n)
              </li>
              <li>
                • <span className="text-violet-400">Memory efficient:</span>{" "}
                Array-based implementation
              </li>
              <li>
                • <span className="text-violet-400">Simple structure:</span>{" "}
                Easy to implement and understand
              </li>
              <li>
                • <span className="text-violet-400">Cache performance:</span>{" "}
                Good spatial locality
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
