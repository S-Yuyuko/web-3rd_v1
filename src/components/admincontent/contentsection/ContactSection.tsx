import { ContactProvider, useContactContext } from '@/contexts/ContactContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import Notification from '@/components/Notification';

const ContactSectionContent = () => {
  const { 
    contactInfo, 
    setContactInfo, 
    handleSaveContactInfo 
  } = useContactContext();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Contact Section</h2>
      <div className="mt-4">
        <label className="block mb-2 text-gray-800 dark:text-gray-100">Phone Number:</label>
        <textarea
          value={contactInfo.phone ?? ''} // Ensure the value is a string
          onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
          className="w-full px-4 py-2 border rounded-md mb-4 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" 
          placeholder="Enter phone number"
        />

        <label className="block mb-2 text-gray-800 dark:text-gray-100">Email:</label>
        <textarea
          value={contactInfo.email ?? ''} // Ensure the value is a string
          onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
          className="w-full px-4 py-2 border rounded-md mb-4 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" 
          placeholder="Enter email"
        />

        <label className="block mb-2 text-gray-800 dark:text-gray-100">LinkedIn:</label>
        <input
          type="url"
          value={contactInfo.linkedin ?? ''} // Ensure the value is a string
          onChange={(e) => setContactInfo({ ...contactInfo, linkedin: e.target.value })}
          className="w-full px-4 py-2 border rounded-md mb-4 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" 
          placeholder="Enter LinkedIn profile URL"
        />

        <label className="block mb-2 text-gray-800 dark:text-gray-100">GitHub:</label>
        <input
          type="url"
          value={contactInfo.github ?? ''} // Ensure the value is a string
          onChange={(e) => setContactInfo({ ...contactInfo, github: e.target.value })}
          className="w-full px-4 py-2 border rounded-md mb-4 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" 
          placeholder="Enter GitHub profile URL"
        />

        <button onClick={handleSaveContactInfo} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          Save Contact Info
        </button>
      </div>
    </div>
  );
};

export default function ContactSection() {
  return (
    <NotificationProvider>
      <ContactProvider>
        <ContactSectionContent />
        <Notification />
      </ContactProvider>
    </NotificationProvider>
  );
}
