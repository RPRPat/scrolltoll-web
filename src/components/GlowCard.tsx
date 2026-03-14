"use client";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
  delay?: number;
}

export default function GlowCard({ children, className = "", glowColor = "rgba(57,255,20,0.15)", delay = 0 }: GlowCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      whileHover={{
        scale: 1.02,
        boxShadow: `0 0 30px ${glowColor}, 0 0 60px ${glowColor}`,
      }}
      className={`relative bg-dark-card border border-white/10 rounded-2xl p-6 md:p-8 transition-colors hover:border-white/20 ${className}`}
    >
      {children}
    </motion.div>
  );
}
