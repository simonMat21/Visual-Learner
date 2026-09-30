"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}) {
  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
        ? defaultValue
        : [min, max],
    [value, defaultValue, min, max]
  );

  return (
    <div className="px-3 rounded-4xl  pt-3 bg-transparent  mb-3">
      <SliderPrimitive.Root
        data-slot="slider"
        defaultValue={defaultValue}
        value={value}
        min={min}
        max={max}
        className={cn(
          "relative flex w-full touch-none items-center bg-transparent rounded-4xl select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
          className
        )}
        {...props}
      >
        <SliderPrimitive.Track
          data-slot="slider-track"
          className={cn(
            "bg-muted relative grow overflow-hidden bg-rule cursor-pointer rounded-full data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full h-4 data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5"
          )}
        >
          <SliderPrimitive.Range
            data-slot="slider-range"
            className={cn(
              "bg-pen-rust absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full h-full"
            )}
          />
        </SliderPrimitive.Track>
        {Array.from({ length: _values.length }, (_, index) => (
          <SliderPrimitive.Thumb
            data-slot="slider-thumb"
            key={index}
            className="border-2 border-pen-rust bg-card cursor-grab active:cursor-grabbing ring-pen-rust/30 block size-4 shrink-0 rounded-full border shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
          />
        ))}
      </SliderPrimitive.Root>
    </div>
  );
}

export { Slider };
