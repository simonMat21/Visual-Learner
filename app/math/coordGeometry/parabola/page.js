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
              Parabola Equations in Coordinate Geometry
            </h1>
            <div className="vl-meta mt-3">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-pen-blue rounded-full mr-2"></span>
                General Form: y = ax² + bx + c
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-pen-blue rounded-full mr-2"></span>
                Standard Form: (x-h)² = 4p(y-k)
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
        <AdBanner position="bottom" size="responsive" adTest="off" />

        {/* General Form */}
        <div className="vl-card p-8">
          <h2 className="vl-h2 mb-4">
            General Quadratic Form
          </h2>
          <div className="space-y-6 text-ink-2 leading-relaxed">
            <div className="vl-note vl-note-blue p-6">
              <div className="text-center mb-4">
                <h3 className="text-2xl font-bold text-pen-blue mb-2">
                  y = ax² + bx + c
                </h3>
                <p className="text-lg">
                  where a ≠ 0 (if a = 0, it&apos;s a line, not a parabola)
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="text-center">
                  <p className="font-semibold text-pen-blue">Vertex</p>
                  <p className="text-sm">x = -b/(2a)</p>
                  <p className="text-xs text-ink-3">y = c - b²/(4a)</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-pen-blue">Direction</p>
                  <p className="text-sm">a &gt; 0: opens up</p>
                  <p className="text-xs text-ink-3">a &lt; 0: opens down</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-pen-green">
                    Axis of Symmetry
                  </p>
                  <p className="text-sm">x = -b/(2a)</p>
                  <p className="text-xs text-ink-3">
                    Vertical line through vertex
                  </p>
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
            <div className="vl-note vl-note-blue p-6">
              <h3 className="vl-h3 mb-4">
                Vertical Parabola
              </h3>
              <div className="space-y-3 text-ink-2">
                <div className="text-center mb-4">
                  <p className="text-2xl font-bold text-pen-blue">
                    (x - h)² = 4p(y - k)
                  </p>
                </div>
                <p>
                  <span className="text-pen-blue font-semibold">Vertex:</span>{" "}
                  (h, k)
                </p>
                <p>
                  <span className="text-pen-blue font-semibold">Focus:</span>{" "}
                  (h, k+p)
                </p>
                <p>
                  <span className="text-pen-blue font-semibold">
                    Directrix:
                  </span>{" "}
                  y = k-p
                </p>
                <p className="text-sm">
                  <span className="text-pen-blue">Opens:</span> Up if p &gt; 0,
                  Down if p &lt; 0
                </p>
              </div>
            </div>

            <div className="vl-note vl-note-green p-6">
              <h3 className="vl-h3 mb-4">
                Horizontal Parabola
              </h3>
              <div className="space-y-3 text-ink-2">
                <div className="text-center mb-4">
                  <p className="text-2xl font-bold text-pen-green">
                    (y - k)² = 4p(x - h)
                  </p>
                </div>
                <p>
                  <span className="text-pen-green font-semibold">Vertex:</span>{" "}
                  (h, k)
                </p>
                <p>
                  <span className="text-pen-green font-semibold">Focus:</span>{" "}
                  (h+p, k)
                </p>
                <p>
                  <span className="text-pen-green font-semibold">
                    Directrix:
                  </span>{" "}
                  x = h-p
                </p>
                <p className="text-sm">
                  <span className="text-pen-green">Opens:</span> Right if p &gt;
                  0, Left if p &lt; 0
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Focus and Directrix */}
        <div className="vl-card p-8">
          <h2 className="vl-h2 mb-6">
            Focus and Directrix Properties
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="vl-note vl-note-plum p-6">
              <h3 className="vl-h3 mb-4">
                Definition
              </h3>
              <div className="space-y-3 text-ink-2">
                <p className="text-center text-lg font-bold">d₁ = d₂</p>
                <p>
                  <span className="text-pen-plum font-semibold">
                    Property:
                  </span>{" "}
                  Equal distances
                </p>
                <p className="text-sm">
                  Any point on parabola is equidistant from focus and directrix
                </p>
                <p className="text-xs text-ink-3">Defining property</p>
              </div>
            </div>

            <div className="vl-note vl-note-rust p-6">
              <h3 className="vl-h3 mb-4">
                Focal Parameter (p)
              </h3>
              <div className="space-y-3 text-ink-2">
                <p className="text-center text-lg font-bold">p = distance</p>
                <p className="text-sm">From vertex to focus</p>
                <p>
                  <span className="text-pen-rust font-semibold">Sign:</span>{" "}
                  Determines direction
                </p>
                <p className="text-xs text-ink-3">|p| = focal length</p>
              </div>
            </div>

            <div className="vl-note vl-note-gold p-6">
              <h3 className="vl-h3 mb-4">
                Latus Rectum
              </h3>
              <div className="space-y-3 text-ink-2">
                <p className="text-center text-lg font-bold">Length = 4|p|</p>
                <p>
                  <span className="text-pen-gold font-semibold">
                    Definition:
                  </span>{" "}
                  Chord through focus
                </p>
                <p className="text-sm">Perpendicular to axis</p>
                <p className="text-xs text-ink-3">
                  Measures &quot;width&quot; at focus
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Vertex Form */}
        <div className="vl-card p-8">
          <h2 className="vl-h2 mb-6">
            Vertex Form
          </h2>
          <div className="vl-note vl-note-rust p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="vl-h3 mb-4">
                  Vertical Parabola
                </h3>
                <div className="space-y-3 text-ink-2">
                  <p className="text-center text-lg font-bold">
                    y = a(x - h)² + k
                  </p>
                  <p>
                    <span className="text-pen-rust font-semibold">Vertex:</span>{" "}
                    (h, k)
                  </p>
                  <ul className="space-y-1 text-sm">
                    <li>• a &gt; 0: opens upward</li>
                    <li>• a &lt; 0: opens downward</li>
                    <li>• |a| affects &quot;width&quot;</li>
                    <li>• Relationship: a = 1/(4p)</li>
                  </ul>
                </div>
              </div>
              <div>
                <h3 className="vl-h3 mb-4">
                  Converting Forms
                </h3>
                <div className="space-y-3 text-ink-2">
                  <p>
                    <span className="text-pen-rust font-semibold">
                      Standard → Vertex:
                    </span>
                  </p>
                  <p className="text-sm">Complete the square</p>
                  <p>
                    <span className="text-pen-rust font-semibold">
                      Vertex → Standard:
                    </span>
                  </p>
                  <p className="text-sm">p = 1/(4a)</p>
                  <p className="text-xs text-ink-3 mt-2">
                    Both forms useful for different problems
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Special Cases */}
        <div className="vl-card p-8">
          <h2 className="vl-h2 mb-6">
            Special Cases and Forms
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="vl-note vl-note-rust p-6">
              <h3 className="vl-h3 mb-4">
                Vertex at Origin
              </h3>
              <div className="space-y-3 text-ink-2">
                <p className="text-center text-lg font-bold">x² = 4py</p>
                <p>
                  <span className="text-pen-rust font-semibold">Vertex:</span>{" "}
                  (0, 0)
                </p>
                <p className="text-sm">Simplest form</p>
                <p className="text-xs text-ink-3">Most common in problems</p>
              </div>
            </div>

            <div className="vl-note vl-note-blue p-6">
              <h3 className="vl-h3 mb-4">
                Simple Quadratic
              </h3>
              <div className="space-y-3 text-ink-2">
                <p className="text-center text-lg font-bold">y = x²</p>
                <p>
                  <span className="text-pen-blue font-semibold">
                    Properties:
                  </span>{" "}
                  a = 1, p = 1/4
                </p>
                <p className="text-sm">Focus: (0, 1/4)</p>
                <p className="text-xs text-ink-3">Directrix: y = -1/4</p>
              </div>
            </div>

            <div className="vl-note vl-note-green p-6">
              <h3 className="vl-h3 mb-4">
                General Conic
              </h3>
              <div className="space-y-3 text-ink-2">
                <p className="text-center text-lg font-bold">
                  Ax² + Bxy + Cy²...
                </p>
                <p>
                  <span className="text-pen-green font-semibold">
                    Parabola if:
                  </span>{" "}
                  B² = 4AC
                </p>
                <p className="text-sm">Discriminant test</p>
                <p className="text-xs text-ink-3">Identifies conic type</p>
              </div>
            </div>
          </div>
        </div>

        {/* Parametric and Other Forms */}
        <div className="vl-card p-8">
          <h2 className="vl-h2 mb-6">
            Parametric Form
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="vl-note vl-note-gold p-6">
              <h3 className="vl-h3 mb-3">
                Vertical Parabola (x² = 4py)
              </h3>
              <div className="space-y-3 text-ink-2">
                <p className="text-center font-bold">x = 2pt</p>
                <p className="text-center font-bold">y = pt²</p>
                <ul className="text-sm space-y-1">
                  <li>• Parameter t is real number</li>
                  <li>• Simple to compute</li>
                  <li>• Traces entire parabola</li>
                </ul>
              </div>
            </div>

            <div className="vl-note vl-note-green p-6">
              <h3 className="vl-h3 mb-3">
                Horizontal Parabola (y² = 4px)
              </h3>
              <div className="space-y-3 text-ink-2">
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
        <div className="vl-card p-8">
          <h2 className="vl-h2 mb-6">
            Tangent and Normal Lines
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="vl-note vl-note-rust p-6">
              <h3 className="vl-h3 mb-4">
                Tangent at Point (x₁, y₁)
              </h3>
              <div className="space-y-3 text-ink-2">
                <p>
                  <span className="text-pen-rust font-semibold">
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

            <div className="vl-note vl-note-plum p-6">
              <h3 className="vl-h3 mb-4">
                Reflection Property
              </h3>
              <div className="space-y-3 text-ink-2">
                <p>
                  <span className="text-pen-plum font-semibold">
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
          <div className="vl-card p-6">
            <h3 className="vl-h3 mb-4">
               <span>Real-World Applications</span>
            </h3>
            <ul className="text-ink-2 leading-relaxed space-y-2">
              <li>
                • <span className="text-pen-green">Physics:</span> Projectile
                motion trajectories
              </li>
              <li>
                • <span className="text-pen-green">Engineering:</span>{" "}
                Satellite dishes and antennas
              </li>
              <li>
                • <span className="text-pen-green">Architecture:</span> Arches
                and bridge designs
              </li>
              <li>
                • <span className="text-pen-green">Optics:</span> Parabolic
                mirrors and reflectors
              </li>
              <li>
                • <span className="text-pen-green">Automotive:</span>{" "}
                Headlight reflectors
              </li>
              <li>
                • <span className="text-pen-green">Sports:</span> Basketball
                shot trajectories
              </li>
            </ul>
          </div>

          <div className="vl-card p-6">
            <h3 className="vl-h3 mb-4">
               <span>Problem-Solving Tips</span>
            </h3>
            <ul className="text-ink-2 leading-relaxed space-y-2">
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
        {/* Banner Ad */}
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
