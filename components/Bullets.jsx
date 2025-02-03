"use client";

import Image from "next/image";

function Bullets({ xPosition, yPosition, isVisible }) {
  if (!isVisible) return null; // Return null if isVisible is false
  return (
    // Render only if isVisible is tru
    <div
      style={{
        position: "absolute",
        top: `${yPosition}px`, // Render based on the passed `yPosition`
        left: `${xPosition}px`, // Sync with cannon's position
        transform: "translateX(-50%)",
      }}
    >
      <Image src="/assets/bullet.png" alt="Bullet" width={20} height={50} />
    </div>
  );
}

export default Bullets;
