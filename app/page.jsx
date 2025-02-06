"use client";

import { useState } from "react";
import dynamic from "@node_modules/next/dynamic";
const Game = dynamic(() => import("./game/page"), { ssr: false });

const Home = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  return (
    <>
      {!isPlaying && (
        <section
          className="relative flex flex-col justify-center items-center h-screen bg-black bg-cover bg-center"
          style={{ backgroundImage: 'url("/assets/ballblast.jpg")' }}
        >
          <p
            className="font-extrabold text-6xl text-gray-800 text-center
              animate-pulse drop-shadow-lg 
              hover:animate-bounce hover:text-yellow-400
              transition-all duration-300"
          >
            Ball Blast
          </p>

          <div className="mt-8 flex space-x-10">
            <button
              onClick={handlePlay}
              className="px-6 py-3 text-xl font-bold bg-yellow-400 text-black rounded-lg shadow-lg transition-transform transform hover:scale-105"
            >
              Play
            </button>
            <button className="px-6 py-3 text-xl font-bold bg-gray-800 text-white rounded-lg shadow-lg transition-transform transform hover:scale-105">
              High Score
            </button>
          </div>
        </section>
      )}

      {isPlaying && <Game />}
    </>
  );
};

export default Home;
