// components/Bullets.jsx
"use client";

import { useEffect, useState } from "react";
import { usePosition } from "@context/positionContext"; // Get position from context
import Image from "next/image";

function Bullets() {
  const { position } = usePosition(); // Get position from context
  const [bulletPosition, setBulletPosition] = useState(500); // Initial bullet position

  useEffect(() => {
    const bulletSpeed = 5; // Bullet speed

    const interval = setInterval(() => {
      setBulletPosition((prev) => prev - bulletSpeed); // Move the bullet upwards
    }, 50);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        top: `${bulletPosition}px`, // Move upwards
        left: `${position}px`, // Sync with cannon position
        transform: "translateX(-50%)", // Center horizontally
      }}
    >
      <Image
        src="/assets/bullet.png" // Bullet image
        alt="Bullet"
        width={20}
        height={50}
      />
    </div>
  );
}

export default Bullets;
