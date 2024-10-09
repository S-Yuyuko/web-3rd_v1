"use client"; // Ensure this component is treated as a client-side component

import { useState } from 'react';
import Image from 'next/image';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

interface MediaGalleryProps {
  mediaUrls?: string[]; // Optional prop in case it's not passed correctly
}

const MediaGallery: React.FC<MediaGalleryProps> = ({ mediaUrls = [] }) => { // Default to an empty array
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const openImage = (index: number) => {
    setSelectedImageIndex(index);
  };

  const closeImage = () => {
    setSelectedImageIndex(null);
  };

  const showPrevImage = () => {
    if (selectedImageIndex !== null && selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  const showNextImage = () => {
    if (selectedImageIndex !== null && selectedImageIndex < mediaUrls.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Media</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {mediaUrls.map((url: string, index: number) => (
          <div
            key={index}
            className="relative w-full h-48 cursor-pointer"
            onClick={() => openImage(index)}
          >
            <Image
              src={`${process.env.NEXT_PUBLIC_API_URL}/${decodeURIComponent(url).replace(/^\//, '')}`}
              alt={`Media ${index + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{ objectFit: 'cover' }}
              className="rounded-md"
              priority={index === 0}
            />
          </div>
        ))}
      </div>

      {/* Fullscreen Image Modal */}
      {selectedImageIndex !== null && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center"
          onClick={closeImage}
        >
          <div className="relative w-full h-full">
            <Image
              src={`${process.env.NEXT_PUBLIC_API_URL}/${decodeURIComponent(mediaUrls[selectedImageIndex]).replace(/^\//, '')}`}
              alt={`Enlarged Media ${selectedImageIndex + 1}`}
              fill
              sizes="100vw"
              style={{ objectFit: 'contain' }}
              className="rounded-md"
            />
          </div>
          <button
            onClick={closeImage}
            className="absolute top-4 right-4 text-white text-2xl"
          >
            &times;
          </button>
          {selectedImageIndex > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                showPrevImage();
              }}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-2xl"
            >
              <FaArrowLeft />
            </button>
          )}
          {selectedImageIndex < mediaUrls.length - 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                showNextImage();
              }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-2xl"
            >
              <FaArrowRight />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default MediaGallery;
