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
              Moore-Penrose Pseudo-Inverse
            </h1>
            <p className="text-ink-2 text-lg">
              Generalizing the matrix inverse for non-square matrices.
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
            Definition & Formula
          </h2>
          <div className="space-y-6 text-ink-2 leading-relaxed">
            <div className="vl-note vl-note-blue p-6 text-center">
              <h3 className="text-3xl font-bold text-pen-blue mb-2">
                A⁺ = V Σ⁺ Uᵀ
              </h3>
              <p className="text-sm text-ink-3">
                Computed using SVD components
              </p>
            </div>
            <p>
              The pseudo-inverse A⁺ exists for any matrix, unlike the regular
              inverse which only exists for non-singular square matrices.
            </p>
            <div className="vl-card p-4 rounded-lg">
              <h4 className="font-bold text-pen-blue mb-2">
                How to compute Σ⁺?
              </h4>
              <p className="text-sm">
                Take the reciprocal of each non-zero singular value in Σ, and
                transpose the resulting matrix. Zero singular values remain
                zero.
              </p>
            </div>
          </div>
        </div>

        {/* Properties */}
        <div className="vl-card p-8">
          <h2 className="vl-h2 mb-4">
            Key Properties
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-ink-2">
            <div className="vl-card p-4 rounded-lg">
              <p className="font-mono text-pen-blue">A A⁺ A = A</p>
              <p className="text-sm text-ink-3 mt-1">
                A⁺ acts like a weak inverse.
              </p>
            </div>
            <div className="vl-card p-4 rounded-lg">
              <p className="font-mono text-pen-blue">A⁺ A A⁺ = A⁺</p>
            </div>
            <div className="vl-card p-4 rounded-lg">
              <p className="font-mono text-pen-blue">(A A⁺)ᵀ = A A⁺</p>
              <p className="text-sm text-ink-3 mt-1">A A⁺ is symmetric.</p>
            </div>
            <div className="vl-card p-4 rounded-lg">
              <p className="font-mono text-pen-blue">(A⁺ A)ᵀ = A⁺ A</p>
              <p className="text-sm text-ink-3 mt-1">A⁺ A is symmetric.</p>
            </div>
          </div>
        </div>

        {/* Applications */}
        <div className="vl-card p-8">
          <h2 className="vl-h2 mb-4">
            Applications
          </h2>
          <p className="text-ink-2 mb-4">
            The most common use is solving <strong>Linear Least Squares</strong>{" "}
            problems.
          </p>
          <div className="vl-note vl-note-blue p-6">
            <p className="text-lg mb-2">
              Given a system <strong>Ax = b</strong> (where A is not square):
            </p>
            <p className="text-ink-2">
              The solution that minimizes the error ||Ax - b||² is given by:
            </p>
            <p className="text-2xl font-bold text-pen-blue mt-2 text-center">
              x = A⁺b
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
