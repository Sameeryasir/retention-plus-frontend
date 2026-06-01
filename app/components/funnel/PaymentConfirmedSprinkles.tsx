"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const SPRINKLE_COLORS = [
  "#22c55e",
  "#3b82f6",
  "#eab308",
  "#ec4899",
  "#a855f7",
  "#f97316",
  "#14b8a6",
];

type SprinkleSpec = {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
  color: string;
  rotate: number;
  drift: number;
};

function buildSprinkles(count: number): SprinkleSpec[] {
  return Array.from({ length: count }, (_, id) => ({
    id,
    left: 4 + Math.random() * 92,
    delay: Math.random() * 0.45,
    duration: 1.8 + Math.random() * 1.4,
    size: 5 + Math.random() * 7,
    color: SPRINKLE_COLORS[id % SPRINKLE_COLORS.length]!,
    rotate: Math.random() * 360,
    drift: -28 + Math.random() * 56,
  }));
}

export function PaymentConfirmedSprinkles({ active }: { active: boolean }) {
  const [sprinkles, setSprinkles] = useState<SprinkleSpec[]>([]);

  useEffect(() => {
    if (!active) {
      setSprinkles([]);
      return;
    }
    setSprinkles(buildSprinkles(48));
  }, [active]);

  if (!active || sprinkles.length === 0) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[60] overflow-hidden"
      aria-hidden
    >
      {sprinkles.map((s) => (
        <motion.span
          key={s.id}
          className="absolute top-0 block rounded-sm"
          style={{
            left: `${s.left}%`,
            width: `${s.size}px`,
            height: `${s.size * 0.45}px`,
            backgroundColor: s.color,
          }}
          initial={{ y: "-12%", opacity: 0, rotate: s.rotate }}
          animate={{
            y: "108vh",
            opacity: [0, 1, 1, 0],
            rotate: s.rotate + 180 + s.drift,
            x: s.drift,
          }}
          transition={{
            duration: s.duration,
            delay: s.delay,
            ease: "easeOut",
            repeat: 1,
            repeatDelay: 0.35,
          }}
        />
      ))}
    </div>
  );
}
