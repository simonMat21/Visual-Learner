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
              Singular Value Decomposition (SVD)
            </h1>
            <p className="text-ink-2 text-lg">
              Factorizing a matrix into rotation and scaling components.
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
            Mathematical Definition
          </h2>
          <div className="space-y-6 text-ink-2 leading-relaxed">
            <div className="vl-note vl-note-blue p-6 text-center">
              <h3 className="text-3xl font-bold text-pen-blue mb-2">
                A = U Σ Vᵀ
              </h3>
              <p className="text-sm text-ink-3">For any m × n matrix A</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="vl-card p-4 rounded-lg">
                <h4 className="font-bold text-pen-blue mb-2">
                  U (Left Singular Vectors)
                </h4>
                <p className="text-sm">
                  An m × m orthogonal matrix. Its columns are eigenvectors of
                  AAᵀ.
                </p>
              </div>
              <div className="vl-card p-4 rounded-lg">
                <h4 className="font-bold text-pen-plum mb-2">
                  Σ (Singular Values)
                </h4>
                <p className="text-sm">
                  An m × n diagonal matrix with non-negative real numbers on the
                  diagonal.
                </p>
              </div>
              <div className="vl-card p-4 rounded-lg">
                <h4 className="font-bold text-pen-blue mb-2">
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
        <div className="vl-card p-8">
          <h2 className="vl-h2 mb-4">
            Geometric Interpretation
          </h2>
          <p className="text-ink-2 mb-4">
            SVD decomposes any linear transformation into three simple steps:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-ink-2 ml-4">
            <li>
              <strong className="text-pen-blue">Rotation (Vᵀ):</strong>{" "}
              Rotates the input vector.
            </li>
            <li>
              <strong className="text-pen-plum">Scaling (Σ):</strong>{" "}
              Stretches or shrinks the vector along the coordinate axes.
            </li>
            <li>
              <strong className="text-pen-blue">Rotation (U):</strong> Rotates
              the result again.
            </li>
          </ol>
        </div>

        {/* Applications */}
        <div className="vl-card p-8">
          <h2 className="vl-h2 mb-4">
            Applications
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-ink-2">
            <li className="flex items-start">
              <span className="mr-2 text-pen-plum">•</span>
              <span>
                <strong>Image Compression:</strong> Approximating an image with
                a lower rank matrix.
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-pen-plum">•</span>
              <span>
                <strong>Dimensionality Reduction (PCA):</strong> Finding the
                most important features in data.
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-pen-plum">•</span>
              <span>
                <strong>Noise Reduction:</strong> Removing small singular values
                that correspond to noise.
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-pen-plum">•</span>
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
