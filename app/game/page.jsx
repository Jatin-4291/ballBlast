import Bullets from "@components/Bullets";
import Cannon from "@components/Cannon";
import { useEffect, useState, useRef } from "react";
import { usePosition } from "@context/positionContext";
import Ball from "@components/Ball";

function Game() {
  const bulletsPerSecond = 10; // Number of bullets to fire per second
  const bulletSpeed = 10; // Speed of bullets
  const [isFiring, setIsFiring] = useState(false);
  const [bullets, setBullets] = useState([]); // Track the bullets
  const [balls, setBalls] = useState([]); // Track the balls
  const { position } = usePosition(); // Get cannon position from context
  const colorArray = ["red", "blue", "green", "yellow", "purple", "orange"];
  const ballSizes = [20, 120, 450, 25, 26]; // Size options for the balls
  const gravity = 1; // Gravity for the balls
  const [gamePaused, setGamePaused] = useState(false);

  // Use refs to store the current state of bullets and balls
  const bulletsRef = useRef(bullets);
  const ballsRef = useRef(balls);

  // Update refs whenever state changes
  useEffect(() => {
    bulletsRef.current = bullets;
  }, [bullets]);

  useEffect(() => {
    ballsRef.current = balls;
  }, [balls]);

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

  // Pause game logic
  const pauseGame = (e) => {
    if (e.key === "Escape") {
      setGamePaused((prev) => !prev); // Toggle pause state
    }
  };

  // Event listeners for spacebar and escape key
  useEffect(() => {
    window.addEventListener("keydown", handleFiring);
    window.addEventListener("keyup", handleNotFiring);
    window.addEventListener("keydown", pauseGame);

    return () => {
      window.removeEventListener("keydown", handleFiring);
      window.removeEventListener("keyup", handleNotFiring);
      window.removeEventListener("keydown", pauseGame);
    };
  }, []);

  // Fire bullets when isFiring is true
  useEffect(() => {
    if (!gamePaused && isFiring) {
      const interval = setInterval(() => {
        setBullets((prev) => [
          ...prev,
          {
            id: Date.now(),
            xPosition: position + 60,
            yPosition: 500,
            isVisible: true,
          }, // Start bullets at y=500
        ]);
      }, 1000 / bulletsPerSecond);

      return () => clearInterval(interval);
    }
  }, [isFiring, position, gamePaused]);

  // Bullet-Ball Collision Handling
  useEffect(() => {
    const interval = setInterval(() => {
      if (!gamePaused) {
        const currentBullets = bulletsRef.current;
        const currentBalls = ballsRef.current;

        const updatedBullets = currentBullets.map((bullet) => {
          let bulletHit = false;

          const updatedBalls = currentBalls.map((ball) => {
            const distance = Math.hypot(
              ball.xPosition - bullet.xPosition,
              ball.yPosition - bullet.yPosition
            );

            const visualSize = 50; // Fixed size of the ball in pixels

            if (distance <= visualSize / 2) {
              bulletHit = true; // Bullet hit detected
              return {
                ...ball,
                size: Math.max(0, ball.size - 1),
                yPosition: ball.yPosition - 10,
                yVelocity: ball.yVelocity * 0.8,
              };
            }
            return ball;
          });

          setBalls(updatedBalls.filter((ball) => ball.size > 0));

          return bulletHit ? { ...bullet, isVisible: false } : bullet;
        });

        setBullets(updatedBullets.filter((bullet) => bullet.isVisible)); // Remove invisible bullets
      }
    }, 50);

    return () => clearInterval(interval);
  }, [gamePaused]);

  //cannon ball collision
  useEffect(() => {
    const interval = setInterval(() => {
      if (!gamePaused) {
        const currentBalls = ballsRef.current;

        const updatedBalls = currentBalls.map((ball) => {
          // Cannon dimensions (based on the SVG cannon)
          const cannonWidth = 120; // Width of the cannon
          const cannonHeight = 1000; // Height of the cannon

          // Cannon's center position
          const cannonCenterX = position + cannonWidth / 2; // Center X of the cannon
          const cannonCenterY = 50 + cannonHeight / 2; // Center Y of the cannon (top is at y=50)

          // Ball's center position
          const ballCenterX = ball.xPosition + 50 / 2; // Center X of the ball
          const ballCenterY = ball.yPosition + 50 / 2; // Center Y of the ball

          // Distance between cannon and ball centers
          const distance = Math.hypot(
            ballCenterX - cannonCenterX,
            ballCenterY - cannonCenterY
          );

          // Collision detection (cannon radius + ball radius)
          const collisionDistance = cannonWidth / 2 + 50 / 2;
          console.log(
            distance,
            cannonCenterX,
            ballCenterX,
            ballCenterY,
            cannonCenterY,
            collisionDistance
          );
          if (distance <= collisionDistance - 60) {
            console.log("Collision detected!");
            setGamePaused(true); // Pause the game
            alert("Game Over"); // Show game over alert
          }

          return ball;
        });

        setBalls(updatedBalls);
      }
    }, 50); // Check for collisions every 50ms

    return () => clearInterval(interval);
  }, [gamePaused, position]);

  // Generate balls with random positions and sizes
  useEffect(() => {
    const interval = setInterval(() => {
      if (!gamePaused) {
        setBalls((prev) => [
          ...prev,
          {
            id: Date.now(),
            xPosition: Math.random() * window.innerWidth, // Random x position
            yPosition: Math.random() * 100, // Random y position
            color: colorArray[Math.floor(Math.random() * colorArray.length)],
            size: ballSizes[Math.floor(Math.random() * ballSizes.length)], // Random size from ballSizes array
            yVelocity: 0, // Initial y velocity
            xVelocity: 2, // Initial x velocity
          },
        ]);
      }
    }, 10000); // Generate a ball every 10 seconds

    return () => clearInterval(interval);
  }, [gamePaused]);

  // Continuously move balls downwards
  useEffect(() => {
    const interval = setInterval(() => {
      if (!gamePaused) {
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
      }
    }, 50); // Update every 50ms for smooth movement

    return () => clearInterval(interval);
  }, [gamePaused]);

  // Continuously move bullets upwards
  useEffect(() => {
    const interval = setInterval(() => {
      if (!gamePaused) {
        setBullets(
          (prev) =>
            prev
              .map((bullet) => ({
                ...bullet,
                yPosition: bullet.yPosition - bulletSpeed,
              }))
              .filter((bullet) => bullet.yPosition > 0) // Remove bullets off-screen
        );
      }
    }, 50); // Update every 50ms for smooth movement

    return () => clearInterval(interval);
  }, [gamePaused]);

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
              xPosition={bullet.xPosition}
              yPosition={bullet.yPosition}
              isVisible={bullet.isVisible} // Pass isVisible prop
            />
          ))}
        </div>
        {/* Cannon */}
        <div className="relative z-0">
          <Cannon />
        </div>
        {/* Pause Overlay */}
        {gamePaused && (
          <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 z-20">
            <p className="text-4xl font-bold">Game Paused</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default Game;
