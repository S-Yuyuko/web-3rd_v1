import { notFound } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
import MediaGallery from '@/components/experiences/MediaGallery';
import RainEffect from '@/components/effect/RainEffect'; // Ensure this path is correct

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic'; 

// Function to fetch professional data from the API
async function fetchProfessionalData(id: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/professionals/${id}`);

    if (!res.ok) {
      console.error('Failed to fetch professional data:', res.statusText);
      return null;
    }

    const professionalData = await res.json();
    return professionalData;
  } catch (error) {
    console.error('Error fetching professional data:', error);
    return null;
  }
}

// Generate static params for all professionals
export async function generateStaticParams() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/professionals/summaries`);

    if (!res.ok) {
      console.error('Failed to fetch professionals summaries:', res.statusText);
      return [];
    }

    const professionals = await res.json();

    return professionals.map((professional: { id: string }) => ({
      id: professional.id,
    }));
  } catch (error) {
    console.error('Error fetching professional summaries:', error);
    return [];
  }
}

export default async function ProfessionalPage({ params }: { params: { id: string } }) {
  const professionalData = await fetchProfessionalData(params.id);

  if (!professionalData) {
    notFound();
  }

  const { title, startTime, endTime, skills, description, media, company } = professionalData;

  return (
    <div className="relative overflow-hidden">
      {/* New Rain Effect */}
      <RainEffect />

      <div className="p-6 max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md mt-10 relative z-10">
        {/* Left-Aligned Back Arrow Section */}
        <div className="flex justify-start mb-4">
          <Link href="/experiences" className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
            <FaArrowLeft className="mr-2" />
            <span>Back to Experiences</span>
          </Link>
        </div>

        {/* Title Section */}
        <h1 className="text-4xl font-bold mb-4 text-center text-gray-800 dark:text-gray-100">
          {title}
        </h1>

        {/* Company Section */}
        {company && (
          <h2 className="text-2xl font-semibold mb-4 text-center text-gray-700 dark:text-gray-300">
            {company}
          </h2>
        )}

        {/* Date and Skills Section */}
        <div className="flex justify-between items-center mb-6 text-gray-600 dark:text-gray-400 text-sm">
          <p>
            <span className="font-semibold">Start: </span>
            {startTime}
          </p>
          <p>
            <span className="font-semibold">End: </span>
            {endTime}
          </p>
        </div>

        {/* Description Section */}
        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
          {description}
        </p>

        {/* Skills Section */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">Skills Used</h3>
          <p className="text-gray-700 dark:text-gray-300">
            {skills}
          </p>
        </div>

        {/* Media Gallery Section */}
        {media.length > 0 && (
          <MediaGallery mediaUrls={media} />
        )}
      </div>
    </div>
  );
}
