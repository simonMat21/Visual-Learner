"use client";

import { useState, useEffect } from "react";

import { Slider } from "@/components/ui/slider2";
import NumberInput from "@/components/NumberInput";

import PhoneScreenBlock from "@/components/phoneScreenBlocker";

import P5Sketch from "./P5Sketch";

export default function Home() {
  const [cyanIntensity, setCyanIntensity] = useState(255);
  const [magentaIntensity, setMagentaIntensity] = useState(255);
  const [yellowIntensity, setYellowIntensity] = useState(255);

  useEffect(() => {
    window.scrollTo({ top: 50, behavior: "smooth" }); // or 'auto'
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white pt-5">
      <PhoneScreenBlock message="Please switch to desktop mode to view this website" />

      {/* Visualization Section */}
      <div className="max-w-6xl mx-auto px-8 mb-12">
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex flex-col items-center space-y-6">
            {/* Controls */}
            <div className="w-full max-w-5xl">
              <h3 className="text-xl font-semibold text-center text-white mb-6">
                Pigment Intensity Controls
              </h3>

              {/* Horizontal Layout for Sliders */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* Cyan Pigment Control */}
                <div className="space-y-3">
                  <div className="text-center">
                    <label className="text-cyan-400 font-medium text-lg">
                      Cyan Pigment
                    </label>
                    <div className="text-white text-sm mt-1">
                      {Math.round(cyanIntensity / 2.55)}%
                    </div>
                  </div>
                  <Slider
                    value={[cyanIntensity]}
                    onValueChange={(value) => setCyanIntensity(value[0])}
                    min={0}
                    max={255}
                    step={1}
                    className="w-full"
                  />
                </div>

                {/* Magenta Pigment Control */}
                <div className="space-y-3">
                  <div className="text-center">
                    <label className="text-pink-400 font-medium text-lg">
                      Magenta Pigment
                    </label>
                    <div className="text-white text-sm mt-1">
                      {Math.round(magentaIntensity / 2.55)}%
                    </div>
                  </div>
                  <Slider
                    value={[magentaIntensity]}
                    onValueChange={(value) => setMagentaIntensity(value[0])}
                    min={0}
                    max={255}
                    step={1}
                    className="w-full"
                  />
                </div>

                {/* Yellow Pigment Control */}
                <div className="space-y-3">
                  <div className="text-center">
                    <label className="text-yellow-400 font-medium text-lg">
                      Yellow Pigment
                    </label>
                    <div className="text-white text-sm mt-1">
                      {Math.round(yellowIntensity / 2.55)}%
                    </div>
                  </div>
                  <Slider
                    value={[yellowIntensity]}
                    onValueChange={(value) => setYellowIntensity(value[0])}
                    min={0}
                    max={255}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>
          <P5Sketch
            cyanIntensity={cyanIntensity}
            magentaIntensity={magentaIntensity}
            yellowIntensity={yellowIntensity}
          />
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-8 space-y-8">
        {/* Algorithm Info */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
              Subtractive Color Mixing (Pigments)
            </h1>
            <div className="inline-flex items-center space-x-4 text-sm bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full px-4 py-2 mt-3 border border-cyan-400/30">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-cyan-400 rounded-full mr-2"></span>
                Cyan Pigment
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-pink-400 rounded-full mr-2"></span>
                Magenta Pigment
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                Yellow Pigment
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
            Understanding Subtractive Color Mixing
          </h2>
          <div className="space-y-4 text-gray-300 leading-relaxed">
            <p className="text-lg">
              Subtractive color mixing occurs when pigments, dyes, or paints
              absorb certain wavelengths of light and reflect others. This is
              the principle behind printing, painting, and most physical art
              materials. Unlike light mixing (additive), pigment mixing
              subtracts wavelengths from white light.
            </p>
            <p className="text-lg">
              The three primary colors of pigments are{" "}
              <span className="text-cyan-400 font-semibold">Cyan</span>,{" "}
              <span className="text-pink-400 font-semibold">Magenta</span>, and{" "}
              <span className="text-yellow-400 font-semibold">Yellow</span>{" "}
              (CMY). When all three are combined at full intensity, they create{" "}
              <span className="text-gray-800 font-semibold bg-white px-1 rounded">
                black
              </span>{" "}
              by absorbing all light.
            </p>
          </div>
        </div>

        {/* Color Mixing Rules */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-blue-300 mb-6 flex items-center">
            <span className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3 text-sm">
              🎨
            </span>
            Primary and Secondary Colors (Pigments)
          </h2>

          {/* Primary Colors */}
          <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-blue-300 mb-4">
              Primary Colors (CMY)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="bg-cyan-500/20 border border-cyan-500/30 rounded-lg p-4">
                <div className="w-12 h-12 bg-cyan-400 rounded-full mx-auto mb-2"></div>
                <p className="text-cyan-300 font-semibold">Cyan</p>
                <p className="text-sm text-gray-300">Absorbs Red Light</p>
              </div>
              <div className="bg-pink-500/20 border border-pink-500/30 rounded-lg p-4">
                <div className="w-12 h-12 bg-pink-400 rounded-full mx-auto mb-2"></div>
                <p className="text-pink-300 font-semibold">Magenta</p>
                <p className="text-sm text-gray-300">Absorbs Green Light</p>
              </div>
              <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
                <div className="w-12 h-12 bg-yellow-400 rounded-full mx-auto mb-2"></div>
                <p className="text-yellow-300 font-semibold">Yellow</p>
                <p className="text-sm text-gray-300">Absorbs Blue Light</p>
              </div>
            </div>
          </div>

          {/* Secondary Colors */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-lg p-4">
              <h4 className="text-md font-semibold text-blue-300 mb-2">
                Cyan + Magenta = Blue
              </h4>
              <div className="w-12 h-12 bg-blue-500 rounded-full mx-auto mb-2"></div>
              <div className="text-center font-mono text-sm text-white mb-2">
                Absorbs Red + Green
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-500/10 to-teal-500/10 border border-green-500/20 rounded-lg p-4">
              <h4 className="text-md font-semibold text-green-300 mb-2">
                Cyan + Yellow = Green
              </h4>
              <div className="w-12 h-12 bg-green-500 rounded-full mx-auto mb-2"></div>
              <div className="text-center font-mono text-sm text-white mb-2">
                Absorbs Red + Blue
              </div>
            </div>
            <div className="bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-500/20 rounded-lg p-4">
              <h4 className="text-md font-semibold text-red-300 mb-2">
                Magenta + Yellow = Red
              </h4>
              <div className="w-12 h-12 bg-red-500 rounded-full mx-auto mb-2"></div>
              <div className="text-center font-mono text-sm text-white mb-2">
                Absorbs Green + Blue
              </div>
            </div>
          </div>
        </div>

        {/* Color Science & Theory */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-purple-300 mb-6 flex items-center">
            <span className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-3 text-sm">
              �
            </span>
            Color Science & Pigment Properties
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Light Absorption */}
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-purple-300 mb-4">
                How Pigments Work
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-cyan-400">Cyan Pigment</span>
                  <span className="text-gray-300">Absorbs Red</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-pink-400">Magenta Pigment</span>
                  <span className="text-gray-300">Absorbs Green</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-yellow-400">Yellow Pigment</span>
                  <span className="text-gray-300">Absorbs Blue</span>
                </div>
              </div>
            </div>

            {/* CMY Color Model */}
            <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-indigo-300 mb-4">
                CMY Color Model
              </h3>
              <div className="text-sm text-gray-300 space-y-2">
                <p>
                  • <strong>Subtractive System:</strong> Colors absorb light
                </p>
                <p>
                  • <strong>Pigment-based:</strong> Paints, inks, dyes
                </p>
                <p>
                  • <strong>White → Black:</strong> More pigment = darker
                </p>
                <p>
                  • <strong>Print Technology:</strong> CMYK printing
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Applications */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-emerald-300 mb-4 flex items-center">
              🎨 <span className="ml-2">Art & Design Applications</span>
            </h3>
            <ul className="text-gray-300 leading-relaxed space-y-2">
              <li>
                •{" "}
                <span className="text-emerald-400">Traditional Painting:</span>{" "}
                Oil, acrylic, and watercolor paints
              </li>
              <li>
                • <span className="text-emerald-400">Digital Art:</span> Color
                theory in design software
              </li>
              <li>
                • <span className="text-emerald-400">Textile Dyeing:</span>{" "}
                Fabric and clothing coloration
              </li>
              <li>
                • <span className="text-emerald-400">Makeup & Cosmetics:</span>{" "}
                Color correction and blending
              </li>
            </ul>
          </div>

          <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-amber-300 mb-4 flex items-center">
              🖨️ <span className="ml-2">Printing & Manufacturing</span>
            </h3>
            <ul className="text-gray-300 leading-relaxed space-y-2">
              <li>
                • <span className="text-amber-400">CMYK Printing:</span>{" "}
                Commercial and home printers
              </li>
              <li>
                • <span className="text-amber-400">Packaging Design:</span>{" "}
                Product labeling and branding
              </li>
              <li>
                • <span className="text-amber-400">Automotive Paint:</span> Car
                and vehicle finishes
              </li>
              <li>
                • <span className="text-amber-400">Food Coloring:</span> Natural
                and artificial dyes
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
