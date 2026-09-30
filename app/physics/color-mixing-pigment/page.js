"use client";

import { useState, useEffect } from "react";

import { Slider } from "@/components/ui/slider2";
import NumberInput from "@/components/NumberInput";

import PhoneScreenBlock from "@/components/phoneScreenBlocker";
import AdBanner from "@/components/AdBanner";

import P5Sketch from "./P5Sketch";

export default function Home() {
  const [cyanIntensity, setCyanIntensity] = useState(255);
  const [magentaIntensity, setMagentaIntensity] = useState(255);
  const [yellowIntensity, setYellowIntensity] = useState(255);

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
              Subtractive Color Mixing (Pigments)
            </h1>
            <div className="vl-meta mt-3">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-pen-blue rounded-full mr-2"></span>
                Cyan Pigment
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-pen-rust rounded-full mr-2"></span>
                Magenta Pigment
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-pen-gold rounded-full mr-2"></span>
                Yellow Pigment
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
                Pigment Intensity Controls
              </h3>

              {/* Horizontal Layout for Sliders */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* Cyan Pigment Control */}
                <div className="space-y-3">
                  <div className="text-center">
                    <label className="text-pen-blue font-medium text-lg">
                      Cyan Pigment
                    </label>
                    <div className="text-ink text-sm mt-1">
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
                    <label className="text-pen-rust font-medium text-lg">
                      Magenta Pigment
                    </label>
                    <div className="text-ink text-sm mt-1">
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
                    <label className="text-pen-gold font-medium text-lg">
                      Yellow Pigment
                    </label>
                    <div className="text-ink text-sm mt-1">
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
        <AdBanner position="bottom" size="responsive" adTest="off" />

        {/* Description */}
        <div className="vl-card p-8">
          <h2 className="vl-h2 mb-4">
            Understanding Subtractive Color Mixing
          </h2>
          <div className="space-y-4 text-ink-2 leading-relaxed">
            <p className="text-lg">
              Subtractive color mixing occurs when pigments, dyes, or paints
              absorb certain wavelengths of light and reflect others. This is
              the principle behind printing, painting, and most physical art
              materials. Unlike light mixing (additive), pigment mixing
              subtracts wavelengths from white light.
            </p>
            <p className="text-lg">
              The three primary colors of pigments are{" "}
              <span className="text-pen-blue font-semibold">Cyan</span>,{" "}
              <span className="text-pen-rust font-semibold">Magenta</span>, and{" "}
              <span className="text-pen-gold font-semibold">Yellow</span>{" "}
              (CMY). When all three are combined at full intensity, they create{" "}
              <span className="text-ink font-semibold bg-card px-1 rounded">
                black
              </span>{" "}
              by absorbing all light.
            </p>
          </div>
        </div>

        {/* Color Mixing Rules */}
        <div className="vl-card p-8">
          <h2 className="vl-h2 mb-6">
            Primary and Secondary Colors (Pigments)
          </h2>

          {/* Primary Colors */}
          <div className="vl-note vl-note-blue p-6 mb-6">
            <h3 className="vl-h3 mb-4">
              Primary Colors (CMY)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="bg-pen-blue/10 border border-pen-blue/30 rounded-lg p-4">
                <div className="w-12 h-12 bg-pen-blue rounded-full mx-auto mb-2"></div>
                <p className="text-pen-blue font-semibold">Cyan</p>
                <p className="text-sm text-ink-2">Absorbs Red Light</p>
              </div>
              <div className="bg-pen-rust/10 border border-pen-rust/30 rounded-lg p-4">
                <div className="w-12 h-12 bg-pen-rust rounded-full mx-auto mb-2"></div>
                <p className="text-pen-rust font-semibold">Magenta</p>
                <p className="text-sm text-ink-2">Absorbs Green Light</p>
              </div>
              <div className="bg-pen-gold/10 border border-pen-gold/30 rounded-lg p-4">
                <div className="w-12 h-12 bg-pen-gold rounded-full mx-auto mb-2"></div>
                <p className="text-pen-gold font-semibold">Yellow</p>
                <p className="text-sm text-ink-2">Absorbs Blue Light</p>
              </div>
            </div>
          </div>

          {/* Secondary Colors */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="vl-note vl-note-blue p-4">
              <h4 className="text-md font-semibold text-pen-blue mb-2">
                Cyan + Magenta = Blue
              </h4>
              <div className="w-12 h-12 bg-pen-blue rounded-full mx-auto mb-2"></div>
              <div className="text-center font-mono text-sm text-ink mb-2">
                Absorbs Red + Green
              </div>
            </div>
            <div className="vl-note vl-note-green p-4">
              <h4 className="text-md font-semibold text-pen-green mb-2">
                Cyan + Yellow = Green
              </h4>
              <div className="w-12 h-12 bg-pen-green rounded-full mx-auto mb-2"></div>
              <div className="text-center font-mono text-sm text-ink mb-2">
                Absorbs Red + Blue
              </div>
            </div>
            <div className="vl-note vl-note-rust p-4">
              <h4 className="text-md font-semibold text-pen-rust mb-2">
                Magenta + Yellow = Red
              </h4>
              <div className="w-12 h-12 bg-pen-rust rounded-full mx-auto mb-2"></div>
              <div className="text-center font-mono text-sm text-ink mb-2">
                Absorbs Green + Blue
              </div>
            </div>
          </div>
        </div>

        {/* Color Science & Theory */}
        <div className="vl-card p-8">
          <h2 className="vl-h2 mb-6">
            Color Science & Pigment Properties
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Light Absorption */}
            <div className="vl-note vl-note-plum p-6">
              <h3 className="vl-h3 mb-4">
                How Pigments Work
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-pen-blue">Cyan Pigment</span>
                  <span className="text-ink-2">Absorbs Red</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-pen-rust">Magenta Pigment</span>
                  <span className="text-ink-2">Absorbs Green</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-pen-gold">Yellow Pigment</span>
                  <span className="text-ink-2">Absorbs Blue</span>
                </div>
              </div>
            </div>

            {/* CMY Color Model */}
            <div className="vl-note vl-note-blue p-6">
              <h3 className="vl-h3 mb-4">
                CMY Color Model
              </h3>
              <div className="text-sm text-ink-2 space-y-2">
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
          <div className="vl-card p-6">
            <h3 className="vl-h3 mb-4">
               <span>Art & Design Applications</span>
            </h3>
            <ul className="text-ink-2 leading-relaxed space-y-2">
              <li>
                •{" "}
                <span className="text-pen-green">Traditional Painting:</span>{" "}
                Oil, acrylic, and watercolor paints
              </li>
              <li>
                • <span className="text-pen-green">Digital Art:</span> Color
                theory in design software
              </li>
              <li>
                • <span className="text-pen-green">Textile Dyeing:</span>{" "}
                Fabric and clothing coloration
              </li>
              <li>
                • <span className="text-pen-green">Makeup & Cosmetics:</span>{" "}
                Color correction and blending
              </li>
            </ul>
          </div>

          <div className="vl-card p-6">
            <h3 className="vl-h3 mb-4">
               <span>Printing & Manufacturing</span>
            </h3>
            <ul className="text-ink-2 leading-relaxed space-y-2">
              <li>
                • <span className="text-pen-gold">CMYK Printing:</span>{" "}
                Commercial and home printers
              </li>
              <li>
                • <span className="text-pen-gold">Packaging Design:</span>{" "}
                Product labeling and branding
              </li>
              <li>
                • <span className="text-pen-gold">Automotive Paint:</span> Car
                and vehicle finishes
              </li>
              <li>
                • <span className="text-pen-gold">Food Coloring:</span> Natural
                and artificial dyes
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
