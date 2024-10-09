import ProjectList from '@/components/experiences/ProjectList';
import ProfessionalList from '@/components/experiences/ProfessionalList';
import ExperienceWord from '@/components/experiences/ExperienceWord';
import SnowEffect from '@/components/effect/SnowEffect'; // Import the SnowEffect component

export const revalidate = 60; // Revalidate every 60 seconds

const fetchProjects = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/summaries`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch projects data');
  }

  const data = await res.json();
  return data;
};

const fetchProfessionals = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/professionals/summaries`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch professionals data');
  }

  const data = await res.json();
  return data;
};

const fetchExperienceWord = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/experiencewords`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch experience word data');
  }

  const data = await res.json();
  return data.words; // Return the first experience word directly
};

export default async function Experiences() {
  const projects = await fetchProjects();
  const professionals = await fetchProfessionals();
  const experienceWord = await fetchExperienceWord();

  return (
    <div className="relative p-6 bg-white dark:bg-black min-h-screen overflow-hidden">
      {/* Snow effect */}
      <SnowEffect />

      {/* Main Content */}
      <section className="relative z-10 flex flex-col items-center justify-center h-screen">
        <ExperienceWord title={experienceWord.title} description={experienceWord.description} />
      </section>
      
      <section className="relative z-10">
        <h1 className="text-3xl font-bold mb-6 text-black dark:text-white">Experiences</h1>

        <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">Projects</h2>
        <ProjectList projects={projects} />

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-black dark:text-white">Professionals</h2>
        <ProfessionalList professionals={professionals} />
      </section>
    </div>
  );
}
