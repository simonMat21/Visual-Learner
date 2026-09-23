"use client";

import { useState, useEffect } from "react";

import { Slider } from "@/components/ui/slider2";
import NumberInput from "@/components/NumberInput";

import { CodeBlock, TextBox } from "@/components/CodeBlock";
import PhoneScreenBlock from "@/components/phoneScreenBlocker";
import AdBanner from "@/components/AdBanner";

import P5Sketch from "./P5Sketch";

export default function Home() {
  const [AEBool, setAEBool] = useState(true);
  const [addForm, setAddForm] = useState({ val: [], pos: 0, start: false });
  const [animSpd, setAnimSpd] = useState(1);
  const [sliderValue, setSliderValue] = useState([1]); // Add this state
  const [sliderValue2, setSliderValue2] = useState([1]); // Add this state
  const [sliderValue3, setSliderValue3] = useState([0.1]); // Add this state

  const codeSnippets = {
    c: `// Subtract vector b from vector a (both of length n)
void vectorSubtract(const double a[], const double b[], double result[], int n) {
  for (int i = 0; i < n; i++) {
    result[i] = a[i] - b[i];
  }
}`,
    js: `// a - b, component by component
function vectorSubtract(a, b) {
  if (a.length !== b.length) {
    throw new Error("Vectors must have the same dimension");
  }
  return a.map((ai, i) => ai - b[i]);
}

// Example: (5, 3) - (2, 4) = (3, -1)
console.log(vectorSubtract([5, 3], [2, 4]));
`,
    py: `def vector_subtract(a, b):
    if len(a) != len(b):
        raise ValueError("Vectors must have the same dimension")
    return [ai - bi for ai, bi in zip(a, b)]

# Example: (5, 3) - (2, 4) = (3, -1)
print(vector_subtract([5, 3], [2, 4]))`,
    cpp: `#include <vector>
#include <stdexcept>

std::vector<double> vectorSubtract(const std::vector<double>& a,
                                   const std::vector<double>& b) {
    if (a.size() != b.size())
        throw std::invalid_argument("Vectors must have the same dimension");
    std::vector<double> result(a.size());
    for (size_t i = 0; i < a.size(); i++)
        result[i] = a[i] - b[i];
    return result;
}`,
    idea: `a - b = a + (-b)

1. Negate b: flip its direction, keep its length
2. Add -b to a using the head-to-tail rule
   or, component-wise:
   (a1 - b1, a2 - b2, ..., an - bn)

Geometrically, a - b is the vector that goes
from the tip of b to the tip of a.`,
  };

  const updateForm = (n, key, value) => {
    if (key !== "start" || AEBool) {
      if (n == 1) {
        setAddForm((prev) => ({ ...prev, [key]: value }));
      }
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 50, behavior: "smooth" }); // or 'auto'
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white pt-5">
      <PhoneScreenBlock message="Please switch to desktop mode to view this website" />

      {/* Visualization Section */}
      <div className="max-w-6xl mx-auto px-8 mb-12">
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
          {/* <div className="flex flex-col items-center space-y-6">
            <NumberInput
              onSubmit={(arr) => {
                updateForm(1, "val", arr);
                updateForm(1, "start", true);
                setTimeout(() => updateForm(1, "start", false), 10);
              }}
            />
            <div className="flex items-center space-x-4">
              <Slider
                value={sliderValue} // Use controlled value
                min={0.1}
                max={2}
                step={0.01}
                onValueChange={(value) => {
                  setSliderValue(value); // Update slider state
                  setAnimSpd(2 - value[0]); // Update animation speed
                }}
                width="w-50"
                label="K1"
                showValue={true}
              />
              <Slider
                value={sliderValue2} // Use controlled value
                min={0.2}
                max={2}
                step={0.01}
                onValueChange={(value) => {
                  setSliderValue2(value); // Update slider state
                  setAnimSpd(2 - value[0]); // Update animation speed
                }}
                width="w-50"
                label="K2"
                showValue={true}
              />
              <Slider
                value={sliderValue3} // Use controlled value
                min={0.01}
                max={0.7}
                step={0.001}
                onValueChange={(value) => {
                  setSliderValue3(value); // Update slider state
                  setAnimSpd(2 - value[0]); // Update animation speed
                }}
                width="w-50"
                label="t"
                showValue={true}
              />
            </div>
          </div> */}
          <P5Sketch
            k1={sliderValue[0]}
            k2={sliderValue2[0]}
            t={sliderValue3[0]}
          />
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-8 space-y-8">
        <AdBanner position="bottom" size="responsive" adTest="off" />
        {/* Algorithm Info */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent mb-2">
              Vector Subtraction
            </h1>
            <div className="inline-flex items-center space-x-4 text-sm bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-full px-4 py-2 mt-3 border border-green-400/30">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                Time: O(n²)
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                Space: O(1)
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                Stable
              </span>
            </div>
          </div>
        </div>
        {/* Description */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-blue-300 mb-4 flex items-center">
            <span className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3 text-sm">
              💡
            </span>
            How It Works
          </h2>
          <div className="space-y-4 text-gray-300 leading-relaxed">
            <p className="text-lg">
              Subtracting one vector from another is the same as adding its
              opposite:{" "}
              <span className="text-orange-400 font-semibold">
                a − b = a + (−b)
              </span>
              . The vector −b has the same length as b but points the other
              way.
            </p>
            <p className="text-lg">
              In components, you subtract matching entries:{" "}
              <span className="text-purple-400 font-semibold">
                (a₁ − b₁, a₂ − b₂, …, aₙ − bₙ)
              </span>
              . Both vectors must have the same number of components.
            </p>
          </div>
        </div>
        {/* Code Block */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-green-300 mb-6 flex items-center">
            <span className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3 text-sm">
              💻
            </span>
            Implementation
          </h2>
          <CodeBlock
            codeSnippets={codeSnippets}
            defaultLang="js"
            height="500px"
          />
        </div>
        {/* Detailed Explanation */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-purple-300 mb-6 flex items-center">
            <span className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-3 text-sm">
              🔍
            </span>
            Deeper Look
          </h2>
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-6">
              <p className="text-gray-300 text-lg leading-relaxed">
                Place a and b tail to tail. The difference{" "}
                <span className="text-green-400 font-semibold">a − b</span> is
                the arrow that runs from the tip of b to the tip of a — so
                b + (a − b) = a. Unlike addition, subtraction is{" "}
                <span className="text-green-400 font-semibold">
                  not commutative
                </span>
                : b − a points the opposite way to a − b, with the same length.
              </p>
            </div>
          </div>
        </div>
        {/* Fun Facts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-yellow-300 mb-4 flex items-center">
              📍 <span className="ml-2">Displacement</span>
            </h3>
            <p className="text-gray-300 leading-relaxed">
              If a and b are position vectors of two points, a − b is the
              displacement from point B to point A, and its length{" "}
              <span className="text-yellow-400 font-semibold">|a − b|</span> is
              the distance between them.
            </p>
          </div>

          <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-cyan-300 mb-4 flex items-center">
              🏃 <span className="ml-2">Relative Velocity</span>
            </h3>
            <p className="text-gray-300 leading-relaxed">
              Physics uses subtraction for relative motion: the velocity of A as
              seen from B is{" "}
              <span className="text-cyan-400 font-semibold">
                v<sub>A</sub> − v<sub>B</sub>
              </span>
              .
            </p>
          </div>
        </div>{" "}
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
