"use client";

import { CodeBlock } from "@/components/CodeBlock";
import PhoneScreenBlock from "@/components/phoneScreenBlocker";
import AdBanner from "@/components/AdBanner";
import StackQueueVisualizer from "@/components/StackQueueVisualizer";

const codeSnippets = {
  js: `// Stack on a fixed-size array
class Stack {
  constructor(capacity) {
    this.items = new Array(capacity);
    this.capacity = capacity;
    this.top = -1;                 // index of the top item, -1 = empty
  }

  isEmpty() { return this.top === -1; }
  isFull()  { return this.top === this.capacity - 1; }

  push(value) {
    if (this.isFull()) throw new Error("Stack overflow");
    this.top++;
    this.items[this.top] = value;
  }

  pop() {
    if (this.isEmpty()) throw new Error("Stack underflow");
    const value = this.items[this.top];
    this.top--;
    return value;
  }

  peek() {
    if (this.isEmpty()) throw new Error("Stack is empty");
    return this.items[this.top];
  }
}

// Application: are the brackets balanced?
function isBalanced(text) {
  const pairs = { ")": "(", "]": "[", "}": "{" };
  const stack = [];
  for (const c of text) {
    if ("([{".includes(c)) stack.push(c);
    else if (c in pairs) {
      if (stack.length === 0 || stack.pop() !== pairs[c]) return false;
    }
  }
  return stack.length === 0;
}

console.log(isBalanced("{[()()]}")); // true
console.log(isBalanced("([)]"));     // false`,
  c: `#include <stdio.h>
#include <stdbool.h>

#define CAPACITY 7

typedef struct {
    int items[CAPACITY];
    int top;                 // index of the top item, -1 = empty
} Stack;

void init(Stack* s)        { s->top = -1; }
bool isEmpty(Stack* s)     { return s->top == -1; }
bool isFull(Stack* s)      { return s->top == CAPACITY - 1; }

bool push(Stack* s, int value) {
    if (isFull(s)) return false;          // overflow
    s->items[++s->top] = value;
    return true;
}

bool pop(Stack* s, int* out) {
    if (isEmpty(s)) return false;         // underflow
    *out = s->items[s->top--];
    return true;
}

bool peek(Stack* s, int* out) {
    if (isEmpty(s)) return false;
    *out = s->items[s->top];
    return true;
}

int main(void) {
    Stack s; init(&s);
    push(&s, 10); push(&s, 20); push(&s, 30);
    int v; pop(&s, &v);
    printf("popped %d\\n", v);            // 30: last in, first out
    return 0;
}`,
  py: `class Stack:
    def __init__(self, capacity):
        self.items = [None] * capacity
        self.capacity = capacity
        self.top = -1                     # index of the top item, -1 = empty

    def is_empty(self):
        return self.top == -1

    def is_full(self):
        return self.top == self.capacity - 1

    def push(self, value):
        if self.is_full():
            raise OverflowError("stack overflow")
        self.top += 1
        self.items[self.top] = value

    def pop(self):
        if self.is_empty():
            raise IndexError("stack underflow")
        value = self.items[self.top]
        self.top -= 1
        return value

    def peek(self):
        if self.is_empty():
            raise IndexError("stack is empty")
        return self.items[self.top]


def is_balanced(text):
    pairs = {")": "(", "]": "[", "}": "{"}
    stack = []
    for c in text:
        if c in "([{":
            stack.append(c)
        elif c in pairs:
            if not stack or stack.pop() != pairs[c]:
                return False
    return not stack


print(is_balanced("{[()()]}"))  # True`,
  cpp: `#include <iostream>
#include <stdexcept>
#include <stack>
#include <string>

template <typename T, int CAPACITY>
class Stack {
    T items[CAPACITY];
    int top = -1;                         // index of the top item, -1 = empty
public:
    bool empty() const { return top == -1; }
    bool full()  const { return top == CAPACITY - 1; }

    void push(const T& value) {
        if (full()) throw std::overflow_error("stack overflow");
        items[++top] = value;
    }
    T pop() {
        if (empty()) throw std::underflow_error("stack underflow");
        return items[top--];
    }
    const T& peek() const {
        if (empty()) throw std::underflow_error("stack is empty");
        return items[top];
    }
};

bool isBalanced(const std::string& text) {
    std::stack<char> st;                  // the standard library stack
    for (char c : text) {
        if (c == '(' || c == '[' || c == '{') st.push(c);
        else if (c == ')' || c == ']' || c == '}') {
            if (st.empty()) return false;
            char open = st.top(); st.pop();
            if ((c == ')' && open != '(') || (c == ']' && open != '[') || (c == '}' && open != '{'))
                return false;
        }
    }
    return st.empty();
}`,
  idea: `A stack is LIFO: Last In, First Out.
Think of a pile of plates: you add and take plates only at the top.

On an array:
- top = index of the top item (-1 when empty)
- push(v): top ← top + 1, a[top] ← v     (full when top == capacity - 1)
- pop():   v ← a[top], top ← top - 1     (empty when top == -1)
- peek():  a[top]

All three are O(1): only the top is ever touched.`,
};

export default function Home() {
  return (
    <main className="vl-page">
      <PhoneScreenBlock message="Please switch to desktop mode to view this website" />

      {/* Title */}
      <div className="max-w-6xl mx-auto px-8 mb-6">
        <div className="vl-hero">
          <div>
            <h1 className="vl-title text-4xl mb-2">Stack</h1>
            <div className="vl-meta mt-3">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-pen-green rounded-full mr-2"></span>
                Push / Pop / Peek: O(1)
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-pen-blue rounded-full mr-2"></span>
                Space: O(n)
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-pen-rust rounded-full mr-2"></span>
                LIFO: last in, first out
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Visualization Section */}
      <div className="max-w-6xl mx-auto px-8 mb-12">
        <div className="vl-card px-6 py-4">
          <StackQueueVisualizer kind="stack" />
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-8 space-y-8">
        <AdBanner position="bottom" size="responsive" adTest="off" />

        <div className="vl-card p-8">
          <h2 className="vl-h2 mb-4">What is a Stack?</h2>
          <div className="space-y-4 text-ink-2 leading-relaxed">
            <p className="text-lg">
              A <span className="text-pen-green font-semibold">stack</span> is a collection where you can only
              add or remove items at one end, called the <span className="text-pen-plum font-semibold">top</span>.
              Like a pile of plates, the item you put on last is the first one you take off. This rule is called{" "}
              <span className="text-pen-rust font-semibold">LIFO</span>: last in, first out.
            </p>
            <p className="text-lg">
              The visualizer stores the stack in a fixed-size array. A single number,{" "}
              <span className="font-mono">top</span>, remembers where the top item is. Pushing moves it up one slot
              and writes the value; popping reads the value and moves it down. Nothing else ever moves, which is why
              every operation is instant.
            </p>
            <div className="vl-note vl-note-green p-4 my-4">
              <p className="text-center text-lg font-bold text-pen-green">Only the top can be seen, added to, or removed.</p>
            </div>
          </div>
        </div>

        <div className="vl-card p-8">
          <h2 className="vl-h2 mb-6">How the Operations Work</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="vl-note vl-note-green p-6">
              <h3 className="vl-h3 mb-2">Push</h3>
              <p className="text-ink-2">
                Check there is room (<span className="font-mono">top &lt; capacity − 1</span>), move{" "}
                <span className="font-mono">top</span> up by one and store the value there. Pushing onto a full
                stack is a <span className="font-semibold">stack overflow</span>.
              </p>
            </div>
            <div className="vl-note vl-note-rust p-6">
              <h3 className="vl-h3 mb-2">Pop</h3>
              <p className="text-ink-2">
                Check the stack isn&apos;t empty (<span className="font-mono">top ≠ −1</span>), read{" "}
                <span className="font-mono">a[top]</span>, then move <span className="font-mono">top</span> down.
                Popping an empty stack is a <span className="font-semibold">stack underflow</span>.
              </p>
            </div>
            <div className="vl-note vl-note-blue p-6">
              <h3 className="vl-h3 mb-2">Peek</h3>
              <p className="text-ink-2">Look at the top value without removing it.</p>
            </div>
            <div className="vl-note vl-note-plum p-6">
              <h3 className="vl-h3 mb-2">Checking brackets</h3>
              <p className="text-ink-2">
                Push every opening bracket. Each closing bracket must match the one on top, which is popped. If
                everything matched and the stack ends empty, the brackets are balanced. Try{" "}
                <span className="font-mono">{"{[()()]}"}</span> and <span className="font-mono">([)]</span> above.
              </p>
            </div>
          </div>
        </div>

        <div className="vl-card p-8">
          <h2 className="vl-h2 mb-6">Implementation</h2>
          <CodeBlock codeSnippets={codeSnippets} defaultLang="js" height="600px" />
        </div>

        <div className="vl-card p-8">
          <h2 className="vl-h2 mb-6">Properties & Complexity</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="vl-note vl-note-plum p-6">
              <h3 className="vl-h3 mb-2">Time Complexity</h3>
              <ul className="text-ink-2 space-y-2">
                <li>• <span className="text-pen-green font-semibold">Push:</span> O(1)</li>
                <li>• <span className="text-pen-green font-semibold">Pop:</span> O(1)</li>
                <li>• <span className="text-pen-green font-semibold">Peek:</span> O(1)</li>
                <li>• <span className="text-pen-gold font-semibold">Search for a value:</span> O(n)</li>
              </ul>
            </div>
            <div className="vl-note vl-note-blue p-6">
              <h3 className="vl-h3 mb-2">Space & Properties</h3>
              <ul className="text-ink-2 space-y-2">
                <li>• <span className="text-pen-blue font-semibold">Space:</span> O(n)</li>
                <li>• <span className="text-pen-blue font-semibold">Order:</span> LIFO</li>
                <li>• <span className="text-pen-blue font-semibold">Array version:</span> fixed capacity</li>
                <li>• <span className="text-pen-blue font-semibold">Linked version:</span> grows as needed</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="vl-card p-6">
            <h3 className="vl-h3 mb-4"><span>Where Stacks Are Used</span></h3>
            <ul className="text-ink-2 leading-relaxed space-y-2">
              <li>• <span className="text-pen-green">Function calls:</span> the call stack remembers where to return</li>
              <li>• <span className="text-pen-green">Undo:</span> the last change is undone first</li>
              <li>• <span className="text-pen-green">Parsing:</span> matching brackets, evaluating expressions</li>
              <li>• <span className="text-pen-green">Back button:</span> the last page visited comes back first</li>
              <li>• <span className="text-pen-green">Depth-first search:</span> explore the newest path first</li>
            </ul>
          </div>
          <div className="vl-card p-6">
            <h3 className="vl-h3 mb-4"><span>Limitations</span></h3>
            <ul className="text-ink-2 leading-relaxed space-y-2">
              <li>• <span className="text-pen-gold">No random access:</span> you can only reach the top</li>
              <li>• <span className="text-pen-gold">Fixed size (array):</span> overflow when full</li>
              <li>• <span className="text-pen-gold">Recursion:</span> too many nested calls overflow the call stack</li>
            </ul>
          </div>
        </div>

        <AdBanner position="bottom" size="responsive" adTest="off" adSlot="9575932649" />
        <div className="h-12"></div>
      </div>
    </main>
  );
}
