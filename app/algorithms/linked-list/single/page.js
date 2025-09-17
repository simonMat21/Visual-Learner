"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { CodeBlock, TextBox } from "@/components/CodeBlock";
import PhoneScreenBlock from "@/components/phoneScreenBlocker";

import P5Sketch from "./P5Sketch";

export default function Home() {
  const [AEBool, setAEBool] = useState(true);
  const [addForm, setAddForm] = useState({ val: [10, 20, 30], start: false });
  const [searchForm, setSearchForm] = useState({
    val: 0,
    start: false,
  });
  const [deleteForm, setDeleteForm] = useState({
    pos: 0,
    start: false,
  });
  const [insertForm, setInsertForm] = useState({
    val: 0,
    pos: 0,
    start: false,
  });

  const [animSpd, setAnimSpd] = useState(1);

  const updateForm = (n, key, value) => {
    if (key !== "start" || AEBool) {
      if (n == 1) {
        setAddForm((prev) => ({ ...prev, [key]: value }));
      } else if (n == 2) {
        setDeleteForm((prev) => ({ ...prev, [key]: value }));
      } else if (n == 3) {
        setSearchForm((prev) => ({ ...prev, [key]: value }));
      } else if (n == 4) {
        setInsertForm((prev) => ({ ...prev, [key]: value }));
      }
    }
  };

  const handleArrayInput = (value) => {
    try {
      const arr = value
        .split(",")
        .map((num) => parseInt(num.trim()))
        .filter((num) => !isNaN(num));
      updateForm(1, "val", arr);
    } catch (error) {
      console.error("Invalid array input");
    }
  };

  const codeSnippets = {
    setup: {
      js: `class Node {
    constructor(data) {
        this.data = data;
        this.next = null;
    }
}

class SinglyLinkedList {
    constructor() {
        this.head = null;
        this.size = 0;
    }
}`,
      c: `struct Node {
    int data;
    struct Node* next;
};

struct SinglyLinkedList {
    struct Node* head;
    int size;
};

struct Node* createNode(int data) {
    struct Node* newNode = malloc(sizeof(struct Node));
    newNode->data = data;
    newNode->next = NULL;
    return newNode;
}`,
      py: `class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

class SinglyLinkedList:
    def __init__(self):
        self.head = None
        self.size = 0`,
      cpp: `struct Node {
    int data;
    Node* next;
    
    Node(int val) : data(val), next(nullptr) {}
};

class SinglyLinkedList {
    Node* head;
    int size;
    
public:
    SinglyLinkedList() : head(nullptr), size(0) {}
};`,
      idea: `Create Node structure with:
- Data value
- Next pointer (forward direction only)
Initialize list with null head
Simpler than doubly linked list`,
    },
    insert: {
      js: `insertAtPosition(data, position) {
    if (position < 0 || position > this.size) return false;
    
    const newNode = new Node(data);
    
    if (position === 0) {
        // Insert at beginning
        newNode.next = this.head;
        this.head = newNode;
    } else {
        // Traverse to position - 1
        let current = this.head;
        for (let i = 0; i < position - 1; i++) {
            current = current.next;
        }
        
        newNode.next = current.next;
        current.next = newNode;
    }
    
    this.size++;
    return true;
}

// Insert at beginning
prepend(data) {
    const newNode = new Node(data);
    newNode.next = this.head;
    this.head = newNode;
    this.size++;
}

// Insert at end
append(data) {
    const newNode = new Node(data);
    
    if (!this.head) {
        this.head = newNode;
    } else {
        let current = this.head;
        while (current.next) {
            current = current.next;
        }
        current.next = newNode;
    }
    
    this.size++;
}`,
      c: `int insertAtPosition(struct SinglyLinkedList* list, int data, int position) {
    if (position < 0 || position > list->size) return 0;
    
    struct Node* newNode = createNode(data);
    
    if (position == 0) {
        newNode->next = list->head;
        list->head = newNode;
    } else {
        struct Node* current = list->head;
        for (int i = 0; i < position - 1; i++) {
            current = current->next;
        }
        
        newNode->next = current->next;
        current->next = newNode;
    }
    
    list->size++;
    return 1;
}

void prepend(struct SinglyLinkedList* list, int data) {
    struct Node* newNode = createNode(data);
    newNode->next = list->head;
    list->head = newNode;
    list->size++;
}`,
      py: `def insert_at_position(self, data, position):
    if position < 0 or position > self.size:
        return False
    
    new_node = Node(data)
    
    if position == 0:
        # Insert at beginning
        new_node.next = self.head
        self.head = new_node
    else:
        # Traverse to position - 1
        current = self.head
        for i in range(position - 1):
            current = current.next
        
        new_node.next = current.next
        current.next = new_node
    
    self.size += 1
    return True

def prepend(self, data):
    new_node = Node(data)
    new_node.next = self.head
    self.head = new_node
    self.size += 1

def append(self, data):
    new_node = Node(data)
    
    if not self.head:
        self.head = new_node
    else:
        current = self.head
        while current.next:
            current = current.next
        current.next = new_node
    
    self.size += 1`,
      cpp: `bool insertAtPosition(int data, int position) {
    if (position < 0 || position > size) return false;
    
    Node* newNode = new Node(data);
    
    if (position == 0) {
        newNode->next = head;
        head = newNode;
    } else {
        Node* current = head;
        for (int i = 0; i < position - 1; i++) {
            current = current->next;
        }
        
        newNode->next = current->next;
        current->next = newNode;
    }
    
    size++;
    return true;
}

void prepend(int data) {
    Node* newNode = new Node(data);
    newNode->next = head;
    head = newNode;
    size++;
}`,
      idea: `Two cases for insertion:
1. At beginning: Update head pointer
2. Elsewhere: Traverse to position-1
Only need to update 2 pointers
Simpler than doubly linked list`,
    },
    search: {
      js: `search(data) {
    let current = this.head;
    let position = 0;
    
    while (current !== null) {
        if (current.data === data) {
            return { found: true, position: position, node: current };
        }
        current = current.next;
        position++;
    }
    
    return { found: false, position: -1, node: null };
}

// Search with early termination for sorted lists
searchSorted(data) {
    let current = this.head;
    let position = 0;
    
    while (current !== null) {
        if (current.data === data) {
            return { found: true, position: position, node: current };
        }
        
        // Early termination if list is sorted
        if (current.data > data) {
            break;
        }
        
        current = current.next;
        position++;
    }
    
    return { found: false, position: -1, node: null };
}`,
      c: `struct SearchResult {
    int found;
    int position;
    struct Node* node;
};

struct SearchResult search(struct SinglyLinkedList* list, int data) {
    struct SearchResult result = {0, -1, NULL};
    struct Node* current = list->head;
    int position = 0;
    
    while (current != NULL) {
        if (current->data == data) {
            result.found = 1;
            result.position = position;
            result.node = current;
            return result;
        }
        current = current->next;
        position++;
    }
    
    return result;
}`,
      py: `def search(self, data):
    current = self.head
    position = 0
    
    while current is not None:
        if current.data == data:
            return {'found': True, 'position': position, 'node': current}
        current = current.next
        position += 1
    
    return {'found': False, 'position': -1, 'node': None}

def search_sorted(self, data):
    current = self.head
    position = 0
    
    while current is not None:
        if current.data == data:
            return {'found': True, 'position': position, 'node': current}
        
        # Early termination for sorted lists
        if current.data > data:
            break
            
        current = current.next
        position += 1
    
    return {'found': False, 'position': -1, 'node': None}`,
      cpp: `struct SearchResult {
    bool found;
    int position;
    Node* node;
};

SearchResult search(int data) {
    Node* current = head;
    int position = 0;
    
    while (current != nullptr) {
        if (current->data == data) {
            return {true, position, current};
        }
        current = current->next;
        position++;
    }
    
    return {false, -1, nullptr};
}`,
      idea: `Linear search through list:
1. Start from head only
2. Compare each node's data
3. Return position if found
4. No backward traversal
   (unlike doubly linked list)`,
    },
    delete: {
      js: `deleteAtPosition(position) {
    if (position < 0 || position >= this.size || this.head === null) {
        return false;
    }
    
    if (position === 0) {
        // Delete first node
        this.head = this.head.next;
    } else {
        // Traverse to position - 1
        let current = this.head;
        for (let i = 0; i < position - 1; i++) {
            current = current.next;
        }
        
        // Skip the node to delete
        current.next = current.next.next;
    }
    
    this.size--;
    return true;
}

deleteByValue(data) {
    if (!this.head) return false;
    
    // If head contains the data
    if (this.head.data === data) {
        this.head = this.head.next;
        this.size--;
        return true;
    }
    
    let current = this.head;
    while (current.next && current.next.data !== data) {
        current = current.next;
    }
    
    if (current.next) {
        current.next = current.next.next;
        this.size--;
        return true;
    }
    
    return false;
}`,
      c: `int deleteAtPosition(struct SinglyLinkedList* list, int position) {
    if (position < 0 || position >= list->size || list->head == NULL) {
        return 0;
    }
    
    struct Node* nodeToDelete;
    
    if (position == 0) {
        nodeToDelete = list->head;
        list->head = list->head->next;
    } else {
        struct Node* current = list->head;
        for (int i = 0; i < position - 1; i++) {
            current = current->next;
        }
        
        nodeToDelete = current->next;
        current->next = current->next->next;
    }
    
    free(nodeToDelete);
    list->size--;
    return 1;
}`,
      py: `def delete_at_position(self, position):
    if position < 0 or position >= self.size or self.head is None:
        return False
    
    if position == 0:
        # Delete first node
        self.head = self.head.next
    else:
        # Traverse to position - 1
        current = self.head
        for i in range(position - 1):
            current = current.next
        
        # Skip the node to delete
        current.next = current.next.next
    
    self.size -= 1
    return True

def delete_by_value(self, data):
    if not self.head:
        return False
    
    # If head contains the data
    if self.head.data == data:
        self.head = self.head.next
        self.size -= 1
        return True
    
    current = self.head
    while current.next and current.next.data != data:
        current = current.next
    
    if current.next:
        current.next = current.next.next
        self.size -= 1
        return True
    
    return False`,
      cpp: `bool deleteAtPosition(int position) {
    if (position < 0 || position >= size || head == nullptr) {
        return false;
    }
    
    Node* nodeToDelete;
    
    if (position == 0) {
        nodeToDelete = head;
        head = head->next;
    } else {
        Node* current = head;
        for (int i = 0; i < position - 1; i++) {
            current = current->next;
        }
        
        nodeToDelete = current->next;
        current->next = current->next->next;
    }
    
    delete nodeToDelete;
    size--;
    return true;
}`,
      idea: `Two cases for deletion:
1. First node: Update head
2. Other nodes: Find predecessor
Must traverse to find predecessor
(easier in doubly linked list)`,
    },
  };

  const inputs = [
    {
      inp: "Enter numbers (e.g., 10,20,30)",
      btn: "Initialize",
      x1: 1,
      x2: "val",
      isArray: true,
    },
    { inp: "Enter value to insert", btn: "Insert", x1: 4, x2: "val" },
    { inp: "Enter value to search", btn: "Search", x1: 3, x2: "val" },
    { inp: "Enter position to delete", btn: "Delete", x1: 2, x2: "pos" },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white pt-5">
      <PhoneScreenBlock message="Please switch to desktop mode to view this website" />

      {/* Visualization Section */}
      <div className="max-w-6xl mx-auto px-8 mb-12">
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="grid grid-cols-2 gap-6">
            {inputs.slice(0, 2).map((item, index) => (
              <div key={index} className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Input
                    className="w-52 inpbox"
                    placeholder={item.inp}
                    onChange={(e) => {
                      if (item.isArray) {
                        handleArrayInput(e.target.value);
                      } else {
                        updateForm(item.x1, item.x2, Number(e.target.value));
                      }
                    }}
                  />
                  <Button
                    className="dobtn"
                    onClick={() => {
                      updateForm(item.x1, "start", true);
                      setTimeout(() => updateForm(item.x1, "start", false), 10);
                    }}
                    disabled={!AEBool}
                  >
                    {item.btn}
                  </Button>
                </div>
                {item.x1 === 4 && (
                  <Input
                    className="w-52 inpbox"
                    placeholder="Enter position"
                    onChange={(e) =>
                      updateForm(4, "pos", Number(e.target.value))
                    }
                  />
                )}
              </div>
            ))}

            {inputs.slice(2).map((item, index) => (
              <div key={index + 2} className="flex items-center gap-2">
                <Input
                  className="w-52 inpbox"
                  placeholder={item.inp}
                  onChange={(e) =>
                    updateForm(item.x1, item.x2, Number(e.target.value))
                  }
                />
                <Button
                  className="dobtn"
                  onClick={() => {
                    updateForm(item.x1, "start", true);
                    setTimeout(() => updateForm(item.x1, "start", false), 10);
                  }}
                  disabled={!AEBool}
                >
                  {item.btn}
                </Button>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center space-x-4 mt-4">
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

          <P5Sketch
            add={addForm}
            dlt={deleteForm}
            srch={searchForm}
            insert={insertForm}
            animSpd={animSpd}
            actionExicutable={(b) => setAEBool(b)}
          />
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-8 space-y-8">
        {/* Algorithm Info */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <div className="text-center mb-5">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              Singly Linked List
            </h1>
            <div className="inline-flex items-center space-x-4 text-sm bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-full px-4 py-2 mt-3 border border-green-400/30">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                Search: O(n)
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                Insert: O(1) at head
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                Delete: O(1) at head
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                Unidirectional
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-blue-300 mb-4 flex items-center">
            <span className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3 text-sm">
              🔗
            </span>
            Singly Linked List Operations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-purple-300 mb-2">
                <button
                  onClick={() =>
                    document
                      .getElementById("setup-section")
                      .scrollIntoView({ behavior: "smooth" })
                  }
                  className="hover:text-purple-200 transition-colors cursor-pointer"
                >
                  Setup
                </button>
              </h3>
              <p className="text-gray-300 text-sm">
                Each node contains data and one pointer: next (forward
                direction). Simpler structure than doubly linked list with less
                memory overhead.
              </p>
            </div>
            <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-green-300 mb-2">
                <button
                  onClick={() =>
                    document
                      .getElementById("insert-section")
                      .scrollIntoView({ behavior: "smooth" })
                  }
                  className="hover:text-green-200 transition-colors cursor-pointer"
                >
                  Insert
                </button>
              </h3>
              <p className="text-gray-300 text-sm">
                Insert at beginning or specific position. Only need to update 2
                pointers. Simpler than doubly linked list but requires traversal
                for middle insertion.
              </p>
            </div>
            <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-blue-300 mb-2">
                <button
                  onClick={() =>
                    document
                      .getElementById("search-section")
                      .scrollIntoView({ behavior: "smooth" })
                  }
                  className="hover:text-blue-200 transition-colors cursor-pointer"
                >
                  Search
                </button>
              </h3>
              <p className="text-gray-300 text-sm">
                Traverse from head only to find elements. Cannot search
                backwards. Suitable for sequential access patterns.
              </p>
            </div>
            <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-red-300 mb-2">
                <button
                  onClick={() =>
                    document
                      .getElementById("delete-section")
                      .scrollIntoView({ behavior: "smooth" })
                  }
                  className="hover:text-red-200 transition-colors cursor-pointer"
                >
                  Delete
                </button>
              </h3>
              <p className="text-gray-300 text-sm">
                Remove nodes by finding predecessor and updating next pointer.
                Must traverse to find predecessor node.
              </p>
            </div>
          </div>
        </div>

        {/* Setup Section */}
        <div
          id="setup-section"
          className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8"
        >
          <h2 className="text-2xl font-semibold text-purple-300 mb-6 flex items-center">
            <span className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-3 text-sm">
              🔧
            </span>
            Setup - Node Structure
          </h2>
          <div className="mb-6">
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-6">
              <p className="text-gray-300 text-lg leading-relaxed">
                A Singly Linked List is the simplest form of linked list where
                each node contains data and a single pointer to the next node.
                This unidirectional structure allows traversal only in the
                forward direction. Each node has two components: the data value
                and a next pointer to the following node. The list maintains a
                reference only to the{" "}
                <span className="text-purple-400 font-semibold">head</span>{" "}
                node, which serves as the entry point. This minimal structure
                results in
                <span className="text-purple-400 font-semibold">
                  {" "}
                  lower memory overhead
                </span>
                compared to doubly linked lists, making it ideal for scenarios
                where backward traversal is not required and memory efficiency
                is important.
              </p>
            </div>
          </div>
          <CodeBlock
            codeSnippets={codeSnippets.setup}
            defaultLang="js"
            height="400px"
          />
        </div>

        {/* Insert Section */}
        <div
          id="insert-section"
          className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8"
        >
          <h2 className="text-2xl font-semibold text-green-300 mb-6 flex items-center">
            <span className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3 text-sm">
              ➕
            </span>
            Insert - Add Operation
          </h2>
          <div className="mb-6">
            <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-6">
              <p className="text-gray-300 text-lg leading-relaxed">
                Insertion in a singly linked list is simpler than in doubly
                linked lists due to fewer pointer updates. There are two main
                scenarios: inserting at the beginning and inserting at a
                specific position. Beginning insertion is
                <span className="text-green-400 font-semibold"> O(1)</span> as
                it only requires updating the new node's next pointer to the
                current head and updating the head reference. For middle
                insertion, we must traverse to the position before the insertion
                point, then update only
                <span className="text-green-400 font-semibold">
                  two pointers
                </span>
                : the new node's next and the predecessor's next. This
                simplicity comes at the cost of requiring traversal for non-head
                insertions, making it less efficient than doubly linked lists
                for frequent middle insertions.
              </p>
            </div>
          </div>
          <CodeBlock
            codeSnippets={codeSnippets.insert}
            defaultLang="js"
            height="600px"
          />
        </div>

        {/* Search Section */}
        <div
          id="search-section"
          className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8"
        >
          <h2 className="text-2xl font-semibold text-blue-300 mb-6 flex items-center">
            <span className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3 text-sm">
              🔍
            </span>
            Search - Find Operation
          </h2>
          <div className="mb-6">
            <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-lg p-6">
              <p className="text-gray-300 text-lg leading-relaxed">
                Search operation in a singly linked list follows a
                straightforward linear traversal from the head node. Unlike
                doubly linked lists, there's no option for backward traversal,
                so all searches must start from the beginning. The algorithm
                compares each node's data with the target value, continuing
                until either the value is found or the end of the list is
                reached. While this results in{" "}
                <span className="text-blue-400 font-semibold">O(n)</span> time
                complexity in the worst case, the unidirectional nature makes it
                suitable for applications with primarily sequential access
                patterns. For sorted lists, early termination can be implemented
                to improve average-case performance.
              </p>
            </div>
          </div>
          <CodeBlock
            codeSnippets={codeSnippets.search}
            defaultLang="js"
            height="600px"
          />
        </div>

        {/* Delete Section */}
        <div
          id="delete-section"
          className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8"
        >
          <h2 className="text-2xl font-semibold text-red-300 mb-6 flex items-center">
            <span className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-3 text-sm">
              🗑️
            </span>
            Delete - Remove Operation
          </h2>
          <div className="mb-6">
            <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-lg p-6">
              <p className="text-gray-300 text-lg leading-relaxed">
                Deletion in a singly linked list requires careful handling due
                to the inability to access the previous node directly. Two main
                cases exist: deleting the first node (simply update the head
                pointer) and deleting any other node (find the predecessor and
                update its next pointer). The challenge lies in finding the
                predecessor node, which requires traversal from the head. Once
                the predecessor is found, deletion is accomplished by updating
                its next pointer to skip the node being deleted. While this
                makes deletion
                <span className="text-red-400 font-semibold">O(n)</span> for
                arbitrary positions, head deletion remains{" "}
                <span className="text-red-400 font-semibold">O(1)</span>. This
                limitation is addressed in doubly linked lists with backward
                pointers.
              </p>
            </div>
          </div>
          <CodeBlock
            codeSnippets={codeSnippets.delete}
            defaultLang="js"
            height="700px"
          />
        </div>

        {/* Bottom Spacer */}
        <div className="h-12"></div>
      </div>
    </main>
  );
}
