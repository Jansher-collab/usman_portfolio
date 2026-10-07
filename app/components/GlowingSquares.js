const SQUARES = [
  [18, 20, 14, 0.0, 4.0],
  [78, 16, 10, 0.6, 3.4],
  [60, 10, 8, 1.1, 4.6],
  [82, 38, 16, 0.3, 3.8],
  [30, 44, 12, 1.5, 4.2],
  [12, 52, 9, 0.9, 3.2],
  [50, 56, 18, 0.4, 4.4],
  [70, 58, 11, 1.8, 3.6],
  [24, 24, 10, 2.0, 4.8],
  [44, 14, 7, 0.8, 3.3],
  [56, 78, 13, 1.3, 4.1],
  [84, 64, 9, 0.2, 3.9],
  [38, 66, 8, 1.9, 4.5],
  [64, 34, 8, 0.5, 3.5],
  [26, 72, 7, 2.2, 4.3],
  [72, 84, 8, 1.6, 3.7],
];

export default function GlowingSquares({ className = "" }) {
  return (
    <div aria-hidden="true" className={className}>
      <div className="glow-squares">
        {SQUARES.map(([x, y, size, delay, dur], i) => (
          <span
            key={i}
            className="glow-square"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: `${size}px`,
              height: `${size}px`,
              animationDelay: `${delay}s`,
              animationDuration: `${dur}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}