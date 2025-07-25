// // Basic usage with value display
// <Slider value={[50]} min={0} max={100} />

// // Custom width
// <Slider value={[75]} width="w-64" label="Animation Speed" />

// // Hide value display
// <Slider value={[25]} showValue={false} />

// // Custom value styling
// <Slider
//   value={[60]}
//   valueClassName="bg-blue-100 text-blue-800"
//   label="Progress"
// />

// // Controlled slider
// <Slider
//   value={[speed]}
//   onValueChange={(value) => setSpeed(value[0])}
//   min={1}
//   max={10}
//   width="w-80"
//   label="Speed"
// />

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
  width = "w-full",
  showValue = true,
  valueClassName = "",
  label = "",
  onValueChange,
  step = 0.01,
  ...props
}) {
  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
        ? defaultValue
        : [min],
    [value, defaultValue, min]
  );

  const currentValue = _values[0] || min;
  const [inputValue, setInputValue] = React.useState(currentValue.toString());
  const [isEditing, setIsEditing] = React.useState(false);

  // Update input value when slider value changes externally
  React.useEffect(() => {
    if (!isEditing) {
      setInputValue(currentValue.toFixed(2));
    }
  }, [currentValue, isEditing]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") {
      handleInputSubmit();
    } else if (e.key === "Escape") {
      setInputValue(currentValue.toFixed(2));
      setIsEditing(false);
    }
  };

  const handleInputSubmit = () => {
    const numValue = parseFloat(inputValue);
    let clampedValue = numValue;

    // Clamp to min/max limits
    if (isNaN(numValue)) {
      clampedValue = currentValue;
    } else if (numValue < min) {
      clampedValue = min;
    } else if (numValue > max) {
      clampedValue = max;
    }

    // Update the slider value
    if (onValueChange) {
      onValueChange([clampedValue]);
    }

    setInputValue(clampedValue.toFixed(2));
    setIsEditing(false);
  };

  const handleInputBlur = () => {
    handleInputSubmit();
  };

  const handleInputFocus = () => {
    setIsEditing(true);
  };

  // Calculate consistent width for value display based on max digits
  const getValueDisplayWidth = () => {
    const maxDigits = Math.max(min.toFixed(2).length, max.toFixed(2).length);
    return `${Math.max(maxDigits * 0.6 + 1.5, 4)}rem`; // Minimum 4rem width
  };

  return (
    <div
      className={cn(
        "flex items-center gap-4 px-3 py-3 bg-transparent mb-3",
        className
      )}
    >
      {/* Optional Label */}
      {label && (
        <span className="text-sm font-medium text-gray-300 min-w-fit">
          {label}:
        </span>
      )}

      {/* Slider Container */}
      <div className={cn("relative", width)}>
        <SliderPrimitive.Root
          data-slot="slider"
          defaultValue={defaultValue}
          value={value}
          min={min}
          max={max}
          step={step}
          onValueChange={onValueChange}
          className={cn(
            "relative flex w-full touch-none items-center bg-transparent select-none data-[disabled]:opacity-50",
            "data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col"
          )}
          {...props}
        >
          <SliderPrimitive.Track
            data-slot="slider-track"
            className={cn(
              "relative grow overflow-hidden bg-gradient-to-r from-gray-200 to-gray-300 cursor-pointer rounded-full",
              "data-[orientation=horizontal]:h-2 data-[orientation=horizontal]:w-full",
              "data-[orientation=vertical]:h-full data-[orientation=vertical]:w-2",
              "shadow-inner"
            )}
          >
            <SliderPrimitive.Range
              data-slot="slider-range"
              className={cn(
                "absolute bg-gradient-to-r from-red-400 to-red-500 rounded-full",
                "data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full",
                "shadow-sm"
              )}
            />
          </SliderPrimitive.Track>

          {Array.from({ length: _values.length }, (_, index) => (
            <SliderPrimitive.Thumb
              data-slot="slider-thumb"
              key={index}
              className={cn(
                "block size-5 shrink-0 rounded-full border-2 border-white bg-gradient-to-b from-red-400 to-red-500",
                "cursor-pointer ring-red-200 shadow-lg transition-all duration-200",
                "hover:scale-110 hover:shadow-xl hover:ring-4",
                "focus-visible:ring-4 focus-visible:outline-none focus-visible:scale-110",
                "disabled:pointer-events-none disabled:opacity-50",
                "active:scale-95"
              )}
            />
          ))}
        </SliderPrimitive.Root>
      </div>

      {/* Editable Value Display */}
      {showValue && (
        <div
          className={cn(
            "flex items-center justify-center bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg border shadow-sm",
            valueClassName
          )}
          style={{ width: getValueDisplayWidth() }}
        >
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            onBlur={handleInputBlur}
            onFocus={handleInputFocus}
            className={cn(
              "w-full text-center text-sm font-semibold text-gray-800 bg-transparent border-none outline-none",
              "focus:bg-white focus:shadow-inner focus:ring-2 focus:ring-red-300 rounded px-1"
            )}
          />
        </div>
      )}
    </div>
  );
}

export { Slider };
