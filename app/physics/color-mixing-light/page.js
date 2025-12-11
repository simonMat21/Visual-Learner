"use client";

import { useState, useEffect } from "react";

import { Slider } from "@/components/ui/slider2";
import NumberInput from "@/components/NumberInput";

import PhoneScreenBlock from "@/components/phoneScreenBlocker";
import AdBanner from "@/components/AdBanner";

import P5Sketch from "./P5Sketch";

export default function Home() {
  const [redIntensity, setRedIntensity] = useState(255);
  const [greenIntensity, setGreenIntensity] = useState(255);
  const [blueIntensity, setBlueIntensity] = useState(255);

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
                Light Intensity Controls
              </h3>

              {/* Horizontal Layout for Sliders */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* Red Light Control */}
                <div className="space-y-3">
                  <div className="text-center">
                    <label className="text-red-400 font-medium text-lg">
                      Red Light
                    </label>
                    <div className="text-white text-sm mt-1">
                      {Math.round(redIntensity / 2.55)}%
                    </div>
                  </div>
                  <Slider
                    value={[redIntensity]}
                    onValueChange={(value) => setRedIntensity(value[0])}
                    min={0}
                    max={255}
                    step={1}
                    className="w-full"
                  />
                </div>

                {/* Green Light Control */}
                <div className="space-y-3">
                  <div className="text-center">
                    <label className="text-green-400 font-medium text-lg">
                      Green Light
                    </label>
                    <div className="text-white text-sm mt-1">
                      {Math.round(greenIntensity / 2.55)}%
                    </div>
                  </div>
                  <Slider
                    value={[greenIntensity]}
                    onValueChange={(value) => setGreenIntensity(value[0])}
                    min={0}
                    max={255}
                    step={1}
                    className="w-full"
                  />
                </div>

                {/* Blue Light Control */}
                <div className="space-y-3">
                  <div className="text-center">
                    <label className="text-blue-400 font-medium text-lg">
                      Blue Light
                    </label>
                    <div className="text-white text-sm mt-1">
                      {Math.round(blueIntensity / 2.55)}%
                    </div>
                  </div>
                  <Slider
                    value={[blueIntensity]}
                    onValueChange={(value) => setBlueIntensity(value[0])}
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
            redIntensity={redIntensity}
            greenIntensity={greenIntensity}
            blueIntensity={blueIntensity}
          />
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-8 space-y-8">
        <AdBanner position="bottom" size="responsive" adTest="off" />
        {/* Algorithm Info */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
              Additive Color Mixing
            </h1>
            <div className="inline-flex items-center space-x-4 text-sm bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full px-4 py-2 mt-3 border border-cyan-400/30">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                Red Light
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                Green Light
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                Blue Light
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
            Understanding Additive Color Mixing
          </h2>
          <div className="space-y-4 text-gray-300 leading-relaxed">
            <p className="text-lg">
              Additive color mixing occurs when different colored lights are
              combined together. This is the principle behind digital displays,
              stage lighting, and LED screens. Unlike mixing paints
              (subtractive), mixing lights adds wavelengths together.
            </p>
            <p className="text-lg">
              The three primary colors of light are{" "}
              <span className="text-red-400 font-semibold">Red</span>,{" "}
              <span className="text-green-400 font-semibold">Green</span>, and{" "}
              <span className="text-blue-400 font-semibold">Blue</span> (RGB).
              When all three are combined at full intensity, they create{" "}
              <span className="text-white font-semibold">white light</span>.
            </p>
          </div>
        </div>

        {/* Color Mixing Rules */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-blue-300 mb-6 flex items-center">
            <span className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3 text-sm">
              🎨
            </span>
            Primary and Secondary Colors
          </h2>

          {/* Primary Colors */}
          <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-blue-300 mb-4">
              Primary Colors (RGB)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
                <div className="w-12 h-12 bg-red-500 rounded-full mx-auto mb-2"></div>
                <p className="text-red-300 font-semibold">Red</p>
                <p className="text-sm text-gray-300">RGB(255, 0, 0)</p>
              </div>
              <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                <div className="w-12 h-12 bg-green-500 rounded-full mx-auto mb-2"></div>
                <p className="text-green-300 font-semibold">Green</p>
                <p className="text-sm text-gray-300">RGB(0, 255, 0)</p>
              </div>
              <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full mx-auto mb-2"></div>
                <p className="text-blue-300 font-semibold">Blue</p>
                <p className="text-sm text-gray-300">RGB(0, 0, 255)</p>
              </div>
            </div>
          </div>

          {/* Secondary Colors */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg p-4">
              <h4 className="text-md font-semibold text-yellow-300 mb-2">
                Red + Green = Yellow
              </h4>
              <div className="w-12 h-12 bg-yellow-400 rounded-full mx-auto mb-2"></div>
              <div className="text-center font-mono text-sm text-white mb-2">
                RGB(255, 255, 0)
              </div>
            </div>
            <div className="bg-gradient-to-r from-cyan-500/10 to-teal-500/10 border border-cyan-500/20 rounded-lg p-4">
              <h4 className="text-md font-semibold text-cyan-300 mb-2">
                Green + Blue = Cyan
              </h4>
              <div className="w-12 h-12 bg-cyan-400 rounded-full mx-auto mb-2"></div>
              <div className="text-center font-mono text-sm text-white mb-2">
                RGB(0, 255, 255)
              </div>
            </div>
            <div className="bg-gradient-to-r from-magenta-500/10 to-pink-500/10 border border-magenta-500/20 rounded-lg p-4">
              <h4 className="text-md font-semibold text-pink-300 mb-2">
                Red + Blue = Magenta
              </h4>
              <div className="w-12 h-12 bg-pink-500 rounded-full mx-auto mb-2"></div>
              <div className="text-center font-mono text-sm text-white mb-2">
                RGB(255, 0, 255)
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
            Color Science & Light Properties
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Light Wavelengths */}
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-purple-300 mb-4">
                Light Wavelengths
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-red-400">Red Light</span>
                  <span className="text-gray-300">620-750 nm</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-green-400">Green Light</span>
                  <span className="text-gray-300">495-570 nm</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-400">Blue Light</span>
                  <span className="text-gray-300">450-495 nm</span>
                </div>
              </div>
            </div>

            {/* RGB Color Model */}
            <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-indigo-300 mb-4">
                RGB Color Model
              </h3>
              <div className="text-sm text-gray-300 space-y-2">
                <p>
                  • <strong>Additive System:</strong> Colors add light
                </p>
                <p>
                  • <strong>8-bit per channel:</strong> 0-255 values
                </p>
                <p>
                  • <strong>16.7 Million Colors:</strong> 256³ combinations
                </p>
                <p>
                  • <strong>Display Technology:</strong> Monitors, TVs, LEDs
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Applications */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-emerald-300 mb-4 flex items-center">
              🖥️ <span className="ml-2">Digital Applications</span>
            </h3>
            <ul className="text-gray-300 leading-relaxed space-y-2">
              <li>
                • <span className="text-emerald-400">Computer Monitors:</span>{" "}
                LCD, OLED, LED displays
              </li>
              <li>
                • <span className="text-emerald-400">Television Screens:</span>{" "}
                HDR and color gamuts
              </li>
              <li>
                • <span className="text-emerald-400">Mobile Devices:</span>{" "}
                Smartphone and tablet screens
              </li>
              <li>
                • <span className="text-emerald-400">Digital Cameras:</span>{" "}
                Image sensors and processing
              </li>
            </ul>
          </div>

          <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-amber-300 mb-4 flex items-center">
              🎭 <span className="ml-2">Creative Industries</span>
            </h3>
            <ul className="text-gray-300 leading-relaxed space-y-2">
              <li>
                • <span className="text-amber-400">Stage Lighting:</span>{" "}
                Theater and concert lighting
              </li>
              <li>
                • <span className="text-amber-400">Film Production:</span>{" "}
                Digital cinematography
              </li>
              <li>
                • <span className="text-amber-400">Architecture:</span> LED
                building illumination
              </li>
              <li>
                • <span className="text-amber-400">Gaming:</span> RGB
                peripherals and displays
              </li>
            </ul>
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
