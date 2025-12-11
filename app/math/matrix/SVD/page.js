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
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">
              Singular Value Decomposition (SVD)
            </h1>
            <p className="text-gray-300 text-lg">
              Factorizing a matrix into rotation and scaling components.
            </p>
          </div>
        </div>

        {/* Definition */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-indigo-300 mb-4 flex items-center">
            <span className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center mr-3 text-sm">
              ∑
            </span>
            Mathematical Definition
          </h2>
          <div className="space-y-6 text-gray-300 leading-relaxed">
            <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-lg p-6 text-center">
              <h3 className="text-3xl font-bold text-indigo-400 mb-2">
                A = U Σ Vᵀ
              </h3>
              <p className="text-sm text-gray-400">For any m × n matrix A</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                <h4 className="font-bold text-indigo-300 mb-2">
                  U (Left Singular Vectors)
                </h4>
                <p className="text-sm">
                  An m × m orthogonal matrix. Its columns are eigenvectors of
                  AAᵀ.
                </p>
              </div>
              <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                <h4 className="font-bold text-purple-300 mb-2">
                  Σ (Singular Values)
                </h4>
                <p className="text-sm">
                  An m × n diagonal matrix with non-negative real numbers on the
                  diagonal.
                </p>
              </div>
              <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                <h4 className="font-bold text-indigo-300 mb-2">
                  Vᵀ (Right Singular Vectors)
                </h4>
                <p className="text-sm">
                  The transpose of an n × n orthogonal matrix V. Columns of V
                  are eigenvectors of AᵀA.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Geometric Interpretation */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-purple-300 mb-4">
            Geometric Interpretation
          </h2>
          <p className="text-gray-300 mb-4">
            SVD decomposes any linear transformation into three simple steps:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-gray-300 ml-4">
            <li>
              <strong className="text-indigo-300">Rotation (Vᵀ):</strong>{" "}
              Rotates the input vector.
            </li>
            <li>
              <strong className="text-purple-300">Scaling (Σ):</strong>{" "}
              Stretches or shrinks the vector along the coordinate axes.
            </li>
            <li>
              <strong className="text-indigo-300">Rotation (U):</strong> Rotates
              the result again.
            </li>
          </ol>
        </div>

        {/* Applications */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-indigo-300 mb-4">
            Applications
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
            <li className="flex items-start">
              <span className="mr-2 text-purple-400">•</span>
              <span>
                <strong>Image Compression:</strong> Approximating an image with
                a lower rank matrix.
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-purple-400">•</span>
              <span>
                <strong>Dimensionality Reduction (PCA):</strong> Finding the
                most important features in data.
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-purple-400">•</span>
              <span>
                <strong>Noise Reduction:</strong> Removing small singular values
                that correspond to noise.
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-purple-400">•</span>
              <span>
                <strong>Pseudo-Inverse:</strong> Solving linear systems where A
                is not square.
              </span>
            </li>
          </ul>
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
