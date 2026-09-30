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
              Vector Dot Product (Scalar Product)
            </h1>
            <div className="vl-meta mt-3">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-pen-green rounded-full mr-2"></span>
                Result: Scalar (Number)
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-pen-green rounded-full mr-2"></span>
                Commutative: a · b = b · a
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Visualization Section */}
      <div className="max-w-6xl mx-auto px-8 mb-12">
        <div className="vl-card p-6">
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

        {/* Definition */}
        <div className="vl-card p-8">
          <h2 className="vl-h2 mb-4">
            Definition and Formula
          </h2>
          <div className="space-y-6 text-ink-2 leading-relaxed">
            <div className="vl-note vl-note-green p-6">
              <div className="text-center mb-4">
                <h3 className="text-2xl font-bold text-pen-green mb-4">
                  a · b = |a| |b| cos(θ)
                </h3>
                <p className="text-lg mb-6">
                  where θ is the angle between vectors a and b
                </p>
                <h3 className="text-2xl font-bold text-pen-green mb-2">
                  Component Form
                </h3>
                <p className="text-xl">
                  a · b = a₁b₁ + a₂b₂ + a₃b₃ + ... + aₙbₙ
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="text-center">
                  <p className="font-semibold text-pen-green">2D Vectors</p>
                  <p className="text-sm">a · b = a₁b₁ + a₂b₂</p>
                  <p className="text-xs text-ink-3">Two components</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-pen-green">3D Vectors</p>
                  <p className="text-sm">a · b = a₁b₁ + a₂b₂ + a₃b₃</p>
                  <p className="text-xs text-ink-3">Three components</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-pen-blue">Result</p>
                  <p className="text-sm">Always a scalar</p>
                  <p className="text-xs text-ink-3">Not a vector</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Geometric Interpretation */}
        <div className="vl-card p-8">
          <h2 className="vl-h2 mb-6">
            Geometric Interpretation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="vl-note vl-note-green p-6">
              <h3 className="vl-h3 mb-4">
                Projection Interpretation
              </h3>
              <div className="space-y-3 text-ink-2">
                <p className="text-center mb-4">
                  <span className="text-xl font-bold text-pen-green">
                    a · b = |a| × (projection of b onto a)
                  </span>
                </p>
                <p>
                  <span className="text-pen-green font-semibold">
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

            <div className="vl-note vl-note-blue p-6">
              <h3 className="vl-h3 mb-4">
                Angle Between Vectors
              </h3>
              <div className="space-y-3 text-ink-2">
                <p className="text-center mb-4">
                  <span className="text-xl font-bold text-pen-blue">
                    cos(θ) = (a · b) / (|a| |b|)
                  </span>
                </p>
                <p>
                  <span className="text-pen-blue font-semibold">
                    Finding angle:
                  </span>
                </p>
                <p className="text-sm">θ = arccos((a · b) / (|a| |b|))</p>
                <p className="text-xs text-ink-3">
                  Most common use of dot product
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Properties */}
        <div className="vl-card p-8">
          <h2 className="vl-h2 mb-6">
            Properties of Dot Product
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="vl-note vl-note-blue p-6">
              <h3 className="vl-h3 mb-4">
                Commutative
              </h3>
              <div className="space-y-3 text-ink-2">
                <p className="text-center text-lg font-bold">a · b = b · a</p>
                <p className="text-sm">Order doesn&apos;t matter</p>
                <p className="text-xs text-ink-3">Unlike cross product</p>
              </div>
            </div>

            <div className="vl-note vl-note-plum p-6">
              <h3 className="vl-h3 mb-4">
                Distributive
              </h3>
              <div className="space-y-3 text-ink-2">
                <p className="text-center text-lg font-bold">
                  a · (b + c) = a · b + a · c
                </p>
                <p className="text-sm">Distributes over addition</p>
                <p className="text-xs text-ink-3">Very useful property</p>
              </div>
            </div>

            <div className="vl-note vl-note-rust p-6">
              <h3 className="vl-h3 mb-4">
                Scalar Multiplication
              </h3>
              <div className="space-y-3 text-ink-2">
                <p className="text-center text-lg font-bold">
                  (ca) · b = c(a · b)
                </p>
                <p className="text-sm">Scalar can be factored out</p>
                <p className="text-xs text-ink-3">
                  Also: a · (cb) = c(a · b)
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Special Cases */}
        <div className="vl-card p-8">
          <h2 className="vl-h2 mb-6">
            Special Cases
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="vl-note vl-note-gold p-6">
              <h3 className="vl-h3 mb-4">
                Perpendicular Vectors
              </h3>
              <div className="space-y-3 text-ink-2">
                <p className="text-center text-lg font-bold">a · b = 0</p>
                <p>
                  <span className="text-pen-gold font-semibold">When:</span> θ
                  = 90°
                </p>
                <p className="text-sm">Orthogonal vectors</p>
                <p className="text-xs text-ink-3">cos(90°) = 0</p>
              </div>
            </div>

            <div className="vl-note vl-note-green p-6">
              <h3 className="vl-h3 mb-4">
                Parallel Vectors
              </h3>
              <div className="space-y-3 text-ink-2">
                <p className="text-center text-lg font-bold">
                  a · b = ±|a| |b|
                </p>
                <p>
                  <span className="text-pen-green font-semibold">When:</span> θ
                  = 0° or 180°
                </p>
                <p className="text-sm">+ for same direction</p>
                <p className="text-xs text-ink-3">
                  − for opposite direction
                </p>
              </div>
            </div>

            <div className="vl-note vl-note-blue p-6">
              <h3 className="vl-h3 mb-4">
                Dot with Itself
              </h3>
              <div className="space-y-3 text-ink-2">
                <p className="text-center text-lg font-bold">a · a = |a|²</p>
                <p>
                  <span className="text-pen-blue font-semibold">Result:</span>{" "}
                  Square of magnitude
                </p>
                <p className="text-sm">Always positive (unless zero vector)</p>
                <p className="text-xs text-ink-3">θ = 0° with itself</p>
              </div>
            </div>
          </div>
        </div>
        {/* Applications */}
        <div className="vl-card p-8">
          <h2 className="vl-h2 mb-6">
            Common Applications
          </h2>
          <div className="vl-note vl-note-rust p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="vl-h3 mb-4">
                  Finding Angles
                </h3>
                <div className="space-y-3 text-ink-2">
                  <p>
                    <span className="text-pen-rust font-semibold">
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
                <h3 className="vl-h3 mb-4">
                  Testing Orthogonality
                </h3>
                <div className="space-y-3 text-ink-2">
                  <p>
                    <span className="text-pen-rust font-semibold">Test:</span>
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
        <div className="vl-card p-8">
          <h2 className="vl-h2 mb-6">
            Physics: Work and Energy
          </h2>
          <div className="vl-note vl-note-rust p-6">
            <div className="text-center mb-4">
              <h3 className="text-2xl font-bold text-pen-rust mb-2">
                W = F · d
              </h3>
              <p className="text-lg text-ink-2">
                Work = Force · Displacement
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="text-center">
                <p className="font-semibold text-pen-rust">θ = 0°</p>
                <p className="text-sm">Maximum work</p>
                <p className="text-xs text-ink-3">
                  Force in direction of motion
                </p>
              </div>
              <div className="text-center">
                <p className="font-semibold text-pen-rust">θ = 90°</p>
                <p className="text-sm">Zero work</p>
                <p className="text-xs text-ink-3">
                  Force perpendicular to motion
                </p>
              </div>
              <div className="text-center">
                <p className="font-semibold text-pen-gold">θ = 180°</p>
                <p className="text-sm">Negative work</p>
                <p className="text-xs text-ink-3">Force opposes motion</p>
              </div>
            </div>
          </div>
        </div>
        {/* Real World Applications */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="vl-card p-6">
            <h3 className="vl-h3 mb-4">
               <span>Real-World Applications</span>
            </h3>
            <ul className="text-ink-2 leading-relaxed space-y-2">
              <li>
                • <span className="text-pen-green">Computer Graphics:</span>{" "}
                Lighting and shading calculations
              </li>
              <li>
                • <span className="text-pen-green">Physics:</span> Work,
                energy, and power calculations
              </li>
              <li>
                • <span className="text-pen-green">Machine Learning:</span>{" "}
                Similarity measures, cosine similarity
              </li>
              <li>
                • <span className="text-pen-green">Game Development:</span>{" "}
                Collision detection, AI behavior
              </li>
              <li>
                • <span className="text-pen-green">Signal Processing:</span>{" "}
                Correlation and filtering
              </li>
            </ul>
          </div>

          <div className="vl-card p-6">
            <h3 className="vl-h3 mb-4">
               <span>Problem-Solving Tips</span>
            </h3>
            <ul className="text-ink-2 leading-relaxed space-y-2">
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
