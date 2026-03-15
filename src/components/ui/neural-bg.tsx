"use client";

import { useEffect, useState } from "react";

export function NeuralBg() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute inset-0 opacity-20">
        {/* CSS Hardware Accelerated Floating Orbs */}
        <div className="absolute top-[20%] left-[20%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-primary/20 rounded-full blur-[100px] animate-float opacity-50" style={{ animationDuration: '15s' }} />
        <div className="absolute top-[60%] right-[10%] w-[30vw] h-[30vw] max-w-[400px] max-h-[400px] bg-secondary/15 rounded-full blur-[100px] animate-float opacity-40" style={{ animationDuration: '20s', animationDelay: '-5s' }} />
        <div className="absolute bottom-[-10%] left-[40%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-purple-500/10 rounded-full blur-[120px] animate-float opacity-30" style={{ animationDuration: '25s', animationDelay: '-10s' }} />
      </div>
    </div>
  );
}
