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
        <AdBanner position="bottom" size="responsive" adTest="off" />

        {/* Algorithm Info */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
              Line Equations in Coordinate Geometry
            </h1>
            <div className="inline-flex items-center space-x-4 text-sm bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full px-4 py-2 mt-3 border border-blue-400/30">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                General Form: Ax + By + C = 0
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                Slope-Intercept: y = mx + b
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                Point-Slope: y - y₁ = m(x - x₁)
              </span>
            </div>
          </div>
        </div>

        {/* General Form */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-blue-300 mb-4 flex items-center">
            <span className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3 text-sm">
              📐
            </span>
            General Form of a Line
          </h2>
          <div className="space-y-6 text-gray-300 leading-relaxed">
            <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-lg p-6">
              <div className="text-center mb-4">
                <h3 className="text-2xl font-bold text-blue-400 mb-2">
                  Ax + By + C = 0
                </h3>
                <p className="text-lg">
                  where A, B, and C are real constants, and A and B are not both
                  zero.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="text-center">
                  <p className="font-semibold text-blue-300">A ≠ 0, B = 0</p>
                  <p className="text-sm">Vertical Line</p>
                  <p className="text-xs text-gray-400">x = -C/A</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-green-300">A = 0, B ≠ 0</p>
                  <p className="text-sm">Horizontal Line</p>
                  <p className="text-xs text-gray-400">y = -C/B</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-purple-300">A ≠ 0, B ≠ 0</p>
                  <p className="text-sm">Oblique Line</p>
                  <p className="text-xs text-gray-400">slope = -A/B</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Line Properties */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-green-300 mb-6 flex items-center">
            <span className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3 text-sm">
              🔍
            </span>
            Key Properties and Formulas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-green-300 mb-4">
                Slope and Intercepts
              </h3>
              <div className="space-y-3 text-gray-300">
                <p>
                  <span className="text-green-400 font-semibold">Slope:</span> m
                  = -A/B (when B ≠ 0)
                </p>
                <p>
                  <span className="text-green-400 font-semibold">
                    X-intercept:
                  </span>{" "}
                  x = -C/A (when A ≠ 0)
                </p>
                <p>
                  <span className="text-green-400 font-semibold">
                    Y-intercept:
                  </span>{" "}
                  y = -C/B (when B ≠ 0)
                </p>
                <p>
                  <span className="text-green-400 font-semibold">
                    Angle with x-axis:
                  </span>{" "}
                  θ = arctan(-A/B)
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-purple-300 mb-4">
                Distance and Normal
              </h3>
              <div className="space-y-3 text-gray-300">
                <p>
                  <span className="text-purple-400 font-semibold">
                    Distance from origin:
                  </span>
                </p>
                <p className="text-center text-lg">d = |C|/√(A² + B²)</p>
                <p>
                  <span className="text-purple-400 font-semibold">
                    Normal vector:
                  </span>{" "}
                  (A, B)
                </p>
                <p>
                  <span className="text-purple-400 font-semibold">
                    Direction vector:
                  </span>{" "}
                  (-B, A)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Distance Between Point and Line */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-orange-300 mb-6 flex items-center">
            <span className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mr-3 text-sm">
              📏
            </span>
            Distance from Point to Line
          </h2>
          <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-lg p-6">
            <div className="text-center mb-4">
              <h3 className="text-2xl font-bold text-orange-400 mb-2">
                d = |Ax₀ + By₀ + C|/√(A² + B²)
              </h3>
              <p className="text-lg text-gray-300">
                Distance from point (x₀, y₀) to line Ax + By + C = 0
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <h4 className="text-lg font-semibold text-orange-300 mb-2">
                  When to use:
                </h4>
                <ul className="space-y-2 text-gray-300">
                  <li>• Finding shortest distance to a line</li>
                  <li>• Checking if points are equidistant from a line</li>
                  <li>• Determining position relative to a line</li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-orange-300 mb-2">
                  Sign interpretation:
                </h4>
                <ul className="space-y-2 text-gray-300">
                  <li>
                    • <span className="text-green-400">Positive:</span> Point on
                    one side
                  </li>
                  <li>
                    • <span className="text-red-400">Negative:</span> Point on
                    other side
                  </li>
                  <li>
                    • <span className="text-yellow-400">Zero:</span> Point on
                    the line
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Parallel and Perpendicular Lines */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-cyan-300 mb-6 flex items-center">
            <span className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center mr-3 text-sm">
              ⟂
            </span>
            Parallel and Perpendicular Lines
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-cyan-300 mb-4">
                Parallel Lines
              </h3>
              <div className="space-y-3 text-gray-300">
                <p className="text-lg font-semibold">A₁x + B₁y + C₁ = 0</p>
                <p className="text-lg font-semibold">A₂x + B₂y + C₂ = 0</p>
                <div className="mt-4 p-3 bg-cyan-900/20 rounded">
                  <p className="text-cyan-400 font-semibold">
                    Condition for parallel:
                  </p>
                  <p className="text-center text-lg">A₁/A₂ = B₁/B₂ ≠ C₁/C₂</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Same slope, different intercepts
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-500/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-red-300 mb-4">
                Perpendicular Lines
              </h3>
              <div className="space-y-3 text-gray-300">
                <p className="text-lg font-semibold">A₁x + B₁y + C₁ = 0</p>
                <p className="text-lg font-semibold">A₂x + B₂y + C₂ = 0</p>
                <div className="mt-4 p-3 bg-red-900/20 rounded">
                  <p className="text-red-400 font-semibold">
                    Condition for perpendicular:
                  </p>
                  <p className="text-center text-lg">A₁A₂ + B₁B₂ = 0</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Product of slopes = -1
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Different Forms */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-yellow-300 mb-6 flex items-center">
            <span className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center mr-3 text-sm">
              📝
            </span>
            Different Forms of Line Equations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-yellow-300 mb-3">
                Slope-Intercept Form
              </h3>
              <p className="text-xl font-bold text-center mb-2">y = mx + b</p>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• m = slope</li>
                <li>• b = y-intercept</li>
                <li>• Most common form</li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-300 mb-3">
                Point-Slope Form
              </h3>
              <p className="text-xl font-bold text-center mb-2">
                y - y₁ = m(x - x₁)
              </p>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• (x₁, y₁) = known point</li>
                <li>• m = slope</li>
                <li>• Useful for construction</li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-green-500/10 to-teal-500/10 border border-green-500/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-300 mb-3">
                Two-Point Form
              </h3>
              <p className="text-lg font-bold text-center mb-2">
                (y - y₁)/(y₂ - y₁) = (x - x₁)/(x₂ - x₁)
              </p>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Two points: (x₁, y₁), (x₂, y₂)</li>
                <li>• Direct from coordinates</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Applications */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-emerald-300 mb-4 flex items-center">
              🔬 <span className="ml-2">Real-World Applications</span>
            </h3>
            <ul className="text-gray-300 leading-relaxed space-y-2">
              <li>
                • <span className="text-emerald-400">Engineering:</span>{" "}
                Structural analysis and design
              </li>
              <li>
                • <span className="text-emerald-400">Physics:</span> Motion in
                straight lines
              </li>
              <li>
                • <span className="text-emerald-400">Economics:</span> Linear
                regression and trends
              </li>
              <li>
                • <span className="text-emerald-400">Computer Graphics:</span>{" "}
                Line rendering
              </li>
            </ul>
          </div>

          <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-violet-300 mb-4 flex items-center">
              🧮 <span className="ml-2">Problem-Solving Tips</span>
            </h3>
            <ul className="text-gray-300 leading-relaxed space-y-2">
              <li>• Always check if A and B are both zero</li>
              <li>• Use general form for easier calculations</li>
              <li>• Remember: slope = -A/B (when B ≠ 0)</li>
              <li>• Distance formula works for any point-line pair</li>
            </ul>
          </div>
        </div>

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
