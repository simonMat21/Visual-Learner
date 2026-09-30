"use client";

import { useState, useEffect } from "react";

import { Slider } from "@/components/ui/slider2";
import NumberInput from "@/components/NumberInput";

import { CodeBlock, TextBox } from "@/components/CodeBlock";
import PhoneScreenBlock from "@/components/phoneScreenBlocker";
import AdBanner from "@/components/AdBanner";

import P5Sketch from "./P5Sketch";

export default function Home() {
  const [sliderValue, setSliderValue] = useState([1]);
  const [sliderValue2, setSliderValue2] = useState([1]);
  const [sliderValue3, setSliderValue3] = useState([0.1]);

  useEffect(() => {
    window.scrollTo({ top: 50, behavior: "smooth" });
  }, []);

  return (
    <main className="vl-page">
      <PhoneScreenBlock message="Please switch to desktop mode to view this website" />

      {/* Title */}
      <div className="max-w-6xl mx-auto px-8 mb-6">
        <div className="vl-hero">
          <div>
            <h1 className="vl-title text-4xl mb-2">
              Matrix Multiplication
            </h1>
            <p className="text-ink-2 text-lg">
              Combining linear transformations.
            </p>
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

        {/* Definition */}
        <div className="vl-card p-8">
          <h2 className="vl-h2 mb-4">
            How it Works
          </h2>
          <div className="space-y-6 text-ink-2 leading-relaxed">
            <div className="vl-note vl-note-green p-6 text-center">
              <h3 className="text-2xl font-bold text-pen-green mb-2">
                C = A × B
              </h3>
              <p className="text-sm text-ink-3">
                Element c_ij is the dot product of Row i of A and Column j of B.
              </p>
            </div>
            <div className="vl-card p-4 rounded-lg">
              <h4 className="font-bold text-pen-green mb-2">
                Dimensionality Rule
              </h4>
              <p className="text-sm">
                If A is size (m × n) and B is size (n × p), then C will be size
                (m × p).
                <br />
                <span className="text-pen-green font-semibold">
                  The inner dimensions (n) must match!
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Properties */}
        <div className="vl-card p-8">
          <h2 className="vl-h2 mb-4">
            Properties
          </h2>
          <ul className="space-y-3 text-ink-2">
            <li className="flex items-start">
              <span className="mr-2 text-pen-green">⚠</span>
              <span>
                <strong>Not Commutative:</strong> In general, AB ≠ BA. Order
                matters!
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-pen-green">✓</span>
              <span>
                <strong>Associative:</strong> (AB)C = A(BC).
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-pen-green">✓</span>
              <span>
                <strong>Distributive:</strong> A(B + C) = AB + AC.
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-pen-green">✓</span>
              <span>
                <strong>Identity:</strong> AI = IA = A.
              </span>
            </li>
          </ul>
        </div>

        {/* Geometric Interpretation */}
        <div className="vl-card p-8">
          <h2 className="vl-h2 mb-4">
            Geometric Meaning
          </h2>
          <p className="text-ink-2">
            Multiplying matrices corresponds to{" "}
            <strong>composing linear transformations</strong>. If matrix B
            rotates a vector, and matrix A scales it, then AB represents the
            combined operation: rotate then scale.
          </p>
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
