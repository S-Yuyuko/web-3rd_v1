// src/components/CloudEffect.tsx
'use client';

import React from 'react';

const CloudEffect = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 10 }).map((_, index) => {
        const cloudSize = Math.random() * 100 + 50; // Cloud size between 50px and 150px
        const topPosition = Math.random() * 100; // Random top position
        const animationDuration = Math.random() * 10 + 5; // Duration between 5s and 15s

        return (
          <div
            key={index}
            className="absolute bg-white rounded-full opacity-60 shadow-lg"
            style={{
              width: `${cloudSize}px`,
              height: `${cloudSize * 0.6}px`, // Height is proportionate to the width
              top: `${topPosition}%`,
              left: `${Math.random() * -50}%`, // Start off-screen to the left
              animation: `moveCloud ${animationDuration}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`, // Random delay for each cloud
            }}
          ></div>
        );
      })}

      <style jsx>{`
        @keyframes moveCloud {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(150vw); // Move off-screen to the right
          }
        }
      `}</style>
    </div>
  );
};

export default CloudEffect;
