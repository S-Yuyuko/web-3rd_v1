'use client'; // Client-side component

import { useEffect, useRef, useState } from 'react';

type ExperienceWordProps = {
  title: string;
  description: string;
};

const ExperienceWord = ({ title, description }: ExperienceWordProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          setIsVisible(false); // Reset visibility when it's out of view
        }
      },
      { threshold: 0.5 } // Trigger when 50% of the component is visible
    );

    const currentRef = ref.current; // Store ref.current in a variable

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef); // Use the stored ref value in the cleanup
      }
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`relative z-10 text-center transition-opacity duration-1000 transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      <h1 className="text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        {title}
      </h1>
      <p className="text-lg text-gray-700 dark:text-gray-300 whitespace-pre-line break-words">
        {description}
      </p>
    </div>
  );
};

export default ExperienceWord;
