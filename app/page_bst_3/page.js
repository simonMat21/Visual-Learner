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
  const [getMaxform, setGetMax] = useState({
    val: 0,
    start: false,
  });
  const [getpredform, setGetpred] = useState({
    val: 0,
    start: false,
  });
  const [getsuccform, setGetsucc] = useState({
    val: 0,
    start: false,
  });
  const [getMinForm, setGetMin] = useState({
    pos: 0,
    start: false,
  });

  const [animSpd, setAnimSpd] = useState(1);

  const updateForm = (n, key, value) => {
    if (key !== "start" || AEBool) {
      if (n == 1) {
        setAddForm((prev) => ({ ...prev, [key]: value }));
      } else if (n == 2) {
        setGetMin((prev) => ({ ...prev, [key]: value }));
      } else if (n == 3) {
        setGetMax((prev) => ({ ...prev, [key]: value }));
      } else if (n == 4) {
        setGetpred((prev) => ({ ...prev, [key]: value }));
      } else if (n == 5) {
        setGetsucc((prev) => ({ ...prev, [key]: value }));
      }
    }
  };
  return (
    <main className="main">
      {/* <h1 className="heading tshad">Algo Visualisor</h1> */}
      <div className="flex items-center gap-9">
        <NumberInput
          btnName="add"
          onSubmit={(arr) => {
            updateForm(1, "val", arr);
            updateForm(1, "start", true);
            setTimeout(() => updateForm(1, "start", false), 10);
          }}
        />

        <div className="flex items-center gap-4">
          <Button
            onClick={() => {
              updateForm(3, "start", true);
              setTimeout(() => updateForm(3, "start", false), 10);
            }}
            className="dobtn"
          >
            Pre order
          </Button>

          <Button
            onClick={() => {
              updateForm(2, "start", true);
              setTimeout(() => updateForm(2, "start", false), 10);
            }}
            className="dobtn"
          >
            In order
          </Button>
          <Button
            onClick={() => {
              updateForm(2, "start", true);
              setTimeout(() => updateForm(2, "start", false), 10);
            }}
            className="dobtn"
          >
            Post order
          </Button>
          <Button
            onClick={() => {
              updateForm(2, "start", true);
              setTimeout(() => updateForm(2, "start", false), 10);
            }}
            className="dobtn"
          >
            Level order
          </Button>
        </div>
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
        dlt={getMinForm}
        srch={getMaxform}
        prev={getpredform}
        succ={getsuccform}
        animSpd={animSpd}
        actionExicutable={(b) => setAEBool(b)}
      />
    </main>
  );
}
