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
    val: 0,
    start: false,
  });

  const [animSpd, setAnimSpd] = useState(1);

  const codeSnippets = {
    js: `// Hash Table with Chaining Implementation
class HashTable {
  constructor(size = 11) {
    this.size = size;
    this.table = new Array(size).fill(null).map(() => []);
    this.count = 0;
  }
  
  hash(key) {
    return key % this.size;
  }
  
  insert(key) {
    const index = this.hash(key);
    const bucket = this.table[index];
    
    // Check if key already exists
    if (!bucket.includes(key)) {
      bucket.push(key);
      this.count++;
      
      // Resize if load factor > 0.75
      if (this.count > this.size * 0.75) {
        this.resize();
      }
    }
  }
  
  search(key) {
    const index = this.hash(key);
    const bucket = this.table[index];
    return bucket.includes(key) ? index : -1;
  }
  
  delete(key) {
    const index = this.hash(key);
    const bucket = this.table[index];
    const keyIndex = bucket.indexOf(key);
    
    if (keyIndex !== -1) {
      bucket.splice(keyIndex, 1);
      this.count--;
      return true;
    }
    return false;
  }
  
  resize() {
    const oldTable = this.table;
    this.size = this.nextPrime(this.size * 2);
    this.table = new Array(this.size).fill(null).map(() => []);
    this.count = 0;
    
    for (let bucket of oldTable) {
      for (let key of bucket) {
        this.insert(key);
      }
    }
  }
  
  nextPrime(n) {
    while (!this.isPrime(n)) n++;
    return n;
  }
  
  isPrime(n) {
    if (n < 2) return false;
    for (let i = 2; i <= Math.sqrt(n); i++) {
      if (n % i === 0) return false;
    }
    return true;
  }
}`,
    c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

typedef struct Node {
    int key;
    struct Node* next;
} Node;

typedef struct {
    Node** table;
    int size;
    int count;
} HashTable;

HashTable* createHashTable(int size) {
    HashTable* ht = malloc(sizeof(HashTable));
    ht->size = size;
    ht->count = 0;
    ht->table = calloc(size, sizeof(Node*));
    return ht;
}

int hash(int key, int size) {
    return key % size;
}

void insert(HashTable* ht, int key) {
    int index = hash(key, ht->size);
    Node* current = ht->table[index];
    
    // Check if key already exists
    while (current != NULL) {
        if (current->key == key) return;
        current = current->next;
    }
    
    // Insert new node at beginning of chain
    Node* newNode = malloc(sizeof(Node));
    newNode->key = key;
    newNode->next = ht->table[index];
    ht->table[index] = newNode;
    ht->count++;
}

bool search(HashTable* ht, int key) {
    int index = hash(key, ht->size);
    Node* current = ht->table[index];
    
    while (current != NULL) {
        if (current->key == key) return true;
        current = current->next;
    }
    return false;
}

bool delete(HashTable* ht, int key) {
    int index = hash(key, ht->size);
    Node* current = ht->table[index];
    Node* prev = NULL;
    
    while (current != NULL) {
        if (current->key == key) {
            if (prev == NULL) {
                ht->table[index] = current->next;
            } else {
                prev->next = current->next;
            }
            free(current);
            ht->count--;
            return true;
        }
        prev = current;
        current = current->next;
    }
    return false;
}`,
    py: `class Node:
    def __init__(self, key):
        self.key = key
        self.next = None

class HashTable:
    def __init__(self, size=11):
        self.size = size
        self.table = [None] * size
        self.count = 0
    
    def _hash(self, key):
        return key % self.size
    
    def insert(self, key):
        index = self._hash(key)
        
        # Check if key already exists
        current = self.table[index]
        while current:
            if current.key == key:
                return
            current = current.next
        
        # Insert new node at beginning of chain
        new_node = Node(key)
        new_node.next = self.table[index]
        self.table[index] = new_node
        self.count += 1
        
        # Resize if load factor > 0.75
        if self.count > self.size * 0.75:
            self._resize()
    
    def search(self, key):
        index = self._hash(key)
        current = self.table[index]
        
        while current:
            if current.key == key:
                return True
            current = current.next
        return False
    
    def delete(self, key):
        index = self._hash(key)
        current = self.table[index]
        prev = None
        
        while current:
            if current.key == key:
                if prev:
                    prev.next = current.next
                else:
                    self.table[index] = current.next
                self.count -= 1
                return True
            prev = current
            current = current.next
        return False
    
    def _resize(self):
        old_table = self.table
        self.size = self._next_prime(self.size * 2)
        self.table = [None] * self.size
        self.count = 0
        
        for head in old_table:
            current = head
            while current:
                self.insert(current.key)
                current = current.next`,
    cpp: `#include <vector>
#include <list>
#include <algorithm>

class HashTable {
private:
    std::vector<std::list<int>> table;
    int size;
    int count;
    
    int hash(int key) {
        return key % size;
    }
    
    bool isPrime(int n) {
        if (n < 2) return false;
        for (int i = 2; i * i <= n; i++) {
            if (n % i == 0) return false;
        }
        return true;
    }
    
    int nextPrime(int n) {
        while (!isPrime(n)) n++;
        return n;
    }
    
    void resize() {
        std::vector<std::list<int>> oldTable = table;
        size = nextPrime(size * 2);
        table.assign(size, std::list<int>());
        count = 0;
        
        for (const auto& bucket : oldTable) {
            for (int key : bucket) {
                insert(key);
            }
        }
    }

public:
    HashTable(int initialSize = 11) : size(initialSize), count(0) {
        table.resize(size);
    }
    
    void insert(int key) {
        int index = hash(key);
        auto& bucket = table[index];
        
        // Check if key already exists
        if (std::find(bucket.begin(), bucket.end(), key) == bucket.end()) {
            bucket.push_back(key);
            count++;
            
            // Resize if load factor > 0.75
            if (count > size * 0.75) {
                resize();
            }
        }
    }
    
    bool search(int key) {
        int index = hash(key);
        const auto& bucket = table[index];
        return std::find(bucket.begin(), bucket.end(), key) != bucket.end();
    }
    
    bool remove(int key) {
        int index = hash(key);
        auto& bucket = table[index];
        auto it = std::find(bucket.begin(), bucket.end(), key);
        
        if (it != bucket.end()) {
            bucket.erase(it);
            count--;
            return true;
        }
        return false;
    }
    
    double loadFactor() const {
        return static_cast<double>(count) / size;
    }
};`,
    idea: `Hash Table with Chaining:
1. Hash function maps keys to table indices
2. Collisions handled by chaining (linked lists)
3. Insert: Hash key, add to chain at index
4. Search: Hash key, traverse chain at index
5. Delete: Hash key, remove from chain at index

Load factor = n/m (items/table size)
Keep load factor < 0.75 for good performance
Resize table when load factor gets too high`,
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
    <main className="vl-page">
      <PhoneScreenBlock message="Please switch to desktop mode to view this website" />

      {/* Title */}
      <div className="max-w-6xl mx-auto px-8 mb-6">
        <div className="vl-hero">
          <div>
            <h1 className="vl-title text-4xl mb-2">
              Hash Table
            </h1>
            <div className="vl-meta mt-3">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-pen-rust rounded-full mr-2"></span>
                Average: O(1)
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-pen-rust rounded-full mr-2"></span>
                Worst: O(n)
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-pen-green rounded-full mr-2"></span>
                Space: O(n)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Visualization Section */}
      <div className="max-w-6xl mx-auto px-8 mb-12">
        <div className="vl-card p-6">
          <div className="flex flex-col items-center space-y-6">
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
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

              <div className="flex items-center gap-2">
                <Input
                  className="w-52 inpbox"
                  placeholder="Enter number to search"
                  onChange={(e) => updateForm(3, "val", Number(e.target.value))}
                />
                <Button
                  onClick={() => {
                    updateForm(3, "start", true);
                    setTimeout(() => updateForm(3, "start", false), 10);
                  }}
                  className="dobtn"
                >
                  Search
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Input
                  className="w-52 inpbox"
                  placeholder="Enter number to delete"
                  onChange={(e) => updateForm(2, "val", Number(e.target.value))}
                />
                <Button
                  onClick={() => {
                    updateForm(2, "start", true);
                    setTimeout(() => updateForm(2, "start", false), 10);
                  }}
                  className="dobtn"
                >
                  Delete
                </Button>
              </div>
            </div>

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

        {/* Description */}
        <div className="vl-card p-8">
          <h2 className="vl-h2 mb-4">
            How Hash Tables Work
          </h2>
          <div className="space-y-4 text-ink-2 leading-relaxed">
            <p className="text-lg">
              A Hash Table is a data structure that implements an associative
              array, mapping keys to values using a hash function. It provides
              fast insertion, deletion, and lookup operations by computing an
              index into an array of buckets.
            </p>
            <p className="text-lg">The key components are:</p>
            <ul className="list-disc ml-6 space-y-2">
              <li>
                <span className="text-pen-rust font-semibold">
                  Hash Function:
                </span>{" "}
                Maps keys to array indices (e.g., key % table_size)
              </li>
              <li>
                <span className="text-pen-rust font-semibold">
                  Collision Resolution:
                </span>{" "}
                Handles when multiple keys hash to the same index
              </li>
              <li>
                <span className="text-pen-rust font-semibold">Chaining:</span>{" "}
                Uses linked lists to store multiple elements at same index
              </li>
              <li>
                <span className="text-pen-rust font-semibold">
                  Load Factor:
                </span>{" "}
                Ratio of elements to table size, affects performance
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
            height="800px"
          />
        </div>

        {/* Performance Analysis */}
        <div className="vl-card p-8">
          <h2 className="vl-h2 mb-6">
            Performance Analysis
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="vl-note vl-note-rust p-6">
              <h3 className="vl-h3 mb-2">
                Time Complexity
              </h3>
              <ul className="text-ink-2 space-y-2">
                <li>
                  •{" "}
                  <span className="text-pen-green font-semibold">
                    Average Insert:
                  </span>{" "}
                  O(1)
                </li>
                <li>
                  •{" "}
                  <span className="text-pen-green font-semibold">
                    Average Search:
                  </span>{" "}
                  O(1)
                </li>
                <li>
                  •{" "}
                  <span className="text-pen-green font-semibold">
                    Average Delete:
                  </span>{" "}
                  O(1)
                </li>
                <li>
                  •{" "}
                  <span className="text-pen-rust font-semibold">
                    Worst case:
                  </span>{" "}
                  O(n) for all operations
                </li>
              </ul>
            </div>
            <div className="vl-note vl-note-blue p-6">
              <h3 className="vl-h3 mb-2">
                Key Properties
              </h3>
              <ul className="text-ink-2 space-y-2">
                <li>
                  • <span className="text-pen-blue font-semibold">Space:</span>{" "}
                  O(n) for table storage
                </li>
                <li>
                  •{" "}
                  <span className="text-pen-blue font-semibold">
                    Load factor:
                  </span>{" "}
                  α = n/m should be &lt; 0.75
                </li>
                <li>
                  •{" "}
                  <span className="text-pen-blue font-semibold">
                    Hash function:
                  </span>{" "}
                  Determines distribution quality
                </li>
                <li>
                  •{" "}
                  <span className="text-pen-blue font-semibold">
                    Dynamic resizing:
                  </span>{" "}
                  Maintains performance
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Collision Resolution & Hash Functions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="vl-card p-6">
            <h3 className="vl-h3 mb-4">
               <span>Collision Resolution</span>
            </h3>
            <ul className="text-ink-2 leading-relaxed space-y-2">
              <li>
                • <span className="text-pen-plum">Chaining:</span> Linked
                lists at each index
              </li>
              <li>
                • <span className="text-pen-plum">Linear Probing:</span> Check
                next available slot
              </li>
              <li>
                • <span className="text-pen-plum">Quadratic Probing:</span>{" "}
                Check slots at quadratic intervals
              </li>
              <li>
                • <span className="text-pen-plum">Double Hashing:</span> Use
                second hash function
              </li>
            </ul>
          </div>
          <div className="vl-card p-6">
            <h3 className="vl-h3 mb-4">
               <span>Hash Functions</span>
            </h3>
            <ul className="text-ink-2 leading-relaxed space-y-2">
              <li>
                • <span className="text-pen-green">Division:</span> h(k) = k
                mod m
              </li>
              <li>
                • <span className="text-pen-green">Multiplication:</span> h(k)
                = ⌊m(kA mod 1)⌋
              </li>
              <li>
                • <span className="text-pen-green">Universal hashing:</span>{" "}
                Randomized functions
              </li>
              <li>
                • <span className="text-pen-green">Cryptographic:</span> MD5,
                SHA for security
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
