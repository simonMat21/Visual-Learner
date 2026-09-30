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
    <main className="vl-page">
      <PhoneScreenBlock message="Please switch to desktop mode to view this website" />

      {/* Title */}
      <div className="max-w-6xl mx-auto px-8 mb-6">
        <div className="vl-hero">
          <div>
            <h1 className="vl-title text-4xl mb-2">
              Additive Color Mixing
            </h1>
            <div className="vl-meta mt-3">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-pen-rust rounded-full mr-2"></span>
                Red Light
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-pen-green rounded-full mr-2"></span>
                Green Light
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-pen-blue rounded-full mr-2"></span>
                Blue Light
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Visualization Section */}
      <div className="max-w-6xl mx-auto px-8 mb-12">
        <div className="vl-card p-6">
          <div className="flex flex-col items-center space-y-6">
            {/* Controls */}
            <div className="w-full max-w-5xl">
              <h3 className="text-xl font-semibold text-center text-ink mb-6">
                Light Intensity Controls
              </h3>

              {/* Horizontal Layout for Sliders */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* Red Light Control */}
                <div className="space-y-3">
                  <div className="text-center">
                    <label className="text-pen-rust font-medium text-lg">
                      Red Light
                    </label>
                    <div className="text-ink text-sm mt-1">
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
                    <label className="text-pen-green font-medium text-lg">
                      Green Light
                    </label>
                    <div className="text-ink text-sm mt-1">
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
                    <label className="text-pen-blue font-medium text-lg">
                      Blue Light
                    </label>
                    <div className="text-ink text-sm mt-1">
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

        {/* Description */}
        <div className="vl-card p-8">
          <h2 className="vl-h2 mb-4">
            Understanding Additive Color Mixing
          </h2>
          <div className="space-y-4 text-ink-2 leading-relaxed">
            <p className="text-lg">
              Additive color mixing occurs when different colored lights are
              combined together. This is the principle behind digital displays,
              stage lighting, and LED screens. Unlike mixing paints
              (subtractive), mixing lights adds wavelengths together.
            </p>
            <p className="text-lg">
              The three primary colors of light are{" "}
              <span className="text-pen-rust font-semibold">Red</span>,{" "}
              <span className="text-pen-green font-semibold">Green</span>, and{" "}
              <span className="text-pen-blue font-semibold">Blue</span> (RGB).
              When all three are combined at full intensity, they create{" "}
              <span className="text-ink font-semibold">white light</span>.
            </p>
          </div>
        </div>

        {/* Color Mixing Rules */}
        <div className="vl-card p-8">
          <h2 className="vl-h2 mb-6">
            Primary and Secondary Colors
          </h2>

          {/* Primary Colors */}
          <div className="vl-note vl-note-blue p-6 mb-6">
            <h3 className="vl-h3 mb-4">
              Primary Colors (RGB)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="bg-pen-rust/10 border border-pen-rust/30 rounded-lg p-4">
                <div className="w-12 h-12 bg-pen-rust rounded-full mx-auto mb-2"></div>
                <p className="text-pen-rust font-semibold">Red</p>
                <p className="text-sm text-ink-2">RGB(255, 0, 0)</p>
              </div>
              <div className="bg-pen-green/10 border border-pen-green/30 rounded-lg p-4">
                <div className="w-12 h-12 bg-pen-green rounded-full mx-auto mb-2"></div>
                <p className="text-pen-green font-semibold">Green</p>
                <p className="text-sm text-ink-2">RGB(0, 255, 0)</p>
              </div>
              <div className="bg-pen-blue/10 border border-pen-blue/30 rounded-lg p-4">
                <div className="w-12 h-12 bg-pen-blue rounded-full mx-auto mb-2"></div>
                <p className="text-pen-blue font-semibold">Blue</p>
                <p className="text-sm text-ink-2">RGB(0, 0, 255)</p>
              </div>
            </div>
          </div>

          {/* Secondary Colors */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="vl-note vl-note-gold p-4">
              <h4 className="text-md font-semibold text-pen-gold mb-2">
                Red + Green = Yellow
              </h4>
              <div className="w-12 h-12 bg-pen-gold rounded-full mx-auto mb-2"></div>
              <div className="text-center font-mono text-sm text-ink mb-2">
                RGB(255, 255, 0)
              </div>
            </div>
            <div className="vl-note vl-note-blue p-4">
              <h4 className="text-md font-semibold text-pen-blue mb-2">
                Green + Blue = Cyan
              </h4>
              <div className="w-12 h-12 bg-pen-blue rounded-full mx-auto mb-2"></div>
              <div className="text-center font-mono text-sm text-ink mb-2">
                RGB(0, 255, 255)
              </div>
            </div>
            <div className="vl-note vl-note-rust p-4">
              <h4 className="text-md font-semibold text-pen-rust mb-2">
                Red + Blue = Magenta
              </h4>
              <div className="w-12 h-12 bg-pen-rust rounded-full mx-auto mb-2"></div>
              <div className="text-center font-mono text-sm text-ink mb-2">
                RGB(255, 0, 255)
              </div>
            </div>
          </div>
        </div>

        {/* Color Science & Theory */}
        <div className="vl-card p-8">
          <h2 className="vl-h2 mb-6">
            Color Science & Light Properties
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Light Wavelengths */}
            <div className="vl-note vl-note-plum p-6">
              <h3 className="vl-h3 mb-4">
                Light Wavelengths
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-pen-rust">Red Light</span>
                  <span className="text-ink-2">620-750 nm</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-pen-green">Green Light</span>
                  <span className="text-ink-2">495-570 nm</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-pen-blue">Blue Light</span>
                  <span className="text-ink-2">450-495 nm</span>
                </div>
              </div>
            </div>

            {/* RGB Color Model */}
            <div className="vl-note vl-note-blue p-6">
              <h3 className="vl-h3 mb-4">
                RGB Color Model
              </h3>
              <div className="text-sm text-ink-2 space-y-2">
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
          <div className="vl-card p-6">
            <h3 className="vl-h3 mb-4">
               <span>Digital Applications</span>
            </h3>
            <ul className="text-ink-2 leading-relaxed space-y-2">
              <li>
                • <span className="text-pen-green">Computer Monitors:</span>{" "}
                LCD, OLED, LED displays
              </li>
              <li>
                • <span className="text-pen-green">Television Screens:</span>{" "}
                HDR and color gamuts
              </li>
              <li>
                • <span className="text-pen-green">Mobile Devices:</span>{" "}
                Smartphone and tablet screens
              </li>
              <li>
                • <span className="text-pen-green">Digital Cameras:</span>{" "}
                Image sensors and processing
              </li>
            </ul>
          </div>

          <div className="vl-card p-6">
            <h3 className="vl-h3 mb-4">
               <span>Creative Industries</span>
            </h3>
            <ul className="text-ink-2 leading-relaxed space-y-2">
              <li>
                • <span className="text-pen-gold">Stage Lighting:</span>{" "}
                Theater and concert lighting
              </li>
              <li>
                • <span className="text-pen-gold">Film Production:</span>{" "}
                Digital cinematography
              </li>
              <li>
                • <span className="text-pen-gold">Architecture:</span> LED
                building illumination
              </li>
              <li>
                • <span className="text-pen-gold">Gaming:</span> RGB
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
