"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { CodeBlock, TextBox } from "@/components/CodeBlock";
import NumberInput from "@/components/NumberInput";
import PhoneScreenBlock from "@/components/phoneScreenBlocker";
import AdBanner from "@/components/AdBanner";

import P5Sketch from "./P5Sketch";

export default function Home() {
  const [AEBool, setAEBool] = useState(true);
  const [addForm, setAddForm] = useState({ val: [], start: false });
  const [getMaxform, setGetMax] = useState({
    val: 0,
    start: false,
  });
  const [getpredform, setGetpred] = useState({
    val: 0,
    start: false,
  });
  const [getsuccform, setGetsucc] = useState({
    val: 0,
    start: false,
  });
  const [getMinForm, setGetMin] = useState({
    pos: 0,
    start: false,
  });

  const [animSpd, setAnimSpd] = useState(1);

  const updateForm = (n, key, value) => {
    if (key !== "start" || AEBool) {
      if (n == 1) {
        setAddForm((prev) => ({ ...prev, [key]: value }));
      } else if (n == 2) {
        setGetMin((prev) => ({ ...prev, [key]: value }));
      } else if (n == 3) {
        setGetMax((prev) => ({ ...prev, [key]: value }));
      } else if (n == 4) {
        setGetpred((prev) => ({ ...prev, [key]: value }));
      } else if (n == 5) {
        setGetsucc((prev) => ({ ...prev, [key]: value }));
      }
    }
  };

  const codeSnippets = {
    findMin: {
      js: `findMin(node = this.root) {
    if (node === null) return null;
    
    // Keep going left until we find the leftmost node
    while (node.left !== null) {
        node = node.left;
    }
    return node;
}

// Recursive approach
findMinRecursive(node = this.root) {
    if (node === null || node.left === null) {
        return node;
    }
    return this.findMinRecursive(node.left);
}`,
      c: `struct Node* findMin(struct Node* root) {
    if (root == NULL) return NULL;
    
    while (root->left != NULL) {
        root = root->left;
    }
    return root;
}

// Recursive approach
struct Node* findMinRecursive(struct Node* root) {
    if (root == NULL || root->left == NULL) {
        return root;
    }
    return findMinRecursive(root->left);
}`,
      py: `def find_min(self, node=None):
    if node is None:
        node = self.root
    if node is None:
        return None
    
    while node.left is not None:
        node = node.left
    return node

def find_min_recursive(self, node=None):
    if node is None:
        node = self.root
    if node is None or node.left is None:
        return node
    return self.find_min_recursive(node.left)`,
      cpp: `Node* findMin(Node* root) {
    if (root == nullptr) return nullptr;
    
    while (root->left != nullptr) {
        root = root->left;
    }
    return root;
}

Node* findMinRecursive(Node* root) {
    if (root == nullptr || root->left == nullptr) {
        return root;
    }
    return findMinRecursive(root->left);
}`,
      idea: `To find minimum:
- Start at root
- Keep going left until null
- Return the leftmost node
- Time: O(h) where h is height`,
    },
    findMax: {
      js: `findMax(node = this.root) {
    if (node === null) return null;
    
    // Keep going right until we find the rightmost node
    while (node.right !== null) {
        node = node.right;
    }
    return node;
}

// Recursive approach
findMaxRecursive(node = this.root) {
    if (node === null || node.right === null) {
        return node;
    }
    return this.findMaxRecursive(node.right);
}`,
      c: `struct Node* findMax(struct Node* root) {
    if (root == NULL) return NULL;
    
    while (root->right != NULL) {
        root = root->right;
    }
    return root;
}

struct Node* findMaxRecursive(struct Node* root) {
    if (root == NULL || root->right == NULL) {
        return root;
    }
    return findMaxRecursive(root->right);
}`,
      py: `def find_max(self, node=None):
    if node is None:
        node = self.root
    if node is None:
        return None
    
    while node.right is not None:
        node = node.right
    return node

def find_max_recursive(self, node=None):
    if node is None:
        node = self.root
    if node is None or node.right is None:
        return node
    return self.find_max_recursive(node.right)`,
      cpp: `Node* findMax(Node* root) {
    if (root == nullptr) return nullptr;
    
    while (root->right != nullptr) {
        root = root->right;
    }
    return root;
}

Node* findMaxRecursive(Node* root) {
    if (root == nullptr || root->right == nullptr) {
        return root;
    }
    return findMaxRecursive(root->right);
}`,
      idea: `To find maximum:
- Start at root
- Keep going right until null
- Return the rightmost node
- Time: O(h) where h is height`,
    },
    predecessor: {
      js: `findPredecessor(data) {
    let node = this.search(data);
    if (!node) return null;
    
    // Case 1: Node has left subtree
    if (node.left) {
        return this.findMax(node.left);
    }
    
    // Case 2: No left subtree - find ancestor
    let predecessor = null;
    let current = this.root;
    
    while (current !== node) {
        if (data > current.data) {
            predecessor = current;
            current = current.right;
        } else {
            current = current.left;
        }
    }
    return predecessor;
}`,
      c: `struct Node* findPredecessor(struct Node* root, int data) {
    struct Node* node = search(root, data);
    if (node == NULL) return NULL;
    
    // Case 1: Node has left subtree
    if (node->left != NULL) {
        return findMax(node->left);
    }
    
    // Case 2: No left subtree
    struct Node* predecessor = NULL;
    struct Node* current = root;
    
    while (current != node) {
        if (data > current->data) {
            predecessor = current;
            current = current->right;
        } else {
            current = current->left;
        }
    }
    return predecessor;
}`,
      py: `def find_predecessor(self, data):
    node = self.search(data)
    if not node:
        return None
    
    # Case 1: Node has left subtree
    if node.left:
        return self.find_max(node.left)
    
    # Case 2: No left subtree
    predecessor = None
    current = self.root
    
    while current != node:
        if data > current.data:
            predecessor = current
            current = current.right
        else:
            current = current.left
    
    return predecessor`,
      cpp: `Node* findPredecessor(Node* root, int data) {
    Node* node = search(root, data);
    if (!node) return nullptr;
    
    // Case 1: Node has left subtree
    if (node->left) {
        return findMax(node->left);
    }
    
    // Case 2: No left subtree
    Node* predecessor = nullptr;
    Node* current = root;
    
    while (current != node) {
        if (data > current->data) {
            predecessor = current;
            current = current->right;
        } else {
            current = current->left;
        }
    }
    return predecessor;
}`,
      idea: `Predecessor (next smaller value):
Case 1: Has left subtree → max of left
Case 2: No left subtree → nearest ancestor
        where node is in right subtree`,
    },
    successor: {
      js: `findSuccessor(data) {
    let node = this.search(data);
    if (!node) return null;
    
    // Case 1: Node has right subtree
    if (node.right) {
        return this.findMin(node.right);
    }
    
    // Case 2: No right subtree - find ancestor
    let successor = null;
    let current = this.root;
    
    while (current !== node) {
        if (data < current.data) {
            successor = current;
            current = current.left;
        } else {
            current = current.right;
        }
    }
    return successor;
}`,
      c: `struct Node* findSuccessor(struct Node* root, int data) {
    struct Node* node = search(root, data);
    if (node == NULL) return NULL;
    
    // Case 1: Node has right subtree
    if (node->right != NULL) {
        return findMin(node->right);
    }
    
    // Case 2: No right subtree
    struct Node* successor = NULL;
    struct Node* current = root;
    
    while (current != node) {
        if (data < current->data) {
            successor = current;
            current = current->left;
        } else {
            current = current->right;
        }
    }
    return successor;
}`,
      py: `def find_successor(self, data):
    node = self.search(data)
    if not node:
        return None
    
    # Case 1: Node has right subtree
    if node.right:
        return self.find_min(node.right)
    
    # Case 2: No right subtree
    successor = None
    current = self.root
    
    while current != node:
        if data < current.data:
            successor = current
            current = current.left
        else:
            current = current.right
    
    return successor`,
      cpp: `Node* findSuccessor(Node* root, int data) {
    Node* node = search(root, data);
    if (!node) return nullptr;
    
    // Case 1: Node has right subtree
    if (node->right) {
        return findMin(node->right);
    }
    
    // Case 2: No right subtree
    Node* successor = nullptr;
    Node* current = root;
    
    while (current != node) {
        if (data < current->data) {
            successor = current;
            current = current->left;
        } else {
            current = current->right;
        }
    }
    return successor;
}`,
      idea: `Successor (next larger value):
Case 1: Has right subtree → min of right
Case 2: No right subtree → nearest ancestor
        where node is in left subtree`,
    },
  };

  return (
    <main className="vl-page">
      <PhoneScreenBlock message="Please switch to desktop mode to view this website" />

      {/* Title */}
      <div className="max-w-6xl mx-auto px-8 mb-6">
        <div className="vl-hero">
          <div>
            <h1 className="vl-title text-4xl">
              BST Advanced Operations
            </h1>
            <div className="vl-meta mt-3">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-pen-green rounded-full mr-2"></span>
                Min/Max: O(h)
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-pen-blue rounded-full mr-2"></span>
                Predecessor: O(h)
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-pen-plum rounded-full mr-2"></span>
                Successor: O(h)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Visualization Section */}
      <div className="max-w-6xl mx-auto px-8 mb-12">
        <div className="vl-card p-6">
          <div className="flex flex-row gap-6 mb-4">
            <NumberInput
              btnName="Add Array"
              onSubmit={(arr) => {
                updateForm(1, "val", arr);
                updateForm(1, "start", true);
                setTimeout(() => updateForm(1, "start", false), 10);
              }}
            />

            <div className="flex gap-4">
              <Button
                onClick={() => {
                  updateForm(2, "start", true);
                  setTimeout(() => updateForm(2, "start", false), 10);
                }}
                className="dobtn"
              >
                Find Min
              </Button>

              <Button
                onClick={() => {
                  updateForm(3, "start", true);
                  setTimeout(() => updateForm(3, "start", false), 10);
                }}
                className="dobtn"
              >
                Find Max
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <Input
              className="w-52 inpbox"
              placeholder="Enter value for predecessor/successor"
              onChange={(e) => {
                updateForm(4, "val", Number(e.target.value));
                updateForm(5, "val", Number(e.target.value));
              }}
            />

            <Button
              className="dobtn"
              onClick={() => {
                updateForm(4, "start", true);
                setTimeout(() => updateForm(4, "start", false), 10);
              }}
            >
              Predecessor
            </Button>

            <Button
              className="dobtn"
              onClick={() => {
                updateForm(5, "start", true);
                setTimeout(() => updateForm(5, "start", false), 10);
              }}
            >
              Successor
            </Button>
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
            dlt={getMinForm}
            srch={getMaxform}
            prev={getpredform}
            succ={getsuccform}
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
            Advanced BST Operations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="vl-note vl-note-green p-4">
              <h3 className="vl-h3 mb-2">
                <button
                  onClick={() =>
                    document
                      .getElementById("min-section")
                      .scrollIntoView({ behavior: "smooth" })
                  }
                  className="hover:text-pen-green transition-colors cursor-pointer"
                >
                  Find Min
                </button>
              </h3>
              <p className="text-ink-2 text-sm">
                Locate the smallest element by traversing left until reaching
                the leftmost node.
              </p>
            </div>
            <div className="vl-note vl-note-blue p-4">
              <h3 className="vl-h3 mb-2">
                <button
                  onClick={() =>
                    document
                      .getElementById("max-section")
                      .scrollIntoView({ behavior: "smooth" })
                  }
                  className="hover:text-pen-blue transition-colors cursor-pointer"
                >
                  Find Max
                </button>
              </h3>
              <p className="text-ink-2 text-sm">
                Locate the largest element by traversing right until reaching
                the rightmost node.
              </p>
            </div>
            <div className="vl-note vl-note-plum p-4">
              <h3 className="vl-h3 mb-2">
                <button
                  onClick={() =>
                    document
                      .getElementById("predecessor-section")
                      .scrollIntoView({ behavior: "smooth" })
                  }
                  className="hover:text-pen-plum transition-colors cursor-pointer"
                >
                  Predecessor
                </button>
              </h3>
              <p className="text-ink-2 text-sm">
                Find the largest element smaller than the given value. Two cases
                based on left subtree.
              </p>
            </div>
            <div className="vl-note vl-note-rust p-4">
              <h3 className="vl-h3 mb-2">
                <button
                  onClick={() =>
                    document
                      .getElementById("successor-section")
                      .scrollIntoView({ behavior: "smooth" })
                  }
                  className="hover:text-pen-rust transition-colors cursor-pointer"
                >
                  Successor
                </button>
              </h3>
              <p className="text-ink-2 text-sm">
                Find the smallest element larger than the given value. Two cases
                based on right subtree.
              </p>
            </div>
          </div>
        </div>

        {/* Find Min Section */}
        <div
          id="min-section"
          className="vl-card p-8"
        >
          <h2 className="vl-h2 mb-6">
            Find Minimum
          </h2>
          <div className="mb-6">
            <div className="vl-note vl-note-green p-6">
              <p className="text-ink-2 text-lg leading-relaxed">
                Finding the minimum element in a BST is straightforward due to
                its ordering property. Since all smaller values are stored in
                the left subtree, the minimum element is always the{" "}
                <span className="text-pen-green font-semibold">
                  leftmost node
                </span>{" "}
                in the tree. We simply traverse left from the root until we
                reach a node with no left child. This operation runs in{" "}
                <span className="text-pen-green font-semibold">O(h)</span> time,
                where h is the height of the tree.
              </p>
            </div>
          </div>
          <CodeBlock
            codeSnippets={codeSnippets.findMin}
            defaultLang="js"
            height="500px"
          />
        </div>

        {/* Find Max Section */}
        <div
          id="max-section"
          className="vl-card p-8"
        >
          <h2 className="vl-h2 mb-6">
            Find Maximum
          </h2>
          <div className="mb-6">
            <div className="vl-note vl-note-blue p-6">
              <p className="text-ink-2 text-lg leading-relaxed">
                Finding the maximum element follows the opposite pattern of
                finding the minimum. Since all larger values are stored in the
                right subtree, the maximum element is always the{" "}
                <span className="text-pen-blue font-semibold">
                  rightmost node
                </span>{" "}
                in the tree. We traverse right from the root until we reach a
                node with no right child. Like finding the minimum, this
                operation also runs in{" "}
                <span className="text-pen-blue font-semibold">O(h)</span> time.
              </p>
            </div>
          </div>
          <CodeBlock
            codeSnippets={codeSnippets.findMax}
            defaultLang="js"
            height="500px"
          />
        </div>

        {/* Predecessor Section */}
        <div
          id="predecessor-section"
          className="vl-card p-8"
        >
          <h2 className="vl-h2 mb-6">
            Find Predecessor
          </h2>
          <div className="mb-6">
            <div className="vl-note vl-note-plum p-6">
              <p className="text-ink-2 text-lg leading-relaxed">
                The predecessor of a node is the largest value smaller than the
                node&apos;s value - essentially the previous element in sorted
                order. There are two cases:
                <span className="text-pen-plum font-semibold">
                  Case 1:
                </span>{" "}
                If the node has a left subtree, the predecessor is the maximum
                value in that left subtree.
                <span className="text-pen-plum font-semibold">
                  Case 2:
                </span>{" "}
                If there&apos;s no left subtree, we need to find the nearest
                ancestor where our node lies in the right subtree.
              </p>
            </div>
          </div>
          <CodeBlock
            codeSnippets={codeSnippets.predecessor}
            defaultLang="js"
            height="600px"
          />
        </div>

        {/* Successor Section */}
        <div
          id="successor-section"
          className="vl-card p-8"
        >
          <h2 className="vl-h2 mb-6">
            Find Successor
          </h2>
          <div className="mb-6">
            <div className="vl-note vl-note-rust p-6">
              <p className="text-ink-2 text-lg leading-relaxed">
                The successor of a node is the smallest value larger than the
                node&apos;s value - the next element in sorted order. Similar to
                predecessor, there are two cases:
                <span className="text-pen-rust font-semibold">Case 1:</span> If
                the node has a right subtree, the successor is the minimum value
                in that right subtree.
                <span className="text-pen-rust font-semibold">Case 2:</span> If
                there&apos;s no right subtree, we find the nearest ancestor
                where our node lies in the left subtree.
              </p>
            </div>
          </div>
          <CodeBlock
            codeSnippets={codeSnippets.successor}
            defaultLang="js"
            height="600px"
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
