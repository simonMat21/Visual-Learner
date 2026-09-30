"use client";

import { useState, useEffect } from "react";

import { Slider } from "@/components/ui/slider2";
import NumberInput from "@/components/NumberInput";

import PhoneScreenBlock from "@/components/phoneScreenBlocker";
import AdBanner from "@/components/AdBanner";

import P5Sketch from "./P5Sketch";

export default function Home() {
  const [refractiveIndex, setRefractiveIndex] = useState(1.5);

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
              Light Refraction Through Glass Block
            </h1>
            <div className="vl-meta mt-3">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-pen-gold rounded-full mr-2"></span>
                Incident Ray
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-pen-green rounded-full mr-2"></span>
                Refracted Ray
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-pen-rust rounded-full mr-2"></span>
                Normal Line
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
            <div className="w-full max-w-3xl">
              <h3 className="text-xl font-semibold text-center text-ink mb-6">
                Refractive Index Control
              </h3>

              {/* Single Refractive Index Slider */}
              <div className="space-y-4">
                <div className="text-center">
                  <label className="text-pen-blue font-medium text-lg">
                    Refractive Index
                  </label>
                  <div className="text-ink text-sm mt-1">
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
                <div className="text-xs text-ink-3 text-center">
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
        <AdBanner position="bottom" size="responsive" adTest="off" />

        {/* Description */}
        <div className="vl-card p-8">
          <h2 className="vl-h2 mb-4">
            Understanding Light Refraction
          </h2>
          <div className="space-y-4 text-ink-2 leading-relaxed">
            <p className="text-lg">
              Refraction occurs when light travels from one medium to another
              with a different optical density. The light ray bends due to the
              change in speed as it enters the new medium. This phenomenon is
              governed by Snell&apos;s Law.
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

        {/* Snell&apos;s Law */}
        <div className="vl-card p-8">
          <h2 className="vl-h2 mb-6">
            Snell&apos;s Law of Refraction
          </h2>

          {/* Snell&apos;s Law Equation */}
          <div className="vl-note vl-note-blue p-6 mb-6">
            <h3 className="vl-h3 mb-4">
              Mathematical Relationship
            </h3>
            <div className="text-center text-3xl font-mono text-ink mb-4">
              n₁ sin(θ₁) = n₂ sin(θ₂)
            </div>
            <div className="text-sm text-ink-2 space-y-1 text-center">
              <p>• n₁, n₂ = refractive indices of the two media</p>
              <p>• θ₁ = angle of incidence (from normal)</p>
              <p>• θ₂ = angle of refraction (from normal)</p>
            </div>
          </div>

          {/* Key Concepts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="vl-note vl-note-green p-4">
              <h4 className="text-md font-semibold text-pen-green mb-2">
                Entering Denser Medium
              </h4>
              <div className="text-sm text-ink-2 space-y-1">
                <p>• Light slows down</p>
                <p>• Bends toward the normal</p>
                <p>• Angle decreases</p>
                <p>• Example: Air → Glass</p>
              </div>
            </div>
            <div className="vl-note vl-note-gold p-4">
              <h4 className="text-md font-semibold text-pen-gold mb-2">
                Entering Less Dense Medium
              </h4>
              <div className="text-sm text-ink-2 space-y-1">
                <p>• Light speeds up</p>
                <p>• Bends away from normal</p>
                <p>• Angle increases</p>
                <p>• Example: Glass → Air</p>
              </div>
            </div>
          </div>
        </div>

        {/* Refractive Index Values */}
        <div className="vl-card p-8">
          <h2 className="vl-h2 mb-6">
            Common Refractive Indices
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Common Materials */}
            <div className="vl-note vl-note-plum p-6">
              <h3 className="vl-h3 mb-4">
                Everyday Materials
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-ink-2">Air (vacuum)</span>
                  <span className="text-ink font-mono">1.000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-ink-2">Water</span>
                  <span className="text-ink font-mono">1.333</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-ink-2">Crown Glass</span>
                  <span className="text-ink font-mono">1.520</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-ink-2">Flint Glass</span>
                  <span className="text-ink font-mono">1.620</span>
                </div>
              </div>
            </div>

            {/* Special Materials */}
            <div className="vl-note vl-note-blue p-6">
              <h3 className="vl-h3 mb-4">
                Special Materials
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-ink-2">Ice</span>
                  <span className="text-ink font-mono">1.309</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-ink-2">Quartz</span>
                  <span className="text-ink font-mono">1.544</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-ink-2">Sapphire</span>
                  <span className="text-ink font-mono">1.770</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-ink-2">Diamond</span>
                  <span className="text-ink font-mono">2.417</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Applications */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="vl-card p-6">
            <h3 className="vl-h3 mb-4">
               <span>Optical Instruments</span>
            </h3>
            <ul className="text-ink-2 leading-relaxed space-y-2">
              <li>
                • <span className="text-pen-green">Lenses:</span> Cameras,
                eyeglasses, microscopes
              </li>
              <li>
                • <span className="text-pen-green">Prisms:</span> Binoculars,
                periscopes, spectroscopy
              </li>
              <li>
                • <span className="text-pen-green">Fiber Optics:</span>{" "}
                Internet cables, medical endoscopes
              </li>
              <li>
                • <span className="text-pen-green">Telescopes:</span>{" "}
                Astronomical and terrestrial observation
              </li>
            </ul>
          </div>

          <div className="vl-card p-6">
            <h3 className="vl-h3 mb-4">
               <span>Natural Phenomena</span>
            </h3>
            <ul className="text-ink-2 leading-relaxed space-y-2">
              <li>
                • <span className="text-pen-gold">Rainbows:</span> Dispersion
                in water droplets
              </li>
              <li>
                • <span className="text-pen-gold">Mirages:</span> Atmospheric
                refraction effects
              </li>
              <li>
                • <span className="text-pen-gold">Swimming Pools:</span>{" "}
                Objects appear closer/shifted
              </li>
              <li>
                • <span className="text-pen-gold">Diamonds:</span> Brilliance
                from high refractive index
              </li>
            </ul>
          </div>
        </div>
        {/* Banner Ad */}
        <AdBanner
          position="bottom"
          size="responsive"
          adTest="off"
          adSlot="9575932649"
        />

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
