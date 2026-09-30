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
              Basic Matrix Operations
            </h1>
            <p className="text-ink-2 text-lg">
              Fundamental arithmetic for matrices.
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

        {/* Operations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Addition */}
          <div className="vl-card p-8">
            <h2 className="vl-h2 mb-4">
              Addition & Subtraction
            </h2>
            <p className="text-ink-2 mb-4">
              Performed element-wise. Matrices must have the{" "}
              <strong>exact same dimensions</strong>.
            </p>
            <div className="bg-paper-2 p-4 rounded-lg font-mono text-sm text-center">
              [A] + [B] = [Aᵢⱼ + Bᵢⱼ]
            </div>
          </div>

          {/* Scalar Mult */}
          <div className="vl-card p-8">
            <h2 className="vl-h2 mb-4">
              Scalar Multiplication
            </h2>
            <p className="text-ink-2 mb-4">
              Multiply every single element in the matrix by a constant number
              (scalar).
            </p>
            <div className="bg-paper-2 p-4 rounded-lg font-mono text-sm text-center">
              k · [A] = [k · Aᵢⱼ]
            </div>
          </div>

          {/* Transpose */}
          <div className="vl-card p-8">
            <h2 className="vl-h2 mb-4">
              Transpose
            </h2>
            <p className="text-ink-2 mb-4">
              Flip the matrix over its main diagonal. Rows become columns, and
              columns become rows.
            </p>
            <div className="bg-paper-2 p-4 rounded-lg font-mono text-sm text-center">
              (Aᵀ)ᵢⱼ = Aⱼᵢ
            </div>
          </div>

          {/* Trace */}
          <div className="vl-card p-8">
            <h2 className="vl-h2 mb-4">
              Trace
            </h2>
            <p className="text-ink-2 mb-4">
              The sum of the elements on the main diagonal (top-left to
              bottom-right). Only for square matrices.
            </p>
            <div className="bg-paper-2 p-4 rounded-lg font-mono text-sm text-center">
              tr(A) = Σ Aᵢᵢ
            </div>
          </div>

          {/* Determinant */}
          <div className="vl-card p-8">
            <h2 className="vl-h2 mb-4">
              Determinant
            </h2>
            <p className="text-ink-2 mb-4">
              A scalar value describing the scaling factor of the linear
              transformation. If zero, the matrix is not invertible.
            </p>
            <div className="bg-paper-2 p-4 rounded-lg font-mono text-sm text-center">
              det(A) or |A|
            </div>
          </div>

          {/* Adjoint */}
          <div className="vl-card p-8">
            <h2 className="vl-h2 mb-4">
              Adjoint (Adjugate)
            </h2>
            <p className="text-ink-2 mb-4">
              The transpose of the cofactor matrix. Crucial for finding the
              inverse manually.
            </p>
            <div className="bg-paper-2 p-4 rounded-lg font-mono text-sm text-center">
              adj(A) = Cᵀ
            </div>
          </div>

          {/* Inverse */}
          <div className="vl-card p-8 md:col-span-2">
            <h2 className="vl-h2 mb-4">
              Inverse
            </h2>
            <p className="text-ink-2 mb-4">
              The matrix that yields the Identity matrix when multiplied with
              the original. Only exists if det(A) ≠ 0.
            </p>
            <div className="bg-paper-2 p-4 rounded-lg font-mono text-sm text-center">
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
