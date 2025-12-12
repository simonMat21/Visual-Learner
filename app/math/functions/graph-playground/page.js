"use client";

import { useState, useEffect } from "react";

import { Slider } from "@/components/ui/slider2";
import NumberInput from "@/components/NumberInput";
import { Input } from "@/components/ui/input";
import { Info } from "lucide-react";

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
  const [functionStr, setFunctionStr] = useState("sin(x)");

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
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <label className="block text-sm font-medium text-gray-300">
                Function Equation (in terms of x)
              </label>
              <div className="relative group">
                <Info className="w-4 h-4 text-gray-400 cursor-help" />
                <div className="absolute left-0 top-full mt-2 hidden group-hover:block w-64 p-3 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50 text-xs text-gray-300">
                  <p className="font-semibold mb-2 text-blue-300">
                    Allowed Math Functions:
                  </p>
                  <p className="leading-relaxed">
                    abs, acos, asin, atan, ceil, cos, exp, floor, log, max, min,
                    pow, random, round, sign, sin, sqrt, tan, trunc
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-300 font-mono text-lg">y =</span>
              <Input
                type="text"
                value={functionStr}
                onChange={(e) => setFunctionStr(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white font-mono"
                placeholder="e.g. sin(x), x*x, floor(x)"
              />
            </div>
          </div>
          <P5Sketch
            functionStr={functionStr}
            k1={sliderValue[0]}
            k2={sliderValue2[0]}
            t={sliderValue3[0]}
          />
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-8 space-y-8">
        <AdBanner position="bottom" size="responsive" adTest="off" />

        {/* Introduction */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
              The Cartesian Coordinate System
            </h1>
            <p className="text-gray-300 text-lg">
              A system that specifies each point uniquely in a plane by a set of
              numerical coordinates.
            </p>
          </div>
        </div>

        {/* The Basics: Axes and Origin */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-blue-300 mb-4 flex items-center">
            <span className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3 text-sm">
              📍
            </span>
            Axes and Coordinates
          </h2>
          <div className="space-y-6 text-gray-300 leading-relaxed">
            <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-bold text-blue-400 mb-2">
                    The Axes
                  </h3>
                  <ul className="space-y-2">
                    <li>
                      •{" "}
                      <span className="font-semibold text-white">X-Axis:</span>{" "}
                      The horizontal number line.
                    </li>
                    <li>
                      •{" "}
                      <span className="font-semibold text-white">Y-Axis:</span>{" "}
                      The vertical number line.
                    </li>
                    <li>
                      •{" "}
                      <span className="font-semibold text-white">
                        Origin (0,0):
                      </span>{" "}
                      The point where the axes intersect.
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-cyan-400 mb-2">
                    Coordinates (x, y)
                  </h3>
                  <p className="mb-2">
                    Every point is defined by an ordered pair:
                  </p>
                  <ul className="space-y-2">
                    <li>
                      •{" "}
                      <span className="font-semibold text-white">
                        x-coordinate (Abscissa):
                      </span>{" "}
                      Distance from the y-axis.
                    </li>
                    <li>
                      •{" "}
                      <span className="font-semibold text-white">
                        y-coordinate (Ordinate):
                      </span>{" "}
                      Distance from the x-axis.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quadrants */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-purple-300 mb-6 flex items-center">
            <span className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-3 text-sm">
              ◰
            </span>
            The Four Quadrants
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-lg p-4 text-center">
              <h3 className="text-lg font-bold text-green-400 mb-2">
                Quadrant I
              </h3>
              <p className="text-2xl mb-2">(+, +)</p>
              <p className="text-sm text-gray-400">Top Right</p>
              <p className="text-xs text-gray-500 mt-1">x &gt; 0, y &gt; 0</p>
            </div>
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-lg p-4 text-center">
              <h3 className="text-lg font-bold text-yellow-400 mb-2">
                Quadrant II
              </h3>
              <p className="text-2xl mb-2">(-, +)</p>
              <p className="text-sm text-gray-400">Top Left</p>
              <p className="text-xs text-gray-500 mt-1">x &lt; 0, y &gt; 0</p>
            </div>
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-lg p-4 text-center">
              <h3 className="text-lg font-bold text-red-400 mb-2">
                Quadrant III
              </h3>
              <p className="text-2xl mb-2">(-, -)</p>
              <p className="text-sm text-gray-400">Bottom Left</p>
              <p className="text-xs text-gray-500 mt-1">x &lt; 0, y &lt; 0</p>
            </div>
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-lg p-4 text-center">
              <h3 className="text-lg font-bold text-blue-400 mb-2">
                Quadrant IV
              </h3>
              <p className="text-2xl mb-2">(+, -)</p>
              <p className="text-sm text-gray-400">Bottom Right</p>
              <p className="text-xs text-gray-500 mt-1">x &gt; 0, y &lt; 0</p>
            </div>
          </div>
        </div>

        {/* Essential Formulas */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-green-300 mb-6 flex items-center">
            <span className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3 text-sm">
              📐
            </span>
            Essential Formulas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-green-300 mb-4">
                Distance Formula
              </h3>
              <p className="text-gray-300 mb-4">
                Calculates the length of the line segment connecting two points.
              </p>
              <div className="bg-black/30 p-4 rounded-lg text-center font-mono text-lg text-green-400">
                d = √((x₂ - x₁)² + (y₂ - y₁)²)
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-purple-300 mb-4">
                Midpoint Formula
              </h3>
              <p className="text-gray-300 mb-4">
                Finds the center point exactly halfway between two points.
              </p>
              <div className="bg-black/30 p-4 rounded-lg text-center font-mono text-lg text-purple-400">
                M = ((x₁ + x₂)/2, (y₁ + y₂)/2)
              </div>
            </div>
          </div>
        </div>

        {/* Applications */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-emerald-300 mb-4 flex items-center">
              🌍 <span className="ml-2">Real-World Applications</span>
            </h3>
            <ul className="text-gray-300 leading-relaxed space-y-2">
              <li>
                • <span className="text-emerald-400">GPS & Navigation:</span>{" "}
                Latitude and Longitude are essentially coordinates on a sphere.
              </li>
              <li>
                • <span className="text-emerald-400">Computer Graphics:</span>{" "}
                Every pixel on your screen is a coordinate (x, y).
              </li>
              <li>
                • <span className="text-emerald-400">Data Science:</span>{" "}
                Scatter plots visualize relationships between two variables.
              </li>
              <li>
                • <span className="text-emerald-400">Robotics:</span> Defining
                position and movement paths in space.
              </li>
            </ul>
          </div>

          <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-violet-300 mb-4 flex items-center">
              💡 <span className="ml-2">Did You Know?</span>
            </h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              The system is named after <strong>René Descartes</strong>, a
              French mathematician and philosopher. Legend has it he came up
              with the idea while watching a fly crawl on his ceiling and
              realizing he could describe its position by its distance from the
              walls.
            </p>
            <p className="text-gray-400 italic text-sm">
              "I think, therefore I am." - René Descartes
            </p>
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
