'use client'; // Client-side component

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import Image from 'next/image';

type SlideShowProps = {
  pictures: { name: string; path: string }[];
};

const SlideShow = ({ pictures }: SlideShowProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const slideRef = useRef<HTMLDivElement | null>(null);

  // Automatically change slides every 5 seconds
  useEffect(() => {
    if (pictures.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % pictures.length);
    }, 5000);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [pictures.length]);

  // Handle visibility on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.5 } // Trigger when 50% of the component is visible
    );

    const currentSlideRef = slideRef.current; // Store the ref in a local variable

    if (currentSlideRef) {
      observer.observe(currentSlideRef);
    }

    return () => {
      if (currentSlideRef) {
        observer.unobserve(currentSlideRef); // Use the stored ref in the cleanup function
      }
    };
  }, []);

  // Navigate to the next slide (memoized to prevent unnecessary re-renders)
  const nextSlide = useCallback(() => {
    setCurrentIndex((currentIndex + 1) % pictures.length);
  }, [currentIndex, pictures.length]);

  // Navigate to the previous slide (memoized to prevent unnecessary re-renders)
  const prevSlide = useCallback(() => {
    setCurrentIndex((currentIndex - 1 + pictures.length) % pictures.length);
  }, [currentIndex, pictures.length]);

  // Go to a specific slide (memoized to prevent unnecessary re-renders)
  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  // Memoize the current slide to avoid rendering non-visible slides
  const currentSlide = useMemo(() => {
    if (pictures.length === 0 || !pictures[currentIndex]) {
      return null; // If pictures array is empty or invalid index, return null
    }

    return (
      <div className="absolute inset-0 transition-opacity duration-1000 ease-in-out opacity-100">
        <Image
          src={pictures[currentIndex].path}
          alt={pictures[currentIndex].name}
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
      </div>
    );
  }, [currentIndex, pictures]);

  if (pictures.length === 0) {
    return <div>No pictures available</div>;
  }

  return (
    <div
      ref={slideRef}
      className={`relative w-full h-screen overflow-hidden transition-opacity duration-1000 ease-in-out transform ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Render only the current slide */}
      {currentSlide}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-5 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
        aria-label="Previous Slide"
      >
        &#10094;
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-5 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
        aria-label="Next Slide"
      >
        &#10095;
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {pictures.map((_, index: number) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full ${
              index === currentIndex ? 'bg-white' : 'bg-gray-400'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default SlideShow;
