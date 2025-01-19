// context/PositionContext.js
"use client";

import { createContext, useContext, useState } from "react";

export const PositionContext = createContext({});

export const PositionProvider = ({ children }) => {
  const [position, setPosition] = useState(0); // Default position is 0

  return (
    <PositionContext.Provider value={{ position, setPosition }}>
      {children}
    </PositionContext.Provider>
  );
};

export const usePosition = () => {
  return useContext(PositionContext);
};
