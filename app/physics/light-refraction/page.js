"use client";

import { useState, useEffect } from "react";

import { Slider } from "@/components/ui/slider2";
import NumberInput from "@/components/NumberInput";

import PhoneScreenBlock from "@/components/phoneScreenBlocker";

import P5Sketch from "./P5Sketch";

export default function Home() {
  const [refractiveIndex, setRefractiveIndex] = useState(1.5);

  useEffect(() => {
    window.scrollTo({ top: 50, behavior: "smooth" });
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white pt-5">
      <PhoneScreenBlock message="Please switch to desktop mode to view this website" />

      {/* Visualization Section */}
      <div className="max-w-6xl mx-auto px-8 mb-12">
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex flex-col items-center space-y-6">
            {/* Controls */}
            <div className="w-full max-w-3xl">
              <h3 className="text-xl font-semibold text-center text-white mb-6">
                Refractive Index Control
              </h3>

              {/* Single Refractive Index Slider */}
              <div className="space-y-4">
                <div className="text-center">
                  <label className="text-blue-400 font-medium text-lg">
                    Refractive Index
                  </label>
                  <div className="text-white text-sm mt-1">
                    n = {refractiveIndex.toFixed(2)}
                  </div>
                </div>
                <Slider
                  value={[refractiveIndex]}
                  onValueChange={(value) => setRefractiveIndex(value[0])}
                  min={1.0}
                  max={2.5}
                  step={0.1}
                  className="w-full"
                />
                <div className="text-xs text-gray-400 text-center">
                  Air: 1.0 | Water: 1.33 | Glass: 1.5 | Diamond: 2.42
                </div>
              </div>
            </div>
          </div>
          <P5Sketch refractiveIndex={refractiveIndex} />
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-8 space-y-8">
        {/* Algorithm Info */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
              Light Refraction Through Glass Block
            </h1>
            <div className="inline-flex items-center space-x-4 text-sm bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full px-4 py-2 mt-3 border border-cyan-400/30">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                Incident Ray
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                Refracted Ray
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                Normal Line
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-cyan-300 mb-4 flex items-center">
            <span className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center mr-3 text-sm">
              💡
            </span>
            Understanding Light Refraction
          </h2>
          <div className="space-y-4 text-gray-300 leading-relaxed">
            <p className="text-lg">
              Refraction occurs when light travels from one medium to another
              with a different optical density. The light ray bends due to the
              change in speed as it enters the new medium. This phenomenon is
              governed by Snell's Law.
            </p>
            <p className="text-lg">
              When light enters a denser medium (higher refractive index), it
              slows down and bends toward the normal. When it exits back to a
              less dense medium, it speeds up and bends away from the normal. In
              a rectangular block with parallel surfaces, the exit ray is
              parallel to the incident ray but laterally displaced.
            </p>
          </div>
        </div>

        {/* Snell's Law */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-blue-300 mb-6 flex items-center">
            <span className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3 text-sm">
              📐
            </span>
            Snell's Law of Refraction
          </h2>

          {/* Snell's Law Equation */}
          <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-blue-300 mb-4 text-center">
              Mathematical Relationship
            </h3>
            <div className="text-center text-3xl font-mono text-white mb-4">
              n₁ sin(θ₁) = n₂ sin(θ₂)
            </div>
            <div className="text-sm text-gray-300 space-y-1 text-center">
              <p>• n₁, n₂ = refractive indices of the two media</p>
              <p>• θ₁ = angle of incidence (from normal)</p>
              <p>• θ₂ = angle of refraction (from normal)</p>
            </div>
          </div>

          {/* Key Concepts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-green-500/10 to-teal-500/10 border border-green-500/20 rounded-lg p-4">
              <h4 className="text-md font-semibold text-green-300 mb-2">
                Entering Denser Medium
              </h4>
              <div className="text-sm text-gray-300 space-y-1">
                <p>• Light slows down</p>
                <p>• Bends toward the normal</p>
                <p>• Angle decreases</p>
                <p>• Example: Air → Glass</p>
              </div>
            </div>
            <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg p-4">
              <h4 className="text-md font-semibold text-yellow-300 mb-2">
                Entering Less Dense Medium
              </h4>
              <div className="text-sm text-gray-300 space-y-1">
                <p>• Light speeds up</p>
                <p>• Bends away from normal</p>
                <p>• Angle increases</p>
                <p>• Example: Glass → Air</p>
              </div>
            </div>
          </div>
        </div>

        {/* Refractive Index Values */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-purple-300 mb-6 flex items-center">
            <span className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-3 text-sm">
              🔬
            </span>
            Common Refractive Indices
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Common Materials */}
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-purple-300 mb-4">
                Everyday Materials
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Air (vacuum)</span>
                  <span className="text-white font-mono">1.000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Water</span>
                  <span className="text-white font-mono">1.333</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Crown Glass</span>
                  <span className="text-white font-mono">1.520</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Flint Glass</span>
                  <span className="text-white font-mono">1.620</span>
                </div>
              </div>
            </div>

            {/* Special Materials */}
            <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-indigo-300 mb-4">
                Special Materials
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Ice</span>
                  <span className="text-white font-mono">1.309</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Quartz</span>
                  <span className="text-white font-mono">1.544</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Sapphire</span>
                  <span className="text-white font-mono">1.770</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Diamond</span>
                  <span className="text-white font-mono">2.417</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Applications */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-emerald-300 mb-4 flex items-center">
              🔍 <span className="ml-2">Optical Instruments</span>
            </h3>
            <ul className="text-gray-300 leading-relaxed space-y-2">
              <li>
                • <span className="text-emerald-400">Lenses:</span> Cameras,
                eyeglasses, microscopes
              </li>
              <li>
                • <span className="text-emerald-400">Prisms:</span> Binoculars,
                periscopes, spectroscopy
              </li>
              <li>
                • <span className="text-emerald-400">Fiber Optics:</span>{" "}
                Internet cables, medical endoscopes
              </li>
              <li>
                • <span className="text-emerald-400">Telescopes:</span>{" "}
                Astronomical and terrestrial observation
              </li>
            </ul>
          </div>

          <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-amber-300 mb-4 flex items-center">
              🌈 <span className="ml-2">Natural Phenomena</span>
            </h3>
            <ul className="text-gray-300 leading-relaxed space-y-2">
              <li>
                • <span className="text-amber-400">Rainbows:</span> Dispersion
                in water droplets
              </li>
              <li>
                • <span className="text-amber-400">Mirages:</span> Atmospheric
                refraction effects
              </li>
              <li>
                • <span className="text-amber-400">Swimming Pools:</span>{" "}
                Objects appear closer/shifted
              </li>
              <li>
                • <span className="text-amber-400">Diamonds:</span> Brilliance
                from high refractive index
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Spacer */}
        <div className="h-12"></div>
      </div>
    </main>
  );
}
