'use client';

import React from 'react';

const RainEffect = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 100 }).map((_, index) => (
        <div
          key={index}
          className="raindrop absolute bg-gray-500"
          style={{
            width: '2px', // Set a thin raindrop width
            height: '15px', // Set a raindrop height
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${Math.random() * 2 + 3}s`, // Slightly slower fall
          }}
        ></div>
      ))}

      <style jsx>{`
        @keyframes fall {
          0% {
            transform: translateY(-100vh);
            opacity: 0;
          }
          20% {
            opacity: 0.5;
          }
          100% {
            transform: translateY(100vh);
            opacity: 0;
          }
        }

        .raindrop {
          animation: fall linear infinite;
        }
      `}</style>
    </div>
  );
};

export default RainEffect;
