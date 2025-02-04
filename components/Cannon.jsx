"use client";

import { useState, useEffect, useRef } from "react";
import { usePosition } from "@context/positionContext"; // Correct usage of usePosition

function Cannon() {
  const { position, setPosition } = usePosition(); // Get position from context
  const [width, setWidth] = useState(window.innerWidth);
  const cannonRef = useRef(null);

  const handleMove = (e) => {
    const cannonWidth = cannonRef.current ? cannonRef.current.offsetWidth : 0;

    if (e.key === "ArrowLeft") {
      setPosition((prev) => Math.max(prev - 20, 0)); // Move left
    } else if (e.key === "ArrowRight") {
      setPosition((prev) => Math.min(prev + 20, width - cannonWidth)); // Move right
    }
  };

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleMove);
    return () => {
      window.removeEventListener("keydown", handleMove);
    };
  }, [width]);

  return (
    <div className="relative mt-[500px] h-20 w-screen">
      <div
        ref={cannonRef}
        className="absolute"
        style={{
          left: `${position}px`,
          top: "50px",
        }}
      >
        {/* Stylish SVG Cannon */}
        <svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Cannon Base */}
          <rect
            x="20"
            y="70"
            width="80"
            height="20"
            rx="10"
            fill="url(#cannonBaseGradient)"
          />
          {/* Cannon Barrel */}
          <rect
            x="45"
            y="30"
            width="30"
            height="50"
            rx="5"
            fill="url(#cannonBarrelGradient)"
          />
          {/* Cannon Wheel 1 */}
          <circle cx="35" cy="90" r="10" fill="url(#cannonWheelGradient)" />
          {/* Cannon Wheel 2 */}
          <circle cx="85" cy="90" r="10" fill="url(#cannonWheelGradient)" />
          {/* Cannon Details */}
          <rect x="50" y="35" width="20" height="40" fill="#555" rx="3" />
          <rect x="55" y="40" width="10" height="30" fill="#777" rx="2" />

          {/* Gradients */}
          <defs>
            {/* Base Gradient */}
            <linearGradient id="cannonBaseGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8B4513" />
              <stop offset="100%" stopColor="#654321" />
            </linearGradient>
            {/* Barrel Gradient */}
            <linearGradient
              id="cannonBarrelGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor="#555" />
              <stop offset="100%" stopColor="#333" />
            </linearGradient>
            {/* Wheel Gradient */}
            <radialGradient
              id="cannonWheelGradient"
              cx="0.5"
              cy="0.5"
              r="0.5"
              fx="0.25"
              fy="0.25"
            >
              <stop offset="0%" stopColor="#444" />
              <stop offset="100%" stopColor="#222" />
            </radialGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}

export default Cannon;
