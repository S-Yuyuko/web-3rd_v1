'use client';

import React from 'react';

const SnowEffect = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 100 }).map((_, index) => {
        const randomWindX = Math.random() * 30 + 30; // Random horizontal movement between 30vw and 60vw
        const randomRotation = Math.random() * 360; // Random rotation between 0 and 360 degrees

        return (
          <div
            key={index}
            className={`absolute w-2 h-2 rounded-full opacity-70 animate-fall bg-gray-300 dark:bg-gray-500`}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 3 + 5}s`,
              transform: `translate(${randomWindX}vw, -100vh) rotate(${randomRotation}deg)`, // Initial transform with random wind and rotation
            }}
          ></div>
        );
      })}

      <style jsx>{`
        @keyframes fall {
          0% {
            transform: translate(-30vw, -100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translate(60vw, 100vh) rotate(360deg);
            opacity: 0.3;
          }
        }

        .animate-fall {
          animation: fall linear infinite;
        }
      `}</style>
    </div>
  );
};

export default SnowEffect;
