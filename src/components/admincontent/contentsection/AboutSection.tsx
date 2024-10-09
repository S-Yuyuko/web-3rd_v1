import { AboutProvider, useAboutContext } from '@/contexts/AboutContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import Notification from '@/components/Notification';

const AboutSectionContent = () => {
  const { 
    aboutInfo, 
    setAboutInfo, 
    handleSaveAboutInfo 
  } = useAboutContext();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">About Section</h2>
      <div className="mt-4">
        <label className="block mb-2 text-gray-800 dark:text-gray-100">Information:</label>
        <textarea
          value={aboutInfo.information ?? ''}  // Ensure the value is a string
          onChange={(e) => setAboutInfo({ ...aboutInfo, information: e.target.value })}
          className="w-full px-4 py-2 border rounded-md mb-4 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" 
          placeholder="Enter the information"
        />

        <label className="block mb-2 text-gray-800 dark:text-gray-100">Skills:</label>
        <textarea
          value={aboutInfo.skills ?? ''} // Ensure the value is a string
          onChange={(e) => setAboutInfo({ ...aboutInfo, skills: e.target.value })}
          className="w-full px-4 py-2 border rounded-md mb-4 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" 
          placeholder="Enter skills"
        />

        <label className="block mb-2 text-gray-800 dark:text-gray-100">Education:</label>
        <textarea
          value={aboutInfo.education ?? ''} // Ensure the value is a string
          onChange={(e) => setAboutInfo({ ...aboutInfo, education: e.target.value })}
          className="w-full px-4 py-2 border rounded-md mb-4 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" 
          placeholder="Enter education"
        />

        <button onClick={handleSaveAboutInfo} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          Save About Info
        </button>
      </div>
    </div>
  );
};

export default function AboutSection() {
  return (
    <NotificationProvider>
      <AboutProvider>
        <AboutSectionContent />
        <Notification />
      </AboutProvider>
    </NotificationProvider>
  );
}
