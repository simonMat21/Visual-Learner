"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import PhoneScreenBlock from "@/components/phoneScreenBlocker";

import P5Sketch from "./P5Sketch";

export default function Home() {
  const [AEBool, setAEBool] = useState(true);
  const [addForm, setAddForm] = useState({ val: 0, pos: 0, start: false });
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
    if (n == 1) {
      setAddForm((prev) => ({ ...prev, [key]: value }));
    } else if (n == 2) {
      setDeleteForm((prev) => ({ ...prev, [key]: value }));
    } else if (n == 3) {
      setSearchForm((prev) => ({ ...prev, [key]: value }));
    }
  };
  return (
    <main className="main">
      <PhoneScreenBlock message="Please switch to desktop mode to view this website" />
      <h1 className="heading tshad">Algo Visualiser</h1>
      {/* <NumberInput onSubmit={(arr) => setData(arr)} /> */}
      <div className="flex gap-42">
        <div className="flex flex-col gap-2">
          <div className="flex gap-3">
            <Input
              className="inpbox"
              placeholder="Enter number to search"
              // value={form.elem}
              onChange={(e) => updateForm(1, "val", Number(e.target.value))}
            />
            <Button
              onClick={() => {
                updateForm(1, "start", true);
                setTimeout(() => updateForm(1, "start", false), 10);
              }}
              className="dobtn"
            >
              add
            </Button>
          </div>
          <Input
            className="inpbox"
            placeholder="Enter position"
            // value={form.pos}
            onChange={(e) => updateForm(1, "pos", Number(e.target.value))}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Input
            className="inpbox"
            placeholder="Enter position"
            // value={form.pos}
            onChange={(e) => updateForm(3, "val", Number(e.target.value))}
          />
          <Button
            onClick={() => {
              updateForm(3, "start", true);
              setTimeout(() => updateForm(3, "start", false), 10);
            }}
            className="dobtn"
          >
            search
          </Button>
        </div>

        <div className="flex flex-col gap-2">
          <Input
            className="inpbox"
            placeholder="Enter position"
            // value={form.pos}
            onChange={(e) => updateForm(2, "pos", Number(e.target.value))}
          />
          <Button
            onClick={() => {
              updateForm(2, "start", true);
              setTimeout(() => updateForm(2, "start", false), 10);
            }}
            className="dobtn"
          >
            delete
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
        dlt={deleteForm}
        srch={searchForm}
        animSpd={animSpd}
        actionExicutable={(b) => setAEBool(b)}
      />
    </main>
  );
}
