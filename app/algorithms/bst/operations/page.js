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
  const [getPreorderForm, setPreorder] = useState({
    val: 0,
    start: false,
  });
  const [getPostorderForm, setPostorder] = useState({
    val: 0,
    start: false,
  });
  const [getLvlorderForm, setLvlorder] = useState({
    val: 0,
    start: false,
  });
  const [getInorderForm, setInorder] = useState({
    pos: 0,
    start: false,
  });

  const [animSpd, setAnimSpd] = useState(1);

  const updateForm = (n, key, value) => {
    if (key !== "start" || AEBool) {
      if (n == 1) {
        setAddForm((prev) => ({ ...prev, [key]: value }));
      } else if (n == 2) {
        setInorder((prev) => ({ ...prev, [key]: value }));
      } else if (n == 3) {
        setPreorder((prev) => ({ ...prev, [key]: value }));
      } else if (n == 4) {
        setPostorder((prev) => ({ ...prev, [key]: value }));
      } else if (n == 5) {
        setLvlorder((prev) => ({ ...prev, [key]: value }));
      }
    }
  };

  const codeSnippets = {
    inorder: {
      js: `// In-order: Left → Root → Right
inorderTraversal(node = this.root, result = []) {
    if (node !== null) {
        // Visit left subtree
        this.inorderTraversal(node.left, result);
        
        // Visit root
        result.push(node.data);
        
        // Visit right subtree
        this.inorderTraversal(node.right, result);
    }
    return result;
}`,
      c: `void inorderTraversal(struct Node* root) {
    if (root != NULL) {
        inorderTraversal(root->left);   // Left
        printf("%d ", root->data);      // Root
        inorderTraversal(root->right);  // Right
    }
}

// With array storage
void inorderArray(struct Node* root, int arr[], int* index) {
    if (root != NULL) {
        inorderArray(root->left, arr, index);
        arr[(*index)++] = root->data;
        inorderArray(root->right, arr, index);
    }
}`,
      py: `def inorder_traversal(self, node=None, result=None):
    if result is None:
        result = []
    if node is None:
        node = self.root
    
    if node is not None:
        # Left
        self.inorder_traversal(node.left, result)
        # Root
        result.append(node.data)
        # Right
        self.inorder_traversal(node.right, result)
    
    return result`,
      cpp: `void inorderTraversal(Node* root, std::vector<int>& result) {
    if (root != nullptr) {
        inorderTraversal(root->left, result);   // Left
        result.push_back(root->data);           // Root
        inorderTraversal(root->right, result);  // Right
    }
}`,
      idea: `In-order traversal (L-R-R):
1. Visit left subtree
2. Visit root node
3. Visit right subtree
Result: Elements in sorted order!`,
    },
    preorder: {
      js: `// Pre-order: Root → Left → Right
preorderTraversal(node = this.root, result = []) {
    if (node !== null) {
        // Visit root
        result.push(node.data);
        
        // Visit left subtree
        this.preorderTraversal(node.left, result);
        
        // Visit right subtree
        this.preorderTraversal(node.right, result);
    }
    return result;
}`,
      c: `void preorderTraversal(struct Node* root) {
    if (root != NULL) {
        printf("%d ", root->data);      // Root
        preorderTraversal(root->left);  // Left
        preorderTraversal(root->right); // Right
    }
}`,
      py: `def preorder_traversal(self, node=None, result=None):
    if result is None:
        result = []
    if node is None:
        node = self.root
    
    if node is not None:
        # Root
        result.append(node.data)
        # Left
        self.preorder_traversal(node.left, result)
        # Right
        self.preorder_traversal(node.right, result)
    
    return result`,
      cpp: `void preorderTraversal(Node* root, std::vector<int>& result) {
    if (root != nullptr) {
        result.push_back(root->data);           // Root
        preorderTraversal(root->left, result);  // Left
        preorderTraversal(root->right, result); // Right
    }
}`,
      idea: `Pre-order traversal (R-L-R):
1. Visit root node
2. Visit left subtree  
3. Visit right subtree
Useful for: Tree copying, prefix expressions`,
    },
    postorder: {
      js: `// Post-order: Left → Right → Root
postorderTraversal(node = this.root, result = []) {
    if (node !== null) {
        // Visit left subtree
        this.postorderTraversal(node.left, result);
        
        // Visit right subtree
        this.postorderTraversal(node.right, result);
        
        // Visit root
        result.push(node.data);
    }
    return result;
}`,
      c: `void postorderTraversal(struct Node* root) {
    if (root != NULL) {
        postorderTraversal(root->left);  // Left
        postorderTraversal(root->right); // Right
        printf("%d ", root->data);       // Root
    }
}`,
      py: `def postorder_traversal(self, node=None, result=None):
    if result is None:
        result = []
    if node is None:
        node = self.root
    
    if node is not None:
        # Left
        self.postorder_traversal(node.left, result)
        # Right
        self.postorder_traversal(node.right, result)
        # Root
        result.append(node.data)
    
    return result`,
      cpp: `void postorderTraversal(Node* root, std::vector<int>& result) {
    if (root != nullptr) {
        postorderTraversal(root->left, result);  // Left
        postorderTraversal(root->right, result); // Right
        result.push_back(root->data);            // Root
    }
}`,
      idea: `Post-order traversal (L-R-R):
1. Visit left subtree
2. Visit right subtree
3. Visit root node
Useful for: Tree deletion, calculating tree size`,
    },
    levelorder: {
      js: `// Level-order: Breadth-First Search
levelorderTraversal() {
    if (!this.root) return [];
    
    const result = [];
    const queue = [this.root];
    
    while (queue.length > 0) {
        const current = queue.shift();
        result.push(current.data);
        
        if (current.left) queue.push(current.left);
        if (current.right) queue.push(current.right);
    }
    return result;
}`,
      c: `void levelorderTraversal(struct Node* root) {
    if (root == NULL) return;
    
    // Simple array-based queue implementation
    struct Node* queue[1000];
    int front = 0, rear = 0;
    
    queue[rear++] = root;
    
    while (front < rear) {
        struct Node* current = queue[front++];
        printf("%d ", current->data);
        
        if (current->left) queue[rear++] = current->left;
        if (current->right) queue[rear++] = current->right;
    }
}`,
      py: `from collections import deque

def levelorder_traversal(self):
    if not self.root:
        return []
    
    result = []
    queue = deque([self.root])
    
    while queue:
        current = queue.popleft()
        result.append(current.data)
        
        if current.left:
            queue.append(current.left)
        if current.right:
            queue.append(current.right)
    
    return result`,
      cpp: `std::vector<int> levelorderTraversal(Node* root) {
    std::vector<int> result;
    if (!root) return result;
    
    std::queue<Node*> queue;
    queue.push(root);
    
    while (!queue.empty()) {
        Node* current = queue.front();
        queue.pop();
        result.push_back(current->data);
        
        if (current->left) queue.push(current->left);
        if (current->right) queue.push(current->right);
    }
    return result;
}`,
      idea: `Level-order traversal (BFS):
- Visit nodes level by level
- Use queue (FIFO) data structure
- Left to right within each level
Useful for: Tree printing, finding height`,
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
              BST Tree Traversals
            </h1>
            <div className="vl-meta mt-3">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-pen-green rounded-full mr-2"></span>
                In-order: O(n)
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-pen-blue rounded-full mr-2"></span>
                Pre-order: O(n)
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-pen-plum rounded-full mr-2"></span>
                Post-order: O(n)
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-pen-rust rounded-full mr-2"></span>
                Level-order: O(n)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Visualization Section */}
      <div className="max-w-6xl mx-auto px-8 mb-12">
        <div className="vl-card p-6">
          <div className="flex items-center gap-6 mb-4">
            <NumberInput
              btnName="Add Array"
              onSubmit={(arr) => {
                updateForm(1, "val", arr);
                updateForm(1, "start", true);
                setTimeout(() => updateForm(1, "start", false), 10);
              }}
            />

            <div className="flex items-center gap-4">
              <Button
                onClick={() => {
                  updateForm(2, "start", true);
                  setTimeout(() => updateForm(2, "start", false), 10);
                }}
                className="dobtn"
              >
                In-order
              </Button>
              <Button
                onClick={() => {
                  updateForm(3, "start", true);
                  setTimeout(() => updateForm(3, "start", false), 10);
                }}
                className="dobtn"
              >
                Pre-order
              </Button>
              <Button
                onClick={() => {
                  updateForm(4, "start", true);
                  setTimeout(() => updateForm(4, "start", false), 10);
                }}
                className="dobtn"
              >
                Post-order
              </Button>
              <Button
                onClick={() => {
                  updateForm(5, "start", true);
                  setTimeout(() => updateForm(5, "start", false), 10);
                }}
                className="dobtn"
              >
                Level-order
              </Button>
            </div>
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
            inorder={getInorderForm}
            preorder={getPreorderForm}
            postorder={getPostorderForm}
            lvlorder={getLvlorderForm}
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
            Tree Traversal Methods
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="vl-note vl-note-green p-4">
              <h3 className="vl-h3 mb-2">
                <button
                  onClick={() =>
                    document
                      .getElementById("inorder-section")
                      .scrollIntoView({ behavior: "smooth" })
                  }
                  className="hover:text-pen-green transition-colors cursor-pointer"
                >
                  In-order
                </button>
              </h3>
              <p className="text-ink-2 text-sm">
                Left → Root → Right. Visits nodes in sorted order for BST. Used
                for getting sorted sequence.
              </p>
            </div>
            <div className="vl-note vl-note-blue p-4">
              <h3 className="vl-h3 mb-2">
                <button
                  onClick={() =>
                    document
                      .getElementById("preorder-section")
                      .scrollIntoView({ behavior: "smooth" })
                  }
                  className="hover:text-pen-blue transition-colors cursor-pointer"
                >
                  Pre-order
                </button>
              </h3>
              <p className="text-ink-2 text-sm">
                Root → Left → Right. Visits root first. Used for tree copying
                and prefix expressions.
              </p>
            </div>
            <div className="vl-note vl-note-plum p-4">
              <h3 className="vl-h3 mb-2">
                <button
                  onClick={() =>
                    document
                      .getElementById("postorder-section")
                      .scrollIntoView({ behavior: "smooth" })
                  }
                  className="hover:text-pen-plum transition-colors cursor-pointer"
                >
                  Post-order
                </button>
              </h3>
              <p className="text-ink-2 text-sm">
                Left → Right → Root. Visits root last. Used for tree deletion
                and postfix expressions.
              </p>
            </div>
            <div className="vl-note vl-note-rust p-4">
              <h3 className="vl-h3 mb-2">
                <button
                  onClick={() =>
                    document
                      .getElementById("levelorder-section")
                      .scrollIntoView({ behavior: "smooth" })
                  }
                  className="hover:text-pen-rust transition-colors cursor-pointer"
                >
                  Level-order
                </button>
              </h3>
              <p className="text-ink-2 text-sm">
                Breadth-first traversal. Visits level by level. Uses queue data
                structure.
              </p>
            </div>
          </div>
        </div>

        {/* In-order Section */}
        <div
          id="inorder-section"
          className="vl-card p-8"
        >
          <h2 className="vl-h2 mb-6">
            In-order Traversal
          </h2>
          <div className="mb-6">
            <div className="vl-note vl-note-green p-6">
              <p className="text-ink-2 text-lg leading-relaxed">
                In-order traversal follows the pattern:{" "}
                <span className="text-pen-green font-semibold">
                  Left → Root → Right
                </span>
                . This traversal is particularly special for Binary Search Trees
                because it visits nodes in
                <span className="text-pen-green font-semibold">
                  {" "}
                  sorted order
                </span>
                . The recursive approach naturally handles the traversal by
                first visiting the left subtree, then processing the current
                node, and finally visiting the right subtree. This property
                makes in-order traversal perfect for retrieving data from a BST
                in ascending order.
              </p>
            </div>
          </div>
          <CodeBlock
            codeSnippets={codeSnippets.inorder}
            defaultLang="js"
            height="600px"
          />
        </div>

        {/* Pre-order Section */}
        <div
          id="preorder-section"
          className="vl-card p-8"
        >
          <h2 className="vl-h2 mb-6">
            Pre-order Traversal
          </h2>
          <div className="mb-6">
            <div className="vl-note vl-note-blue p-6">
              <p className="text-ink-2 text-lg leading-relaxed">
                Pre-order traversal follows:{" "}
                <span className="text-pen-blue font-semibold">
                  Root → Left → Right
                </span>
                . By visiting the root node first, this traversal creates a
                natural sequence for
                <span className="text-pen-blue font-semibold">
                  {" "}
                  tree reconstruction
                </span>
                . Pre-order is commonly used for copying trees, creating backup
                representations, and evaluating prefix expressions. The
                root-first approach ensures that when rebuilding a tree, you
                always have the parent node available before processing its
                children.
              </p>
            </div>
          </div>
          <CodeBlock
            codeSnippets={codeSnippets.preorder}
            defaultLang="js"
            height="500px"
          />
        </div>

        {/* Post-order Section */}
        <div
          id="postorder-section"
          className="vl-card p-8"
        >
          <h2 className="vl-h2 mb-6">
            Post-order Traversal
          </h2>
          <div className="mb-6">
            <div className="vl-note vl-note-plum p-6">
              <p className="text-ink-2 text-lg leading-relaxed">
                Post-order traversal follows:{" "}
                <span className="text-pen-plum font-semibold">
                  Left → Right → Root
                </span>
                . This traversal processes children before their parent, making
                it ideal for
                <span className="text-pen-plum font-semibold">
                  {" "}
                  safe tree deletion
                </span>{" "}
                and calculating tree properties like size or height. Since
                children are processed first, you can safely delete or modify
                nodes without affecting the traversal of remaining nodes.
                Post-order is also used for evaluating postfix expressions and
                performing bottom-up computations.
              </p>
            </div>
          </div>
          <CodeBlock
            codeSnippets={codeSnippets.postorder}
            defaultLang="js"
            height="500px"
          />
        </div>

        {/* Level-order Section */}
        <div
          id="levelorder-section"
          className="vl-card p-8"
        >
          <h2 className="vl-h2 mb-6">
            Level-order Traversal
          </h2>
          <div className="mb-6">
            <div className="vl-note vl-note-rust p-6">
              <p className="text-ink-2 text-lg leading-relaxed">
                Level-order traversal, also known as{" "}
                <span className="text-pen-rust font-semibold">
                  Breadth-First Search (BFS)
                </span>
                , visits nodes level by level from left to right. Unlike the
                depth-first approaches (in-order, pre-order, post-order), this
                traversal uses a{" "}
                <span className="text-pen-rust font-semibold">
                  queue data structure
                </span>{" "}
                instead of recursion or a stack. It&apos;s particularly useful
                for tree printing, finding the shortest path, and determining
                tree width at each level. Level-order traversal provides a
                natural way to visualize tree structure.
              </p>
            </div>
          </div>
          <CodeBlock
            codeSnippets={codeSnippets.levelorder}
            defaultLang="js"
            height="500px"
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
