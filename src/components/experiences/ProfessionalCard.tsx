import Link from 'next/link';
import Image from 'next/image';

// Helper function to format the date and remove the 'T' part
const formatDate = (dateString: string | null) => {
  return dateString ? dateString.split('T')[0] : 'N/A';
};

type ProfessionalCardProps = {
  professional: {
    id: string;
    title: string;
    startTime: string | null;
    endTime: string | null;
    media: string[];
    description: string | null;
    company: string | null;
    skills: string | null;
  };
};

export default function ProfessionalCard({ professional }: ProfessionalCardProps) {
  return (
    <div className="border rounded-lg shadow-lg overflow-hidden">
      <Link
        href={{
          pathname: `/experiences/professionals/${professional.id}`,
          query: {
            title: professional.title,
            description: professional.description,
            startTime: formatDate(professional.startTime), // Format the date
            endTime: formatDate(professional.endTime),     // Format the date
            company: professional.company,
            skills: professional.skills,
            media: JSON.stringify(professional.media),
          },
        }}
      >
        {/* Media Section (Display the first image) */}
        {professional.media && professional.media.length > 0 ? (
          <Image
            src={`${process.env.NEXT_PUBLIC_API_URL}/${professional.media[0]}`} // Display the first image
            alt={professional.title}
            width={400}
            height={200}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-gray-300 flex items-center justify-center text-gray-500">
            No Image Available
          </div>
        )}

        {/* Bottom Section with Title, Company, Start and End Time */}
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-2">{professional.title}</h2>
          {professional.company && (
            <p className="text-sm text-gray-600">Company: {professional.company}</p>
          )}
          <p className="text-sm text-gray-600">
            Start: {formatDate(professional.startTime)} | End: {formatDate(professional.endTime)}
          </p>
        </div>
      </Link>
    </div>
  );
}
