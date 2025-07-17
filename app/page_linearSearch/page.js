"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

import NumberInput from "../components/NumberInput";
import PhoneScreenBlock from "../components/phoneScreenBlocker";

import P5Sketch from "./P5Sketch";

export default function Home() {
  const [AEBool, setAEBool] = useState(true);
  const [addForm, setAddForm] = useState({ val: [], pos: 0, start: false });
  const [searchForm, setSearchForm] = useState({ val: 0, start: false });
  const [animSpd, setAnimSpd] = useState(1);

  const updateForm = (n, key, value) => {
    if (key !== "start" || AEBool) {
      if (n == 1) {
        setAddForm((prev) => ({ ...prev, [key]: value }));
      } else if (n == 2) {
        setSearchForm((prev) => ({ ...prev, [key]: value }));
      }
    }
  };
  return (
    <main className="main">
      <PhoneScreenBlock message="Please switch to desktop mode to view this website" />
      <h1 className="heading tshad">Algo visuvalizor</h1>
      <div key={1} className="flex items-center gap-2 mb-4 rounded-5">
        <Input
          className="inpbox"
          placeholder="Enter number to search"
          onChange={(e) => updateForm(2, "val", Number(e.target.value))}
        />
        <Button
          onClick={() => {
            updateForm(2, "start", true);
            setTimeout(() => updateForm(2, "start", false), 10);
          }}
          className="dobtn"
        >
          search
        </Button>
      </div>
      <NumberInput
        onSubmit={(arr) => {
          updateForm(1, "val", arr);
          updateForm(1, "start", true);
          setTimeout(() => updateForm(1, "start", false), 10);
        }}
      />
      <Slider
        defaultValue={[1]}
        min={0.5}
        max={1.5}
        step={0.01}
        onValueChange={([val]) => setAnimSpd(val)}
        className="w-64 h-6 "
      />
      <P5Sketch
        add={addForm}
        srch={searchForm}
        animSpd={animSpd}
        actionExicutable={(b) => setAEBool(b)}
      />
    </main>
  );
}
