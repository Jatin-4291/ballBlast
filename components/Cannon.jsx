// components/Cannon.jsx
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
      <p
        ref={cannonRef}
        className="absolute text-black text-4xl"
        width="100"
        style={{
          left: `${position}px`,
        }}
      >
        H
      </p>
    </div>
  );
}

export default Cannon;
