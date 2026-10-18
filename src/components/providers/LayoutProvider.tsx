"use client";

import { LayoutGroup, MotionConfig } from "framer-motion";

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  return (
    // "user" turns off transform/layout animations for visitors who ask for reduced motion
    <MotionConfig reducedMotion="user">
      <LayoutGroup>{children}</LayoutGroup>
    </MotionConfig>
  );
}
