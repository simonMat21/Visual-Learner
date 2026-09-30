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
    <main className="vl-page">
      <PhoneScreenBlock message="Please switch to desktop mode to view this website" />

      {/* Title */}
      <div className="max-w-6xl mx-auto px-8 mb-6">
        <div className="vl-hero">
          <div>
            <h1 className="vl-title text-4xl mb-2">
              Line Equations in Coordinate Geometry
            </h1>
            <div className="vl-meta mt-3">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-pen-blue rounded-full mr-2"></span>
                General Form: Ax + By + C = 0
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-pen-green rounded-full mr-2"></span>
                Slope-Intercept: y = mx + b
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-pen-plum rounded-full mr-2"></span>
                Point-Slope: y - y₁ = m(x - x₁)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Visualization Section */}
      <div className="max-w-6xl mx-auto px-8 mb-12">
        <div className="vl-card p-6">
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

        {/* General Form */}
        <div className="vl-card p-8">
          <h2 className="vl-h2 mb-4">
            General Form of a Line
          </h2>
          <div className="space-y-6 text-ink-2 leading-relaxed">
            <div className="vl-note vl-note-blue p-6">
              <div className="text-center mb-4">
                <h3 className="text-2xl font-bold text-pen-blue mb-2">
                  Ax + By + C = 0
                </h3>
                <p className="text-lg">
                  where A, B, and C are real constants, and A and B are not both
                  zero.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="text-center">
                  <p className="font-semibold text-pen-blue">A ≠ 0, B = 0</p>
                  <p className="text-sm">Vertical Line</p>
                  <p className="text-xs text-ink-3">x = -C/A</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-pen-green">A = 0, B ≠ 0</p>
                  <p className="text-sm">Horizontal Line</p>
                  <p className="text-xs text-ink-3">y = -C/B</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-pen-plum">A ≠ 0, B ≠ 0</p>
                  <p className="text-sm">Oblique Line</p>
                  <p className="text-xs text-ink-3">slope = -A/B</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Line Properties */}
        <div className="vl-card p-8">
          <h2 className="vl-h2 mb-6">
            Key Properties and Formulas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="vl-note vl-note-green p-6">
              <h3 className="vl-h3 mb-4">
                Slope and Intercepts
              </h3>
              <div className="space-y-3 text-ink-2">
                <p>
                  <span className="text-pen-green font-semibold">Slope:</span> m
                  = -A/B (when B ≠ 0)
                </p>
                <p>
                  <span className="text-pen-green font-semibold">
                    X-intercept:
                  </span>{" "}
                  x = -C/A (when A ≠ 0)
                </p>
                <p>
                  <span className="text-pen-green font-semibold">
                    Y-intercept:
                  </span>{" "}
                  y = -C/B (when B ≠ 0)
                </p>
                <p>
                  <span className="text-pen-green font-semibold">
                    Angle with x-axis:
                  </span>{" "}
                  θ = arctan(-A/B)
                </p>
              </div>
            </div>

            <div className="vl-note vl-note-plum p-6">
              <h3 className="vl-h3 mb-4">
                Distance and Normal
              </h3>
              <div className="space-y-3 text-ink-2">
                <p>
                  <span className="text-pen-plum font-semibold">
                    Distance from origin:
                  </span>
                </p>
                <p className="text-center text-lg">d = |C|/√(A² + B²)</p>
                <p>
                  <span className="text-pen-plum font-semibold">
                    Normal vector:
                  </span>{" "}
                  (A, B)
                </p>
                <p>
                  <span className="text-pen-plum font-semibold">
                    Direction vector:
                  </span>{" "}
                  (-B, A)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Distance Between Point and Line */}
        <div className="vl-card p-8">
          <h2 className="vl-h2 mb-6">
            Distance from Point to Line
          </h2>
          <div className="vl-note vl-note-rust p-6">
            <div className="text-center mb-4">
              <h3 className="text-2xl font-bold text-pen-rust mb-2">
                d = |Ax₀ + By₀ + C|/√(A² + B²)
              </h3>
              <p className="text-lg text-ink-2">
                Distance from point (x₀, y₀) to line Ax + By + C = 0
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <h4 className="text-lg font-semibold text-pen-rust mb-2">
                  When to use:
                </h4>
                <ul className="space-y-2 text-ink-2">
                  <li>• Finding shortest distance to a line</li>
                  <li>• Checking if points are equidistant from a line</li>
                  <li>• Determining position relative to a line</li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-pen-rust mb-2">
                  Sign interpretation:
                </h4>
                <ul className="space-y-2 text-ink-2">
                  <li>
                    • <span className="text-pen-green">Positive:</span> Point on
                    one side
                  </li>
                  <li>
                    • <span className="text-pen-rust">Negative:</span> Point on
                    other side
                  </li>
                  <li>
                    • <span className="text-pen-gold">Zero:</span> Point on
                    the line
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Parallel and Perpendicular Lines */}
        <div className="vl-card p-8">
          <h2 className="vl-h2 mb-6">
            Parallel and Perpendicular Lines
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="vl-note vl-note-blue p-6">
              <h3 className="vl-h3 mb-4">
                Parallel Lines
              </h3>
              <div className="space-y-3 text-ink-2">
                <p className="text-lg font-semibold">A₁x + B₁y + C₁ = 0</p>
                <p className="text-lg font-semibold">A₂x + B₂y + C₂ = 0</p>
                <div className="mt-4 p-3 bg-pen-blue/10 rounded">
                  <p className="text-pen-blue font-semibold">
                    Condition for parallel:
                  </p>
                  <p className="text-center text-lg">A₁/A₂ = B₁/B₂ ≠ C₁/C₂</p>
                  <p className="text-sm text-ink-3 mt-2">
                    Same slope, different intercepts
                  </p>
                </div>
              </div>
            </div>

            <div className="vl-note vl-note-rust p-6">
              <h3 className="vl-h3 mb-4">
                Perpendicular Lines
              </h3>
              <div className="space-y-3 text-ink-2">
                <p className="text-lg font-semibold">A₁x + B₁y + C₁ = 0</p>
                <p className="text-lg font-semibold">A₂x + B₂y + C₂ = 0</p>
                <div className="mt-4 p-3 bg-pen-rust/10 rounded">
                  <p className="text-pen-rust font-semibold">
                    Condition for perpendicular:
                  </p>
                  <p className="text-center text-lg">A₁A₂ + B₁B₂ = 0</p>
                  <p className="text-sm text-ink-3 mt-2">
                    Product of slopes = -1
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Different Forms */}
        <div className="vl-card p-8">
          <h2 className="vl-h2 mb-6">
            Different Forms of Line Equations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="vl-note vl-note-gold p-6">
              <h3 className="vl-h3 mb-3">
                Slope-Intercept Form
              </h3>
              <p className="text-xl font-bold text-center mb-2">y = mx + b</p>
              <ul className="text-sm text-ink-2 space-y-1">
                <li>• m = slope</li>
                <li>• b = y-intercept</li>
                <li>• Most common form</li>
              </ul>
            </div>

            <div className="vl-note vl-note-blue p-6">
              <h3 className="vl-h3 mb-3">
                Point-Slope Form
              </h3>
              <p className="text-xl font-bold text-center mb-2">
                y - y₁ = m(x - x₁)
              </p>
              <ul className="text-sm text-ink-2 space-y-1">
                <li>• (x₁, y₁) = known point</li>
                <li>• m = slope</li>
                <li>• Useful for construction</li>
              </ul>
            </div>

            <div className="vl-note vl-note-green p-6">
              <h3 className="vl-h3 mb-3">
                Two-Point Form
              </h3>
              <p className="text-lg font-bold text-center mb-2">
                (y - y₁)/(y₂ - y₁) = (x - x₁)/(x₂ - x₁)
              </p>
              <ul className="text-sm text-ink-2 space-y-1">
                <li>• Two points: (x₁, y₁), (x₂, y₂)</li>
                <li>• Direct from coordinates</li>
              </ul>
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
                • <span className="text-pen-green">Engineering:</span>{" "}
                Structural analysis and design
              </li>
              <li>
                • <span className="text-pen-green">Physics:</span> Motion in
                straight lines
              </li>
              <li>
                • <span className="text-pen-green">Economics:</span> Linear
                regression and trends
              </li>
              <li>
                • <span className="text-pen-green">Computer Graphics:</span>{" "}
                Line rendering
              </li>
            </ul>
          </div>

          <div className="vl-card p-6">
            <h3 className="vl-h3 mb-4">
               <span>Problem-Solving Tips</span>
            </h3>
            <ul className="text-ink-2 leading-relaxed space-y-2">
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
