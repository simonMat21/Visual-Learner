"use client";

import Link from "next/link";
import { CodeBlock } from "@/components/CodeBlock";
import PhoneScreenBlock from "@/components/phoneScreenBlocker";
import AdBanner from "@/components/AdBanner";
import StackQueueVisualizer from "@/components/StackQueueVisualizer";

const codeSnippets = {
  js: `// Queue on a fixed-size array (the simple version)
class Queue {
  constructor(capacity) {
    this.items = new Array(capacity);
    this.capacity = capacity;
    this.front = 0;        // index of the first item
    this.rear = -1;        // index of the last item
  }

  isEmpty() { return this.front > this.rear; }
  isFull()  { return this.rear === this.capacity - 1; }

  enqueue(value) {                      // add at the back
    if (this.isFull()) throw new Error("Queue overflow");
    this.rear++;
    this.items[this.rear] = value;
  }

  dequeue() {                           // remove from the front
    if (this.isEmpty()) throw new Error("Queue underflow");
    const value = this.items[this.front];
    this.front++;                       // this slot is never reused
    return value;
  }

  peek() {
    if (this.isEmpty()) throw new Error("Queue is empty");
    return this.items[this.front];
  }
}

const q = new Queue(8);
q.enqueue(10); q.enqueue(20); q.enqueue(30);
console.log(q.dequeue()); // 10: first in, first out`,
  c: `#include <stdbool.h>

#define CAPACITY 8

typedef struct {
    int items[CAPACITY];
    int front;     // index of the first item
    int rear;      // index of the last item
} Queue;

void init(Queue* q)     { q->front = 0; q->rear = -1; }
bool isEmpty(Queue* q)  { return q->front > q->rear; }
bool isFull(Queue* q)   { return q->rear == CAPACITY - 1; }

bool enqueue(Queue* q, int value) {
    if (isFull(q)) return false;          // overflow
    q->items[++q->rear] = value;
    return true;
}

bool dequeue(Queue* q, int* out) {
    if (isEmpty(q)) return false;         // underflow
    *out = q->items[q->front++];          // the slot is never reused
    return true;
}`,
  py: `class Queue:
    def __init__(self, capacity):
        self.items = [None] * capacity
        self.capacity = capacity
        self.front = 0          # index of the first item
        self.rear = -1          # index of the last item

    def is_empty(self):
        return self.front > self.rear

    def is_full(self):
        return self.rear == self.capacity - 1

    def enqueue(self, value):
        if self.is_full():
            raise OverflowError("queue overflow")
        self.rear += 1
        self.items[self.rear] = value

    def dequeue(self):
        if self.is_empty():
            raise IndexError("queue underflow")
        value = self.items[self.front]
        self.front += 1         # the slot is never reused
        return value


# In real Python code, use collections.deque:
from collections import deque
q = deque()
q.append(10); q.append(20)
print(q.popleft())   # 10`,
  cpp: `#include <queue>
#include <stdexcept>

template <typename T, int CAPACITY>
class Queue {
    T items[CAPACITY];
    int front = 0;        // index of the first item
    int rear = -1;        // index of the last item
public:
    bool empty() const { return front > rear; }
    bool full()  const { return rear == CAPACITY - 1; }

    void enqueue(const T& value) {
        if (full()) throw std::overflow_error("queue overflow");
        items[++rear] = value;
    }
    T dequeue() {
        if (empty()) throw std::underflow_error("queue underflow");
        return items[front++];            // the slot is never reused
    }
};

// The standard library version:
// std::queue<int> q; q.push(10); q.front(); q.pop();`,
  idea: `A queue is FIFO: First In, First Out.
Like a line at a shop: join at the back, leave from the front.

On an array with two indexes:
- enqueue(v): rear ← rear + 1, a[rear] ← v    (full when rear == capacity - 1)
- dequeue():  v ← a[front], front ← front + 1 (empty when front > rear)

The catch: front only moves right, so slots before it are
wasted. The queue can be "full" while having free slots at the
front. A circular queue fixes this by wrapping round.`,
};

export default function Home() {
  return (
    <main className="vl-page">
      <PhoneScreenBlock message="Please switch to desktop mode to view this website" />

      <div className="max-w-6xl mx-auto px-8 mb-6">
        <div className="vl-hero">
          <div>
            <h1 className="vl-title text-4xl mb-2">Queue</h1>
            <div className="vl-meta mt-3">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-pen-green rounded-full mr-2"></span>
                Enqueue / Dequeue: O(1)
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-pen-blue rounded-full mr-2"></span>
                Space: O(n)
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-pen-rust rounded-full mr-2"></span>
                FIFO: first in, first out
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 mb-12">
        <div className="vl-card px-6 py-4">
          <StackQueueVisualizer kind="queue" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 space-y-8">
        <AdBanner position="bottom" size="responsive" adTest="off" />

        <div className="vl-card p-8">
          <h2 className="vl-h2 mb-4">What is a Queue?</h2>
          <div className="space-y-4 text-ink-2 leading-relaxed">
            <p className="text-lg">
              A <span className="text-pen-green font-semibold">queue</span> works like a line of people: new
              items join at the <span className="text-pen-plum font-semibold">rear</span> and items leave from the{" "}
              <span className="text-pen-plum font-semibold">front</span>. Whatever went in first comes out first,
              which is called <span className="text-pen-rust font-semibold">FIFO</span>: first in, first out.
            </p>
            <p className="text-lg">
              The visualizer shows the simplest array version, with two indexes. <span className="font-mono">rear</span>{" "}
              moves right when you enqueue and <span className="font-mono">front</span> moves right when you
              dequeue. Dequeue a few values and keep enqueueing: the slots behind <span className="font-mono">front</span>{" "}
              are never used again, so the queue reports &quot;full&quot; while empty slots are still sitting at the
              front. The{" "}
              <Link href="/algorithms/stack-queue/circular-queue" className="text-pen-blue font-semibold underline">
                circular queue
              </Link>{" "}
              solves exactly this.
            </p>
            <div className="vl-note vl-note-green p-4 my-4">
              <p className="text-center text-lg font-bold text-pen-green">Join at the rear, leave from the front.</p>
            </div>
          </div>
        </div>

        <div className="vl-card p-8">
          <h2 className="vl-h2 mb-6">How the Operations Work</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="vl-note vl-note-green p-6">
              <h3 className="vl-h3 mb-2">Enqueue</h3>
              <p className="text-ink-2">
                If <span className="font-mono">rear</span> is not at the last slot, move it one step right and
                store the value there. Otherwise the queue overflows.
              </p>
            </div>
            <div className="vl-note vl-note-rust p-6">
              <h3 className="vl-h3 mb-2">Dequeue</h3>
              <p className="text-ink-2">
                If the queue isn&apos;t empty (<span className="font-mono">front ≤ rear</span>), read{" "}
                <span className="font-mono">a[front]</span> and move <span className="font-mono">front</span> one
                step right.
              </p>
            </div>
            <div className="vl-note vl-note-blue p-6">
              <h3 className="vl-h3 mb-2">Peek</h3>
              <p className="text-ink-2">Look at the front value without removing it.</p>
            </div>
            <div className="vl-note vl-note-plum p-6">
              <h3 className="vl-h3 mb-2">The wasted-space problem</h3>
              <p className="text-ink-2">
                Shifting every item left after each dequeue would fix it but costs O(n). Wrapping the indexes
                round to the start (a circular queue) fixes it in O(1).
              </p>
            </div>
          </div>
        </div>

        <div className="vl-card p-8">
          <h2 className="vl-h2 mb-6">Implementation</h2>
          <CodeBlock codeSnippets={codeSnippets} defaultLang="js" height="560px" />
        </div>

        <div className="vl-card p-8">
          <h2 className="vl-h2 mb-6">Properties & Complexity</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="vl-note vl-note-plum p-6">
              <h3 className="vl-h3 mb-2">Time Complexity</h3>
              <ul className="text-ink-2 space-y-2">
                <li>• <span className="text-pen-green font-semibold">Enqueue:</span> O(1)</li>
                <li>• <span className="text-pen-green font-semibold">Dequeue:</span> O(1)</li>
                <li>• <span className="text-pen-green font-semibold">Peek:</span> O(1)</li>
                <li>• <span className="text-pen-gold font-semibold">Search for a value:</span> O(n)</li>
              </ul>
            </div>
            <div className="vl-note vl-note-blue p-6">
              <h3 className="vl-h3 mb-2">Space & Properties</h3>
              <ul className="text-ink-2 space-y-2">
                <li>• <span className="text-pen-blue font-semibold">Space:</span> O(n)</li>
                <li>• <span className="text-pen-blue font-semibold">Order:</span> FIFO</li>
                <li>• <span className="text-pen-blue font-semibold">Simple array:</span> wastes slots at the front</li>
                <li>• <span className="text-pen-blue font-semibold">Fix:</span> circular queue or a linked list</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="vl-card p-6">
            <h3 className="vl-h3 mb-4"><span>Where Queues Are Used</span></h3>
            <ul className="text-ink-2 leading-relaxed space-y-2">
              <li>• <span className="text-pen-green">Breadth-first search:</span> visit nodes level by level</li>
              <li>• <span className="text-pen-green">Printing / task queues:</span> jobs run in arrival order</li>
              <li>• <span className="text-pen-green">Buffers:</span> keyboard input, network packets, streaming</li>
              <li>• <span className="text-pen-green">Scheduling:</span> waiting lines for a shared resource</li>
            </ul>
          </div>
          <div className="vl-card p-6">
            <h3 className="vl-h3 mb-4"><span>Limitations</span></h3>
            <ul className="text-ink-2 leading-relaxed space-y-2">
              <li>• <span className="text-pen-gold">Wasted slots:</span> the simple array version can&apos;t reuse the front</li>
              <li>• <span className="text-pen-gold">No random access:</span> only the front can be read</li>
              <li>• <span className="text-pen-gold">Fixed size:</span> the array version can overflow</li>
            </ul>
          </div>
        </div>

        <AdBanner position="bottom" size="responsive" adTest="off" adSlot="9575932649" />
        <div className="h-12"></div>
      </div>
    </main>
  );
}
