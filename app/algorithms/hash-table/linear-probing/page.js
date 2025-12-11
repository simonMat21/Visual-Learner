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
    js: `// Linear Probing Hash Table Implementation
class LinearProbingHashTable {
  constructor(size = 11) {
    this.size = size;
    this.table = new Array(size).fill(null);
    this.deleted = new Array(size).fill(false); // Track deleted slots
    this.count = 0;
  }
  
  hash(key) {
    return key % this.size;
  }
  
  insert(key) {
    if (this.count >= this.size * 0.7) {
      this.resize();
    }
    
    let index = this.hash(key);
    
    // Linear probing: check consecutive slots
    while (this.table[index] !== null && this.table[index] !== key) {
      if (this.deleted[index]) break; // Can use deleted slot
      index = (index + 1) % this.size;
    }
    
    if (this.table[index] !== key) {
      this.table[index] = key;
      this.deleted[index] = false;
      this.count++;
    }
    return true;
  }
  
  search(key) {
    let index = this.hash(key);
    let probes = 0;
    
    while (this.table[index] !== null || this.deleted[index]) {
      if (this.table[index] === key && !this.deleted[index]) {
        return index; // Found
      }
      index = (index + 1) % this.size;
      probes++;
      
      if (probes >= this.size) break; // Avoid infinite loop
    }
    return -1; // Not found
  }
  
  delete(key) {
    let index = this.search(key);
    if (index !== -1) {
      this.table[index] = null;
      this.deleted[index] = true;
      this.count--;
      return true;
    }
    return false;
  }
  
  resize() {
    let oldTable = this.table;
    let oldDeleted = this.deleted;
    this.size = this.nextPrime(this.size * 2);
    this.table = new Array(this.size).fill(null);
    this.deleted = new Array(this.size).fill(false);
    this.count = 0;
    
    for (let i = 0; i < oldTable.length; i++) {
      if (oldTable[i] !== null && !oldDeleted[i]) {
        this.insert(oldTable[i]);
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

#define DELETED -1
#define EMPTY 0

typedef struct {
    int* table;
    int* status; // 0: empty, 1: occupied, -1: deleted
    int size;
    int count;
} HashTable;

HashTable* createHashTable(int size) {
    HashTable* ht = malloc(sizeof(HashTable));
    ht->size = size;
    ht->count = 0;
    ht->table = calloc(size, sizeof(int));
    ht->status = calloc(size, sizeof(int));
    return ht;
}

int hash(int key, int size) {
    return key % size;
}

bool insert(HashTable* ht, int key) {
    if (ht->count >= ht->size * 0.7) {
        // Should resize here
        return false;
    }
    
    int index = hash(key, ht->size);
    
    // Linear probing
    while (ht->status[index] == 1 && ht->table[index] != key) {
        index = (index + 1) % ht->size;
    }
    
    if (ht->table[index] != key) {
        ht->table[index] = key;
        ht->status[index] = 1;
        ht->count++;
    }
    return true;
}

int search(HashTable* ht, int key) {
    int index = hash(key, ht->size);
    int probes = 0;
    
    while (ht->status[index] != EMPTY) {
        if (ht->status[index] == 1 && ht->table[index] == key) {
            return index;
        }
        index = (index + 1) % ht->size;
        probes++;
        if (probes >= ht->size) break;
    }
    return -1;
}

bool delete(HashTable* ht, int key) {
    int index = search(ht, key);
    if (index != -1) {
        ht->status[index] = DELETED;
        ht->count--;
        return true;
    }
    return false;
}

void printHashTable(HashTable* ht) {
    printf("Hash Table:\\n");
    for (int i = 0; i < ht->size; i++) {
        if (ht->status[i] == 1) {
            printf("[%d]: %d\\n", i, ht->table[i]);
        } else if (ht->status[i] == DELETED) {
            printf("[%d]: DELETED\\n", i);
        } else {
            printf("[%d]: EMPTY\\n", i);
        }
    }
}`,
    py: `class LinearProbingHashTable:
    def __init__(self, size=11):
        self.size = size
        self.table = [None] * size
        self.deleted = [False] * size
        self.count = 0
    
    def _hash(self, key):
        return key % self.size
    
    def insert(self, key):
        if self.count >= self.size * 0.7:
            self._resize()
        
        index = self._hash(key)
        
        # Linear probing
        while (self.table[index] is not None and 
               self.table[index] != key and 
               not self.deleted[index]):
            index = (index + 1) % self.size
        
        if self.table[index] != key:
            self.table[index] = key
            self.deleted[index] = False
            self.count += 1
        return True
    
    def search(self, key):
        index = self._hash(key)
        probes = 0
        
        while (self.table[index] is not None or self.deleted[index]):
            if (self.table[index] == key and not self.deleted[index]):
                return index
            index = (index + 1) % self.size
            probes += 1
            if probes >= self.size:
                break
        return -1
    
    def delete(self, key):
        index = self.search(key)
        if index != -1:
            self.table[index] = None
            self.deleted[index] = True
            self.count -= 1
            return True
        return False
    
    def _resize(self):
        old_table = self.table[:]
        old_deleted = self.deleted[:]
        self.size = self._next_prime(self.size * 2)
        self.table = [None] * self.size
        self.deleted = [False] * self.size
        self.count = 0
        
        for i, item in enumerate(old_table):
            if item is not None and not old_deleted[i]:
                self.insert(item)
    
    def _is_prime(self, n):
        if n < 2:
            return False
        for i in range(2, int(n**0.5) + 1):
            if n % i == 0:
                return False
        return True
    
    def _next_prime(self, n):
        while not self._is_prime(n):
            n += 1
        return n
    
    def display(self):
        for i in range(self.size):
            if self.table[i] is not None and not self.deleted[i]:
                print(f"[{i}]: {self.table[i]}")
            elif self.deleted[i]:
                print(f"[{i}]: DELETED")
            else:
                print(f"[{i}]: EMPTY")`,
    cpp: `#include <vector>
#include <cmath>

class LinearProbingHashTable {
private:
    std::vector<int> table;
    std::vector<bool> deleted;
    int size;
    int count;
    
    int hash(int key) {
        return key % size;
    }
    
    bool isPrime(int n) {
        if (n < 2) return false;
        for (int i = 2; i <= sqrt(n); i++) {
            if (n % i == 0) return false;
        }
        return true;
    }
    
    int nextPrime(int n) {
        while (!isPrime(n)) n++;
        return n;
    }
    
    void resize() {
        std::vector<int> oldTable = table;
        std::vector<bool> oldDeleted = deleted;
        
        size = nextPrime(size * 2);
        table.assign(size, -1); // -1 represents empty
        deleted.assign(size, false);
        count = 0;
        
        for (int i = 0; i < oldTable.size(); i++) {
            if (oldTable[i] != -1 && !oldDeleted[i]) {
                insert(oldTable[i]);
            }
        }
    }

public:
    LinearProbingHashTable(int initialSize = 11) : 
        size(initialSize), count(0) {
        table.assign(size, -1);
        deleted.assign(size, false);
    }
    
    bool insert(int key) {
        if (count >= size * 0.7) {
            resize();
        }
        
        int index = hash(key);
        
        // Linear probing
        while (table[index] != -1 && table[index] != key && !deleted[index]) {
            index = (index + 1) % size;
        }
        
        if (table[index] != key) {
            table[index] = key;
            deleted[index] = false;
            count++;
        }
        return true;
    }
    
    int search(int key) {
        int index = hash(key);
        int probes = 0;
        
        while (table[index] != -1 || deleted[index]) {
            if (table[index] == key && !deleted[index]) {
                return index;
            }
            index = (index + 1) % size;
            probes++;
            if (probes >= size) break;
        }
        return -1;
    }
    
    bool remove(int key) {
        int index = search(key);
        if (index != -1) {
            table[index] = -1;
            deleted[index] = true;
            count--;
            return true;
        }
        return false;
    }
    
    void display() {
        for (int i = 0; i < size; i++) {
            if (table[i] != -1 && !deleted[i]) {
                std::cout << "[" << i << "]: " << table[i] << std::endl;
            } else if (deleted[i]) {
                std::cout << "[" << i << "]: DELETED" << std::endl;
            } else {
                std::cout << "[" << i << "]: EMPTY" << std::endl;
            }
        }
    }
    
    double loadFactor() const {
        return static_cast<double>(count) / size;
    }
};`,
    idea: `Linear Probing Hash Table:
1. Use hash function: h(k) = k % table_size
2. On collision, probe linearly: h(k), h(k)+1, h(k)+2, ...
3. Insert: Find next available slot using linear sequence
4. Search: Follow same probe sequence until found or empty
5. Delete: Mark as deleted (tombstone) to maintain probe chains

Advantages: Simple, cache-friendly
Disadvantages: Primary clustering, performance degrades with high load factor
Load factor should stay < 0.7 for good performance`,
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
            <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent mb-2">
              Linear Probing Hash Table
            </h1>
            <div className="inline-flex items-center space-x-4 text-sm bg-gradient-to-r from-teal-400/20 to-cyan-400/20 rounded-full px-4 py-2 mt-3 border border-teal-400/30">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-teal-400 rounded-full mr-2"></span>
                Average: O(1)
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-cyan-400 rounded-full mr-2"></span>
                Worst: O(n)
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                Space: O(n)
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-teal-300 mb-4 flex items-center">
            <span className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center mr-3 text-sm">
              ↗️
            </span>
            How Linear Probing Works
          </h2>
          <div className="space-y-4 text-gray-300 leading-relaxed">
            <p className="text-lg">
              Linear Probing is a collision resolution technique for hash tables
              that uses consecutive slots to resolve collisions. When a
              collision occurs at index i, the algorithm checks slots i+1, i+2,
              i+3, ... until an empty slot is found.
            </p>
            <p className="text-lg">The probing sequence follows the formula:</p>
            <div className="bg-gradient-to-r from-teal-500/10 to-cyan-500/10 border border-teal-500/20 rounded-lg p-4 my-4">
              <p className="text-center text-xl font-bold text-teal-400">
                h(k, i) = (h(k) + i) mod m
              </p>
              <p className="text-center text-sm text-gray-300 mt-2">
                where k = key, i = probe number (0, 1, 2, ...), m = table size
              </p>
            </div>
            <ul className="list-disc ml-6 space-y-2">
              <li>
                <span className="text-teal-400 font-semibold">
                  Simple implementation:
                </span>{" "}
                Easy to understand and code
              </li>
              <li>
                <span className="text-teal-400 font-semibold">
                  Cache-friendly:
                </span>{" "}
                Sequential memory access improves performance
              </li>
              <li>
                <span className="text-teal-400 font-semibold">
                  Primary clustering:
                </span>{" "}
                Keys tend to cluster together
              </li>
              <li>
                <span className="text-teal-400 font-semibold">
                  Tombstone deletion:
                </span>{" "}
                Mark deleted slots to maintain probe chains
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

        {/* Algorithm Analysis */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-blue-300 mb-6 flex items-center">
            <span className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3 text-sm">
              📊
            </span>
            Performance Analysis
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-teal-500/10 to-cyan-500/10 border border-teal-500/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-teal-300 mb-2">
                Time Complexity
              </h3>
              <ul className="text-gray-300 space-y-2">
                <li>
                  •{" "}
                  <span className="text-green-400 font-semibold">
                    Average Insert:
                  </span>{" "}
                  O(1)
                </li>
                <li>
                  •{" "}
                  <span className="text-green-400 font-semibold">
                    Average Search:
                  </span>{" "}
                  O(1)
                </li>
                <li>
                  •{" "}
                  <span className="text-green-400 font-semibold">
                    Average Delete:
                  </span>{" "}
                  O(1)
                </li>
                <li>
                  •{" "}
                  <span className="text-red-400 font-semibold">
                    Worst case:
                  </span>{" "}
                  O(n) for all operations
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-300 mb-2">
                Load Factor Impact
              </h3>
              <ul className="text-gray-300 space-y-2">
                <li>
                  •{" "}
                  <span className="text-blue-400 font-semibold">α = 0.5:</span>{" "}
                  ~1.5 probes average
                </li>
                <li>
                  •{" "}
                  <span className="text-blue-400 font-semibold">α = 0.7:</span>{" "}
                  ~2.2 probes average
                </li>
                <li>
                  •{" "}
                  <span className="text-blue-400 font-semibold">α = 0.9:</span>{" "}
                  ~5.5 probes average
                </li>
                <li>
                  •{" "}
                  <span className="text-red-400 font-semibold">
                    α &gt; 0.7:
                  </span>{" "}
                  Performance degrades rapidly
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
                <span className="text-emerald-400">Simple implementation:</span>{" "}
                Easy to understand and code
              </li>
              <li>
                • <span className="text-emerald-400">Cache-friendly:</span>{" "}
                Sequential memory access pattern
              </li>
              <li>
                • <span className="text-emerald-400">Memory efficient:</span> No
                extra pointers or structures
              </li>
              <li>
                • <span className="text-emerald-400">Good locality:</span>{" "}
                Related data stored close together
              </li>
              <li>
                • <span className="text-emerald-400">Fast when sparse:</span>{" "}
                Excellent performance at low load factors
              </li>
            </ul>
          </div>
          <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-red-300 mb-4 flex items-center">
              ❌ <span className="ml-2">Disadvantages</span>
            </h3>
            <ul className="text-gray-300 leading-relaxed space-y-2">
              <li>
                • <span className="text-red-400">Primary clustering:</span>{" "}
                Consecutive occupied slots form clusters
              </li>
              <li>
                • <span className="text-red-400">Load factor sensitive:</span>{" "}
                Performance degrades quickly after 70%
              </li>
              <li>
                • <span className="text-red-400">Deletion complexity:</span>{" "}
                Requires tombstone mechanism
              </li>
              <li>
                • <span className="text-red-400">Poor worst-case:</span> Can
                degrade to O(n) in bad scenarios
              </li>
              <li>
                • <span className="text-red-400">Table size matters:</span>{" "}
                Should use prime numbers for better distribution
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
