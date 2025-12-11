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
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
              Moore-Penrose Pseudo-Inverse
            </h1>
            <p className="text-gray-300 text-lg">
              Generalizing the matrix inverse for non-square matrices.
            </p>
          </div>
        </div>

        {/* Definition */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-cyan-300 mb-4 flex items-center">
            <span className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center mr-3 text-sm">
              †
            </span>
            Definition & Formula
          </h2>
          <div className="space-y-6 text-gray-300 leading-relaxed">
            <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-lg p-6 text-center">
              <h3 className="text-3xl font-bold text-cyan-400 mb-2">
                A⁺ = V Σ⁺ Uᵀ
              </h3>
              <p className="text-sm text-gray-400">
                Computed using SVD components
              </p>
            </div>
            <p>
              The pseudo-inverse A⁺ exists for any matrix, unlike the regular
              inverse which only exists for non-singular square matrices.
            </p>
            <div className="bg-white/5 p-4 rounded-lg border border-white/10">
              <h4 className="font-bold text-blue-300 mb-2">
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
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-blue-300 mb-4">
            Key Properties
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
            <div className="bg-white/5 p-4 rounded-lg border border-white/10">
              <p className="font-mono text-cyan-300">A A⁺ A = A</p>
              <p className="text-sm text-gray-400 mt-1">
                A⁺ acts like a weak inverse.
              </p>
            </div>
            <div className="bg-white/5 p-4 rounded-lg border border-white/10">
              <p className="font-mono text-cyan-300">A⁺ A A⁺ = A⁺</p>
            </div>
            <div className="bg-white/5 p-4 rounded-lg border border-white/10">
              <p className="font-mono text-cyan-300">(A A⁺)ᵀ = A A⁺</p>
              <p className="text-sm text-gray-400 mt-1">A A⁺ is symmetric.</p>
            </div>
            <div className="bg-white/5 p-4 rounded-lg border border-white/10">
              <p className="font-mono text-cyan-300">(A⁺ A)ᵀ = A⁺ A</p>
              <p className="text-sm text-gray-400 mt-1">A⁺ A is symmetric.</p>
            </div>
          </div>
        </div>

        {/* Applications */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-cyan-300 mb-4">
            Applications
          </h2>
          <p className="text-gray-300 mb-4">
            The most common use is solving <strong>Linear Least Squares</strong>{" "}
            problems.
          </p>
          <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-lg p-6">
            <p className="text-lg mb-2">
              Given a system <strong>Ax = b</strong> (where A is not square):
            </p>
            <p className="text-gray-300">
              The solution that minimizes the error ||Ax - b||² is given by:
            </p>
            <p className="text-2xl font-bold text-cyan-400 mt-2 text-center">
              x = A⁺b
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
