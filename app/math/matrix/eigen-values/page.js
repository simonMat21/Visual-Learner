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
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent mb-2">
              Eigenvalues & Eigenvectors
            </h1>
            <p className="text-gray-300 text-lg">
              Vectors that don't change direction under transformation.
            </p>
          </div>
        </div>

        {/* Definition */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-orange-300 mb-4 flex items-center">
            <span className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mr-3 text-sm">
              λ
            </span>
            The Eigen Equation
          </h2>
          <div className="space-y-6 text-gray-300 leading-relaxed">
            <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-lg p-6 text-center">
              <h3 className="text-3xl font-bold text-orange-400 mb-2">
                Av = λv
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                <h4 className="font-bold text-orange-300 mb-2">
                  v (Eigenvector)
                </h4>
                <p className="text-sm">
                  A non-zero vector that only gets scaled by the linear
                  transformation A. It does not change direction.
                </p>
              </div>
              <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                <h4 className="font-bold text-red-300 mb-2">λ (Eigenvalue)</h4>
                <p className="text-sm">
                  The scalar factor by which the eigenvector is stretched or
                  shrunk.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Calculation */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-red-300 mb-4">
            How to Find Them
          </h2>
          <p className="text-gray-300 mb-4">
            To find the eigenvalues, we solve the characteristic equation:
          </p>
          <div className="text-center bg-white/5 p-4 rounded-lg border border-white/10 mb-4">
            <p className="text-xl font-mono text-orange-300">det(A - λI) = 0</p>
          </div>
          <p className="text-gray-300">
            Once λ is found, substitute it back into{" "}
            <strong>(A - λI)v = 0</strong> to solve for the eigenvector v.
          </p>
        </div>

        {/* Applications */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-orange-300 mb-4">
            Applications
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
            <li className="flex items-start">
              <span className="mr-2 text-red-400">•</span>
              <span>
                <strong>Google PageRank:</strong> Uses eigenvectors of the web
                graph.
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-red-400">•</span>
              <span>
                <strong>Vibration Analysis:</strong> Natural frequencies of
                bridges/buildings.
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-red-400">•</span>
              <span>
                <strong>Face Recognition:</strong> Eigenfaces in computer
                vision.
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-red-400">•</span>
              <span>
                <strong>Quantum Mechanics:</strong> States and observables.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
