"use client";

import { CodeBlock } from "@/components/CodeBlock";
import PhoneScreenBlock from "@/components/phoneScreenBlocker";
import AdBanner from "@/components/AdBanner";
import StackQueueVisualizer from "@/components/StackQueueVisualizer";

const codeSnippets = {
  js: `// Circular queue (ring buffer) on a fixed-size array
class CircularQueue {
  constructor(capacity) {
    this.items = new Array(capacity);
    this.capacity = capacity;
    this.front = 0;               // index of the first item
    this.rear = capacity - 1;     // index of the last item (one before front)
    this.count = 0;               // how many items are stored
  }

  isEmpty() { return this.count === 0; }
  isFull()  { return this.count === this.capacity; }

  enqueue(value) {
    if (this.isFull()) throw new Error("Queue overflow");
    this.rear = (this.rear + 1) % this.capacity;   // wrap round
    this.items[this.rear] = value;
    this.count++;
  }

  dequeue() {
    if (this.isEmpty()) throw new Error("Queue underflow");
    const value = this.items[this.front];
    this.front = (this.front + 1) % this.capacity; // wrap round
    this.count--;
    return value;
  }

  peek() {
    if (this.isEmpty()) throw new Error("Queue is empty");
    return this.items[this.front];
  }
}`,
  c: `#include <stdbool.h>

#define CAPACITY 8

typedef struct {
    int items[CAPACITY];
    int front, rear, count;
} CircularQueue;

void init(CircularQueue* q) {
    q->front = 0;
    q->rear = CAPACITY - 1;
    q->count = 0;
}

bool enqueue(CircularQueue* q, int value) {
    if (q->count == CAPACITY) return false;            // overflow
    q->rear = (q->rear + 1) % CAPACITY;                 // wrap round
    q->items[q->rear] = value;
    q->count++;
    return true;
}

bool dequeue(CircularQueue* q, int* out) {
    if (q->count == 0) return false;                    // underflow
    *out = q->items[q->front];
    q->front = (q->front + 1) % CAPACITY;               // wrap round
    q->count--;
    return true;
}`,
  py: `class CircularQueue:
    def __init__(self, capacity):
        self.items = [None] * capacity
        self.capacity = capacity
        self.front = 0
        self.rear = capacity - 1
        self.count = 0

    def is_empty(self):
        return self.count == 0

    def is_full(self):
        return self.count == self.capacity

    def enqueue(self, value):
        if self.is_full():
            raise OverflowError("queue overflow")
        self.rear = (self.rear + 1) % self.capacity    # wrap round
        self.items[self.rear] = value
        self.count += 1

    def dequeue(self):
        if self.is_empty():
            raise IndexError("queue underflow")
        value = self.items[self.front]
        self.front = (self.front + 1) % self.capacity  # wrap round
        self.count -= 1
        return value`,
  cpp: `#include <stdexcept>

template <typename T, int CAPACITY>
class CircularQueue {
    T items[CAPACITY];
    int front = 0, rear = CAPACITY - 1, count = 0;
public:
    bool empty() const { return count == 0; }
    bool full()  const { return count == CAPACITY; }

    void enqueue(const T& value) {
        if (full()) throw std::overflow_error("queue overflow");
        rear = (rear + 1) % CAPACITY;      // wrap round
        items[rear] = value;
        count++;
    }
    T dequeue() {
        if (empty()) throw std::underflow_error("queue underflow");
        T value = items[front];
        front = (front + 1) % CAPACITY;    // wrap round
        count--;
        return value;
    }
};`,
  idea: `A circular queue is a queue on an array whose ends are joined:
after the last slot comes slot 0 again.

- next index = (index + 1) mod capacity
- enqueue: rear  ← (rear + 1) mod capacity, a[rear] ← v
- dequeue: front ← (front + 1) mod capacity
- keep a count to tell "empty" (0) from "full" (capacity),
  because front and rear look the same in both cases.

Every slot can be reused, so nothing is wasted,
and every operation is still O(1).`,
};

export default function Home() {
  return (
    <main className="vl-page">
      <PhoneScreenBlock message="Please switch to desktop mode to view this website" />

      <div className="max-w-6xl mx-auto px-8 mb-6">
        <div className="vl-hero">
          <div>
            <h1 className="vl-title text-4xl mb-2">Circular Queue</h1>
            <div className="vl-meta mt-3">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-pen-green rounded-full mr-2"></span>
                Enqueue / Dequeue: O(1)
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-pen-blue rounded-full mr-2"></span>
                No wasted slots
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-pen-rust rounded-full mr-2"></span>
                Ring buffer
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 mb-12">
        <div className="vl-card px-6 py-4">
          <StackQueueVisualizer kind="circular" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 space-y-8">
        <AdBanner position="bottom" size="responsive" adTest="off" />

        <div className="vl-card p-8">
          <h2 className="vl-h2 mb-4">What is a Circular Queue?</h2>
          <div className="space-y-4 text-ink-2 leading-relaxed">
            <p className="text-lg">
              A <span className="text-pen-green font-semibold">circular queue</span> (or{" "}
              <span className="text-pen-green font-semibold">ring buffer</span>) is still a FIFO queue on an
              array, but the array&apos;s ends are joined: after the last slot comes slot{" "}
              <span className="font-mono">0</span> again. Both <span className="font-mono">front</span> and{" "}
              <span className="font-mono">rear</span> move forward with{" "}
              <span className="text-pen-plum font-semibold">(index + 1) mod capacity</span>, so slots freed by
              dequeue are reused by later enqueues.
            </p>
            <p className="text-lg">
              The ring on the left and the flat array on the right show the same eight slots. Watch{" "}
              <span className="font-mono">rear</span> jump from slot 7 back to slot 0: on the ring it&apos;s just
              the next slot, in the array it wraps to the start.
            </p>
            <div className="vl-note vl-note-green p-4 my-4">
              <p className="text-center text-lg font-bold text-pen-green">
                next = (index + 1) mod capacity: the end of the array wraps round to the start.
              </p>
            </div>
          </div>
        </div>

        <div className="vl-card p-8">
          <h2 className="vl-h2 mb-6">How the Operations Work</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="vl-note vl-note-green p-6">
              <h3 className="vl-h3 mb-2">Enqueue</h3>
              <p className="text-ink-2">
                If <span className="font-mono">count &lt; capacity</span>, advance{" "}
                <span className="font-mono">rear</span> one step round the ring, store the value and add one to{" "}
                <span className="font-mono">count</span>.
              </p>
            </div>
            <div className="vl-note vl-note-rust p-6">
              <h3 className="vl-h3 mb-2">Dequeue</h3>
              <p className="text-ink-2">
                If <span className="font-mono">count &gt; 0</span>, read <span className="font-mono">a[front]</span>,
                advance <span className="font-mono">front</span> one step round the ring and take one off{" "}
                <span className="font-mono">count</span>.
              </p>
            </div>
            <div className="vl-note vl-note-blue p-6">
              <h3 className="vl-h3 mb-2">Why keep a count?</h3>
              <p className="text-ink-2">
                In an empty queue and in a full queue, <span className="font-mono">rear</span> sits just before{" "}
                <span className="font-mono">front</span>. The count tells the two apart. (Another common trick is
                to always leave one slot empty.)
              </p>
            </div>
            <div className="vl-note vl-note-plum p-6">
              <h3 className="vl-h3 mb-2">Compared to the simple queue</h3>
              <p className="text-ink-2">
                The simple array queue can only use each slot once. The circular queue keeps reusing them, so it can
                run forever with a fixed amount of memory.
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
                <li>• <span className="text-pen-green font-semibold">Is empty / full:</span> O(1)</li>
              </ul>
            </div>
            <div className="vl-note vl-note-blue p-6">
              <h3 className="vl-h3 mb-2">Space & Properties</h3>
              <ul className="text-ink-2 space-y-2">
                <li>• <span className="text-pen-blue font-semibold">Space:</span> exactly the capacity</li>
                <li>• <span className="text-pen-blue font-semibold">Order:</span> FIFO</li>
                <li>• <span className="text-pen-blue font-semibold">Slots:</span> all reused, none wasted</li>
                <li>• <span className="text-pen-blue font-semibold">Allocation:</span> none after creation</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="vl-card p-6">
            <h3 className="vl-h3 mb-4"><span>Where Ring Buffers Are Used</span></h3>
            <ul className="text-ink-2 leading-relaxed space-y-2">
              <li>• <span className="text-pen-green">Audio and video streaming:</span> a steady buffer of samples</li>
              <li>• <span className="text-pen-green">Keyboard and serial input:</span> drivers store key presses</li>
              <li>• <span className="text-pen-green">Network cards:</span> packets waiting to be processed</li>
              <li>• <span className="text-pen-green">Logs:</span> keep only the latest N entries</li>
              <li>• <span className="text-pen-green">Round-robin scheduling:</span> take turns forever</li>
            </ul>
          </div>
          <div className="vl-card p-6">
            <h3 className="vl-h3 mb-4"><span>Limitations</span></h3>
            <ul className="text-ink-2 leading-relaxed space-y-2">
              <li>• <span className="text-pen-gold">Fixed capacity:</span> it overflows when every slot is full</li>
              <li>• <span className="text-pen-gold">Empty vs full:</span> needs a count or a spare slot to tell apart</li>
              <li>• <span className="text-pen-gold">No random access:</span> only the front can be read</li>
            </ul>
          </div>
        </div>

        <AdBanner position="bottom" size="responsive" adTest="off" adSlot="9575932649" />
        <div className="h-12"></div>
      </div>
    </main>
  );
}
