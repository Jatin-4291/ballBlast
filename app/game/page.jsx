import Bullets from "@components/Bullets";
import Cannon from "@components/Cannon";
import { useEffect, useState } from "react";

function Game() {
  const bulletsPerSecond = 5; // Number of bullets to fire per second
  const [isFiring, setIsFiring] = useState(false);
  const [bullets, setBullets] = useState([]); // Track the bullets

  // Handle firing (keydown for spacebar)
  const handleFiring = (e) => {
    if (e.key === " " && !isFiring) {
      // Only allow firing if not already firing
      setIsFiring(true);
    }
  };

  // Handle stopping firing (keyup for spacebar)
  const handleNotFiring = (e) => {
    if (e.key === " ") {
      setIsFiring(false);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleFiring);
    window.addEventListener("keyup", handleNotFiring);

    return () => {
      window.removeEventListener("keydown", handleFiring);
      window.removeEventListener("keyup", handleNotFiring);
    };
  }, [isFiring]); // Re-run effect when `isFiring` changes

  useEffect(() => {
    if (isFiring) {
      // Fire a bullet every second when the spacebar is held down
      const interval = setInterval(() => {
        setBullets((prev) => [...prev, { id: Date.now(), position: 500 }]); // Add a new bullet with a unique id
      }, 1000 / bulletsPerSecond); // 1 second interval

      // Cleanup the interval on component unmount or when firing stops
      return () => clearInterval(interval);
    }
  }, [isFiring]);

  return (
    <section
      className="flex justify-center items-center h-screen bg-gray-900 text-white bg-cover bg-center"
      style={{
        backgroundImage: 'url("/assets/ballblast.jpg")',
      }}
    >
      {/* Wrapper for positioning */}
      <div className="relative">
        {/* Bullets should always be on top */}
        <div className="absolute inset-0 z-10">
          {bullets.map((bullet) => (
            <Bullets key={bullet.id} position={bullet.position} />
          ))}
        </div>
        {/* Cannon */}
        <div className="relative z-0">
          <Cannon />
        </div>
      </div>
    </section>
  );
}

export default Game;
