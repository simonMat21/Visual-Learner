"use client";

import { CodeBlock } from "@/components/CodeBlock";
import PhoneScreenBlock from "@/components/phoneScreenBlocker";
import AdBanner from "@/components/AdBanner";
import LinkedListVisualizer from "@/components/LinkedListVisualizer";

const codeSnippets = {
  setup: {
    js: `class Node {
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}

class CircularLinkedList {
  constructor() {
    this.head = null;   // any node can be the "start"; we keep one
    this.size = 0;
  }

  // the last node is the one whose next is head
  lastNode() {
    let curr = this.head;
    while (curr.next !== this.head) curr = curr.next;
    return curr;
  }
}`,
    c: `#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int data;
    struct Node* next;
} Node;

typedef struct {
    Node* head;
    int size;
} CircularList;

Node* createNode(int data) {
    Node* n = malloc(sizeof(Node));
    n->data = data;
    n->next = NULL;
    return n;
}

// the last node is the one whose next is head
Node* lastNode(CircularList* list) {
    Node* curr = list->head;
    while (curr->next != list->head) curr = curr->next;
    return curr;
}`,
    py: `class Node:
    def __init__(self, data):
        self.data = data
        self.next = None


class CircularLinkedList:
    def __init__(self):
        self.head = None
        self.size = 0

    def last_node(self):
        """The last node is the one whose next is head."""
        curr = self.head
        while curr.next is not self.head:
            curr = curr.next
        return curr`,
    cpp: `struct Node {
    int data;
    Node* next;
    Node(int d) : data(d), next(nullptr) {}
};

class CircularLinkedList {
    Node* head = nullptr;
    int size = 0;

    // the last node is the one whose next is head
    Node* lastNode() const {
        Node* curr = head;
        while (curr->next != head) curr = curr->next;
        return curr;
    }
public:
    // insert, remove and search below
};`,
    idea: `A circular linked list is a singly linked list whose
last node points back to the first node instead of null.

- There is no null at the end: following next forever
  just keeps going round.
- Any node could be the start; we keep a "head" pointer.
- An empty list has head = null.
- A one-node list points to itself.`,
  },
  insert: {
    js: `insert(data, index = this.size) {
  const newNode = new Node(data);

  if (this.head === null) {           // empty: point to itself
    newNode.next = newNode;
    this.head = newNode;
  } else if (index === 0) {           // new head: fix the last node too
    const last = this.lastNode();
    newNode.next = this.head;
    last.next = newNode;
    this.head = newNode;
  } else {                            // middle or end
    let curr = this.head;
    for (let i = 0; i < index - 1; i++) curr = curr.next;
    newNode.next = curr.next;
    curr.next = newNode;
  }
  this.size++;
}`,
    c: `void insert(CircularList* list, int data, int index) {
    Node* newNode = createNode(data);

    if (list->head == NULL) {               // empty: point to itself
        newNode->next = newNode;
        list->head = newNode;
    } else if (index == 0) {                // new head: fix the last node too
        Node* last = lastNode(list);
        newNode->next = list->head;
        last->next = newNode;
        list->head = newNode;
    } else {                                // middle or end
        Node* curr = list->head;
        for (int i = 0; i < index - 1; i++) curr = curr->next;
        newNode->next = curr->next;
        curr->next = newNode;
    }
    list->size++;
}`,
    py: `def insert(self, data, index=None):
    if index is None:
        index = self.size
    new_node = Node(data)

    if self.head is None:                 # empty: point to itself
        new_node.next = new_node
        self.head = new_node
    elif index == 0:                      # new head: fix the last node too
        last = self.last_node()
        new_node.next = self.head
        last.next = new_node
        self.head = new_node
    else:                                 # middle or end
        curr = self.head
        for _ in range(index - 1):
            curr = curr.next
        new_node.next = curr.next
        curr.next = new_node
    self.size += 1`,
    cpp: `void insert(int data, int index) {
    Node* newNode = new Node(data);

    if (!head) {                            // empty: point to itself
        newNode->next = newNode;
        head = newNode;
    } else if (index == 0) {                // new head: fix the last node too
        Node* last = lastNode();
        newNode->next = head;
        last->next = newNode;
        head = newNode;
    } else {                                // middle or end
        Node* curr = head;
        for (int i = 0; i < index - 1; i++) curr = curr->next;
        newNode->next = curr->next;
        curr->next = newNode;
    }
    size++;
}`,
    idea: `Three cases:
1. Empty list   -> the new node points to itself.
2. At index 0   -> new node points to head, the LAST node
                   now points to the new node, head moves.
                   (finding the last node costs O(n) unless
                   you also keep a tail pointer)
3. Anywhere else -> exactly like a singly linked list:
                   newNode.next = curr.next; curr.next = newNode.`,
  },
  search: {
    js: `search(value) {
  if (this.head === null) return -1;
  let curr = this.head;
  let i = 0;
  do {
    if (curr.data === value) return i;
    curr = curr.next;
    i++;
  } while (curr !== this.head);   // back at the start: stop
  return -1;
}`,
    c: `int search(CircularList* list, int value) {
    if (list->head == NULL) return -1;
    Node* curr = list->head;
    int i = 0;
    do {
        if (curr->data == value) return i;
        curr = curr->next;
        i++;
    } while (curr != list->head);   // back at the start: stop
    return -1;
}`,
    py: `def search(self, value):
    if self.head is None:
        return -1
    curr, i = self.head, 0
    while True:
        if curr.data == value:
            return i
        curr, i = curr.next, i + 1
        if curr is self.head:       # back at the start: stop
            return -1`,
    cpp: `int search(int value) const {
    if (!head) return -1;
    Node* curr = head;
    int i = 0;
    do {
        if (curr->data == value) return i;
        curr = curr->next;
        i++;
    } while (curr != head);         // back at the start: stop
    return -1;
}`,
    idea: `There is no null to stop at, so a normal
"while curr != null" loop would never end.

Use a do-while: look at the node first, move on,
and stop as soon as you are back at head.`,
  },
  delete: {
    js: `removeAt(index) {
  if (this.head === null || index < 0 || index >= this.size) return false;

  if (this.size === 1) {              // only node
    this.head = null;
  } else if (index === 0) {           // removing head: fix the last node
    const last = this.lastNode();
    this.head = this.head.next;
    last.next = this.head;
  } else {
    let curr = this.head;
    for (let i = 0; i < index - 1; i++) curr = curr.next;
    const target = curr.next;
    curr.next = target.next;          // skip over it
  }
  this.size--;
  return true;
}`,
    c: `int removeAt(CircularList* list, int index) {
    if (!list->head || index < 0 || index >= list->size) return 0;
    Node* target;

    if (list->size == 1) {                  // only node
        target = list->head;
        list->head = NULL;
    } else if (index == 0) {                // removing head: fix the last node
        Node* last = lastNode(list);
        target = list->head;
        list->head = target->next;
        last->next = list->head;
    } else {
        Node* curr = list->head;
        for (int i = 0; i < index - 1; i++) curr = curr->next;
        target = curr->next;
        curr->next = target->next;          // skip over it
    }
    free(target);
    list->size--;
    return 1;
}`,
    py: `def remove_at(self, index):
    if self.head is None or not 0 <= index < self.size:
        return False

    if self.size == 1:                    # only node
        self.head = None
    elif index == 0:                      # removing head: fix the last node
        last = self.last_node()
        self.head = self.head.next
        last.next = self.head
    else:
        curr = self.head
        for _ in range(index - 1):
            curr = curr.next
        curr.next = curr.next.next        # skip over it
    self.size -= 1
    return True`,
    cpp: `bool removeAt(int index) {
    if (!head || index < 0 || index >= size) return false;
    Node* target;

    if (size == 1) {                        // only node
        target = head;
        head = nullptr;
    } else if (index == 0) {                // removing head: fix the last node
        Node* last = lastNode();
        target = head;
        head = head->next;
        last->next = head;
    } else {
        Node* curr = head;
        for (int i = 0; i < index - 1; i++) curr = curr->next;
        target = curr->next;
        curr->next = target->next;          // skip over it
    }
    delete target;
    size--;
    return true;
}`,
    idea: `Three cases:
1. Only one node -> head becomes null.
2. Index 0       -> head moves to head.next and the LAST
                    node must point at the new head.
3. Anywhere else -> find the node before it and make it
                    skip over the target.`,
  },
};

export default function Home() {
  return (
    <main className="vl-page">
      <PhoneScreenBlock message="Please switch to desktop mode to view this website" />

      {/* Title */}
      <div className="max-w-6xl mx-auto px-8 mb-6">
        <div className="vl-hero">
          <div>
            <h1 className="vl-title text-4xl">Circular Linked List</h1>
            <div className="vl-meta mt-3">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-pen-green rounded-full mr-2"></span>
                Search: O(n)
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-pen-blue rounded-full mr-2"></span>
                Insert after a node: O(1)
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-pen-rust rounded-full mr-2"></span>
                Insert / delete at head: O(n) without a tail pointer
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-pen-plum rounded-full mr-2"></span>
                No null at the end
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Visualization Section */}
      <div className="max-w-6xl mx-auto px-8 mb-12">
        <div className="vl-card px-6 py-4">
          <LinkedListVisualizer kind="circular" />
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-8 space-y-8">
        <AdBanner position="bottom" size="responsive" adTest="off" />

        {/* Description */}
        <div className="vl-card p-8">
          <h2 className="vl-h2 mb-4">Circular Linked List Operations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="vl-note vl-note-plum p-4">
              <h3 className="vl-h3 mb-2">
                <button
                  onClick={() => document.getElementById("setup-section").scrollIntoView({ behavior: "smooth" })}
                  className="hover:text-pen-plum transition-colors cursor-pointer"
                >
                  Setup
                </button>
              </h3>
              <p className="text-ink-2 text-sm">
                Like a singly linked list, but the last node&apos;s next points back to the head, so the
                nodes form a ring with no null at the end.
              </p>
            </div>
            <div className="vl-note vl-note-green p-4">
              <h3 className="vl-h3 mb-2">
                <button
                  onClick={() => document.getElementById("insert-section").scrollIntoView({ behavior: "smooth" })}
                  className="hover:text-pen-green transition-colors cursor-pointer"
                >
                  Insert
                </button>
              </h3>
              <p className="text-ink-2 text-sm">
                Inserting after a node is the same two pointer updates as a singly list. A new head also
                needs the last node re-pointed, so the ring stays closed.
              </p>
            </div>
            <div className="vl-note vl-note-blue p-4">
              <h3 className="vl-h3 mb-2">
                <button
                  onClick={() => document.getElementById("search-section").scrollIntoView({ behavior: "smooth" })}
                  className="hover:text-pen-blue transition-colors cursor-pointer"
                >
                  Search
                </button>
              </h3>
              <p className="text-ink-2 text-sm">
                There is no null to stop at, so the search stops when it arrives back at head after one
                full lap.
              </p>
            </div>
            <div className="vl-note vl-note-rust p-4">
              <h3 className="vl-h3 mb-2">
                <button
                  onClick={() => document.getElementById("delete-section").scrollIntoView({ behavior: "smooth" })}
                  className="hover:text-pen-rust transition-colors cursor-pointer"
                >
                  Delete
                </button>
              </h3>
              <p className="text-ink-2 text-sm">
                Skip over the node like in a singly list. Removing the head means moving head forward and
                re-pointing the last node; removing the only node empties the list.
              </p>
            </div>
          </div>
        </div>

        {/* Setup Section */}
        <div id="setup-section" className="vl-card p-8">
          <h2 className="vl-h2 mb-6">Setup - Node Structure</h2>
          <div className="mb-6">
            <div className="vl-note vl-note-plum p-6">
              <p className="text-ink-2 text-lg leading-relaxed">
                Each node holds a value and a <span className="text-pen-plum font-semibold">next</span>{" "}
                pointer, exactly like a singly linked list. The difference is the end: instead of{" "}
                <span className="font-mono">null</span>, the last node points back to the{" "}
                <span className="text-pen-plum font-semibold">head</span>. That makes the list a loop, which
                is handy for things that naturally go round and round: players taking turns, a round-robin
                CPU scheduler, or a playlist on repeat. Use <span className="font-semibold">Rotate</span> in
                the visualizer to see that moving the head is enough to change where the list
                &quot;starts&quot;: no node has to move.
              </p>
            </div>
          </div>
          <CodeBlock codeSnippets={codeSnippets.setup} defaultLang="js" height="400px" />
        </div>

        {/* Insert Section */}
        <div id="insert-section" className="vl-card p-8">
          <h2 className="vl-h2 mb-6">Insert - Add Operation</h2>
          <div className="mb-6">
            <div className="vl-note vl-note-green p-6">
              <p className="text-ink-2 text-lg leading-relaxed">
                Inserting after an existing node takes the usual{" "}
                <span className="text-pen-green font-semibold">two pointer updates</span>: the new node points
                to what came next, and the node before it points to the new node. The special cases are the
                ends of the ring. Into an empty list, the new node simply points to itself. As the new head,
                the <span className="text-pen-green font-semibold">last node must point to it</span>,
                otherwise the ring would still close at the old head. Finding the last node means walking
                all the way round, which is why many implementations also keep a tail pointer.
              </p>
            </div>
          </div>
          <CodeBlock codeSnippets={codeSnippets.insert} defaultLang="js" height="560px" />
        </div>

        {/* Search Section */}
        <div id="search-section" className="vl-card p-8">
          <h2 className="vl-h2 mb-6">Search - Find Operation</h2>
          <div className="mb-6">
            <div className="vl-note vl-note-blue p-6">
              <p className="text-ink-2 text-lg leading-relaxed">
                A search walks from the head comparing each value, just like a singly list, but the stopping
                rule is different. A <span className="font-mono">while (curr != null)</span> loop would spin
                forever, because there is no null. Instead a{" "}
                <span className="text-pen-blue font-semibold">do-while</span> loop checks a node, moves on,
                and stops when it comes back to the head. Worst case it visits every node once:{" "}
                <span className="text-pen-blue font-semibold">O(n)</span>.
              </p>
            </div>
          </div>
          <CodeBlock codeSnippets={codeSnippets.search} defaultLang="js" height="420px" />
        </div>

        {/* Delete Section */}
        <div id="delete-section" className="vl-card p-8">
          <h2 className="vl-h2 mb-6">Delete - Remove Operation</h2>
          <div className="mb-6">
            <div className="vl-note vl-note-rust p-6">
              <p className="text-ink-2 text-lg leading-relaxed">
                To delete, find the node before the target and make it{" "}
                <span className="text-pen-rust font-semibold">skip over</span> the target. Deleting the head
                also moves the head pointer forward, and the last node has to be re-pointed to the new head.
                If the list had only one node (which points to itself), deleting it leaves an empty list with
                head set to null.
              </p>
            </div>
          </div>
          <CodeBlock codeSnippets={codeSnippets.delete} defaultLang="js" height="620px" />
        </div>

        {/* Bottom Banner Ad */}
        <AdBanner position="bottom" size="responsive" adTest="off" adSlot="9575932649" />

        {/* Bottom Spacer */}
        <div className="h-12"></div>
      </div>
    </main>
  );
}
