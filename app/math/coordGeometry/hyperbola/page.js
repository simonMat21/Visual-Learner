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
              Hyperbola Equations in Coordinate Geometry
            </h1>
            <div className="vl-meta mt-3">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-pen-rust rounded-full mr-2"></span>
                General Form: Ax² - Cy² + Dx + Ey + F = 0
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-pen-rust rounded-full mr-2"></span>
                Standard Form: (x-h)²/a² - (y-k)²/b² = 1
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
        <AdBanner position="bottom" size="responsive" adTest="off" />

        {/* General Form */}
        <div className="vl-card p-8">
          <h2 className="vl-h2 mb-4">
            General Form of a Hyperbola
          </h2>
          <div className="space-y-6 text-ink-2 leading-relaxed">
            <div className="vl-note vl-note-rust p-6">
              <div className="text-center mb-4">
                <h3 className="text-2xl font-bold text-pen-rust mb-2">
                  Ax² - Cy² + Dx + Ey + F = 0
                </h3>
                <p className="text-lg">
                  where A ≠ 0, C ≠ 0, and A and C have opposite signs for a real
                  hyperbola.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="text-center">
                  <p className="font-semibold text-pen-rust">Center</p>
                  <p className="text-sm">(-D/(2A), -E/(2C))</p>
                  <p className="text-xs text-ink-3">
                    h = -D/(2A), k = -E/(2C)
                  </p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-pen-rust">Semi-axes</p>
                  <p className="text-sm">a² = discriminant/A</p>
                  <p className="text-xs text-ink-3">b² = -discriminant/C</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-pen-gold">Asymptotes</p>
                  <p className="text-sm">y - k = ±(b/a)(x - h)</p>
                  <p className="text-xs text-ink-3">Two diagonal lines</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Standard Form */}
        <div className="vl-card p-8">
          <h2 className="vl-h2 mb-6">
            Standard Form and Orientation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="vl-note vl-note-rust p-6">
              <h3 className="vl-h3 mb-4">
                Horizontal Transverse Axis
              </h3>
              <div className="space-y-3 text-ink-2">
                <div className="text-center mb-4">
                  <p className="text-2xl font-bold text-pen-rust">
                    (x - h)²/a² - (y - k)²/b² = 1
                  </p>
                </div>
                <p>
                  <span className="text-pen-rust font-semibold">Center:</span>{" "}
                  (h, k)
                </p>
                <p>
                  <span className="text-pen-rust font-semibold">
                    Vertices:
                  </span>{" "}
                  (h±a, k)
                </p>
                <p>
                  <span className="text-pen-rust font-semibold">Foci:</span>{" "}
                  (h±c, k)
                </p>
                <p className="text-sm text-ink-3">where c² = a² + b²</p>
              </div>
            </div>

            <div className="vl-note vl-note-blue p-6">
              <h3 className="vl-h3 mb-4">
                Vertical Transverse Axis
              </h3>
              <div className="space-y-3 text-ink-2">
                <div className="text-center mb-4">
                  <p className="text-2xl font-bold text-pen-blue">
                    (y - k)²/a² - (x - h)²/b² = 1
                  </p>
                </div>
                <p>
                  <span className="text-pen-blue font-semibold">Center:</span>{" "}
                  (h, k)
                </p>
                <p>
                  <span className="text-pen-blue font-semibold">Vertices:</span>{" "}
                  (h, k±a)
                </p>
                <p>
                  <span className="text-pen-blue font-semibold">Foci:</span> (h,
                  k±c)
                </p>
                <p className="text-sm text-ink-3">where c² = a² + b²</p>
              </div>
            </div>
          </div>
        </div>

        {/* Eccentricity and Foci */}
        <div className="vl-card p-8">
          <h2 className="vl-h2 mb-6">
            Eccentricity and Foci
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="vl-note vl-note-green p-6">
              <h3 className="vl-h3 mb-4">
                Eccentricity (e)
              </h3>
              <div className="space-y-3 text-ink-2">
                <p className="text-center text-lg font-bold">
                  e = √(1 + b²/a²)
                </p>
                <p className="text-sm">or e = c/a</p>
                <p>
                  <span className="text-pen-green font-semibold">Range:</span> e
                  &gt; 1
                </p>
                <p className="text-xs text-ink-3">
                  Always greater than 1 for hyperbolas
                </p>
              </div>
            </div>

            <div className="vl-note vl-note-gold p-6">
              <h3 className="vl-h3 mb-4">
                Foci Distance
              </h3>
              <div className="space-y-3 text-ink-2">
                <p className="text-center text-lg font-bold">c = √(a² + b²)</p>
                <p className="text-sm">Distance from center to focus</p>
                <p>
                  <span className="text-pen-gold font-semibold">Note:</span> c
                  &gt; a always
                </p>
                <p className="text-xs text-ink-3">
                  Unlike ellipse where c &lt; a
                </p>
              </div>
            </div>

            <div className="vl-note vl-note-rust p-6">
              <h3 className="vl-h3 mb-4">
                Focal Property
              </h3>
              <div className="space-y-3 text-ink-2">
                <p className="text-center text-lg font-bold">|d₁ - d₂| = 2a</p>
                <p>
                  <span className="text-pen-rust font-semibold">Property:</span>{" "}
                  Difference of distances
                </p>
                <p className="text-sm">From any point to foci is constant</p>
                <p className="text-xs text-ink-3">Absolute difference</p>
              </div>
            </div>
          </div>
        </div>

        {/* Asymptotes */}
        <div className="vl-card p-8">
          <h2 className="vl-h2 mb-6">
            Asymptotes
          </h2>
          <div className="vl-note vl-note-plum p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="vl-h3 mb-4">
                  Horizontal Hyperbola
                </h3>
                <div className="space-y-3 text-ink-2">
                  <p className="text-center text-lg font-bold">
                    y - k = ±(b/a)(x - h)
                  </p>
                  <p>
                    <span className="text-pen-plum font-semibold">
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
                <h3 className="vl-h3 mb-4">
                  Vertical Hyperbola
                </h3>
                <div className="space-y-3 text-ink-2">
                  <p className="text-center text-lg font-bold">
                    y - k = ±(a/b)(x - h)
                  </p>
                  <p>
                    <span className="text-pen-plum font-semibold">
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
        <div className="vl-card p-8">
          <h2 className="vl-h2 mb-6">
            Special Cases
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="vl-note vl-note-blue p-6">
              <h3 className="vl-h3 mb-4">
                Rectangular Hyperbola
              </h3>
              <div className="space-y-3 text-ink-2">
                <p className="text-center text-lg font-bold">a = b</p>
                <p>
                  <span className="text-pen-blue font-semibold">Equation:</span>{" "}
                  xy = c²/2
                </p>
                <p className="text-sm">Asymptotes perpendicular</p>
                <p className="text-xs text-ink-3">45° rotated form</p>
              </div>
            </div>

            <div className="vl-note vl-note-green p-6">
              <h3 className="vl-h3 mb-4">
                Centered at Origin
              </h3>
              <div className="space-y-3 text-ink-2">
                <p className="text-center text-lg font-bold">
                  x²/a² - y²/b² = 1
                </p>
                <p>
                  <span className="text-pen-green font-semibold">Center:</span>{" "}
                  (0, 0)
                </p>
                <p className="text-sm">Simplest form</p>
                <p className="text-xs text-ink-3">Most common in problems</p>
              </div>
            </div>

            <div className="vl-note vl-note-gold p-6">
              <h3 className="vl-h3 mb-4">
                Conjugate Hyperbola
              </h3>
              <div className="space-y-3 text-ink-2">
                <p className="text-center text-lg font-bold">
                  -x²/a² + y²/b² = 1
                </p>
                <p>
                  <span className="text-pen-gold font-semibold">
                    Property:
                  </span>{" "}
                  Swapped axes
                </p>
                <p className="text-sm">Same asymptotes</p>
                <p className="text-xs text-ink-3">
                  Perpendicular transverse axes
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Parametric Form */}
        <div className="vl-card p-8">
          <h2 className="vl-h2 mb-6">
            Parametric Form
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="vl-note vl-note-gold p-6">
              <h3 className="vl-h3 mb-3">
                Horizontal Hyperbola
              </h3>
              <div className="space-y-3 text-ink-2">
                <p className="text-center font-bold">x = h + a sec(t)</p>
                <p className="text-center font-bold">y = k + b tan(t)</p>
                <ul className="text-sm space-y-1">
                  <li>• Uses secant and tangent</li>
                  <li>• Parameter t is angle</li>
                  <li>• Traces one branch at a time</li>
                </ul>
              </div>
            </div>

            <div className="vl-note vl-note-green p-6">
              <h3 className="vl-h3 mb-3">
                Alternative Form (Hyperbolic)
              </h3>
              <div className="space-y-3 text-ink-2">
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
          <div className="vl-card p-6">
            <h3 className="vl-h3 mb-4">
               <span>Real-World Applications</span>
            </h3>
            <ul className="text-ink-2 leading-relaxed space-y-2">
              <li>
                • <span className="text-pen-green">Navigation:</span> LORAN
                and GPS positioning systems
              </li>
              <li>
                • <span className="text-pen-green">Physics:</span> Particle
                trajectories and orbits
              </li>
              <li>
                • <span className="text-pen-green">Architecture:</span>{" "}
                Cooling towers and structural design
              </li>
              <li>
                • <span className="text-pen-green">Optics:</span> Hyperbolic
                mirrors and lenses
              </li>
              <li>
                • <span className="text-pen-green">Astronomy:</span> Comet and
                spacecraft trajectories
              </li>
            </ul>
          </div>

          <div className="vl-card p-6">
            <h3 className="vl-h3 mb-4">
               <span>Problem-Solving Tips</span>
            </h3>
            <ul className="text-ink-2 leading-relaxed space-y-2">
              <li>• Check A and C have opposite signs</li>
              <li>• Identify transverse axis orientation</li>
              <li>• Remember: c² = a² + b² (not subtraction!)</li>
              <li>• Asymptotes pass through center</li>
              <li>• Eccentricity e &gt; 1 always</li>
              <li>• Focal property uses difference, not sum</li>
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
        {/* Bottom Spacer */}
        <div className="h-12"></div>
      </div>
    </main>
  );
}
