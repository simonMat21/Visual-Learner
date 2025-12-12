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
        {/* Title */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-2">
              Vector Dot Product (Scalar Product)
            </h1>
            <div className="inline-flex items-center space-x-4 text-sm bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-full px-4 py-2 mt-3 border border-green-400/30">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                Result: Scalar (Number)
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></span>
                Commutative: a · b = b · a
              </span>
            </div>
          </div>
        </div>
        {/* Definition */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-green-300 mb-4 flex items-center">
            <span className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3 text-sm">
              ⭕
            </span>
            Definition and Formula
          </h2>
          <div className="space-y-6 text-gray-300 leading-relaxed">
            <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-6">
              <div className="text-center mb-4">
                <h3 className="text-2xl font-bold text-green-400 mb-4">
                  a · b = |a| |b| cos(θ)
                </h3>
                <p className="text-lg mb-6">
                  where θ is the angle between vectors a and b
                </p>
                <h3 className="text-2xl font-bold text-emerald-400 mb-2">
                  Component Form
                </h3>
                <p className="text-xl">
                  a · b = a₁b₁ + a₂b₂ + a₃b₃ + ... + aₙbₙ
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="text-center">
                  <p className="font-semibold text-green-300">2D Vectors</p>
                  <p className="text-sm">a · b = a₁b₁ + a₂b₂</p>
                  <p className="text-xs text-gray-400">Two components</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-emerald-300">3D Vectors</p>
                  <p className="text-sm">a · b = a₁b₁ + a₂b₂ + a₃b₃</p>
                  <p className="text-xs text-gray-400">Three components</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-cyan-300">Result</p>
                  <p className="text-sm">Always a scalar</p>
                  <p className="text-xs text-gray-400">Not a vector</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Geometric Interpretation */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-emerald-300 mb-6 flex items-center">
            <span className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center mr-3 text-sm">
              🎯
            </span>
            Geometric Interpretation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-emerald-300 mb-4">
                Projection Interpretation
              </h3>
              <div className="space-y-3 text-gray-300">
                <p className="text-center mb-4">
                  <span className="text-xl font-bold text-emerald-400">
                    a · b = |a| × (projection of b onto a)
                  </span>
                </p>
                <p>
                  <span className="text-emerald-400 font-semibold">
                    Meaning:
                  </span>{" "}
                  Magnitude of a times the component of b in direction of a
                </p>
                <p className="text-sm">
                  The dot product measures how much two vectors &quot;point in
                  the same direction&quot;.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-blue-300 mb-4">
                Angle Between Vectors
              </h3>
              <div className="space-y-3 text-gray-300">
                <p className="text-center mb-4">
                  <span className="text-xl font-bold text-blue-400">
                    cos(θ) = (a · b) / (|a| |b|)
                  </span>
                </p>
                <p>
                  <span className="text-blue-400 font-semibold">
                    Finding angle:
                  </span>
                </p>
                <p className="text-sm">θ = arccos((a · b) / (|a| |b|))</p>
                <p className="text-xs text-gray-400">
                  Most common use of dot product
                </p>
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
            Properties of Dot Product
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-cyan-300 mb-4">
                Commutative
              </h3>
              <div className="space-y-3 text-gray-300">
                <p className="text-center text-lg font-bold">a · b = b · a</p>
                <p className="text-sm">Order doesn&apos;t matter</p>
                <p className="text-xs text-gray-400">Unlike cross product</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-purple-300 mb-4">
                Distributive
              </h3>
              <div className="space-y-3 text-gray-300">
                <p className="text-center text-lg font-bold">
                  a · (b + c) = a · b + a · c
                </p>
                <p className="text-sm">Distributes over addition</p>
                <p className="text-xs text-gray-400">Very useful property</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-orange-300 mb-4">
                Scalar Multiplication
              </h3>
              <div className="space-y-3 text-gray-300">
                <p className="text-center text-lg font-bold">
                  (ca) · b = c(a · b)
                </p>
                <p className="text-sm">Scalar can be factored out</p>
                <p className="text-xs text-gray-400">
                  Also: a · (cb) = c(a · b)
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Special Cases */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-yellow-300 mb-6 flex items-center">
            <span className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center mr-3 text-sm">
              🔄
            </span>
            Special Cases
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-yellow-300 mb-4">
                Perpendicular Vectors
              </h3>
              <div className="space-y-3 text-gray-300">
                <p className="text-center text-lg font-bold">a · b = 0</p>
                <p>
                  <span className="text-yellow-400 font-semibold">When:</span> θ
                  = 90°
                </p>
                <p className="text-sm">Orthogonal vectors</p>
                <p className="text-xs text-gray-400">cos(90°) = 0</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-green-300 mb-4">
                Parallel Vectors
              </h3>
              <div className="space-y-3 text-gray-300">
                <p className="text-center text-lg font-bold">
                  a · b = ±|a| |b|
                </p>
                <p>
                  <span className="text-green-400 font-semibold">When:</span> θ
                  = 0° or 180°
                </p>
                <p className="text-sm">+ for same direction</p>
                <p className="text-xs text-gray-400">
                  − for opposite direction
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-blue-300 mb-4">
                Dot with Itself
              </h3>
              <div className="space-y-3 text-gray-300">
                <p className="text-center text-lg font-bold">a · a = |a|²</p>
                <p>
                  <span className="text-blue-400 font-semibold">Result:</span>{" "}
                  Square of magnitude
                </p>
                <p className="text-sm">Always positive (unless zero vector)</p>
                <p className="text-xs text-gray-400">θ = 0° with itself</p>
              </div>
            </div>
          </div>
        </div>
        {/* Applications */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-pink-300 mb-6 flex items-center">
            <span className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center mr-3 text-sm">
              📐
            </span>
            Common Applications
          </h2>
          <div className="bg-gradient-to-r from-pink-500/10 to-red-500/10 border border-pink-500/20 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold text-pink-300 mb-4">
                  Finding Angles
                </h3>
                <div className="space-y-3 text-gray-300">
                  <p>
                    <span className="text-pink-400 font-semibold">
                      Formula:
                    </span>
                  </p>
                  <p className="text-sm">cos(θ) = (a · b) / (|a| |b|)</p>
                  <ul className="space-y-1 text-sm mt-3">
                    <li>• Used in 3D graphics</li>
                    <li>• Lighting calculations</li>
                    <li>• Camera angles</li>
                  </ul>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-pink-300 mb-4">
                  Testing Orthogonality
                </h3>
                <div className="space-y-3 text-gray-300">
                  <p>
                    <span className="text-pink-400 font-semibold">Test:</span>
                  </p>
                  <p className="text-sm">If a · b = 0, then perpendicular</p>
                  <ul className="space-y-1 text-sm mt-3">
                    <li>• Collision detection</li>
                    <li>• Surface normals</li>
                    <li>• Coordinate systems</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Work and Energy */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-red-300 mb-6 flex items-center">
            <span className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-3 text-sm">
              📊
            </span>
            Physics: Work and Energy
          </h2>
          <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-lg p-6">
            <div className="text-center mb-4">
              <h3 className="text-2xl font-bold text-red-400 mb-2">
                W = F · d
              </h3>
              <p className="text-lg text-gray-300">
                Work = Force · Displacement
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="text-center">
                <p className="font-semibold text-red-300">θ = 0°</p>
                <p className="text-sm">Maximum work</p>
                <p className="text-xs text-gray-400">
                  Force in direction of motion
                </p>
              </div>
              <div className="text-center">
                <p className="font-semibold text-orange-300">θ = 90°</p>
                <p className="text-sm">Zero work</p>
                <p className="text-xs text-gray-400">
                  Force perpendicular to motion
                </p>
              </div>
              <div className="text-center">
                <p className="font-semibold text-yellow-300">θ = 180°</p>
                <p className="text-sm">Negative work</p>
                <p className="text-xs text-gray-400">Force opposes motion</p>
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
                • <span className="text-emerald-400">Computer Graphics:</span>{" "}
                Lighting and shading calculations
              </li>
              <li>
                • <span className="text-emerald-400">Physics:</span> Work,
                energy, and power calculations
              </li>
              <li>
                • <span className="text-emerald-400">Machine Learning:</span>{" "}
                Similarity measures, cosine similarity
              </li>
              <li>
                • <span className="text-emerald-400">Game Development:</span>{" "}
                Collision detection, AI behavior
              </li>
              <li>
                • <span className="text-emerald-400">Signal Processing:</span>{" "}
                Correlation and filtering
              </li>
            </ul>
          </div>

          <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-violet-300 mb-4 flex items-center">
              🧮 <span className="ml-2">Problem-Solving Tips</span>
            </h3>
            <ul className="text-gray-300 leading-relaxed space-y-2">
              <li>• Use component form for calculation</li>
              <li>• Use geometric form for understanding</li>
              <li>• Check if vectors are perpendicular (dot = 0)</li>
              <li>• Remember: result is always a scalar</li>
              <li>• Normalize vectors for cosine similarity</li>
              <li>• Dot product is commutative</li>
            </ul>
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
