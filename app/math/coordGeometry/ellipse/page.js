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
        {/* Algorithm Info */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
              Ellipse Equations in Coordinate Geometry
            </h1>
            <div className="inline-flex items-center space-x-4 text-sm bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full px-4 py-2 mt-3 border border-purple-400/30">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                General Form: Ax² + Cy² + Dx + Ey + F = 0
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-pink-400 rounded-full mr-2"></span>
                Standard Form: (x-h)²/a² + (y-k)²/b² = 1
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
            General Form of an Ellipse
          </h2>
          <div className="space-y-6 text-gray-300 leading-relaxed">
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-6">
              <div className="text-center mb-4">
                <h3 className="text-2xl font-bold text-purple-400 mb-2">
                  Ax² + Cy² + Dx + Ey + F = 0
                </h3>
                <p className="text-lg">
                  where A ≠ 0, C ≠ 0, A ≠ C, and both have the same sign for a
                  real ellipse.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="text-center">
                  <p className="font-semibold text-purple-300">Center</p>
                  <p className="text-sm">(-D/(2A), -E/(2C))</p>
                  <p className="text-xs text-gray-400">
                    h = -D/(2A), k = -E/(2C)
                  </p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-pink-300">Semi-axes</p>
                  <p className="text-sm">a = √(discriminant/A)</p>
                  <p className="text-xs text-gray-400">b = √(discriminant/C)</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-blue-300">Condition</p>
                  <p className="text-sm">D²/(4A²) + E²/(4C²) - F &gt; 0</p>
                  <p className="text-xs text-gray-400">For real ellipse</p>
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
            Standard Form and Properties
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-pink-500/10 to-red-500/10 border border-pink-500/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-pink-300 mb-4">
                Standard Form
              </h3>
              <div className="space-y-3 text-gray-300">
                <div className="text-center mb-4">
                  <p className="text-2xl font-bold text-pink-400">
                    (x - h)²/a² + (y - k)²/b² = 1
                  </p>
                </div>
                <p>
                  <span className="text-pink-400 font-semibold">Center:</span>{" "}
                  (h, k)
                </p>
                <p>
                  <span className="text-pink-400 font-semibold">
                    Semi-major axis:
                  </span>{" "}
                  max(a, b)
                </p>
                <p>
                  <span className="text-pink-400 font-semibold">
                    Semi-minor axis:
                  </span>{" "}
                  min(a, b)
                </p>
                <p>
                  <span className="text-pink-400 font-semibold">Domain:</span>{" "}
                  [h - a, h + a]
                </p>
                <p>
                  <span className="text-pink-400 font-semibold">Range:</span> [k
                  - b, k + b]
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
                <p className="text-sm">h = -D/(2A), k = -E/(2C)</p>
                <p className="text-sm">a² = discriminant/A</p>
                <p className="text-sm">b² = discriminant/C</p>
                <p className="text-xs text-gray-400">
                  discriminant = D²/(4A²) + E²/(4C²) - F
                </p>
                <p className="mt-3">
                  <span className="text-blue-400 font-semibold">
                    Standard → General:
                  </span>
                </p>
                <p className="text-sm">A = 1/a², C = 1/b²</p>
                <p className="text-sm">D = -2h/a², E = -2k/b²</p>
                <p className="text-sm">F = (h²/a² + k²/b² - 1)</p>
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
                  e = √(1 - b²/a²)
                </p>
                <p className="text-sm">where a &gt; b</p>
                <p>
                  <span className="text-green-400 font-semibold">Range:</span> 0
                  &lt; e &lt; 1
                </p>
                <p className="text-xs text-gray-400">
                  e = 0 is a circle, e → 1 is very elongated
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-yellow-300 mb-4">
                Foci Location
              </h3>
              <div className="space-y-3 text-gray-300">
                <p className="text-center text-lg font-bold">c = ae</p>
                <p className="text-sm">or c = √(a² - b²)</p>
                <p>
                  <span className="text-yellow-400 font-semibold">
                    If a &gt; b:
                  </span>{" "}
                  (h±c, k)
                </p>
                <p>
                  <span className="text-yellow-400 font-semibold">
                    If b &gt; a:
                  </span>{" "}
                  (h, k±c)
                </p>
                <p className="text-xs text-gray-400">Horizontal or vertical</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-500/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-red-300 mb-4">
                Focal Property
              </h3>
              <div className="space-y-3 text-gray-300">
                <p className="text-center text-lg font-bold">d₁ + d₂ = 2a</p>
                <p>
                  <span className="text-red-400 font-semibold">Property:</span>{" "}
                  Sum of distances
                </p>
                <p className="text-sm">
                  From any point to both foci is constant
                </p>
                <p className="text-xs text-gray-400">
                  Defines the ellipse shape
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Special Cases */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-orange-300 mb-6 flex items-center">
            <span className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mr-3 text-sm">
              📐
            </span>
            Special Cases and Axes
          </h2>
          <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold text-orange-300 mb-4">
                  Centered at Origin
                </h3>
                <div className="space-y-3 text-gray-300">
                  <p className="text-center text-lg font-bold">
                    x²/a² + y²/b² = 1
                  </p>
                  <p>
                    <span className="text-orange-400 font-semibold">
                      Center:
                    </span>{" "}
                    (0, 0)
                  </p>
                  <ul className="space-y-1 text-sm">
                    <li>
                      • <span className="text-green-400">Simplest form</span>
                    </li>
                    <li>
                      •{" "}
                      <span className="text-yellow-400">Aligned with axes</span>
                    </li>
                    <li>
                      •{" "}
                      <span className="text-blue-400">
                        Most common in problems
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-orange-300 mb-4">
                  Axis Orientation
                </h3>
                <div className="space-y-3 text-gray-300">
                  <p>
                    <span className="text-orange-400 font-semibold">
                      If a &gt; b:
                    </span>
                  </p>
                  <p className="text-sm">Major axis is horizontal</p>
                  <p>
                    <span className="text-orange-400 font-semibold">
                      If b &gt; a:
                    </span>
                  </p>
                  <p className="text-sm">Major axis is vertical</p>
                  <p className="text-xs text-gray-400 mt-2">
                    Larger denominator determines major axis direction
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
                <p className="text-center font-bold">x = h + a cos(t)</p>
                <p className="text-center font-bold">y = k + b sin(t)</p>
                <p className="text-sm">where 0 ≤ t ≤ 2π</p>
                <ul className="text-sm space-y-1">
                  <li>• Useful for plotting points</li>
                  <li>• Easy to animate</li>
                  <li>• Parameter t represents angle</li>
                  <li>• Traces entire ellipse once</li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500/10 to-teal-500/10 border border-green-500/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-300 mb-3">
                Polar Form (Centered at Origin)
              </h3>
              <div className="space-y-3 text-gray-300">
                <p className="text-center font-bold">
                  r = ab/√((b cos θ)² + (a sin θ)²)
                </p>
                <p className="text-sm">
                  Alternative form with focus at origin:
                </p>
                <p className="text-center font-bold">r = a(1-e²)/(1-e cos θ)</p>
                <ul className="text-sm space-y-1">
                  <li>• More complex than circle</li>
                  <li>• Used in orbital mechanics</li>
                  <li>• θ is the polar angle</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Tangent Properties */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-cyan-300 mb-6 flex items-center">
            <span className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center mr-3 text-sm">
              🔄
            </span>
            Tangent and Normal Properties
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-cyan-300 mb-4">
                Tangent at Point (x₁, y₁)
              </h3>
              <div className="space-y-3 text-gray-300">
                <p>
                  <span className="text-cyan-400 font-semibold">Equation:</span>
                </p>
                <p className="text-center font-bold">
                  (x₁-h)(x-h)/a² + (y₁-k)(y-k)/b² = 1
                </p>
                <div className="mt-4 space-y-2 text-sm">
                  <p>• Point must be on the ellipse</p>
                  <p>• Perpendicular to radius at that point</p>
                  <p>• Unique tangent at each point</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-purple-300 mb-4">
                Reflection Property
              </h3>
              <div className="space-y-3 text-gray-300">
                <p>
                  <span className="text-purple-400 font-semibold">
                    Focal Property:
                  </span>
                </p>
                <p className="text-sm">
                  A line from one focus reflects off the ellipse and passes
                  through the other focus
                </p>
                <div className="mt-4 space-y-2 text-sm">
                  <p>• Used in whispering galleries</p>
                  <p>• Basis for elliptical mirrors</p>
                  <p>• Important in acoustics and optics</p>
                </div>
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
                • <span className="text-emerald-400">Astronomy:</span> Planetary
                orbits around the sun
              </li>
              <li>
                • <span className="text-emerald-400">Architecture:</span>{" "}
                Whispering galleries and acoustic design
              </li>
              <li>
                • <span className="text-emerald-400">Engineering:</span>{" "}
                Elliptical gears and machine parts
              </li>
              <li>
                • <span className="text-emerald-400">Medicine:</span>{" "}
                Lithotripsy (kidney stone treatment)
              </li>
              <li>
                • <span className="text-emerald-400">Optics:</span> Reflectors
                and lens design
              </li>
            </ul>
          </div>

          <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-violet-300 mb-4 flex items-center">
              🧮 <span className="ml-2">Problem-Solving Tips</span>
            </h3>
            <ul className="text-gray-300 leading-relaxed space-y-2">
              <li>• Check A ≠ C for it to be an ellipse</li>
              <li>• Use standard form for geometric problems</li>
              <li>• Identify major axis (larger denominator)</li>
              <li>• Calculate eccentricity to find shape</li>
              <li>• Remember: center is (-D/(2A), -E/(2C))</li>
              <li>• Verify discriminant &gt; 0 for real ellipse</li>
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
