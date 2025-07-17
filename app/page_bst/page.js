"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import PhoneScreenBlock from "../components/phoneScreenBlocker";

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

  const inputs = [
    { inp: "Enter number to search", btn: "add", x1: 1, x2: "val" },
    { inp: "Enter position", btn: "search", x1: 3, x2: "val" },
    { inp: "Enter position", btn: "delete", x1: 2, x2: "pos" },
  ];

  return (
    <main className="main">
      <PhoneScreenBlock message="Please switch to desktop mode to view this website" />
      <h1 className="heading tshad">Algo Visualisor</h1>
      {/* <NumberInput onSubmit={(arr) => setData(arr)} /> */}
      <div className="flex flex-row gap-10">
        {inputs.map((item, index) => {
          return (
            <div key={index} className="flex items-center gap-2 mb-4 rounded-5">
              <Input
                className="inpbox"
                placeholder={item.inp}
                onChange={(e) =>
                  updateForm(item.x1, item.x2, Number(e.target.value))
                }
              />

              <Button
                className="dobtn"
                onClick={() => {
                  updateForm(item.x1, "start", true);
                  setTimeout(() => updateForm(item.x1, "start", false), 10);
                }}
              >
                {item.btn}
              </Button>
            </div>
          );
        })}
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
