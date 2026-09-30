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
              Vector Addition
            </h1>
            <div className="vl-meta mt-3">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-pen-blue rounded-full mr-2"></span>
                Result: Vector
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-pen-plum rounded-full mr-2"></span>
                Commutative: a + b = b + a
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
            Definition and Component Form
          </h2>
          <div className="space-y-6 text-ink-2 leading-relaxed">
            <div className="vl-note vl-note-blue p-6">
              <div className="text-center mb-4">
                <h3 className="text-2xl font-bold text-pen-blue mb-4">
                  Component-wise Addition
                </h3>
                <p className="text-xl mb-6">
                  a + b = (a₁ + b₁, a₂ + b₂, a₃ + b₃, ..., aₙ + bₙ)
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="text-center">
                  <p className="font-semibold text-pen-blue">2D Vectors</p>
                  <p className="text-sm">(a₁, a₂) + (b₁, b₂)</p>
                  <p className="text-sm">= (a₁+b₁, a₂+b₂)</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-pen-plum">3D Vectors</p>
                  <p className="text-sm">(a₁, a₂, a₃) + (b₁, b₂, b₃)</p>
                  <p className="text-sm">= (a₁+b₁, a₂+b₂, a₃+b₃)</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-pen-blue">Result</p>
                  <p className="text-sm">Always a vector</p>
                  <p className="text-xs text-ink-3">Same dimension</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Geometric Methods */}
        <div className="vl-card p-8">
          <h2 className="vl-h2 mb-6">
            Geometric Methods
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="vl-note vl-note-plum p-6">
              <h3 className="vl-h3 mb-4">
                Triangle Method (Head-to-Tail)
              </h3>
              <div className="space-y-3 text-ink-2">
                <p className="text-sm mb-3">
                  Place the tail of vector{" "}
                  <span className="text-pen-plum font-semibold">b</span> at
                  the head of vector{" "}
                  <span className="text-pen-plum font-semibold">a</span>
                </p>
                <ul className="space-y-2 text-sm">
                  <li>• Draw vector a from origin</li>
                  <li>• Draw vector b starting from end of a</li>
                  <li>• Resultant: from origin to end of b</li>
                  <li>• Most intuitive method</li>
                </ul>
              </div>
            </div>

            <div className="vl-note vl-note-blue p-6">
              <h3 className="vl-h3 mb-4">
                Parallelogram Method
              </h3>
              <div className="space-y-3 text-ink-2">
                <p className="text-sm mb-3">
                  Place both vectors at the{" "}
                  <span className="text-pen-blue font-semibold">
                    same origin
                  </span>
                </p>
                <ul className="space-y-2 text-sm">
                  <li>• Draw both vectors from origin</li>
                  <li>• Complete the parallelogram</li>
                  <li>• Resultant: diagonal from origin</li>
                  <li>• Shows symmetry clearly</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Properties */}
        <div className="vl-card p-8">
          <h2 className="vl-h2 mb-6">
            Properties of Vector Addition
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="vl-note vl-note-blue p-6">
              <h3 className="vl-h3 mb-4">
                Commutative
              </h3>
              <div className="space-y-3 text-ink-2">
                <p className="text-center text-lg font-bold">a + b = b + a</p>
                <p className="text-sm">Order doesn&apos;t matter</p>
                <p className="text-xs text-ink-3">
                  Forms same parallelogram
                </p>
              </div>
            </div>

            <div className="vl-note vl-note-green p-6">
              <h3 className="vl-h3 mb-4">
                Associative
              </h3>
              <div className="space-y-3 text-ink-2">
                <p className="text-center text-lg font-bold">
                  (a + b) + c = a + (b + c)
                </p>
                <p className="text-sm">Grouping doesn&apos;t matter</p>
                <p className="text-xs text-ink-3">
                  Can add multiple vectors
                </p>
              </div>
            </div>

            <div className="vl-note vl-note-rust p-6">
              <h3 className="vl-h3 mb-4">
                Identity Element
              </h3>
              <div className="space-y-3 text-ink-2">
                <p className="text-center text-lg font-bold">a + 0 = a</p>
                <p className="text-sm">Zero vector is identity</p>
                <p className="text-xs text-ink-3">0 = (0, 0, 0, ...)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Vector Subtraction */}
        <div className="vl-card p-8">
          <h2 className="vl-h2 mb-6">
            Vector Subtraction
          </h2>
          <div className="vl-note vl-note-rust p-6">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-pen-rust mb-2">
                a - b = a + (-b)
              </h3>
              <p className="text-lg text-ink-2">
                Subtraction is adding the negative
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="vl-h3 mb-4">
                  Component Form
                </h3>
                <div className="space-y-3 text-ink-2">
                  <p className="text-center font-bold">
                    a - b = (a₁-b₁, a₂-b₂, a₃-b₃)
                  </p>
                  <p className="text-sm">Subtract each component</p>
                </div>
              </div>
              <div>
                <h3 className="vl-h3 mb-4">
                  Geometric Meaning
                </h3>
                <div className="space-y-3 text-ink-2">
                  <p className="text-sm">
                    <span className="text-pen-rust font-semibold">a - b:</span>{" "}
                    Vector from b to a
                  </p>
                  <p className="text-sm">Points from second to first</p>
                  <p className="text-xs text-ink-3">Reverse of b - a</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scalar Multiplication */}
        <div className="vl-card p-8">
          <h2 className="vl-h2 mb-6">
            Scalar Multiplication
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="vl-note vl-note-green p-6">
              <h3 className="vl-h3 mb-4">
                Definition
              </h3>
              <div className="space-y-3 text-ink-2">
                <p className="text-center text-lg font-bold">
                  ca = (ca₁, ca₂, ca₃)
                </p>
                <p>
                  <span className="text-pen-green font-semibold">Effect:</span>{" "}
                  Scales magnitude
                </p>
                <p className="text-sm">Multiply each component by c</p>
              </div>
            </div>

            <div className="vl-note vl-note-gold p-6">
              <h3 className="vl-h3 mb-4">
                Positive Scalar
              </h3>
              <div className="space-y-3 text-ink-2">
                <p className="text-center text-lg font-bold">c &gt; 0</p>
                <p>
                  <span className="text-pen-gold font-semibold">Result:</span>{" "}
                  Same direction
                </p>
                <p className="text-sm">c &gt; 1: longer</p>
                <p className="text-sm">0 &lt; c &lt; 1: shorter</p>
              </div>
            </div>

            <div className="vl-note vl-note-rust p-6">
              <h3 className="vl-h3 mb-4">
                Negative Scalar
              </h3>
              <div className="space-y-3 text-ink-2">
                <p className="text-center text-lg font-bold">c &lt; 0</p>
                <p>
                  <span className="text-pen-rust font-semibold">Result:</span>{" "}
                  Opposite direction
                </p>
                <p className="text-sm">Also scales magnitude</p>
                <p className="text-sm">-1: reverses direction</p>
              </div>
            </div>
          </div>
        </div>

        {/* Linear Combinations */}
        <div className="vl-card p-8">
          <h2 className="vl-h2 mb-6">
            Linear Combinations
          </h2>
          <div className="vl-note vl-note-rust p-6">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-pen-rust mb-2">
                v = c₁a₁ + c₂a₂ + ... + cₙaₙ
              </h3>
              <p className="text-lg text-ink-2">
                Any vector can be expressed as a combination of basis vectors
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="vl-h3 mb-4">
                  Standard Basis (3D)
                </h3>
                <div className="space-y-3 text-ink-2">
                  <p className="text-sm">
                    <span className="text-pen-rust font-semibold">i</span> =
                    (1, 0, 0)
                  </p>
                  <p className="text-sm">
                    <span className="text-pen-rust font-semibold">j</span> =
                    (0, 1, 0)
                  </p>
                  <p className="text-sm">
                    <span className="text-pen-rust font-semibold">k</span> =
                    (0, 0, 1)
                  </p>
                  <p className="text-sm mt-3">v = v₁i + v₂j + v₃k</p>
                </div>
              </div>
              <div>
                <h3 className="vl-h3 mb-4">
                  Applications
                </h3>
                <div className="space-y-2 text-ink-2 text-sm">
                  <p>• Any vector as sum of basis vectors</p>
                  <p>• Coordinate transformations</p>
                  <p>• Linear algebra operations</p>
                  <p>• Vector space theory</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Unit Vectors */}
        <div className="vl-card p-8">
          <h2 className="vl-h2 mb-6">
            Unit Vectors and Normalization
          </h2>
          <div className="vl-note vl-note-gold p-6">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-pen-gold mb-2">
                û = a / |a|
              </h3>
              <p className="text-lg text-ink-2">
                Unit vector has magnitude 1
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="font-semibold text-pen-gold">Definition</p>
                <p className="text-sm">|u| = 1</p>
                <p className="text-xs text-ink-3">Length is exactly 1</p>
              </div>
              <div className="text-center">
                <p className="font-semibold text-pen-rust">Direction</p>
                <p className="text-sm">Same as original</p>
                <p className="text-xs text-ink-3">Only magnitude changes</p>
              </div>
              <div className="text-center">
                <p className="font-semibold text-pen-rust">Usage</p>
                <p className="text-sm">Represents direction only</p>
                <p className="text-xs text-ink-3">Common in graphics</p>
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
                • <span className="text-pen-green">Physics:</span> Force
                composition and net force
              </li>
              <li>
                • <span className="text-pen-green">Navigation:</span> Course
                corrections and displacement
              </li>
              <li>
                • <span className="text-pen-green">Computer Graphics:</span>{" "}
                Object transformations and movement
              </li>
              <li>
                • <span className="text-pen-green">Game Development:</span>{" "}
                Character movement and velocity
              </li>
              <li>
                • <span className="text-pen-green">Robotics:</span> Path
                planning and motion control
              </li>
              <li>
                • <span className="text-pen-green">Engineering:</span> Load
                distribution and structural analysis
              </li>
            </ul>
          </div>

          <div className="vl-card p-6">
            <h3 className="vl-h3 mb-4">
               <span>Problem-Solving Tips</span>
            </h3>
            <ul className="text-ink-2 leading-relaxed space-y-2">
              <li>• Add component by component</li>
              <li>• Use head-to-tail for visualization</li>
              <li>• Break into components for calculation</li>
              <li>• Remember: addition is commutative</li>
              <li>• Use unit vectors for clarity</li>
              <li>• Check dimensions match before adding</li>
              <li>• Result vector starts at origin</li>
            </ul>
          </div>
        </div>
        {/*Banner Ad */}
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
