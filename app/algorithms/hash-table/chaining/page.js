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
class ChainingHashTable {
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
  
  display() {
    for (let i = 0; i < this.size; i++) {
      console.log(\`[\${i}]: \${this.table[i].join(' -> ')}\`);
    }
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
}

void printHashTable(HashTable* ht) {
    for (int i = 0; i < ht->size; i++) {
        printf("[%d]: ", i);
        Node* current = ht->table[i];
        while (current != NULL) {
            printf("%d -> ", current->key);
            current = current->next;
        }
        printf("NULL\\n");
    }
}`,
    py: `class Node:
    def __init__(self, key):
        self.key = key
        self.next = None

class ChainingHashTable:
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
                current = current.next
    
    def display(self):
        for i in range(self.size):
            print(f"[{i}]: ", end="")
            current = self.table[i]
            while current:
                print(f"{current.key} -> ", end="")
                current = current.next
            print("NULL")`,
    cpp: `#include <vector>
#include <list>
#include <algorithm>
#include <iostream>

class ChainingHashTable {
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
    ChainingHashTable(int initialSize = 11) : size(initialSize), count(0) {
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
    
    void display() {
        for (int i = 0; i < size; i++) {
            std::cout << "[" << i << "]: ";
            for (int key : table[i]) {
                std::cout << key << " -> ";
            }
            std::cout << "NULL" << std::endl;
        }
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

Advantages: Simple collision handling, no clustering
Load factor can exceed 1.0
Good performance even with many collisions`,
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
              Chaining Hash Table
            </h1>
            <div className="vl-meta mt-3">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-pen-green rounded-full mr-2"></span>
                Average: O(1)
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-pen-green rounded-full mr-2"></span>
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
            How Chaining Works
          </h2>
          <div className="space-y-4 text-ink-2 leading-relaxed">
            <p className="text-lg">
              Chaining is a collision resolution technique for hash tables that
              handles collisions by storing multiple elements at the same index
              using linked lists. Each table slot contains a pointer to a linked
              list of all elements that hash to that particular index.
            </p>
            <p className="text-lg">The key advantages of chaining:</p>
            <ul className="list-disc ml-6 space-y-2">
              <li>
                <span className="text-pen-green font-semibold">
                  Simple implementation:
                </span>{" "}
                Easy to understand and implement
              </li>
              <li>
                <span className="text-pen-green font-semibold">
                  No clustering:
                </span>{" "}
                Collisions don&apos;t affect neighboring slots
              </li>
              <li>
                <span className="text-pen-green font-semibold">
                  Dynamic size:
                </span>{" "}
                Chains can grow as needed
              </li>
              <li>
                <span className="text-pen-green font-semibold">
                  Load factor flexibility:
                </span>{" "}
                Can exceed 1.0 without major issues
              </li>
              <li>
                <span className="text-pen-green font-semibold">
                  Easy deletion:
                </span>{" "}
                No tombstone mechanism needed
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

        {/* Algorithm Analysis */}
        <div className="vl-card p-8">
          <h2 className="vl-h2 mb-6">
            Performance Analysis
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="vl-note vl-note-green p-6">
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
                  O(1 + α)
                </li>
                <li>
                  •{" "}
                  <span className="text-pen-green font-semibold">
                    Average Delete:
                  </span>{" "}
                  O(1 + α)
                </li>
                <li>
                  •{" "}
                  <span className="text-pen-rust font-semibold">
                    Worst case:
                  </span>{" "}
                  O(n) when all keys hash to same slot
                </li>
              </ul>
            </div>
            <div className="vl-note vl-note-blue p-6">
              <h3 className="vl-h3 mb-2">
                Load Factor Impact
              </h3>
              <ul className="text-ink-2 space-y-2">
                <li>
                  •{" "}
                  <span className="text-pen-blue font-semibold">α = n/m:</span>{" "}
                  average chain length
                </li>
                <li>
                  •{" "}
                  <span className="text-pen-blue font-semibold">α = 0.75:</span>{" "}
                  good performance
                </li>
                <li>
                  •{" "}
                  <span className="text-pen-blue font-semibold">α = 1.0:</span>{" "}
                  still acceptable
                </li>
                <li>
                  •{" "}
                  <span className="text-pen-blue font-semibold">
                    α &gt; 2.0:
                  </span>{" "}
                  consider resizing
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Advantages & Disadvantages */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="vl-card p-6">
            <h3 className="vl-h3 mb-4">
               <span>Advantages</span>
            </h3>
            <ul className="text-ink-2 leading-relaxed space-y-2">
              <li>
                • <span className="text-pen-green">Simple to implement:</span>{" "}
                Straightforward collision handling
              </li>
              <li>
                • <span className="text-pen-green">No clustering:</span> Each
                slot is independent
              </li>
              <li>
                •{" "}
                <span className="text-pen-green">Flexible load factor:</span>{" "}
                Can exceed 1.0
              </li>
              <li>
                • <span className="text-pen-green">Easy deletion:</span> No
                special handling needed
              </li>
              <li>
                • <span className="text-pen-green">Memory efficient:</span>{" "}
                Only allocates what&apos;s needed
              </li>
            </ul>
          </div>
          <div className="vl-card p-6">
            <h3 className="vl-h3 mb-4">
               <span>Disadvantages</span>
            </h3>
            <ul className="text-ink-2 leading-relaxed space-y-2">
              <li>
                • <span className="text-pen-rust">Memory overhead:</span> Extra
                space for pointers
              </li>
              <li>
                • <span className="text-pen-rust">Cache performance:</span> Poor
                memory locality
              </li>
              <li>
                • <span className="text-pen-rust">Dynamic allocation:</span>{" "}
                Runtime memory management
              </li>
              <li>
                • <span className="text-pen-rust">Poor worst case:</span> All
                elements in one chain
              </li>
              <li>
                • <span className="text-pen-rust">Pointer dereferencing:</span>{" "}
                Extra indirection overhead
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
