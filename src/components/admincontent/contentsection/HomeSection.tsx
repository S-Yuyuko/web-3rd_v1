import { useState } from 'react';
import { FaTimes, FaTrashAlt } from 'react-icons/fa';
import Image from 'next/image';
import { HomeProvider, useHomeContext } from '@/contexts/HomeContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import Notification from '@/components/Notification';

const HomeSectionContent = ({ activeSubSection }: { activeSubSection: string }) => {
  const { 
    previewUrl, 
    handleFileChange, 
    handleUpload, 
    handleCancel, 
    slidePictures, 
    handleDeletePicture, 
    homeWord, 
    setHomeWord, 
    handleSaveHomeWord
  } = useHomeContext();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const openModal = (imagePath: string) => {
    setSelectedImage(imagePath);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedImage(null);
    setIsModalOpen(false);
  };

  const renderSubContent = () => {
    switch (activeSubSection) {
      case 'homeWords':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-2">Home Words</h2>
            <div className="mt-4">
              <label className="block mb-2 text-gray-800 dark:text-gray-100">Title:</label>
              <input 
                type="text" 
                value={homeWord.title ?? ''}  // Ensure the value is a string
                onChange={(e) => setHomeWord({ ...homeWord, title: e.target.value })} 
                className="w-full px-4 py-2 border rounded-md mb-4 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="Enter the title"
              />

              <label className="block mb-2 text-gray-800 dark:text-gray-100">Description:</label>
              <textarea
                value={homeWord.description ?? ''}  // Ensure the value is a string
                onChange={(e) => setHomeWord({ ...homeWord, description: e.target.value })}
                className="w-full px-4 py-2 border rounded-md mb-4 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="Enter the description"
              />

              <button onClick={handleSaveHomeWord} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                Save Home Words
              </button>
            </div>
          </div>
        );
      
      case 'slidePicture':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-2">Slider Picture</h2>
            <div className="mt-4">
              <label className="block mb-2 text-gray-800 dark:text-gray-100">Upload Picture:</label>
              <input 
                type="file" 
                onChange={handleFileChange} 
                value="" // Always provide a fallback to prevent uncontrolled input issues
                className="mb-4 w-full px-4 py-2 border rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
              {previewUrl && (
                <div className="relative mb-4">
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    width={256}
                    height={256}
                    className="border rounded-md"
                  />
                  <button
                    onClick={handleCancel}
                    className="absolute top-2 left-2 text-white bg-red-500 hover:bg-red-600 rounded-full p-1 focus:outline-none"
                  >
                    <FaTimes className="w-4 h-4" />
                  </button>
                </div>
              )}
              <button onClick={handleUpload} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                Upload Picture
              </button>
            </div>
            <div className="mt-4">
              <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-100">Uploaded Pictures</h3>
              <table className="w-full border-collapse text-center"> 
                <thead>
                  <tr>
                    <th className="border px-4 py-2">Picture Preview</th>
                    <th className="border px-4 py-2">Picture Name</th>
                    <th className="border px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {slidePictures.map((picture) => (
                    <tr key={picture.name} className="align-middle">
                      <td className="border px-4 py-2 align-middle flex justify-center items-center">
                        <Image
                          src={`${process.env.NEXT_PUBLIC_API_URL}${picture.path}`}
                          alt={picture.name}
                          width={100}
                          height={100}
                          className="border rounded-md cursor-pointer"
                          onClick={() => openModal(`${process.env.NEXT_PUBLIC_API_URL}${picture.path}`)}
                        />
                      </td>
                      <td className="border px-4 py-2 align-middle">{picture.name}</td>
                      <td className="border px-4 py-2 align-middle">
                        <button
                          onClick={() => handleDeletePicture(picture.name)}
                          className="flex items-center justify-center text-red-500 hover:text-red-700 focus:outline-none"
                        >
                          <FaTrashAlt className="mr-2" /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      
      default:
        return (
          <div>
            <h1 className="text-3xl font-bold mb-4">Home</h1>
            <p>Select a subcategory from the catalog.</p>
          </div>
        );
    }
  };

  return (
    <div>
      {renderSubContent()}

      {isModalOpen && selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex justify-center items-center">
          <div className="relative w-full h-full">
            <Image
              src={selectedImage}
              alt="Full size"
              layout="fill"
              objectFit="contain"
              className="rounded-md"
            />
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 rounded-full p-2 focus:outline-none text-white"
            >
              <FaTimes className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default function HomeSection({ activeSubSection }: { activeSubSection: string }) { // Expecting activeSubSection as a prop
  return (
    <NotificationProvider>
      <HomeProvider>
        <HomeSectionContent activeSubSection={activeSubSection} />
        <Notification />
      </HomeProvider>
    </NotificationProvider>
  );
}
