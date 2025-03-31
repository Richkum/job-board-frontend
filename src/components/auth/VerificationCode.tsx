"use client";

import React, { useRef, useState, useEffect } from "react";

interface VerificationCodeProps {
  onComplete: (code: string) => void; // Callback when user finishes entering code
}

export default function VerificationCode({
  onComplete,
}: VerificationCodeProps) {
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  // Set focus on first input when component mounts
  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  // Focus component on load
  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const handleChange = (value: string, index: number) => {
    // Only allow numeric
    if (!/^\d*$/.test(value)) return;

    const newDigits = [...digits];
    newDigits[index] = value;
    setDigits(newDigits);

    // Move to next input if the user typed a digit
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
      setActiveIndex(index + 1);
    }

    // If all 6 digits are filled, call onComplete
    if (newDigits.every((digit) => digit !== "")) {
      setTimeout(() => {
        onComplete(newDigits.join(""));
      }, 100); // Small delay to allow focus to move
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    // Handle backspace
    if (e.key === "Backspace") {
      if (digits[index]) {
        // If current input has a digit, clear it
        const newDigits = [...digits];
        newDigits[index] = "";
        setDigits(newDigits);
      } else if (index > 0) {
        // If current input is empty and not the first, move focus to previous input
        inputsRef.current[index - 1]?.focus();
        setActiveIndex(index - 1);
      }
    }
    // Handle arrow keys
    else if (e.key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1]?.focus();
      setActiveIndex(index - 1);
    } else if (e.key === "ArrowRight" && index < 5) {
      inputsRef.current[index + 1]?.focus();
      setActiveIndex(index + 1);
    }
  };

  const handleFocus = (index: number) => {
    setActiveIndex(index);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").trim();

    // Check if pasted content is numeric and correct length
    if (/^\d+$/.test(pasteData)) {
      const digits = pasteData.slice(0, 6).split("");
      const newDigits = [...Array(6)].map((_, i) => digits[i] || "");
      setDigits(newDigits);

      // Focus on the last filled input or the first empty one
      const focusIndex = Math.min(digits.length, 5);
      inputsRef.current[focusIndex]?.focus();
      setActiveIndex(focusIndex);

      // If all 6 digits are filled, call onComplete
      if (newDigits.length === 6 && newDigits.every((d) => d !== "")) {
        setTimeout(() => onComplete(newDigits.join("")), 100);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-2 justify-center">
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={(el) => {
              inputsRef.current[i] = el;
            }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e.target.value, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            onFocus={() => handleFocus(i)}
            onPaste={i === 0 ? handlePaste : undefined} // Only allow paste on first input
            className={`w-12 h-14 text-center border rounded-md text-2xl focus:outline-none transition-all dark:bg-bgSecondary-dark dark:text-text-dark
              ${
                activeIndex === i
                  ? "border-primary dark:border-primary-dark ring-2 ring-primary/20 dark:ring-primary-dark/20"
                  : "border-border dark:border-border-dark"
              }
            `}
            aria-label={`Verification digit ${i + 1}`}
          />
        ))}
      </div>
      <div className="flex justify-center mt-4">
        <button
          type="button"
          onClick={() => setDigits(["", "", "", "", "", ""])}
          className="text-sm text-primary dark:text-primary-dark hover:underline focus:outline-none"
        >
          Clear Code
        </button>
      </div>
    </div>
  );
}
