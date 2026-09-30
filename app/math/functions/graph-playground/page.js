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
    <main className="vl-page">
      <PhoneScreenBlock message="Please switch to desktop mode to view this website" />

      {/* Title */}
      <div className="max-w-6xl mx-auto px-8 mb-6">
        <div className="vl-hero">
          <div>
            <h1 className="vl-title text-4xl mb-2">
              The Cartesian Coordinate System
            </h1>
            <p className="text-ink-2 text-lg">
              A system that specifies each point uniquely in a plane by a set of
              numerical coordinates.
            </p>
          </div>
        </div>
      </div>

      {/* Visualization Section */}
      <div className="max-w-6xl mx-auto px-8 mb-12">
        <div className="vl-card p-6">
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <label className="block text-sm font-medium text-ink-2">
                Function Equation (in terms of x)
              </label>
              <div className="relative group">
                <Info className="w-4 h-4 text-ink-3 cursor-help" />
                <div className="absolute left-0 top-full mt-2 hidden group-hover:block w-64 p-3 bg-paper-2 border border-rule rounded-lg shadow-xl z-50 text-xs text-ink-2">
                  <p className="font-semibold mb-2 text-pen-blue">
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
              <span className="text-ink-2 font-mono text-lg">y =</span>
              <Input
                type="text"
                value={functionStr}
                onChange={(e) => setFunctionStr(e.target.value)}
                className="bg-paper-2 border-rule text-ink font-mono"
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

        {/* The Basics: Axes and Origin */}
        <div className="vl-card p-8">
          <h2 className="vl-h2 mb-4">
            Axes and Coordinates
          </h2>
          <div className="space-y-6 text-ink-2 leading-relaxed">
            <div className="vl-note vl-note-blue p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-bold text-pen-blue mb-2">
                    The Axes
                  </h3>
                  <ul className="space-y-2">
                    <li>
                      •{" "}
                      <span className="font-semibold text-ink">X-Axis:</span>{" "}
                      The horizontal number line.
                    </li>
                    <li>
                      •{" "}
                      <span className="font-semibold text-ink">Y-Axis:</span>{" "}
                      The vertical number line.
                    </li>
                    <li>
                      •{" "}
                      <span className="font-semibold text-ink">
                        Origin (0,0):
                      </span>{" "}
                      The point where the axes intersect.
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-pen-blue mb-2">
                    Coordinates (x, y)
                  </h3>
                  <p className="mb-2">
                    Every point is defined by an ordered pair:
                  </p>
                  <ul className="space-y-2">
                    <li>
                      •{" "}
                      <span className="font-semibold text-ink">
                        x-coordinate (Abscissa):
                      </span>{" "}
                      Distance from the y-axis.
                    </li>
                    <li>
                      •{" "}
                      <span className="font-semibold text-ink">
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
        <div className="vl-card p-8">
          <h2 className="vl-h2 mb-6">
            The Four Quadrants
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-paper-2 border border-rule rounded-lg p-4 text-center">
              <h3 className="text-lg font-bold text-pen-green mb-2">
                Quadrant I
              </h3>
              <p className="text-2xl mb-2">(+, +)</p>
              <p className="text-sm text-ink-3">Top Right</p>
              <p className="text-xs text-ink-3 mt-1">x &gt; 0, y &gt; 0</p>
            </div>
            <div className="bg-paper-2 border border-rule rounded-lg p-4 text-center">
              <h3 className="text-lg font-bold text-pen-gold mb-2">
                Quadrant II
              </h3>
              <p className="text-2xl mb-2">(-, +)</p>
              <p className="text-sm text-ink-3">Top Left</p>
              <p className="text-xs text-ink-3 mt-1">x &lt; 0, y &gt; 0</p>
            </div>
            <div className="bg-paper-2 border border-rule rounded-lg p-4 text-center">
              <h3 className="text-lg font-bold text-pen-rust mb-2">
                Quadrant III
              </h3>
              <p className="text-2xl mb-2">(-, -)</p>
              <p className="text-sm text-ink-3">Bottom Left</p>
              <p className="text-xs text-ink-3 mt-1">x &lt; 0, y &lt; 0</p>
            </div>
            <div className="bg-paper-2 border border-rule rounded-lg p-4 text-center">
              <h3 className="text-lg font-bold text-pen-blue mb-2">
                Quadrant IV
              </h3>
              <p className="text-2xl mb-2">(+, -)</p>
              <p className="text-sm text-ink-3">Bottom Right</p>
              <p className="text-xs text-ink-3 mt-1">x &gt; 0, y &lt; 0</p>
            </div>
          </div>
        </div>

        {/* Essential Formulas */}
        <div className="vl-card p-8">
          <h2 className="vl-h2 mb-6">
            Essential Formulas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="vl-note vl-note-green p-6">
              <h3 className="vl-h3 mb-4">
                Distance Formula
              </h3>
              <p className="text-ink-2 mb-4">
                Calculates the length of the line segment connecting two points.
              </p>
              <div className="bg-paper-2 p-4 rounded-lg text-center font-mono text-lg text-pen-green">
                d = √((x₂ - x₁)² + (y₂ - y₁)²)
              </div>
            </div>

            <div className="vl-note vl-note-plum p-6">
              <h3 className="vl-h3 mb-4">
                Midpoint Formula
              </h3>
              <p className="text-ink-2 mb-4">
                Finds the center point exactly halfway between two points.
              </p>
              <div className="bg-paper-2 p-4 rounded-lg text-center font-mono text-lg text-pen-plum">
                M = ((x₁ + x₂)/2, (y₁ + y₂)/2)
              </div>
            </div>
          </div>
        </div>

        {/* Applications */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="vl-card p-6">
            <h3 className="vl-h3 mb-4">
               <span>Real-World Applications</span>
            </h3>
            <ul className="text-ink-2 leading-relaxed space-y-2">
              <li>
                • <span className="text-pen-green">GPS & Navigation:</span>{" "}
                Latitude and Longitude are essentially coordinates on a sphere.
              </li>
              <li>
                • <span className="text-pen-green">Computer Graphics:</span>{" "}
                Every pixel on your screen is a coordinate (x, y).
              </li>
              <li>
                • <span className="text-pen-green">Data Science:</span>{" "}
                Scatter plots visualize relationships between two variables.
              </li>
              <li>
                • <span className="text-pen-green">Robotics:</span> Defining
                position and movement paths in space.
              </li>
            </ul>
          </div>

          <div className="vl-card p-6">
            <h3 className="vl-h3 mb-4">
               <span>Did You Know?</span>
            </h3>
            <p className="text-ink-2 leading-relaxed mb-4">
              The system is named after <strong>René Descartes</strong>, a
              French mathematician and philosopher. Legend has it he came up
              with the idea while watching a fly crawl on his ceiling and
              realizing he could describe its position by its distance from the
              walls.
            </p>
            <p className="text-ink-3 italic text-sm">
              &quot;I think, therefore I am.&quot; - René Descartes
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
