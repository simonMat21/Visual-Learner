"use client";

import { useState, useEffect } from "react";

import { Slider } from "@/components/ui/slider2";
import NumberInput from "@/components/NumberInput";

import { CodeBlock, TextBox } from "@/components/CodeBlock";
import PhoneScreenBlock from "@/components/phoneScreenBlocker";

import P5Sketch from "./P5Sketch";

export default function Home() {
  const [sliderValue, setSliderValue] = useState([1]);
  const [sliderValue2, setSliderValue2] = useState([1]);
  const [sliderValue3, setSliderValue3] = useState([0.1]);

  useEffect(() => {
    window.scrollTo({ top: 50, behavior: "smooth" });
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white pt-5">
      <PhoneScreenBlock message="Please switch to desktop mode to view this website" />

      {/* Visualization Section */}
      <div className="max-w-6xl mx-auto px-8 mb-12">
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
          <P5Sketch
            k1={sliderValue[0]}
            k2={sliderValue2[0]}
            t={sliderValue3[0]}
          />
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-8 space-y-8">
        {/* Title */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent mb-2">
              Matrix Multiplication
            </h1>
            <p className="text-gray-300 text-lg">
              Combining linear transformations.
            </p>
          </div>
        </div>

        {/* Definition */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-emerald-300 mb-4 flex items-center">
            <span className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center mr-3 text-sm">
              ×
            </span>
            How it Works
          </h2>
          <div className="space-y-6 text-gray-300 leading-relaxed">
            <div className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/20 rounded-lg p-6 text-center">
              <h3 className="text-2xl font-bold text-emerald-400 mb-2">
                C = A × B
              </h3>
              <p className="text-sm text-gray-400">
                Element c_ij is the dot product of Row i of A and Column j of B.
              </p>
            </div>
            <div className="bg-white/5 p-4 rounded-lg border border-white/10">
              <h4 className="font-bold text-green-300 mb-2">
                Dimensionality Rule
              </h4>
              <p className="text-sm">
                If A is size (m × n) and B is size (n × p), then C will be size
                (m × p).
                <br />
                <span className="text-emerald-400 font-semibold">
                  The inner dimensions (n) must match!
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Properties */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-green-300 mb-4">
            Properties
          </h2>
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-start">
              <span className="mr-2 text-emerald-400">⚠</span>
              <span>
                <strong>Not Commutative:</strong> In general, AB ≠ BA. Order
                matters!
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-emerald-400">✓</span>
              <span>
                <strong>Associative:</strong> (AB)C = A(BC).
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-emerald-400">✓</span>
              <span>
                <strong>Distributive:</strong> A(B + C) = AB + AC.
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-emerald-400">✓</span>
              <span>
                <strong>Identity:</strong> AI = IA = A.
              </span>
            </li>
          </ul>
        </div>

        {/* Geometric Interpretation */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-emerald-300 mb-4">
            Geometric Meaning
          </h2>
          <p className="text-gray-300">
            Multiplying matrices corresponds to{" "}
            <strong>composing linear transformations</strong>. If matrix B
            rotates a vector, and matrix A scales it, then AB represents the
            combined operation: rotate then scale.
          </p>
        </div>
      </div>
    </main>
  );
}
