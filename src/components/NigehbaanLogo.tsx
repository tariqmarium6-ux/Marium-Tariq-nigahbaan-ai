import React from "react";

interface NigehbaanLogoProps {
  className?: string;
  size?: number;
}

export const NigehbaanLogo: React.FC<NigehbaanLogoProps> = ({
  className = "",
  size = 40,
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm"
      >
        <defs>
          {/* Vibrant Yellowish / Amber Gradient that stands out from the orange UI */}
          <linearGradient id="yellowShieldGrad" x1="10%" y1="0%" x2="90%" y2="100%">
            <stop offset="0%" stopColor="#FCD34D" />
            <stop offset="50%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>

          {/* Gentle top highlight for a polished 3D tactile feel */}
          <linearGradient id="shieldGloss" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.45" />
            <stop offset="60%" stopColor="#FFFFFF" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Outer Warm Amber Shield */}
        <path
          d="M24 4.5L7 11V22.5C7 33.2 14.3 43.1 24 45.5C33.7 43.1 41 33.2 41 22.5V11L24 4.5Z"
          fill="url(#yellowShieldGrad)"
          stroke="#D97706"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Top-half Glass Highlight Contour */}
        <path
          d="M24 7.5L10 13V22C10 30.5 16 38.5 24 41.5C32 38.5 38 30.5 38 22V13L24 7.5Z"
          fill="url(#shieldGloss)"
        />

        {/* Clean, Simple High-Contrast White Checkmark */}
        <path
          d="M16 23.5L22 29.5L32 18"
          stroke="#FFFFFF"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};
