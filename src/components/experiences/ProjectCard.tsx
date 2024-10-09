// src/components/ProjectCard.tsx
import Link from 'next/link';
import Image from 'next/image';

// Helper function to format the date and remove the 'T' part
const formatDate = (dateString: string | null) => {
  return dateString ? dateString.split('T')[0] : 'N/A';
};

type ProjectCardProps = {
  project: {
    id: string;
    title: string;
    startTime: string | null;
    endTime: string | null;
    media: string[];
    description: string;
    skills: string;
    link: string | null;
  };
};

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="border rounded-lg shadow-lg overflow-hidden">
      <Link
        href={{
          pathname: `/experiences/projects/${project.id}`,
          query: {
            title: project.title,
            description: project.description,
            startTime: formatDate(project.startTime), // Format the date
            endTime: formatDate(project.endTime),     // Format the date
            skills: project.skills,
            link: project.link,
            media: JSON.stringify(project.media),
          },
        }}
      >
        {/* Media Section (Display the first image) */}
        {project.media && project.media.length > 0 ? (
          <Image
            src={`${process.env.NEXT_PUBLIC_API_URL}/${project.media[0]}`} // Display the first image
            alt={project.title}
            width={400}
            height={200}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-gray-300 flex items-center justify-center text-gray-500">
            No Image Available
          </div>
        )}

        {/* Bottom Section with Title, Start and End Time */}
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-2">{project.title}</h2>
          <p className="text-sm text-gray-600">
            Start: {formatDate(project.startTime)} | End: {formatDate(project.endTime)}
          </p>
        </div>
      </Link>
    </div>
  );
}
