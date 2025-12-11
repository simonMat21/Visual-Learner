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
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
              Parabola Equations in Coordinate Geometry
            </h1>
            <div className="inline-flex items-center space-x-4 text-sm bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full px-4 py-2 mt-3 border border-blue-400/30">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                General Form: y = ax² + bx + c
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-cyan-400 rounded-full mr-2"></span>
                Standard Form: (x-h)² = 4p(y-k)
              </span>
            </div>
          </div>
        </div>

        {/* General Form */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-blue-300 mb-4 flex items-center">
            <span className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3 text-sm">
              ⭕
            </span>
            General Quadratic Form
          </h2>
          <div className="space-y-6 text-gray-300 leading-relaxed">
            <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-lg p-6">
              <div className="text-center mb-4">
                <h3 className="text-2xl font-bold text-blue-400 mb-2">
                  y = ax² + bx + c
                </h3>
                <p className="text-lg">
                  where a ≠ 0 (if a = 0, it's a line, not a parabola)
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="text-center">
                  <p className="font-semibold text-blue-300">Vertex</p>
                  <p className="text-sm">x = -b/(2a)</p>
                  <p className="text-xs text-gray-400">y = c - b²/(4a)</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-cyan-300">Direction</p>
                  <p className="text-sm">a &gt; 0: opens up</p>
                  <p className="text-xs text-gray-400">a &lt; 0: opens down</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-green-300">Axis of Symmetry</p>
                  <p className="text-sm">x = -b/(2a)</p>
                  <p className="text-xs text-gray-400">Vertical line through vertex</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Standard Form */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-cyan-300 mb-6 flex items-center">
            <span className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center mr-3 text-sm">
              🎯
            </span>
            Standard Form and Orientation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-cyan-300 mb-4">
                Vertical Parabola
              </h3>
              <div className="space-y-3 text-gray-300">
                <div className="text-center mb-4">
                  <p className="text-2xl font-bold text-cyan-400">
                    (x - h)² = 4p(y - k)
                  </p>
                </div>
                <p>
                  <span className="text-cyan-400 font-semibold">Vertex:</span>{" "}
                  (h, k)
                </p>
                <p>
                  <span className="text-cyan-400 font-semibold">Focus:</span> (h, k+p)
                </p>
                <p>
                  <span className="text-cyan-400 font-semibold">Directrix:</span> y = k-p
                </p>
                <p className="text-sm">
                  <span className="text-cyan-400">Opens:</span> Up if p &gt; 0, Down if p &lt; 0
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-green-300 mb-4">
                Horizontal Parabola
              </h3>
              <div className="space-y-3 text-gray-300">
                <div className="text-center mb-4">
                  <p className="text-2xl font-bold text-green-400">
                    (y - k)² = 4p(x - h)
                  </p>
                </div>
                <p>
                  <span className="text-green-400 font-semibold">Vertex:</span>{" "}
                  (h, k)
                </p>
                <p>
                  <span className="text-green-400 font-semibold">Focus:</span> (h+p, k)
                </p>
                <p>
                  <span className="text-green-400 font-semibold">Directrix:</span> x = h-p
                </p>
                <p className="text-sm">
                  <span className="text-green-400">Opens:</span> Right if p &gt; 0, Left if p &lt; 0
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Focus and Directrix */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-purple-300 mb-6 flex items-center">
            <span className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-3 text-sm">
              ⚡
            </span>
            Focus and Directrix Properties
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-purple-300 mb-4">
                Definition
              </h3>
              <div className="space-y-3 text-gray-300">
                <p className="text-center text-lg font-bold">d₁ = d₂</p>
                <p>
                  <span className="text-purple-400 font-semibold">Property:</span>{" "}
                  Equal distances
                </p>
                <p className="text-sm">Any point on parabola is equidistant from focus and directrix</p>
                <p className="text-xs text-gray-400">Defining property</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-orange-300 mb-4">
                Focal Parameter (p)
              </h3>
              <div className="space-y-3 text-gray-300">
                <p className="text-center text-lg font-bold">p = distance</p>
                <p className="text-sm">From vertex to focus</p>
                <p>
                  <span className="text-orange-400 font-semibold">Sign:</span>{" "}
                  Determines direction
                </p>
                <p className="text-xs text-gray-400">|p| = focal length</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-yellow-300 mb-4">
                Latus Rectum
              </h3>
              <div className="space-y-3 text-gray-300">
                <p className="text-center text-lg font-bold">Length = 4|p|</p>
                <p>
                  <span className="text-yellow-400 font-semibold">Definition:</span>{" "}
                  Chord through focus
                </p>
                <p className="text-sm">Perpendicular to axis</p>
                <p className="text-xs text-gray-400">Measures "width" at focus</p>
              </div>
            </div>
          </div>
        </div>

        {/* Vertex Form */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-pink-300 mb-6 flex items-center">
            <span className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center mr-3 text-sm">
              📐
            </span>
            Vertex Form
          </h2>
          <div className="bg-gradient-to-r from-pink-500/10 to-red-500/10 border border-pink-500/20 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold text-pink-300 mb-4">
                  Vertical Parabola
                </h3>
                <div className="space-y-3 text-gray-300">
                  <p className="text-center text-lg font-bold">
                    y = a(x - h)² + k
                  </p>
                  <p>
                    <span className="text-pink-400 font-semibold">
                      Vertex:
                    </span>{" "}
                    (h, k)
                  </p>
                  <ul className="space-y-1 text-sm">
                    <li>• a &gt; 0: opens upward</li>
                    <li>• a &lt; 0: opens downward</li>
                    <li>• |a| affects "width"</li>
                    <li>• Relationship: a = 1/(4p)</li>
                  </ul>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-pink-300 mb-4">
                  Converting Forms
                </h3>
                <div className="space-y-3 text-gray-300">
                  <p>
                    <span className="text-pink-400 font-semibold">
                      Standard → Vertex:
                    </span>
                  </p>
                  <p className="text-sm">Complete the square</p>
                  <p>
                    <span className="text-pink-400 font-semibold">
                      Vertex → Standard:
                    </span>
                  </p>
                  <p className="text-sm">p = 1/(4a)</p>
                  <p className="text-xs text-gray-400 mt-2">
                    Both forms useful for different problems
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Special Cases */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-orange-300 mb-6 flex items-center">
            <span className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mr-3 text-sm">
              🔄
            </span>
            Special Cases and Forms
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-orange-300 mb-4">
                Vertex at Origin
              </h3>
              <div className="space-y-3 text-gray-300">
                <p className="text-center text-lg font-bold">x² = 4py</p>
                <p>
                  <span className="text-orange-400 font-semibold">Vertex:</span>{" "}
                  (0, 0)
                </p>
                <p className="text-sm">Simplest form</p>
                <p className="text-xs text-gray-400">Most common in problems</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-blue-300 mb-4">
                Simple Quadratic
              </h3>
              <div className="space-y-3 text-gray-300">
                <p className="text-center text-lg font-bold">y = x²</p>
                <p>
                  <span className="text-blue-400 font-semibold">Properties:</span>{" "}
                  a = 1, p = 1/4
                </p>
                <p className="text-sm">Focus: (0, 1/4)</p>
                <p className="text-xs text-gray-400">Directrix: y = -1/4</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500/10 to-teal-500/10 border border-green-500/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-green-300 mb-4">
                General Conic
              </h3>
              <div className="space-y-3 text-gray-300">
                <p className="text-center text-lg font-bold">Ax² + Bxy + Cy²...</p>
                <p>
                  <span className="text-green-400 font-semibold">Parabola if:</span>{" "}
                  B² = 4AC
                </p>
                <p className="text-sm">Discriminant test</p>
                <p className="text-xs text-gray-400">Identifies conic type</p>
              </div>
            </div>
          </div>
        </div>

        {/* Parametric and Other Forms */}
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
                Vertical Parabola (x² = 4py)
              </h3>
              <div className="space-y-3 text-gray-300">
                <p className="text-center font-bold">x = 2pt</p>
                <p className="text-center font-bold">y = pt²</p>
                <ul className="text-sm space-y-1">
                  <li>• Parameter t is real number</li>
                  <li>• Simple to compute</li>
                  <li>• Traces entire parabola</li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500/10 to-teal-500/10 border border-green-500/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-300 mb-3">
                Horizontal Parabola (y² = 4px)
              </h3>
              <div className="space-y-3 text-gray-300">
                <p className="text-center font-bold">x = pt²</p>
                <p className="text-center font-bold">y = 2pt</p>
                <ul className="text-sm space-y-1">
                  <li>• x and y roles swapped</li>
                  <li>• Used for projectile motion</li>
                  <li>• t often represents time</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Tangent and Normal */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-red-300 mb-6 flex items-center">
            <span className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-3 text-sm">
              📊
            </span>
            Tangent and Normal Lines
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-500/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-red-300 mb-4">
                Tangent at Point (x₁, y₁)
              </h3>
              <div className="space-y-3 text-gray-300">
                <p>
                  <span className="text-red-400 font-semibold">
                    For x² = 4py:
                  </span>
                </p>
                <p className="text-center font-bold">xx₁ = 2p(y + y₁)</p>
                <div className="mt-4 space-y-2 text-sm">
                  <p>• Point must be on parabola</p>
                  <p>• Unique tangent at each point</p>
                  <p>• Slope = x₁/(2p)</p>
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
                    Key Property:
                  </span>
                </p>
                <p className="text-sm">
                  Ray parallel to axis reflects through focus
                </p>
                <div className="mt-4 space-y-2 text-sm">
                  <p>• Used in satellite dishes</p>
                  <p>• Car headlights design</p>
                  <p>• Solar concentrators</p>
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
                • <span className="text-emerald-400">Physics:</span> Projectile
                motion trajectories
              </li>
              <li>
                • <span className="text-emerald-400">Engineering:</span> Satellite
                dishes and antennas
              </li>
              <li>
                • <span className="text-emerald-400">Architecture:</span> Arches
                and bridge designs
              </li>
              <li>
                • <span className="text-emerald-400">Optics:</span> Parabolic
                mirrors and reflectors
              </li>
              <li>
                • <span className="text-emerald-400">Automotive:</span> Headlight
                reflectors
              </li>
              <li>
                • <span className="text-emerald-400">Sports:</span> Basketball
                shot trajectories
              </li>
            </ul>
          </div>

          <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-violet-300 mb-4 flex items-center">
              🧮 <span className="ml-2">Problem-Solving Tips</span>
            </h3>
            <ul className="text-gray-300 leading-relaxed space-y-2">
              <li>• Identify vertex position first</li>
              <li>• Determine axis orientation (vertical/horizontal)</li>
              <li>• Find p from coefficient or focus/directrix</li>
              <li>• Vertex form easier for graphing</li>
              <li>• Standard form shows focus clearly</li>
              <li>• Complete the square to convert forms</li>
              <li>• Check opening direction (sign of a or p)</li>
            </ul>
          </div>
        </div>

        {/* Bottom Spacer */}
        <div className="h-12"></div>
      </div>
    </main>
  );
}
