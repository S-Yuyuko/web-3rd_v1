import AboutSection from '@/components/AboutSection';
import CloudEffect from '@/components/effect/CloudEffect';
import { FaInfoCircle, FaTools, FaGraduationCap } from 'react-icons/fa';

const fetchAboutInfo = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/about`);
  if (!res.ok) {
    throw new Error('Failed to fetch about information');
  }
  const data = await res.json();
  return data.about; // Get the first entry from the about array
};

export default async function About() {
  const data = await fetchAboutInfo();
  const sections = [
    { title: 'Information', content: data.information, icon: <FaInfoCircle />, bgColor: 'bg-gradient-to-b from-[#0f3460] to-[#1a1a2e]', textColor: 'text-white' },
    { title: 'Skills', content: data.skills, icon: <FaTools />, bgColor: 'bg-gradient-to-b from-[#1a1a2e] to-[#162447]', textColor: 'text-white' },
    { title: 'Education', content: data.education, icon: <FaGraduationCap />, bgColor: 'bg-gradient-to-b from-[#162447] to-[#0f3460]', textColor: 'text-white' },
  ];

  return (
    <div className="relative min-h-screen">
      <CloudEffect />
      {sections.map((section, index) => (
        <AboutSection 
          key={index} 
          title={section.title} 
          content={section.content} 
          icon={section.icon} 
          bgColor={section.bgColor} 
          textColor={section.textColor} 
        />
      ))}
    </div>
  );
}
