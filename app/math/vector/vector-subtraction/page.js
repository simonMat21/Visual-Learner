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
    <main className="vl-page">
      <PhoneScreenBlock message="Please switch to desktop mode to view this website" />

      {/* Title */}
      <div className="max-w-6xl mx-auto px-8 mb-6">
        <div className="vl-hero">
          <div>
            <h1 className="vl-title text-4xl mb-2">
              Vector Subtraction
            </h1>
            <div className="vl-meta mt-3">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-pen-rust rounded-full mr-2"></span>
                Time: O(n²)
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-pen-blue rounded-full mr-2"></span>
                Space: O(1)
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-pen-green rounded-full mr-2"></span>
                Stable
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Visualization Section */}
      <div className="max-w-6xl mx-auto px-8 mb-12">
        <div className="vl-card p-6">
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

        {/* Description */}
        <div className="vl-card p-8">
          <h2 className="vl-h2 mb-4">
            How It Works
          </h2>
          <div className="space-y-4 text-ink-2 leading-relaxed">
            <p className="text-lg">
              Subtracting one vector from another is the same as adding its
              opposite:{" "}
              <span className="text-pen-rust font-semibold">
                a − b = a + (−b)
              </span>
              . The vector −b has the same length as b but points the other
              way.
            </p>
            <p className="text-lg">
              In components, you subtract matching entries:{" "}
              <span className="text-pen-plum font-semibold">
                (a₁ − b₁, a₂ − b₂, …, aₙ − bₙ)
              </span>
              . Both vectors must have the same number of components.
            </p>
          </div>
        </div>
        {/* Code Block */}
        <div className="vl-card p-8">
          <h2 className="vl-h2 mb-6">
            Implementation
          </h2>
          <CodeBlock
            codeSnippets={codeSnippets}
            defaultLang="js"
            height="500px"
          />
        </div>
        {/* Detailed Explanation */}
        <div className="vl-card p-8">
          <h2 className="vl-h2 mb-6">
            Deeper Look
          </h2>
          <div className="space-y-6">
            <div className="vl-note vl-note-plum p-6">
              <p className="text-ink-2 text-lg leading-relaxed">
                Place a and b tail to tail. The difference{" "}
                <span className="text-pen-green font-semibold">a − b</span> is
                the arrow that runs from the tip of b to the tip of a — so
                b + (a − b) = a. Unlike addition, subtraction is{" "}
                <span className="text-pen-green font-semibold">
                  not commutative
                </span>
                : b − a points the opposite way to a − b, with the same length.
              </p>
            </div>
          </div>
        </div>
        {/* Fun Facts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="vl-card p-6">
            <h3 className="vl-h3 mb-4">
               <span>Displacement</span>
            </h3>
            <p className="text-ink-2 leading-relaxed">
              If a and b are position vectors of two points, a − b is the
              displacement from point B to point A, and its length{" "}
              <span className="text-pen-gold font-semibold">|a − b|</span> is
              the distance between them.
            </p>
          </div>

          <div className="vl-card p-6">
            <h3 className="vl-h3 mb-4">
               <span>Relative Velocity</span>
            </h3>
            <p className="text-ink-2 leading-relaxed">
              Physics uses subtraction for relative motion: the velocity of A as
              seen from B is{" "}
              <span className="text-pen-blue font-semibold">
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
