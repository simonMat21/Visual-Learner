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

        {/* Algorithm Info */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
              Circle Equations in Coordinate Geometry
            </h1>
            <div className="inline-flex items-center space-x-4 text-sm bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full px-4 py-2 mt-3 border border-purple-400/30">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                General Form: ax² + ay² + 2gx + 2fy + c = 0
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-pink-400 rounded-full mr-2"></span>
                Standard Form: (x - h)² + (y - k)² = r²
              </span>
            </div>
          </div>
        </div>

        {/* General Form */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-purple-300 mb-4 flex items-center">
            <span className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-3 text-sm">
              ⭕
            </span>
            General Form of a Circle
          </h2>
          <div className="space-y-6 text-gray-300 leading-relaxed">
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-6">
              <div className="text-center mb-4">
                <h3 className="text-2xl font-bold text-purple-400 mb-2">
                  ax² + ay² + 2gx + 2fy + c = 0
                </h3>
                <p className="text-lg">
                  where a ≠ 0 and g² + f² - ac &gt; 0 for a real circle.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="text-center">
                  <p className="font-semibold text-purple-300">Center</p>
                  <p className="text-sm">(-g/a, -f/a)</p>
                  <p className="text-xs text-gray-400">h = -g/a, k = -f/a</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-pink-300">Radius</p>
                  <p className="text-sm">√(g² + f² - ac)/|a|</p>
                  <p className="text-xs text-gray-400">
                    r = √(discriminant)/|a|
                  </p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-blue-300">Condition</p>
                  <p className="text-sm">g² + f² - ac &gt; 0</p>
                  <p className="text-xs text-gray-400">For real circle</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Standard Form */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-pink-300 mb-6 flex items-center">
            <span className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center mr-3 text-sm">
              🎯
            </span>
            Standard Form and Transformations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-pink-500/10 to-red-500/10 border border-pink-500/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-pink-300 mb-4">
                Standard Form
              </h3>
              <div className="space-y-3 text-gray-300">
                <div className="text-center mb-4">
                  <p className="text-2xl font-bold text-pink-400">
                    (x - h)² + (y - k)² = r²
                  </p>
                </div>
                <p>
                  <span className="text-pink-400 font-semibold">Center:</span>{" "}
                  (h, k)
                </p>
                <p>
                  <span className="text-pink-400 font-semibold">Radius:</span> r
                </p>
                <p>
                  <span className="text-pink-400 font-semibold">Domain:</span>{" "}
                  [h - r, h + r]
                </p>
                <p>
                  <span className="text-pink-400 font-semibold">Range:</span> [k
                  - r, k + r]
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-blue-300 mb-4">
                Conversion Formulas
              </h3>
              <div className="space-y-3 text-gray-300">
                <p>
                  <span className="text-blue-400 font-semibold">
                    General → Standard:
                  </span>
                </p>
                <p className="text-sm">h = -g/a, k = -f/a</p>
                <p className="text-sm">r² = (g² + f² - ac)/a²</p>
                <p>
                  <span className="text-blue-400 font-semibold">
                    Standard → General:
                  </span>
                </p>
                <p className="text-sm">g = -ah, f = -ak</p>
                <p className="text-sm">c = a(h² + k² - r²)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Special Cases */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-green-300 mb-6 flex items-center">
            <span className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3 text-sm">
              ⚡
            </span>
            Special Cases and Properties
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-green-300 mb-4">
                Unit Circle
              </h3>
              <div className="space-y-3 text-gray-300">
                <p className="text-center text-lg font-bold">x² + y² = 1</p>
                <p>
                  <span className="text-green-400 font-semibold">Center:</span>{" "}
                  (0, 0)
                </p>
                <p>
                  <span className="text-green-400 font-semibold">Radius:</span>{" "}
                  1
                </p>
                <p>
                  <span className="text-green-400 font-semibold">Used in:</span>{" "}
                  Trigonometry
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-yellow-300 mb-4">
                Centered at Origin
              </h3>
              <div className="space-y-3 text-gray-300">
                <p className="text-center text-lg font-bold">x² + y² = r²</p>
                <p>
                  <span className="text-yellow-400 font-semibold">Center:</span>{" "}
                  (0, 0)
                </p>
                <p>
                  <span className="text-yellow-400 font-semibold">Radius:</span>{" "}
                  r
                </p>
                <p>
                  <span className="text-yellow-400 font-semibold">
                    Simplest form
                  </span>
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-500/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-red-300 mb-4">
                Point Circle
              </h3>
              <div className="space-y-3 text-gray-300">
                <p className="text-center text-lg font-bold">r = 0</p>
                <p>
                  <span className="text-red-400 font-semibold">When:</span> g² +
                  f² = ac
                </p>
                <p>
                  <span className="text-red-400 font-semibold">Result:</span>{" "}
                  Single point
                </p>
                <p>
                  <span className="text-red-400 font-semibold">
                    Degenerate case
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Distance and Tangent Properties */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-orange-300 mb-6 flex items-center">
            <span className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mr-3 text-sm">
              📐
            </span>
            Distance and Tangent Properties
          </h2>
          <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold text-orange-300 mb-4">
                  Distance from Point to Circle
                </h3>
                <div className="space-y-3 text-gray-300">
                  <p className="text-center text-lg font-bold">
                    d = |√((x₀-h)² + (y₀-k)²) - r|
                  </p>
                  <p>
                    <span className="text-orange-400 font-semibold">
                      Point (x₀, y₀):
                    </span>
                  </p>
                  <ul className="space-y-1 text-sm">
                    <li>
                      • <span className="text-green-400">Inside:</span> distance
                      &lt; r
                    </li>
                    <li>
                      • <span className="text-yellow-400">On circle:</span>{" "}
                      distance = r
                    </li>
                    <li>
                      • <span className="text-red-400">Outside:</span> distance
                      &gt; r
                    </li>
                  </ul>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-orange-300 mb-4">
                  Tangent Line
                </h3>
                <div className="space-y-3 text-gray-300">
                  <p>
                    <span className="text-orange-400 font-semibold">
                      At point (x₁, y₁) on circle:
                    </span>
                  </p>
                  <p className="text-center text-lg font-bold">
                    (x₁-h)(x-h) + (y₁-k)(y-k) = r²
                  </p>
                  <p>
                    <span className="text-orange-400 font-semibold">
                      From external point:
                    </span>
                  </p>
                  <p className="text-sm">Length = √((x₀-h)² + (y₀-k)² - r²)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Circle Relationships */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-cyan-300 mb-6 flex items-center">
            <span className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center mr-3 text-sm">
              🔄
            </span>
            Circle Relationships
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-cyan-300 mb-4">
                Two Circles
              </h3>
              <div className="space-y-3 text-gray-300">
                <p>
                  <span className="text-cyan-400 font-semibold">
                    Distance between centers:
                  </span>
                </p>
                <p className="text-center">d = √((h₁-h₂)² + (k₁-k₂)²)</p>
                <div className="mt-4 space-y-2 text-sm">
                  <p>
                    • <span className="text-green-400">Separate:</span> d &gt;
                    r₁ + r₂
                  </p>
                  <p>
                    • <span className="text-yellow-400">External tangent:</span>{" "}
                    d = r₁ + r₂
                  </p>
                  <p>
                    • <span className="text-blue-400">Intersecting:</span> |r₁ -
                    r₂| &lt; d &lt; r₁ + r₂
                  </p>
                  <p>
                    • <span className="text-purple-400">Internal tangent:</span>{" "}
                    d = |r₁ - r₂|
                  </p>
                  <p>
                    • <span className="text-red-400">One inside other:</span> d
                    &lt; |r₁ - r₂|
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-purple-300 mb-4">
                Circle and Line
              </h3>
              <div className="space-y-3 text-gray-300">
                <p>
                  <span className="text-purple-400 font-semibold">
                    Line: Ax + By + C = 0
                  </span>
                </p>
                <p>
                  <span className="text-purple-400 font-semibold">
                    Distance from center:
                  </span>
                </p>
                <p className="text-center">d = |Ah + Bk + C|/√(A² + B²)</p>
                <div className="mt-4 space-y-2 text-sm">
                  <p>
                    • <span className="text-green-400">No intersection:</span> d
                    &gt; r
                  </p>
                  <p>
                    • <span className="text-yellow-400">Tangent:</span> d = r
                  </p>
                  <p>
                    • <span className="text-blue-400">Two intersections:</span>{" "}
                    d &lt; r
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Parametric and Polar Forms */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-yellow-300 mb-6 flex items-center">
            <span className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center mr-3 text-sm">
              📝
            </span>
            Alternative Forms
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-yellow-300 mb-3">
                Parametric Form
              </h3>
              <div className="space-y-3 text-gray-300">
                <p className="text-center font-bold">x = h + r cos(t)</p>
                <p className="text-center font-bold">y = k + r sin(t)</p>
                <p className="text-sm">where 0 ≤ t ≤ 2π</p>
                <ul className="text-sm space-y-1">
                  <li>• Useful for plotting points</li>
                  <li>• Easy to animate</li>
                  <li>• Parameter t represents angle</li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500/10 to-teal-500/10 border border-green-500/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-300 mb-3">
                Polar Form (Centered at Origin)
              </h3>
              <div className="space-y-3 text-gray-300">
                <p className="text-center font-bold">r = constant</p>
                <p className="text-sm">where r is the radius</p>
                <ul className="text-sm space-y-1">
                  <li>• Simplest in polar coordinates</li>
                  <li>• All points equidistant from origin</li>
                  <li>• θ can vary from 0 to 2π</li>
                </ul>
              </div>
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
                • <span className="text-emerald-400">Engineering:</span> Wheel
                and gear design
              </li>
              <li>
                • <span className="text-emerald-400">Physics:</span> Circular
                motion and orbits
              </li>
              <li>
                • <span className="text-emerald-400">Computer Graphics:</span>
                Drawing curves
              </li>
              <li>
                • <span className="text-emerald-400">Navigation:</span> Radar
                and GPS systems
              </li>
              <li>
                • <span className="text-emerald-400">Architecture:</span> Arches
                and domes
              </li>
            </ul>
          </div>

          <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-violet-300 mb-4 flex items-center">
              🧮 <span className="ml-2">Problem-Solving Tips</span>
            </h3>
            <ul className="text-gray-300 leading-relaxed space-y-2">
              <li>• Check discriminant: g² + f² - ac &gt; 0</li>
              <li>• Use standard form for geometric problems</li>
              <li>• Convert between forms as needed</li>
              <li>• Parametric form helpful for animations</li>
              <li>• Remember: center is (-g/a, -f/a)</li>
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
