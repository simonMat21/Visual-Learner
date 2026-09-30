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
    c: ``,
    js: `function bubbleSort(arr) {
  let n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        // swap
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }
    if (!swapped) break;
  }
  return arr;
}
`,
    py: `def greet(name):
    return "Hello, " + name`,
    cpp: `std::string greet(std::string name) {
    return "Hello, " + name;
}`,
    idea: `# first loop with i as element
    # second loop with j as element
        if j>i:
            swap their postions
            
or

Repeat n times:
    Compare each pair of adjacent items
    Swap them if they are in the wrong order`,
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
              Vector Representation
            </h1>
            <div className="vl-meta mt-3">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-pen-gold rounded-full mr-2"></span>
                Position
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-pen-rust rounded-full mr-2"></span>
                X-Component
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-pen-green rounded-full mr-2"></span>
                Y-Component
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

        {/* What is a Vector */}
        <div className="vl-card p-8">
          <h2 className="vl-h2 mb-4">
            What is a Vector?
          </h2>
          <div className="space-y-4 text-ink-2 leading-relaxed">
            <p className="text-lg">
              A vector is a mathematical object that has both{" "}
              <span className="text-pen-gold font-semibold">magnitude</span>{" "}
              (length) and{" "}
              <span className="text-pen-rust font-semibold">direction</span>.
              Unlike a scalar which only has magnitude, vectors represent
              quantities like velocity, force, and displacement.
            </p>
            <p className="text-lg">
              In the visualization above, you can drag the yellow point to see
              how the vector changes. The vector is represented by the{" "}
              <span className="text-pen-gold font-semibold">
                yellow arrow
              </span>{" "}
              from the origin (0,0) to your point.
            </p>
          </div>
        </div>
        {/* Component Representation */}
        <div className="vl-card p-8">
          <h2 className="vl-h2 mb-6">
            Breaking Down Components
          </h2>
          <div className="space-y-6">
            <div className="vl-note vl-note-rust p-6">
              <h3 className="vl-h3 mb-3">
                X-Component (Horizontal)
              </h3>
              <p className="text-ink-2 text-lg leading-relaxed">
                The{" "}
                <span className="text-pen-rust font-semibold">red arrow</span>{" "}
                shows the horizontal component of the vector. This represents
                how far the vector extends along the X-axis. It&apos;s
                calculated as{" "}
                <span className="font-mono bg-paper-2 px-2 py-1 rounded">
                  x = r × cos(θ)
                </span>
                , where r is the magnitude and θ is the angle.
              </p>
            </div>

            <div className="vl-note vl-note-green p-6">
              <h3 className="vl-h3 mb-3">
                Y-Component (Vertical)
              </h3>
              <p className="text-ink-2 text-lg leading-relaxed">
                The{" "}
                <span className="text-pen-green font-semibold">
                  green arrow
                </span>{" "}
                shows the vertical component of the vector. This represents how
                far the vector extends along the Y-axis. It&apos;s calculated as{" "}
                <span className="font-mono bg-paper-2 px-2 py-1 rounded">
                  y = r × sin(θ)
                </span>
                , where r is the magnitude and θ is the angle.
              </p>
            </div>
          </div>
        </div>
        {/* Magnitude and Angle */}
        <div className="vl-card p-8">
          <h2 className="vl-h2 mb-6">
            Magnitude and Direction
          </h2>
          <div className="space-y-6">
            <div className="vl-note vl-note-plum p-6">
              <h3 className="vl-h3 mb-3">
                Magnitude (Length)
              </h3>
              <p className="text-ink-2 text-lg leading-relaxed mb-3">
                The magnitude of a vector is its length, calculated using the
                Pythagorean theorem:
              </p>
              <div className="font-mono bg-paper-2 px-4 py-3 rounded text-center text-lg">
                |v| = √(x² + y²)
              </div>
            </div>

            <div className="vl-note vl-note-blue p-6">
              <h3 className="vl-h3 mb-3">
                Direction (Angle)
              </h3>
              <p className="text-ink-2 text-lg leading-relaxed mb-3">
                The angle θ (theta) is measured counterclockwise from the
                positive X-axis. It&apos;s calculated using the arctangent
                function:
              </p>
              <div className="font-mono bg-paper-2 px-4 py-3 rounded text-center text-lg">
                θ = arctan(y / x)
              </div>
              <p className="text-ink-3 text-sm mt-3">
                The white arc in the visualization shows this angle from the
                X-axis
              </p>
            </div>
          </div>
        </div>
        {/* Key Concepts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="vl-card p-6">
            <h3 className="vl-h3 mb-4">
               <span>Vector Notation</span>
            </h3>
            <p className="text-ink-2 leading-relaxed mb-3">
              Vectors can be written in multiple ways:
            </p>
            <ul className="space-y-2 text-ink-2">
              <li>
                •{" "}
                <span className="font-mono bg-paper-2 px-2 py-1 rounded">
                  (x, y)
                </span>{" "}
                - Component form
              </li>
              <li>
                •{" "}
                <span className="font-mono bg-paper-2 px-2 py-1 rounded">
                  xi + yj
                </span>{" "}
                - Unit vector notation
              </li>
              <li>
                •{" "}
                <span className="font-mono bg-paper-2 px-2 py-1 rounded">
                  r∠θ
                </span>{" "}
                - Polar form
              </li>
            </ul>
          </div>

          <div className="vl-card p-6">
            <h3 className="vl-h3 mb-4">
               <span>Conversion</span>
            </h3>
            <p className="text-ink-2 leading-relaxed">
              You can convert between component form and polar form:
            </p>
            <div className="mt-3 space-y-2 text-sm text-ink-2">
              <div className="font-mono bg-paper-2 px-2 py-1 rounded">
                Cartesian → Polar:
                <br />r = √(x² + y²), θ = arctan(y/x)
              </div>
              <div className="font-mono bg-paper-2 px-2 py-1 rounded">
                Polar → Cartesian:
                <br />x = r×cos(θ), y = r×sin(θ)
              </div>
            </div>
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
