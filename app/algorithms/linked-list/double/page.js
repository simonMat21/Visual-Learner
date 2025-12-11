"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { CodeBlock, TextBox } from "@/components/CodeBlock";
import PhoneScreenBlock from "@/components/phoneScreenBlocker";

import P5Sketch_linkedList from "./P5Sketch_linkedList";
import AdBanner from "@/components/AdBanner";

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
        this.prev = null;
    }
}

class DoublyLinkedList {
    constructor() {
        this.head = null;
        this.tail = null;
        this.size = 0;
    }
}`,
      c: `struct Node {
    int data;
    struct Node* next;
    struct Node* prev;
};

struct DoublyLinkedList {
    struct Node* head;
    struct Node* tail;
    int size;
};

struct Node* createNode(int data) {
    struct Node* newNode = malloc(sizeof(struct Node));
    newNode->data = data;
    newNode->next = NULL;
    newNode->prev = NULL;
    return newNode;
}`,
      py: `class Node:
    def __init__(self, data):
        self.data = data
        self.next = None
        self.prev = None

class DoublyLinkedList:
    def __init__(self):
        self.head = None
        self.tail = None
        self.size = 0`,
      cpp: `struct Node {
    int data;
    Node* next;
    Node* prev;
    
    Node(int val) : data(val), next(nullptr), prev(nullptr) {}
};

class DoublyLinkedList {
    Node* head;
    Node* tail;
    int size;
    
public:
    DoublyLinkedList() : head(nullptr), tail(nullptr), size(0) {}
};`,
      idea: `Create Node structure with:
- Data value
- Next pointer (forward direction)
- Previous pointer (backward direction)
Initialize list with null head and tail`,
    },
    insert: {
      js: `insertAtPosition(data, position) {
    if (position < 0 || position > this.size) return false;
    
    const newNode = new Node(data);
    
    if (position === 0) {
        // Insert at beginning
        if (this.head === null) {
            this.head = this.tail = newNode;
        } else {
            newNode.next = this.head;
            this.head.prev = newNode;
            this.head = newNode;
        }
    } else if (position === this.size) {
        // Insert at end
        newNode.prev = this.tail;
        this.tail.next = newNode;
        this.tail = newNode;
    } else {
        // Insert in middle
        let current = this.head;
        for (let i = 0; i < position; i++) {
            current = current.next;
        }
        
        newNode.next = current;
        newNode.prev = current.prev;
        current.prev.next = newNode;
        current.prev = newNode;
    }
    
    this.size++;
    return true;
}`,
      c: `int insertAtPosition(struct DoublyLinkedList* list, int data, int position) {
    if (position < 0 || position > list->size) return 0;
    
    struct Node* newNode = createNode(data);
    
    if (position == 0) {
        if (list->head == NULL) {
            list->head = list->tail = newNode;
        } else {
            newNode->next = list->head;
            list->head->prev = newNode;
            list->head = newNode;
        }
    } else if (position == list->size) {
        newNode->prev = list->tail;
        list->tail->next = newNode;
        list->tail = newNode;
    } else {
        struct Node* current = list->head;
        for (int i = 0; i < position; i++) {
            current = current->next;
        }
        
        newNode->next = current;
        newNode->prev = current->prev;
        current->prev->next = newNode;
        current->prev = newNode;
    }
    
    list->size++;
    return 1;
}`,
      py: `def insert_at_position(self, data, position):
    if position < 0 or position > self.size:
        return False
    
    new_node = Node(data)
    
    if position == 0:
        # Insert at beginning
        if self.head is None:
            self.head = self.tail = new_node
        else:
            new_node.next = self.head
            self.head.prev = new_node
            self.head = new_node
    elif position == self.size:
        # Insert at end
        new_node.prev = self.tail
        self.tail.next = new_node
        self.tail = new_node
    else:
        # Insert in middle
        current = self.head
        for i in range(position):
            current = current.next
        
        new_node.next = current
        new_node.prev = current.prev
        current.prev.next = new_node
        current.prev = new_node
    
    self.size += 1
    return True`,
      cpp: `bool insertAtPosition(int data, int position) {
    if (position < 0 || position > size) return false;
    
    Node* newNode = new Node(data);
    
    if (position == 0) {
        if (head == nullptr) {
            head = tail = newNode;
        } else {
            newNode->next = head;
            head->prev = newNode;
            head = newNode;
        }
    } else if (position == size) {
        newNode->prev = tail;
        tail->next = newNode;
        tail = newNode;
    } else {
        Node* current = head;
        for (int i = 0; i < position; i++) {
            current = current->next;
        }
        
        newNode->next = current;
        newNode->prev = current->prev;
        current->prev->next = newNode;
        current->prev = newNode;
    }
    
    size++;
    return true;
}`,
      idea: `Three cases for insertion:
1. At beginning: Update head pointer
2. At end: Update tail pointer  
3. In middle: Traverse to position
Update 4 pointers for middle insertion`,
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

// Optimized search (can start from either end)
searchOptimized(data, fromTail = false) {
    if (fromTail) {
        let current = this.tail;
        let position = this.size - 1;
        
        while (current !== null) {
            if (current.data === data) {
                return { found: true, position: position, node: current };
            }
            current = current.prev;
            position--;
        }
    } else {
        return this.search(data);
    }
    
    return { found: false, position: -1, node: null };
}`,
      c: `struct SearchResult {
    int found;
    int position;
    struct Node* node;
};

struct SearchResult search(struct DoublyLinkedList* list, int data) {
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

def search_optimized(self, data, from_tail=False):
    if from_tail:
        current = self.tail
        position = self.size - 1
        
        while current is not None:
            if current.data == data:
                return {'found': True, 'position': position, 'node': current}
            current = current.prev
            position -= 1
    else:
        return self.search(data)
    
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
1. Start from head (or tail)
2. Compare each node&apos;s data
3. Return position if found
4. Advantage: Can search backwards
   using prev pointers`,
    },
    delete: {
      js: `deleteAtPosition(position) {
    if (position < 0 || position >= this.size || this.head === null) {
        return false;
    }
    
    let nodeToDelete;
    
    if (position === 0) {
        // Delete first node
        nodeToDelete = this.head;
        this.head = this.head.next;
        
        if (this.head !== null) {
            this.head.prev = null;
        } else {
            this.tail = null; // List becomes empty
        }
    } else if (position === this.size - 1) {
        // Delete last node
        nodeToDelete = this.tail;
        this.tail = this.tail.prev;
        this.tail.next = null;
    } else {
        // Delete middle node
        let current = this.head;
        for (let i = 0; i < position; i++) {
            current = current.next;
        }
        
        nodeToDelete = current;
        current.prev.next = current.next;
        current.next.prev = current.prev;
    }
    
    this.size--;
    return true;
}`,
      c: `int deleteAtPosition(struct DoublyLinkedList* list, int position) {
    if (position < 0 || position >= list->size || list->head == NULL) {
        return 0;
    }
    
    struct Node* nodeToDelete;
    
    if (position == 0) {
        nodeToDelete = list->head;
        list->head = list->head->next;
        
        if (list->head != NULL) {
            list->head->prev = NULL;
        } else {
            list->tail = NULL;
        }
    } else if (position == list->size - 1) {
        nodeToDelete = list->tail;
        list->tail = list->tail->prev;
        list->tail->next = NULL;
    } else {
        struct Node* current = list->head;
        for (int i = 0; i < position; i++) {
            current = current->next;
        }
        
        nodeToDelete = current;
        current->prev->next = current->next;
        current->next->prev = current->prev;
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
        node_to_delete = self.head
        self.head = self.head.next
        
        if self.head is not None:
            self.head.prev = None
        else:
            self.tail = None
    elif position == self.size - 1:
        # Delete last node
        node_to_delete = self.tail
        self.tail = self.tail.prev
        self.tail.next = None
    else:
        # Delete middle node
        current = self.head
        for i in range(position):
            current = current.next
        
        node_to_delete = current
        current.prev.next = current.next
        current.next.prev = current.prev
    
    self.size -= 1
    return True`,
      cpp: `bool deleteAtPosition(int position) {
    if (position < 0 || position >= size || head == nullptr) {
        return false;
    }
    
    Node* nodeToDelete;
    
    if (position == 0) {
        nodeToDelete = head;
        head = head->next;
        
        if (head != nullptr) {
            head->prev = nullptr;
        } else {
            tail = nullptr;
        }
    } else if (position == size - 1) {
        nodeToDelete = tail;
        tail = tail->prev;
        tail->next = nullptr;
    } else {
        Node* current = head;
        for (int i = 0; i < position; i++) {
            current = current->next;
        }
        
        nodeToDelete = current;
        current->prev->next = current->next;
        current->next->prev = current->prev;
    }
    
    delete nodeToDelete;
    size--;
    return true;
}`,
      idea: `Three cases for deletion:
1. First node: Update head
2. Last node: Update tail
3. Middle node: Update 2 pointers
Key: Update both next and prev
pointers of adjacent nodes`,
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

          <P5Sketch_linkedList
            add={addForm}
            dlt={deleteForm}
            srch={searchForm}
            insert={insertForm}
            animSpd={animSpd}
            actionExecutable={(b) => setAEBool(b)}
          />
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-8 space-y-8">
        <AdBanner position="bottom" size="responsive" adTest="off" />
        {/* Algorithm Info */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <div className="text-center mb-5">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              Doubly Linked List
            </h1>
            <div className="inline-flex items-center space-x-4 text-sm bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-full px-4 py-2 mt-3 border border-green-400/30">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                Search: O(n)
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                Insert: O(1) at ends
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                Delete: O(1) at ends
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                Bidirectional
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
            Doubly Linked List Operations
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
                Each node contains data and two pointers: next (forward) and
                prev (backward). Enables bidirectional traversal.
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
                Insert at beginning, end, or specific position. Update up to 4
                pointers to maintain forward and backward links.
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
                Traverse from head or tail to find elements. Bidirectional
                search can optimize performance in some scenarios.
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
                Remove nodes by updating both next and prev pointers of adjacent
                nodes. Handle head and tail updates appropriately.
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
                A Doubly Linked List extends the concept of a singly linked list
                by adding a
                <span className="text-purple-400 font-semibold">
                  {" "}
                  previous pointer
                </span>{" "}
                to each node. This bidirectional connectivity allows traversal
                in both forward and backward directions. Each node contains
                three components: the data value, a next pointer to the
                following node, and a prev pointer to the previous node. The
                list maintains references to both
                <span className="text-purple-400 font-semibold"> head</span> and
                <span className="text-purple-400 font-semibold">
                  {" "}
                  tail
                </span>{" "}
                nodes, enabling efficient operations at both ends. This
                structure provides flexibility at the cost of additional memory
                overhead for the extra pointer.
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
                Insertion in a doubly linked list requires careful pointer
                management due to the bidirectional nature. There are three main
                scenarios: inserting at the beginning, at the end, or at a
                specific position. When inserting at the beginning, we update
                the head pointer and set the new node&apos;s next to the current
                head, while updating the old head&apos;s prev pointer. For end
                insertion, we use the tail pointer for direct access. Middle
                insertion requires traversing to the position and updating up to
                <span className="text-green-400 font-semibold">
                  {" "}
                  four pointers
                </span>
                : the new node&apos;s next and prev, plus the adjacent
                nodes&apos; connecting pointers. This complexity provides the
                benefit of{" "}
                <span className="text-green-400 font-semibold">O(1)</span>{" "}
                insertion at both ends.
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
                Search operation in a doubly linked list offers unique
                advantages due to bidirectional traversal capability. While the
                basic search still requires
                <span className="text-blue-400 font-semibold"> O(n)</span> time
                complexity in the worst case, the ability to start from either
                head or tail can provide optimizations. For instance, if
                searching for a value likely to be in the latter half of the
                list, starting from the tail and moving backward using prev
                pointers can reduce the average search time. Additionally, the
                bidirectional nature enables more sophisticated search
                strategies and makes it easier to implement operations that
                require knowledge of neighboring elements.
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
                Deletion in a doubly linked list requires updating multiple
                pointers to maintain the bidirectional integrity. Three
                scenarios exist: deleting the first node (update head and the
                new first node&apos;s prev pointer), deleting the last node
                (update tail and the new last node&apos;s next pointer), and
                deleting a middle node (update both adjacent nodes&apos;
                pointers). The key advantage is that once you have a reference
                to the node to delete, removal is{" "}
                <span className="text-red-400 font-semibold">O(1)</span> since
                you can directly access both neighboring nodes through the prev
                and next pointers. This eliminates the need to traverse from the
                head to find the predecessor, as required in singly linked
                lists.
              </p>
            </div>
          </div>
          <CodeBlock
            codeSnippets={codeSnippets.delete}
            defaultLang="js"
            height="700px"
          />
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
