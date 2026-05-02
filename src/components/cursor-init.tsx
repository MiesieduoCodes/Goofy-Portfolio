"use client";

import { useEffect } from "react";
import { initCursor } from "../lib/cursor";

export default function CursorInit() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      initCursor();
    }
  }, []);

  return (
    <div id="cursor">
      <svg viewBox="0 0 100 100" id="cursor-hex-svg">
        <polygon points="50,10 84.6,30 84.6,70 50,90 15.4,70 15.4,30" fill="transparent" stroke="white" strokeWidth="8" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
