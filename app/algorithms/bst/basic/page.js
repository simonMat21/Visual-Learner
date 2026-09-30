"use client";

import { useState } from "react";

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

  const codeSnippets = {
    setup: {
      js: `class Node {
    constructor(data) {
        this.data = data;
        this.left = null;
        this.right = null;
    }
}

class BST {
    constructor() {
        this.root = null;
    }
}`,
      c: `struct Node {
    int data;
    struct Node* left;
    struct Node* right;
};

struct Node* createNode(int data) {
    struct Node* newNode = malloc(sizeof(struct Node));
    newNode->data = data;
    newNode->left = NULL;
    newNode->right = NULL;
    return newNode;
}`,
      py: `class Node:
    def __init__(self, data):
        self.data = data
        self.left = None
        self.right = None

class BST:
    def __init__(self):
        self.root = None`,
      cpp: `struct Node {
    int data;
    Node* left;
    Node* right;
    
    Node(int val) : data(val), left(nullptr), right(nullptr) {}
};

class BST {
    Node* root;
public:
    BST() : root(nullptr) {}
};`,
      idea: `Create Node structure with:
- Data value
- Left pointer (smaller values)
- Right pointer (larger values)
Initialize BST with null root`,
    },
    add: {
      js: `insert(data) {
    this.root = this.insertNode(this.root, data);
}

insertNode(node, data) {
    if (node === null) {
        return new Node(data);
    }
    
    if (data < node.data) {
        node.left = this.insertNode(node.left, data);
    } else if (data > node.data) {
        node.right = this.insertNode(node.right, data);
    }
    
    return node;
}`,
      c: `struct Node* insert(struct Node* root, int data) {
    if (root == NULL) {
        return createNode(data);
    }
    
    if (data < root->data) {
        root->left = insert(root->left, data);
    } else if (data > root->data) {
        root->right = insert(root->right, data);
    }
    
    return root;
}`,
      py: `def insert(self, data):
    self.root = self._insert_node(self.root, data)

def _insert_node(self, node, data):
    if node is None:
        return Node(data)
    
    if data < node.data:
        node.left = self._insert_node(node.left, data)
    elif data > node.data:
        node.right = self._insert_node(node.right, data)
    
    return node`,
      cpp: `Node* insert(Node* root, int data) {
    if (root == nullptr) {
        return new Node(data);
    }
    
    if (data < root->data) {
        root->left = insert(root->left, data);
    } else if (data > root->data) {
        root->right = insert(root->right, data);
    }
    
    return root;
}`,
      idea: `Start at root
If empty, create new node
If value < current: go left
If value > current: go right
Repeat until empty spot found`,
    },
    search: {
      js: `search(data) {
    return this.searchNode(this.root, data);
}

searchNode(node, data) {
    if (node === null || node.data === data) {
        return node;
    }
    
    if (data < node.data) {
        return this.searchNode(node.left, data);
    }
    
    return this.searchNode(node.right, data);
}`,
      c: `struct Node* search(struct Node* root, int data) {
    if (root == NULL || root->data == data) {
        return root;
    }
    
    if (data < root->data) {
        return search(root->left, data);
    }
    
    return search(root->right, data);
}`,
      py: `def search(self, data):
    return self._search_node(self.root, data)

def _search_node(self, node, data):
    if node is None or node.data == data:
        return node
    
    if data < node.data:
        return self._search_node(node.left, data)
    
    return self._search_node(node.right, data)`,
      cpp: `Node* search(Node* root, int data) {
    if (root == nullptr || root->data == data) {
        return root;
    }
    
    if (data < root->data) {
        return search(root->left, data);
    }
    
    return search(root->right, data);
}`,
      idea: `Start at root
If found or null: return result
If target < current: search left
If target > current: search right
Continue until found or exhausted`,
    },
    delete: {
      js: `delete(data) {
    this.root = this.deleteNode(this.root, data);
}

deleteNode(node, data) {
    if (node === null) return null;
    
    if (data < node.data) {
        node.left = this.deleteNode(node.left, data);
    } else if (data > node.data) {
        node.right = this.deleteNode(node.right, data);
    } else {
        // No children
        if (!node.left && !node.right) return null;
        
        // One child
        if (!node.left) return node.right;
        if (!node.right) return node.left;
        
        // Two children
        let successor = this.findMin(node.right);
        node.data = successor.data;
        node.right = this.deleteNode(node.right, successor.data);
    }
    return node;
}`,
      c: `struct Node* delete(struct Node* root, int data) {
    if (root == NULL) return root;
    
    if (data < root->data) {
        root->left = delete(root->left, data);
    } else if (data > root->data) {
        root->right = delete(root->right, data);
    } else {
        // Node to be deleted found
        if (root->left == NULL) {
            struct Node* temp = root->right;
            free(root);
            return temp;
        } else if (root->right == NULL) {
            struct Node* temp = root->left;
            free(root);
            return temp;
        }
        
        // Node with two children
        struct Node* temp = findMin(root->right);
        root->data = temp->data;
        root->right = delete(root->right, temp->data);
    }
    return root;
}`,
      py: `def delete(self, data):
    self.root = self._delete_node(self.root, data)

def _delete_node(self, node, data):
    if node is None:
        return node
    
    if data < node.data:
        node.left = self._delete_node(node.left, data)
    elif data > node.data:
        node.right = self._delete_node(node.right, data)
    else:
        # No children
        if not node.left and not node.right:
            return None
        
        # One child
        if not node.left:
            return node.right
        if not node.right:
            return node.left
        
        # Two children
        successor = self._find_min(node.right)
        node.data = successor.data
        node.right = self._delete_node(node.right, successor.data)
    
    return node`,
      cpp: `Node* deleteNode(Node* root, int data) {
    if (root == nullptr) return root;
    
    if (data < root->data) {
        root->left = deleteNode(root->left, data);
    } else if (data > root->data) {
        root->right = deleteNode(root->right, data);
    } else {
        if (root->left == nullptr) {
            Node* temp = root->right;
            delete root;
            return temp;
        } else if (root->right == nullptr) {
            Node* temp = root->left;
            delete root;
            return temp;
        }
        
        Node* temp = findMin(root->right);
        root->data = temp->data;
        root->right = deleteNode(root->right, temp->data);
    }
    return root;
}`,
      idea: `Three cases:
1. No children: simply remove
2. One child: replace with child
3. Two children: replace with successor
   (smallest in right subtree)`,
    },
  };

  const inputs = [
    { inp: "Enter number to add", btn: "add", x1: 1, x2: "val" },
    { inp: "Enter number to search", btn: "search", x1: 3, x2: "val" },
    { inp: "Enter number to delete", btn: "delete", x1: 2, x2: "pos" },
  ];

  return (
    <main className="vl-page">
      <PhoneScreenBlock message="Please switch to desktop mode to view this website" />

      {/* Title */}
      <div className="max-w-6xl mx-auto px-8 mb-6">
        <div className="vl-hero">
          <div>
            <h1 className="vl-title text-4xl">
              Binary Search Tree (BST)
            </h1>
            <div className="vl-meta mt-3">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-pen-green rounded-full mr-2"></span>
                Search: O(log n)
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-pen-blue rounded-full mr-2"></span>
                Insert: O(log n)
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-pen-rust rounded-full mr-2"></span>
                Delete: O(log n)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Visualization Section */}
      <div className="max-w-6xl mx-auto px-8 mb-12">
        <div className="vl-card p-6">
          <div className="flex flex-row gap-6">
            {inputs.map((item, index) => {
              return (
                <div
                  key={index}
                  className="flex items-center gap-2 mb-4 rounded-5"
                >
                  <Input
                    className="w-52 inpbox" // Set specific width
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
                  >
                    {item.btn}
                  </Button>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-center space-x-4">
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
            BST Operations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="vl-note vl-note-plum p-4">
              <h3 className="vl-h3 mb-2">
                <button
                  onClick={() =>
                    document
                      .getElementById("setup-section")
                      .scrollIntoView({ behavior: "smooth" })
                  }
                  className="hover:text-pen-plum transition-colors cursor-pointer"
                >
                  Setup
                </button>
              </h3>
              <p className="text-ink-2 text-sm">
                A BST starts empty. Each node has at most two children: left
                (smaller values) and right (larger values).
              </p>
            </div>
            <div className="vl-note vl-note-green p-4">
              <h3 className="vl-h3 mb-2">
                <button
                  onClick={() =>
                    document
                      .getElementById("add-section")
                      .scrollIntoView({ behavior: "smooth" })
                  }
                  className="hover:text-pen-green transition-colors cursor-pointer"
                >
                  Add
                </button>
              </h3>
              <p className="text-ink-2 text-sm">
                Insert by comparing with current node. Go left if smaller, right
                if larger. Create new node when reaching null.
              </p>
            </div>
            <div className="vl-note vl-note-blue p-4">
              <h3 className="vl-h3 mb-2">
                <button
                  onClick={() =>
                    document
                      .getElementById("search-section")
                      .scrollIntoView({ behavior: "smooth" })
                  }
                  className="hover:text-pen-blue transition-colors cursor-pointer"
                >
                  Search
                </button>
              </h3>
              <p className="text-ink-2 text-sm">
                Start at root. Compare target with current node. Go left if
                smaller, right if larger, until found or null.
              </p>
            </div>
            <div className="vl-note vl-note-rust p-4">
              <h3 className="vl-h3 mb-2">
                <button
                  onClick={() =>
                    document
                      .getElementById("delete-section")
                      .scrollIntoView({ behavior: "smooth" })
                  }
                  className="hover:text-pen-rust transition-colors cursor-pointer"
                >
                  Delete
                </button>
              </h3>
              <p className="text-ink-2 text-sm">
                Three cases: no children (remove), one child (replace with
                child), two children (replace with successor).
              </p>
            </div>
          </div>
        </div>

        {/* Setup Section */}
        <div
          id="setup-section"
          className="vl-card p-8"
        >
          <h2 className="vl-h2 mb-6">
            Setup - Node Structure
          </h2>
          <div className="mb-6">
            <div className="vl-note vl-note-plum p-6">
              <p className="text-ink-2 text-lg leading-relaxed">
                The foundation of a Binary Search Tree lies in its node
                structure. Each node contains a data value and two pointers: one
                to the left child (for smaller values) and one to the right
                child (for larger values). The BST class maintains a reference
                to the root node, which serves as the entry point to the entire
                tree. Initially, the tree is empty with a{" "}
                <span className="text-pen-plum font-semibold">null root</span>
                . This simple but powerful structure enables the BST to maintain
                sorted order automatically as elements are added or removed.
              </p>
            </div>
          </div>
          <CodeBlock
            codeSnippets={codeSnippets.setup}
            defaultLang="js"
            height="400px"
          />
        </div>

        {/* Add Section */}
        <div
          id="add-section"
          className="vl-card p-8"
        >
          <h2 className="vl-h2 mb-6">
            Add - Insert Operation
          </h2>
          <div className="mb-6">
            <div className="vl-note vl-note-green p-6">
              <p className="text-ink-2 text-lg leading-relaxed">
                Insertion in a BST follows a recursive approach that maintains
                the tree&apos;s ordering property. Starting from the root, we
                compare the new value with the current node&apos;s value. If the
                new value is smaller, we move to the left subtree; if larger, we
                move to the right subtree. This continues until we reach a null
                position where the new node can be inserted. The process ensures
                that all values to the left of any node are smaller, and all
                values to the right are larger, preserving the BST property. In
                a balanced tree, insertion takes{" "}
                <span className="text-pen-green font-semibold">O(log n)</span>{" "}
                time.
              </p>
            </div>
          </div>
          <CodeBlock
            codeSnippets={codeSnippets.add}
            defaultLang="js"
            height="500px"
          />
        </div>

        {/* Search Section */}
        <div
          id="search-section"
          className="vl-card p-8"
        >
          <h2 className="vl-h2 mb-6">
            Search - Find Operation
          </h2>
          <div className="mb-6">
            <div className="vl-note vl-note-blue p-6">
              <p className="text-ink-2 text-lg leading-relaxed">
                Search operation in BST leverages the tree&apos;s ordering
                property to efficiently locate elements. Starting from the root,
                we compare the target value with the current node&apos;s value.
                If the target is smaller, we traverse to the left subtree; if
                larger, we go to the right subtree. This process continues until
                we either find the target value or reach a null node (indicating
                the value doesn&apos;t exist). In a balanced BST, this approach
                achieves{" "}
                <span className="text-pen-blue font-semibold">O(log n)</span>{" "}
                time complexity by eliminating half of the remaining nodes with
                each comparison.
              </p>
            </div>
          </div>
          <CodeBlock
            codeSnippets={codeSnippets.search}
            defaultLang="js"
            height="500px"
          />
        </div>

        {/* Delete Section */}
        <div
          id="delete-section"
          className="vl-card p-8"
        >
          <h2 className="vl-h2 mb-6">
            Delete - Remove Operation
          </h2>
          <div className="mb-6">
            <div className="vl-note vl-note-rust p-6">
              <p className="text-ink-2 text-lg leading-relaxed">
                Deletion is the most complex BST operation due to three distinct
                cases that must be handled.
                <span className="text-pen-rust font-semibold">Case 1:</span> If
                the node has no children, simply remove it.
                <span className="text-pen-rust font-semibold">Case 2:</span> If
                the node has one child, replace the node with its child.
                <span className="text-pen-rust font-semibold">Case 3:</span> If
                the node has two children, find the inorder successor (smallest
                value in the right subtree), replace the node&apos;s value with
                the successor&apos;s value, then delete the successor. This
                maintains the BST property while ensuring the tree structure
                remains valid after deletion.
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
