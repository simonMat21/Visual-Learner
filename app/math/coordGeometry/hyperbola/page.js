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
        {/* Algorithm Info */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent mb-2">
              Hyperbola Equations in Coordinate Geometry
            </h1>
            <div className="inline-flex items-center space-x-4 text-sm bg-gradient-to-r from-red-400/20 to-orange-400/20 rounded-full px-4 py-2 mt-3 border border-red-400/30">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                General Form: Ax² - Cy² + Dx + Ey + F = 0
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                Standard Form: (x-h)²/a² - (y-k)²/b² = 1
              </span>
            </div>
          </div>
        </div>

        {/* General Form */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-red-300 mb-4 flex items-center">
            <span className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-3 text-sm">
              ⭕
            </span>
            General Form of a Hyperbola
          </h2>
          <div className="space-y-6 text-gray-300 leading-relaxed">
            <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-lg p-6">
              <div className="text-center mb-4">
                <h3 className="text-2xl font-bold text-red-400 mb-2">
                  Ax² - Cy² + Dx + Ey + F = 0
                </h3>
                <p className="text-lg">
                  where A ≠ 0, C ≠ 0, and A and C have opposite signs for a real
                  hyperbola.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="text-center">
                  <p className="font-semibold text-red-300">Center</p>
                  <p className="text-sm">(-D/(2A), -E/(2C))</p>
                  <p className="text-xs text-gray-400">
                    h = -D/(2A), k = -E/(2C)
                  </p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-orange-300">Semi-axes</p>
                  <p className="text-sm">a² = discriminant/A</p>
                  <p className="text-xs text-gray-400">b² = -discriminant/C</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-yellow-300">Asymptotes</p>
                  <p className="text-sm">y - k = ±(b/a)(x - h)</p>
                  <p className="text-xs text-gray-400">Two diagonal lines</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Standard Form */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-orange-300 mb-6 flex items-center">
            <span className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mr-3 text-sm">
              🎯
            </span>
            Standard Form and Orientation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-orange-300 mb-4">
                Horizontal Transverse Axis
              </h3>
              <div className="space-y-3 text-gray-300">
                <div className="text-center mb-4">
                  <p className="text-2xl font-bold text-orange-400">
                    (x - h)²/a² - (y - k)²/b² = 1
                  </p>
                </div>
                <p>
                  <span className="text-orange-400 font-semibold">Center:</span>{" "}
                  (h, k)
                </p>
                <p>
                  <span className="text-orange-400 font-semibold">
                    Vertices:
                  </span>{" "}
                  (h±a, k)
                </p>
                <p>
                  <span className="text-orange-400 font-semibold">Foci:</span>{" "}
                  (h±c, k)
                </p>
                <p className="text-sm text-gray-400">where c² = a² + b²</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-blue-300 mb-4">
                Vertical Transverse Axis
              </h3>
              <div className="space-y-3 text-gray-300">
                <div className="text-center mb-4">
                  <p className="text-2xl font-bold text-blue-400">
                    (y - k)²/a² - (x - h)²/b² = 1
                  </p>
                </div>
                <p>
                  <span className="text-blue-400 font-semibold">Center:</span>{" "}
                  (h, k)
                </p>
                <p>
                  <span className="text-blue-400 font-semibold">Vertices:</span>{" "}
                  (h, k±a)
                </p>
                <p>
                  <span className="text-blue-400 font-semibold">Foci:</span> (h,
                  k±c)
                </p>
                <p className="text-sm text-gray-400">where c² = a² + b²</p>
              </div>
            </div>
          </div>
        </div>

        {/* Eccentricity and Foci */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-green-300 mb-6 flex items-center">
            <span className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3 text-sm">
              ⚡
            </span>
            Eccentricity and Foci
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-green-300 mb-4">
                Eccentricity (e)
              </h3>
              <div className="space-y-3 text-gray-300">
                <p className="text-center text-lg font-bold">
                  e = √(1 + b²/a²)
                </p>
                <p className="text-sm">or e = c/a</p>
                <p>
                  <span className="text-green-400 font-semibold">Range:</span> e
                  &gt; 1
                </p>
                <p className="text-xs text-gray-400">
                  Always greater than 1 for hyperbolas
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-yellow-300 mb-4">
                Foci Distance
              </h3>
              <div className="space-y-3 text-gray-300">
                <p className="text-center text-lg font-bold">c = √(a² + b²)</p>
                <p className="text-sm">Distance from center to focus</p>
                <p>
                  <span className="text-yellow-400 font-semibold">Note:</span> c
                  &gt; a always
                </p>
                <p className="text-xs text-gray-400">
                  Unlike ellipse where c &lt; a
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-500/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-red-300 mb-4">
                Focal Property
              </h3>
              <div className="space-y-3 text-gray-300">
                <p className="text-center text-lg font-bold">|d₁ - d₂| = 2a</p>
                <p>
                  <span className="text-red-400 font-semibold">Property:</span>{" "}
                  Difference of distances
                </p>
                <p className="text-sm">From any point to foci is constant</p>
                <p className="text-xs text-gray-400">Absolute difference</p>
              </div>
            </div>
          </div>
        </div>

        {/* Asymptotes */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-purple-300 mb-6 flex items-center">
            <span className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-3 text-sm">
              📐
            </span>
            Asymptotes
          </h2>
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold text-purple-300 mb-4">
                  Horizontal Hyperbola
                </h3>
                <div className="space-y-3 text-gray-300">
                  <p className="text-center text-lg font-bold">
                    y - k = ±(b/a)(x - h)
                  </p>
                  <p>
                    <span className="text-purple-400 font-semibold">
                      Equations:
                    </span>
                  </p>
                  <ul className="space-y-1 text-sm">
                    <li>• y = k + (b/a)(x - h)</li>
                    <li>• y = k - (b/a)(x - h)</li>
                    <li>• Pass through center (h, k)</li>
                  </ul>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-purple-300 mb-4">
                  Vertical Hyperbola
                </h3>
                <div className="space-y-3 text-gray-300">
                  <p className="text-center text-lg font-bold">
                    y - k = ±(a/b)(x - h)
                  </p>
                  <p>
                    <span className="text-purple-400 font-semibold">
                      Properties:
                    </span>
                  </p>
                  <ul className="space-y-1 text-sm">
                    <li>• Hyperbola approaches but never touches</li>
                    <li>• Slopes are ±a/b</li>
                    <li>• Form a rectangle with vertices</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Special Cases */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-cyan-300 mb-6 flex items-center">
            <span className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center mr-3 text-sm">
              🔄
            </span>
            Special Cases
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-cyan-300 mb-4">
                Rectangular Hyperbola
              </h3>
              <div className="space-y-3 text-gray-300">
                <p className="text-center text-lg font-bold">a = b</p>
                <p>
                  <span className="text-cyan-400 font-semibold">Equation:</span>{" "}
                  xy = c²/2
                </p>
                <p className="text-sm">Asymptotes perpendicular</p>
                <p className="text-xs text-gray-400">45° rotated form</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500/10 to-teal-500/10 border border-green-500/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-green-300 mb-4">
                Centered at Origin
              </h3>
              <div className="space-y-3 text-gray-300">
                <p className="text-center text-lg font-bold">
                  x²/a² - y²/b² = 1
                </p>
                <p>
                  <span className="text-green-400 font-semibold">Center:</span>{" "}
                  (0, 0)
                </p>
                <p className="text-sm">Simplest form</p>
                <p className="text-xs text-gray-400">Most common in problems</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-yellow-300 mb-4">
                Conjugate Hyperbola
              </h3>
              <div className="space-y-3 text-gray-300">
                <p className="text-center text-lg font-bold">
                  -x²/a² + y²/b² = 1
                </p>
                <p>
                  <span className="text-yellow-400 font-semibold">
                    Property:
                  </span>{" "}
                  Swapped axes
                </p>
                <p className="text-sm">Same asymptotes</p>
                <p className="text-xs text-gray-400">
                  Perpendicular transverse axes
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Parametric Form */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-yellow-300 mb-6 flex items-center">
            <span className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center mr-3 text-sm">
              📝
            </span>
            Parametric Form
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-yellow-300 mb-3">
                Horizontal Hyperbola
              </h3>
              <div className="space-y-3 text-gray-300">
                <p className="text-center font-bold">x = h + a sec(t)</p>
                <p className="text-center font-bold">y = k + b tan(t)</p>
                <ul className="text-sm space-y-1">
                  <li>• Uses secant and tangent</li>
                  <li>• Parameter t is angle</li>
                  <li>• Traces one branch at a time</li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500/10 to-teal-500/10 border border-green-500/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-300 mb-3">
                Alternative Form (Hyperbolic)
              </h3>
              <div className="space-y-3 text-gray-300">
                <p className="text-center font-bold">x = h + a cosh(t)</p>
                <p className="text-center font-bold">y = k + b sinh(t)</p>
                <ul className="text-sm space-y-1">
                  <li>• Uses hyperbolic functions</li>
                  <li>• Natural for hyperbolas</li>
                  <li>• Traces entire branch smoothly</li>
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
                • <span className="text-emerald-400">Navigation:</span> LORAN
                and GPS positioning systems
              </li>
              <li>
                • <span className="text-emerald-400">Physics:</span> Particle
                trajectories and orbits
              </li>
              <li>
                • <span className="text-emerald-400">Architecture:</span>{" "}
                Cooling towers and structural design
              </li>
              <li>
                • <span className="text-emerald-400">Optics:</span> Hyperbolic
                mirrors and lenses
              </li>
              <li>
                • <span className="text-emerald-400">Astronomy:</span> Comet and
                spacecraft trajectories
              </li>
            </ul>
          </div>

          <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-violet-300 mb-4 flex items-center">
              🧮 <span className="ml-2">Problem-Solving Tips</span>
            </h3>
            <ul className="text-gray-300 leading-relaxed space-y-2">
              <li>• Check A and C have opposite signs</li>
              <li>• Identify transverse axis orientation</li>
              <li>• Remember: c² = a² + b² (not subtraction!)</li>
              <li>• Asymptotes pass through center</li>
              <li>• Eccentricity e &gt; 1 always</li>
              <li>• Focal property uses difference, not sum</li>
            </ul>
          </div>
        </div>

        {/* Bottom Spacer */}
        <div className="h-12"></div>
      </div>
    </main>
  );
}
