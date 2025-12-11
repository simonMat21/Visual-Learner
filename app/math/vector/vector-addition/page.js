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
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
              Vector Addition
            </h1>
            <div className="inline-flex items-center space-x-4 text-sm bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full px-4 py-2 mt-3 border border-blue-400/30">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                Result: Vector
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                Commutative: a + b = b + a
              </span>
            </div>
          </div>
        </div>

        {/* Definition */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-blue-300 mb-4 flex items-center">
            <span className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3 text-sm">
              ⭕
            </span>
            Definition and Component Form
          </h2>
          <div className="space-y-6 text-gray-300 leading-relaxed">
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-6">
              <div className="text-center mb-4">
                <h3 className="text-2xl font-bold text-blue-400 mb-4">
                  Component-wise Addition
                </h3>
                <p className="text-xl mb-6">
                  a + b = (a₁ + b₁, a₂ + b₂, a₃ + b₃, ..., aₙ + bₙ)
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="text-center">
                  <p className="font-semibold text-blue-300">2D Vectors</p>
                  <p className="text-sm">(a₁, a₂) + (b₁, b₂)</p>
                  <p className="text-sm">= (a₁+b₁, a₂+b₂)</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-purple-300">3D Vectors</p>
                  <p className="text-sm">(a₁, a₂, a₃) + (b₁, b₂, b₃)</p>
                  <p className="text-sm">= (a₁+b₁, a₂+b₂, a₃+b₃)</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-cyan-300">Result</p>
                  <p className="text-sm">Always a vector</p>
                  <p className="text-xs text-gray-400">Same dimension</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Geometric Methods */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-purple-300 mb-6 flex items-center">
            <span className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-3 text-sm">
              🎯
            </span>
            Geometric Methods
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-purple-300 mb-4">
                Triangle Method (Head-to-Tail)
              </h3>
              <div className="space-y-3 text-gray-300">
                <p className="text-sm mb-3">
                  Place the tail of vector <span className="text-purple-400 font-semibold">b</span> at the head of vector <span className="text-purple-400 font-semibold">a</span>
                </p>
                <ul className="space-y-2 text-sm">
                  <li>• Draw vector a from origin</li>
                  <li>• Draw vector b starting from end of a</li>
                  <li>• Resultant: from origin to end of b</li>
                  <li>• Most intuitive method</li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-cyan-300 mb-4">
                Parallelogram Method
              </h3>
              <div className="space-y-3 text-gray-300">
                <p className="text-sm mb-3">
                  Place both vectors at the <span className="text-cyan-400 font-semibold">same origin</span>
                </p>
                <ul className="space-y-2 text-sm">
                  <li>• Draw both vectors from origin</li>
                  <li>• Complete the parallelogram</li>
                  <li>• Resultant: diagonal from origin</li>
                  <li>• Shows symmetry clearly</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Properties */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-cyan-300 mb-6 flex items-center">
            <span className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center mr-3 text-sm">
              ⚡
            </span>
            Properties of Vector Addition
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-cyan-300 mb-4">
                Commutative
              </h3>
              <div className="space-y-3 text-gray-300">
                <p className="text-center text-lg font-bold">a + b = b + a</p>
                <p className="text-sm">Order doesn't matter</p>
                <p className="text-xs text-gray-400">
                  Forms same parallelogram
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-green-300 mb-4">
                Associative
              </h3>
              <div className="space-y-3 text-gray-300">
                <p className="text-center text-lg font-bold">(a + b) + c = a + (b + c)</p>
                <p className="text-sm">Grouping doesn't matter</p>
                <p className="text-xs text-gray-400">
                  Can add multiple vectors
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-orange-300 mb-4">
                Identity Element
              </h3>
              <div className="space-y-3 text-gray-300">
                <p className="text-center text-lg font-bold">a + 0 = a</p>
                <p className="text-sm">Zero vector is identity</p>
                <p className="text-xs text-gray-400">
                  0 = (0, 0, 0, ...)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Vector Subtraction */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-pink-300 mb-6 flex items-center">
            <span className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center mr-3 text-sm">
              📐
            </span>
            Vector Subtraction
          </h2>
          <div className="bg-gradient-to-r from-pink-500/10 to-red-500/10 border border-pink-500/20 rounded-lg p-6">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-pink-400 mb-2">
                a - b = a + (-b)
              </h3>
              <p className="text-lg text-gray-300">
                Subtraction is adding the negative
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold text-pink-300 mb-4">
                  Component Form
                </h3>
                <div className="space-y-3 text-gray-300">
                  <p className="text-center font-bold">
                    a - b = (a₁-b₁, a₂-b₂, a₃-b₃)
                  </p>
                  <p className="text-sm">Subtract each component</p>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-pink-300 mb-4">
                  Geometric Meaning
                </h3>
                <div className="space-y-3 text-gray-300">
                  <p className="text-sm">
                    <span className="text-pink-400 font-semibold">a - b:</span> Vector from b to a
                  </p>
                  <p className="text-sm">Points from second to first</p>
                  <p className="text-xs text-gray-400">Reverse of b - a</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scalar Multiplication */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-green-300 mb-6 flex items-center">
            <span className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3 text-sm">
              🔄
            </span>
            Scalar Multiplication
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-green-300 mb-4">
                Definition
              </h3>
              <div className="space-y-3 text-gray-300">
                <p className="text-center text-lg font-bold">ca = (ca₁, ca₂, ca₃)</p>
                <p>
                  <span className="text-green-400 font-semibold">Effect:</span>{" "}
                  Scales magnitude
                </p>
                <p className="text-sm">Multiply each component by c</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-yellow-300 mb-4">
                Positive Scalar
              </h3>
              <div className="space-y-3 text-gray-300">
                <p className="text-center text-lg font-bold">c &gt; 0</p>
                <p>
                  <span className="text-yellow-400 font-semibold">Result:</span>{" "}
                  Same direction
                </p>
                <p className="text-sm">c &gt; 1: longer</p>
                <p className="text-sm">0 &lt; c &lt; 1: shorter</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-500/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-red-300 mb-4">
                Negative Scalar
              </h3>
              <div className="space-y-3 text-gray-300">
                <p className="text-center text-lg font-bold">c &lt; 0</p>
                <p>
                  <span className="text-red-400 font-semibold">Result:</span>{" "}
                  Opposite direction
                </p>
                <p className="text-sm">Also scales magnitude</p>
                <p className="text-sm">-1: reverses direction</p>
              </div>
            </div>
          </div>
        </div>

        {/* Linear Combinations */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-orange-300 mb-6 flex items-center">
            <span className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mr-3 text-sm">
              📊
            </span>
            Linear Combinations
          </h2>
          <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-lg p-6">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-orange-400 mb-2">
                v = c₁a₁ + c₂a₂ + ... + cₙaₙ
              </h3>
              <p className="text-lg text-gray-300">
                Any vector can be expressed as a combination of basis vectors
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold text-orange-300 mb-4">
                  Standard Basis (3D)
                </h3>
                <div className="space-y-3 text-gray-300">
                  <p className="text-sm">
                    <span className="text-orange-400 font-semibold">i</span> = (1, 0, 0)
                  </p>
                  <p className="text-sm">
                    <span className="text-orange-400 font-semibold">j</span> = (0, 1, 0)
                  </p>
                  <p className="text-sm">
                    <span className="text-orange-400 font-semibold">k</span> = (0, 0, 1)
                  </p>
                  <p className="text-sm mt-3">v = v₁i + v₂j + v₃k</p>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-orange-300 mb-4">
                  Applications
                </h3>
                <div className="space-y-2 text-gray-300 text-sm">
                  <p>• Any vector as sum of basis vectors</p>
                  <p>• Coordinate transformations</p>
                  <p>• Linear algebra operations</p>
                  <p>• Vector space theory</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Unit Vectors */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-yellow-300 mb-6 flex items-center">
            <span className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center mr-3 text-sm">
              📝
            </span>
            Unit Vectors and Normalization
          </h2>
          <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg p-6">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-yellow-400 mb-2">
                û = a / |a|
              </h3>
              <p className="text-lg text-gray-300">
                Unit vector has magnitude 1
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="font-semibold text-yellow-300">Definition</p>
                <p className="text-sm">|u| = 1</p>
                <p className="text-xs text-gray-400">Length is exactly 1</p>
              </div>
              <div className="text-center">
                <p className="font-semibold text-orange-300">Direction</p>
                <p className="text-sm">Same as original</p>
                <p className="text-xs text-gray-400">Only magnitude changes</p>
              </div>
              <div className="text-center">
                <p className="font-semibold text-red-300">Usage</p>
                <p className="text-sm">Represents direction only</p>
                <p className="text-xs text-gray-400">Common in graphics</p>
              </div>
            </div>
          </div>
        </div>

        {/* Real World Applications */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-emerald-300 mb-4 flex items-center">
              🔬 <span className="ml-2">Real-World Applications</span>
            </h3>
            <ul className="text-gray-300 leading-relaxed space-y-2">
              <li>
                • <span className="text-emerald-400">Physics:</span> Force
                composition and net force
              </li>
              <li>
                • <span className="text-emerald-400">Navigation:</span> Course
                corrections and displacement
              </li>
              <li>
                • <span className="text-emerald-400">Computer Graphics:</span> Object
                transformations and movement
              </li>
              <li>
                • <span className="text-emerald-400">Game Development:</span> Character
                movement and velocity
              </li>
              <li>
                • <span className="text-emerald-400">Robotics:</span> Path planning
                and motion control
              </li>
              <li>
                • <span className="text-emerald-400">Engineering:</span> Load
                distribution and structural analysis
              </li>
            </ul>
          </div>

          <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-violet-300 mb-4 flex items-center">
              🧮 <span className="ml-2">Problem-Solving Tips</span>
            </h3>
            <ul className="text-gray-300 leading-relaxed space-y-2">
              <li>• Add component by component</li>
              <li>• Use head-to-tail for visualization</li>
              <li>• Break into components for calculation</li>
              <li>• Remember: addition is commutative</li>
              <li>• Use unit vectors for clarity</li>
              <li>• Check dimensions match before adding</li>
              <li>• Result vector starts at origin</li>
            </ul>
          </div>
        </div>

        {/* Bottom Spacer */}
        <div className="h-12"></div>
      </div>
    </main>
  );
}
