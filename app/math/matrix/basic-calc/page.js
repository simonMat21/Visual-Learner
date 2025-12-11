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
        <AdBanner position="bottom" size="responsive" adTest="off" />

        {/* Title */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent mb-2">
              Basic Matrix Operations
            </h1>
            <p className="text-gray-300 text-lg">
              Fundamental arithmetic for matrices.
            </p>
          </div>
        </div>

        {/* Operations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Addition */}
          <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
            <h2 className="text-2xl font-semibold text-teal-300 mb-4 flex items-center">
              <span className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center mr-3 text-sm">
                +
              </span>
              Addition & Subtraction
            </h2>
            <p className="text-gray-300 mb-4">
              Performed element-wise. Matrices must have the{" "}
              <strong>exact same dimensions</strong>.
            </p>
            <div className="bg-black/30 p-4 rounded-lg font-mono text-sm text-center">
              [A] + [B] = [Aᵢⱼ + Bᵢⱼ]
            </div>
          </div>

          {/* Scalar Mult */}
          <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
            <h2 className="text-2xl font-semibold text-cyan-300 mb-4 flex items-center">
              <span className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center mr-3 text-sm">
                k
              </span>
              Scalar Multiplication
            </h2>
            <p className="text-gray-300 mb-4">
              Multiply every single element in the matrix by a constant number
              (scalar).
            </p>
            <div className="bg-black/30 p-4 rounded-lg font-mono text-sm text-center">
              k · [A] = [k · Aᵢⱼ]
            </div>
          </div>

          {/* Transpose */}
          <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
            <h2 className="text-2xl font-semibold text-teal-300 mb-4 flex items-center">
              <span className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center mr-3 text-sm">
                T
              </span>
              Transpose
            </h2>
            <p className="text-gray-300 mb-4">
              Flip the matrix over its main diagonal. Rows become columns, and
              columns become rows.
            </p>
            <div className="bg-black/30 p-4 rounded-lg font-mono text-sm text-center">
              (Aᵀ)ᵢⱼ = Aⱼᵢ
            </div>
          </div>

          {/* Trace */}
          <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
            <h2 className="text-2xl font-semibold text-cyan-300 mb-4 flex items-center">
              <span className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center mr-3 text-sm">
                tr
              </span>
              Trace
            </h2>
            <p className="text-gray-300 mb-4">
              The sum of the elements on the main diagonal (top-left to
              bottom-right). Only for square matrices.
            </p>
            <div className="bg-black/30 p-4 rounded-lg font-mono text-sm text-center">
              tr(A) = Σ Aᵢᵢ
            </div>
          </div>

          {/* Determinant */}
          <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
            <h2 className="text-2xl font-semibold text-teal-300 mb-4 flex items-center">
              <span className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center mr-3 text-sm">
                det
              </span>
              Determinant
            </h2>
            <p className="text-gray-300 mb-4">
              A scalar value describing the scaling factor of the linear
              transformation. If zero, the matrix is not invertible.
            </p>
            <div className="bg-black/30 p-4 rounded-lg font-mono text-sm text-center">
              det(A) or |A|
            </div>
          </div>

          {/* Adjoint */}
          <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
            <h2 className="text-2xl font-semibold text-cyan-300 mb-4 flex items-center">
              <span className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center mr-3 text-sm">
                adj
              </span>
              Adjoint (Adjugate)
            </h2>
            <p className="text-gray-300 mb-4">
              The transpose of the cofactor matrix. Crucial for finding the
              inverse manually.
            </p>
            <div className="bg-black/30 p-4 rounded-lg font-mono text-sm text-center">
              adj(A) = Cᵀ
            </div>
          </div>

          {/* Inverse */}
          <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8 md:col-span-2">
            <h2 className="text-2xl font-semibold text-teal-300 mb-4 flex items-center">
              <span className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center mr-3 text-sm">
                -1
              </span>
              Inverse
            </h2>
            <p className="text-gray-300 mb-4">
              The matrix that yields the Identity matrix when multiplied with
              the original. Only exists if det(A) ≠ 0.
            </p>
            <div className="bg-black/30 p-4 rounded-lg font-mono text-sm text-center">
              A⁻¹ = (1/|A|) · adj(A)
            </div>
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
