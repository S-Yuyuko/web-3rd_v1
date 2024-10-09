"use client";

import React from 'react';

const bubbles = [
  'bg-blue-400', 'bg-purple-400', 'bg-pink-400', 'bg-yellow-400', 'bg-green-400',
];

const BubbleEffect = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {bubbles.map((color, index) => (
        <div key={index} className={`bubble ${color} absolute`}></div>
      ))}
      <style jsx>{`
        .bubble {
          position: absolute;
          border-radius: 50%;
          opacity: 0.6;
          animation: bubble 15s infinite ease-in-out;
        }

        .bubble:nth-child(1) {
          width: 200px;
          height: 200px;
          bottom: -100px;
          left: 10%;
          animation-delay: 0s;
        }

        .bubble:nth-child(2) {
          width: 150px;
          height: 150px;
          bottom: -50px;
          left: 60%;
          animation-delay: 2s;
        }

        .bubble:nth-child(3) {
          width: 300px;
          height: 300px;
          bottom: -150px;
          left: 30%;
          animation-delay: 4s;
        }

        .bubble:nth-child(4) {
          width: 250px;
          height: 250px;
          bottom: -200px;
          left: 80%;
          animation-delay: 6s;
        }

        .bubble:nth-child(5) {
          width: 100px;
          height: 100px;
          bottom: -100px;
          left: 50%;
          animation-delay: 8s;
        }

        @keyframes bubble {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-100vh) scale(1.2);
          }
        }
      `}</style>
    </div>
  );
};

export default BubbleEffect;
