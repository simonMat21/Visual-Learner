"use client";

import { useState, useEffect } from "react";

import { Slider } from "@/components/ui/slider2";
import NumberInput from "@/components/NumberInput";

import { CodeBlock, TextBox } from "@/components/CodeBlock";
import PhoneScreenBlock from "@/components/phoneScreenBlocker";

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
        {/* Title */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-2">
              Vector Representation
            </h1>
            <div className="inline-flex items-center space-x-4 text-sm bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-full px-4 py-2 mt-3 border border-yellow-400/30">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                Position
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                X-Component
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                Y-Component
              </span>
            </div>
          </div>
        </div>

        {/* What is a Vector */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-blue-300 mb-4 flex items-center">
            <span className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3 text-sm">
              📐
            </span>
            What is a Vector?
          </h2>
          <div className="space-y-4 text-gray-300 leading-relaxed">
            <p className="text-lg">
              A vector is a mathematical object that has both{" "}
              <span className="text-yellow-400 font-semibold">magnitude</span>{" "}
              (length) and{" "}
              <span className="text-orange-400 font-semibold">direction</span>.
              Unlike a scalar which only has magnitude, vectors represent
              quantities like velocity, force, and displacement.
            </p>
            <p className="text-lg">
              In the visualization above, you can drag the yellow point to see
              how the vector changes. The vector is represented by the{" "}
              <span className="text-yellow-400 font-semibold">
                yellow arrow
              </span>{" "}
              from the origin (0,0) to your point.
            </p>
          </div>
        </div>

        {/* Component Representation */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-green-300 mb-6 flex items-center">
            <span className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3 text-sm">
              🧩
            </span>
            Breaking Down Components
          </h2>
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-red-500/10 to-red-500/10 border border-red-500/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-red-300 mb-3">
                X-Component (Horizontal)
              </h3>
              <p className="text-gray-300 text-lg leading-relaxed">
                The{" "}
                <span className="text-red-400 font-semibold">red arrow</span>{" "}
                shows the horizontal component of the vector. This represents
                how far the vector extends along the X-axis. It&apos;s
                calculated as{" "}
                <span className="font-mono bg-black/30 px-2 py-1 rounded">
                  x = r × cos(θ)
                </span>
                , where r is the magnitude and θ is the angle.
              </p>
            </div>

            <div className="bg-gradient-to-r from-green-500/10 to-green-500/10 border border-green-500/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-green-300 mb-3">
                Y-Component (Vertical)
              </h3>
              <p className="text-gray-300 text-lg leading-relaxed">
                The{" "}
                <span className="text-green-400 font-semibold">
                  green arrow
                </span>{" "}
                shows the vertical component of the vector. This represents how
                far the vector extends along the Y-axis. It&apos;s calculated as{" "}
                <span className="font-mono bg-black/30 px-2 py-1 rounded">
                  y = r × sin(θ)
                </span>
                , where r is the magnitude and θ is the angle.
              </p>
            </div>
          </div>
        </div>

        {/* Magnitude and Angle */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-purple-300 mb-6 flex items-center">
            <span className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-3 text-sm">
              📏
            </span>
            Magnitude and Direction
          </h2>
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-purple-300 mb-3">
                Magnitude (Length)
              </h3>
              <p className="text-gray-300 text-lg leading-relaxed mb-3">
                The magnitude of a vector is its length, calculated using the
                Pythagorean theorem:
              </p>
              <div className="font-mono bg-black/30 px-4 py-3 rounded text-center text-lg">
                |v| = √(x² + y²)
              </div>
            </div>

            <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-cyan-300 mb-3">
                Direction (Angle)
              </h3>
              <p className="text-gray-300 text-lg leading-relaxed mb-3">
                The angle θ (theta) is measured counterclockwise from the
                positive X-axis. It&apos;s calculated using the arctangent
                function:
              </p>
              <div className="font-mono bg-black/30 px-4 py-3 rounded text-center text-lg">
                θ = arctan(y / x)
              </div>
              <p className="text-gray-400 text-sm mt-3">
                The white arc in the visualization shows this angle from the
                X-axis
              </p>
            </div>
          </div>
        </div>

        {/* Key Concepts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-yellow-300 mb-4 flex items-center">
              🎯 <span className="ml-2">Vector Notation</span>
            </h3>
            <p className="text-gray-300 leading-relaxed mb-3">
              Vectors can be written in multiple ways:
            </p>
            <ul className="space-y-2 text-gray-300">
              <li>
                •{" "}
                <span className="font-mono bg-black/30 px-2 py-1 rounded">
                  (x, y)
                </span>{" "}
                - Component form
              </li>
              <li>
                •{" "}
                <span className="font-mono bg-black/30 px-2 py-1 rounded">
                  xi + yj
                </span>{" "}
                - Unit vector notation
              </li>
              <li>
                •{" "}
                <span className="font-mono bg-black/30 px-2 py-1 rounded">
                  r∠θ
                </span>{" "}
                - Polar form
              </li>
            </ul>
          </div>

          <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-cyan-300 mb-4 flex items-center">
              🔄 <span className="ml-2">Conversion</span>
            </h3>
            <p className="text-gray-300 leading-relaxed">
              You can convert between component form and polar form:
            </p>
            <div className="mt-3 space-y-2 text-sm text-gray-300">
              <div className="font-mono bg-black/30 px-2 py-1 rounded">
                Cartesian → Polar:
                <br />r = √(x² + y²), θ = arctan(y/x)
              </div>
              <div className="font-mono bg-black/30 px-2 py-1 rounded">
                Polar → Cartesian:
                <br />x = r×cos(θ), y = r×sin(θ)
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Spacer */}
        <div className="h-12"></div>
      </div>
    </main>
  );
}
