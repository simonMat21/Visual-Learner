"use client";

import { useState, useEffect } from "react";

import { Slider } from "@/components/ui/slider2";
import NumberInput from "@/components/NumberInput";

import PhoneScreenBlock from "@/components/phoneScreenBlocker";
import AdBanner from "@/components/AdBanner";

import P5Sketch from "./P5Sketch";

export default function Home() {
  const [AEBool, setAEBool] = useState(true);
  const [addForm, setAddForm] = useState({ val: [], pos: 0, start: false });
  const [animSpd, setAnimSpd] = useState(1);
  const [sliderValue, setSliderValue] = useState([1]); // Add this state
  const [sliderValue2, setSliderValue2] = useState([1]); // Add this state
  const [sliderValue3, setSliderValue3] = useState([0.1]); // Add this state

  const updateForm = (n, key, value) => {
    if (key !== "start" || AEBool) {
      if (n == 1) {
        setAddForm((prev) => ({ ...prev, [key]: value }));
      }
    }
  };

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
              Damping Function
            </h1>
            <div className="vl-meta mt-3">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-pen-blue rounded-full mr-2"></span>
                Oscillatory Motion
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-pen-blue rounded-full mr-2"></span>
                Energy Dissipation
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-pen-green rounded-full mr-2"></span>
                Exponential Decay
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Visualization Section */}
      <div className="max-w-6xl mx-auto px-8 mb-12">
        <div className="vl-card p-6">
          <div className="flex flex-col items-center space-y-6">
            <div className="flex items-center space-x-4">
              <Slider
                value={sliderValue} // Use controlled value
                min={0.1}
                max={2}
                step={0.01}
                onValueChange={(value) => {
                  setSliderValue(value); // Update slider state
                  setAnimSpd(2 - value[0]); // Update animation speed
                }}
                width="w-50"
                label="K1"
                showValue={true}
              />
              <Slider
                value={sliderValue2} // Use controlled value
                min={0.2}
                max={2}
                step={0.01}
                onValueChange={(value) => {
                  setSliderValue2(value); // Update slider state
                  setAnimSpd(2 - value[0]); // Update animation speed
                }}
                width="w-50"
                label="K2"
                showValue={true}
              />
              <Slider
                value={sliderValue3} // Use controlled value
                min={0.01}
                max={0.7}
                step={0.001}
                onValueChange={(value) => {
                  setSliderValue3(value); // Update slider state
                  setAnimSpd(2 - value[0]); // Update animation speed
                }}
                width="w-50"
                label="t"
                showValue={true}
              />
            </div>
          </div>
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

        {/* Description */}
        <div className="vl-card p-8">
          <h2 className="vl-h2 mb-4">
            Understanding Damping
          </h2>
          <div className="space-y-4 text-ink-2 leading-relaxed">
            <p className="text-lg">
              Damping refers to the gradual reduction of oscillatory motion in
              physical systems due to energy dissipation. In mechanical systems,
              this energy loss occurs through friction, air resistance, or
              internal material properties that convert kinetic energy into
              heat.
            </p>
            <p className="text-lg">
              The damping function describes how the amplitude of oscillation
              decreases over time, following an{" "}
              <span className="text-pen-blue font-semibold">
                exponential decay
              </span>{" "}
              pattern that eventually brings the system to rest.
            </p>
          </div>
        </div>

        {/* Fundamental Equations */}
        <div className="vl-card p-8">
          <h2 className="vl-h2 mb-6">
            Fundamental Equations
          </h2>

          {/* General Damped Harmonic Oscillator */}
          <div className="vl-note vl-note-blue p-6 mb-6">
            <h3 className="vl-h3 mb-4">
              General Damped Harmonic Oscillator
            </h3>
            <div className="text-center text-2xl font-mono text-ink mb-4">
              m(d²x/dt²) + c(dx/dt) + kx = 0
            </div>
            <div className="text-sm text-ink-2 space-y-1">
              <p>• m = mass of the oscillating object</p>
              <p>• c = damping coefficient</p>
              <p>• k = spring constant</p>
              <p>• x = displacement from equilibrium</p>
            </div>
          </div>

          {/* Solution Forms */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="vl-note vl-note-green p-4">
              <h4 className="text-md font-semibold text-pen-green mb-2">
                Underdamped (ζ &lt; 1)
              </h4>
              <div className="text-center font-mono text-sm text-ink mb-2">
                x(t) = Ae^(-ζω₀t)cos(ωₐt + φ)
              </div>
              <div className="text-xs text-ink-2">ωₐ = ω₀√(1 - ζ²)</div>
            </div>
            <div className="vl-note vl-note-gold p-4">
              <h4 className="text-md font-semibold text-pen-gold mb-2">
                Critically Damped (ζ = 1)
              </h4>
              <div className="text-center font-mono text-sm text-ink mb-2">
                x(t) = (A + Bt)e^(-ω₀t)
              </div>
              <div className="text-xs text-ink-2">
                Fastest return to equilibrium
              </div>
            </div>
          </div>
        </div>

        {/* Key Parameters */}
        <div className="vl-card p-8">
          <h2 className="vl-h2 mb-6">
            Key Parameters & Relationships
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Damping Ratio */}
            <div className="vl-note vl-note-plum p-6">
              <h3 className="vl-h3 mb-4">
                Damping Ratio (ζ)
              </h3>
              <div className="text-center text-xl font-mono text-ink mb-3">
                ζ = c/(2√(mk))
              </div>
              <div className="text-sm text-ink-2 space-y-1">
                <p>• ζ &lt; 1: Underdamped (oscillatory)</p>
                <p>• ζ = 1: Critically damped</p>
                <p>• ζ &gt; 1: Overdamped (no oscillation)</p>
              </div>
            </div>

            {/* Natural Frequency */}
            <div className="vl-note vl-note-blue p-6">
              <h3 className="vl-h3 mb-4">
                Natural Frequency
              </h3>
              <div className="text-center text-xl font-mono text-ink mb-3">
                ω₀ = √(k/m)
              </div>
              <div className="text-sm text-ink-2 space-y-1">
                <p>• Frequency without damping</p>
                <p>• Determines oscillation rate</p>
                <p>• Independent of amplitude</p>
              </div>
            </div>
          </div>
        </div>

        {/* Applications */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="vl-card p-6">
            <h3 className="vl-h3 mb-4">
               <span>Engineering Applications</span>
            </h3>
            <ul className="text-ink-2 leading-relaxed space-y-2">
              <li>
                • <span className="text-pen-green">Vehicle Suspension:</span>{" "}
                Shock absorbers and springs
              </li>
              <li>
                • <span className="text-pen-green">Building Design:</span>{" "}
                Earthquake damping systems
              </li>
              <li>
                • <span className="text-pen-green">Mechanical Systems:</span>{" "}
                Vibration control
              </li>
              <li>
                • <span className="text-pen-green">Electronics:</span> RLC
                circuits and filters
              </li>
            </ul>
          </div>

          <div className="vl-card p-6">
            <h3 className="vl-h3 mb-4">
               <span>Physical Examples</span>
            </h3>
            <ul className="text-ink-2 leading-relaxed space-y-2">
              <li>
                • <span className="text-pen-gold">Pendulum:</span> Air
                resistance causes decay
              </li>
              <li>
                • <span className="text-pen-gold">Guitar String:</span> Sound
                gradually fades
              </li>
              <li>
                • <span className="text-pen-gold">Car Door:</span> Closes
                smoothly without bouncing
              </li>
              <li>
                • <span className="text-pen-gold">Seismometer:</span> Measures
                ground motion
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
