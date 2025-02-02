import Bullets from "@components/Bullets";
import Cannon from "@components/Cannon";
import { useEffect, useState } from "react";
import { usePosition } from "@context/positionContext";
import Ball from "@components/Ball";

function Game() {
  const bulletsPerSecond = 5; // Number of bullets to fire per second
  const bulletSpeed = 5; // Speed of bullets
  const [isFiring, setIsFiring] = useState(false);
  const [bullets, setBullets] = useState([]); // Track the bullets
  const [balls, setBalls] = useState([]); // Track the balls
  const { position } = usePosition(); // Get cannon position from context
  const colorArray = ["red", "blue", "green", "yellow", "purple", "orange"];
  const ballSizes = [20, 120, 450, 25, 26]; // Size options for the balls
  const gravity = 1; // Gravity for the balls

  // Update the yPosition of a bullet
  const updateYPosition = (id, newYPosition) => {
    setBullets(
      (prev) =>
        prev
          .map((bullet) =>
            bullet.id === id ? { ...bullet, yPosition: newYPosition } : bullet
          )
          .filter((bullet) => bullet.yPosition > 0) // Remove bullets off-screen
    );
  };

  // Handle firing logic
  const handleFiring = (e) => {
    if (e.key === " " && !isFiring) setIsFiring(true);
  };

  const handleNotFiring = (e) => {
    if (e.key === " ") setIsFiring(false);
  };

  // Spacebar event listeners
  useEffect(() => {
    window.addEventListener("keydown", handleFiring);
    window.addEventListener("keyup", handleNotFiring);

    return () => {
      window.removeEventListener("keydown", handleFiring);
      window.removeEventListener("keyup", handleNotFiring);
    };
  }, []);

  // Fire bullets when isFiring is true
  useEffect(() => {
    if (isFiring) {
      const interval = setInterval(() => {
        setBullets((prev) => [
          ...prev,
          { id: Date.now(), xPosition: position, yPosition: 500 }, // Start bullets at y=500
        ]);
      }, 1000 / bulletsPerSecond);

      return () => clearInterval(interval);
    }
  }, [isFiring, position]);

  //bullet hit balls
  useEffect(() => {
    const interval = setInterval(() => {
      setBullets((prevBullets) => {
        return prevBullets
          .map((bullet) => {
            const newYPosition = bullet.yPosition - bulletSpeed;

            let bulletHit = false;

            // Check if the bullet hits any ball
            setBalls(
              (prevBalls) =>
                prevBalls
                  .map((ball) => {
                    const distance = Math.hypot(
                      ball.xPosition - bullet.xPosition,
                      ball.yPosition - newYPosition
                    );

                    if (distance < ball.size / 2) {
                      bulletHit = true; // Mark the bullet for removal
                      return { ...ball, size: Math.max(0, ball.size - 1) }; // Reduce ball size
                    }
                    return ball;
                  })
                  .filter((ball) => ball.size > 0) // Remove balls that reach size 0
            );

            return bulletHit ? null : { ...bullet, yPosition: newYPosition };
          })
          .filter(Boolean); // Remove bullets that hit a ball
      });
    }, 50); // Update every 50ms for smooth movement

    return () => clearInterval(interval);
  }, []);

  // Generate balls with random positions and sizes
  useEffect(() => {
    const interval = setInterval(() => {
      setBalls((prev) => [
        ...prev,
        {
          id: Date.now(),
          xPosition: Math.random() * innerWidth, // Random x position
          yPosition: Math.random() * 100, // Random y position
          color: colorArray[Math.floor(Math.random() * colorArray.length)],
          size: ballSizes[Math.floor(Math.random() * ballSizes.length)], // Random size from ballSizes array
          yVelocity: 0, // Initial y velocity
          xVelocity: 2, // Initial x velocity
        },
      ]);
    }, 10000); // Generate a ball every 3 seconds

    return () => clearInterval(interval);
  }, []); // Empty dependency array to run this effect only once on mount

  // Continuously move balls downwards
  useEffect(() => {
    const interval = setInterval(() => {
      setBalls((prev) =>
        prev.map((ball) => {
          let newYVelocity = ball.yVelocity + gravity;
          let newXPosition = ball.xPosition + ball.xVelocity;
          let newYPosition = ball.yPosition + newYVelocity;

          // Bounce off the bottom
          if (newYPosition >= window.innerHeight - 150) {
            newYVelocity = -ball.yVelocity; // Reverse velocity with damping
            newYPosition = window.innerHeight - 150; // Keep it above the ground
          }

          // Bounce off walls
          if (newXPosition <= 0 || newXPosition >= window.innerWidth - 50) {
            ball.xVelocity = -ball.xVelocity;
          }

          return {
            ...ball,
            yPosition: newYPosition,
            yVelocity: newYVelocity,
            xPosition: newXPosition,
          };
        })
      );
    }, 50); // Update every 50ms for smooth movement

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  // Continuously move bullets upwards
  useEffect(() => {
    const interval = setInterval(() => {
      setBullets(
        (prev) =>
          prev
            .map((bullet) => ({
              ...bullet,
              yPosition: bullet.yPosition - bulletSpeed,
            }))
            .filter((bullet) => bullet.yPosition > 0) // Remove bullets off-screen
      );
    }, 50); // Update every 50ms for smooth movement

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <section
      className="flex justify-center items-center h-screen bg-gray-900 text-white bg-cover bg-center"
      style={{
        backgroundImage: 'url("/assets/ballblast.jpg")',
      }}
    >
      <div className="relative">
        {/* Balls Layer */}
        <div className="absolute inset-0 z-10">
          {balls.map((ball) => (
            <Ball
              key={ball.id}
              id={ball.id}
              color={ball.color}
              xPosition={ball.xPosition}
              yPosition={ball.yPosition}
              size={ball.size} // Pass size to Ball component
            />
          ))}
        </div>
        {/* Bullets Layer */}
        <div className="absolute inset-0 z-10">
          {bullets.map((bullet) => (
            <Bullets
              key={bullet.id}
              id={bullet.id}
              xPosition={bullet.xPosition}
              yPosition={bullet.yPosition}
              updateYPosition={updateYPosition} // Update handled at the Game level
            />
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
