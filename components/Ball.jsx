function Ball({ id, size, xPosition, yPosition, color }) {
  return (
    <div
      style={{
        position: "absolute",
        top: `${yPosition}px`,
        left: `${xPosition}px`,
        transform: "translateX(-50%)",
      }}
    >
      <div
        className="rounded-full flex items-center justify-center text-white font-bold shadow-lg transition-transform duration-300"
        style={{
          width: "50px",
          height: "50px",
          background: color, // Use the passed color as background
          boxShadow: `0 4px 10px ${color}80`, // Soft shadow based on color
        }}
      >
        {size}
      </div>
    </div>
  );
}

export default Ball;
