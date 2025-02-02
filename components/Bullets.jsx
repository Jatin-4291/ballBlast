"use client";

import Image from "next/image";

function Bullets({ xPosition, yPosition }) {
  return (
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
