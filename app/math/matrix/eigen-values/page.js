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
              Eigenvalues & Eigenvectors
            </h1>
            <p className="text-ink-2 text-lg">
              Vectors that don&apos;t change direction under transformation.
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
            The Eigen Equation
          </h2>
          <div className="space-y-6 text-ink-2 leading-relaxed">
            <div className="vl-note vl-note-rust p-6 text-center">
              <h3 className="text-3xl font-bold text-pen-rust mb-2">
                Av = λv
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="vl-card p-4 rounded-lg">
                <h4 className="font-bold text-pen-rust mb-2">
                  v (Eigenvector)
                </h4>
                <p className="text-sm">
                  A non-zero vector that only gets scaled by the linear
                  transformation A. It does not change direction.
                </p>
              </div>
              <div className="vl-card p-4 rounded-lg">
                <h4 className="font-bold text-pen-rust mb-2">λ (Eigenvalue)</h4>
                <p className="text-sm">
                  The scalar factor by which the eigenvector is stretched or
                  shrunk.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Calculation */}
        <div className="vl-card p-8">
          <h2 className="vl-h2 mb-4">
            How to Find Them
          </h2>
          <p className="text-ink-2 mb-4">
            To find the eigenvalues, we solve the characteristic equation:
          </p>
          <div className="vl-card text-center p-4 rounded-lg mb-4">
            <p className="text-xl font-mono text-pen-rust">det(A - λI) = 0</p>
          </div>
          <p className="text-ink-2">
            Once λ is found, substitute it back into{" "}
            <strong>(A - λI)v = 0</strong> to solve for the eigenvector v.
          </p>
        </div>

        {/* Applications */}
        <div className="vl-card p-8">
          <h2 className="vl-h2 mb-4">
            Applications
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-ink-2">
            <li className="flex items-start">
              <span className="mr-2 text-pen-rust">•</span>
              <span>
                <strong>Google PageRank:</strong> Uses eigenvectors of the web
                graph.
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-pen-rust">•</span>
              <span>
                <strong>Vibration Analysis:</strong> Natural frequencies of
                bridges/buildings.
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-pen-rust">•</span>
              <span>
                <strong>Face Recognition:</strong> Eigenfaces in computer
                vision.
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-pen-rust">•</span>
              <span>
                <strong>Quantum Mechanics:</strong> States and observables.
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
