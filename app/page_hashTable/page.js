"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import NumberInput from "../components/NumberInput";

import P5Sketch from "./P5Sketch";

export default function Home() {
  const [AEBool, setAEBool] = useState(true);
  const [addForm, setAddForm] = useState({ val: [], start: false });
  const [searchForm, setSearchForm] = useState({
    val: 0,
    start: false,
  });
  const [deleteForm, setDeleteForm] = useState({
    pos: 0,
    start: false,
  });

  const [animSpd, setAnimSpd] = useState(1);

  const updateForm = (n, key, value) => {
    if (key !== "start" || AEBool) {
      if (n == 1) {
        setAddForm((prev) => ({ ...prev, [key]: value }));
      } else if (n == 2) {
        setDeleteForm((prev) => ({ ...prev, [key]: value }));
      } else if (n == 3) {
        setSearchForm((prev) => ({ ...prev, [key]: value }));
      }
    }
  };
  return (
    <main>
      <h1 className="text-3xl font-bold underline">Algo visuvalizor</h1>
      <NumberInput
        btnName="add"
        onSubmit={(arr) => {
          updateForm(1, "val", arr);
          updateForm(1, "start", true);
          setTimeout(() => updateForm(1, "start", false), 10);
        }}
      />

      <div className="flex items-center gap-2">
        <Button
          onClick={() => {
            updateForm(3, "start", true);
            setTimeout(() => updateForm(3, "start", false), 10);
          }}
          className="bg-blue-600 w-30 text-white px-4 py-2 rounded-xl border border-white hover:bg-blue-700 transition duration-200 shadow-md"
        >
          Get Max
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Button
          onClick={() => {
            updateForm(2, "start", true);
            setTimeout(() => updateForm(2, "start", false), 10);
          }}
          className="bg-blue-600 w-30 text-white px-4 py-2 rounded-xl border border-white hover:bg-blue-700 transition duration-200 shadow-md"
        >
          Get Min
        </Button>
      </div>

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
        dlt={deleteForm}
        srch={searchForm}
        animSpd={animSpd}
        actionExicutable={(b) => setAEBool(b)}
      />
    </main>
  );
}
