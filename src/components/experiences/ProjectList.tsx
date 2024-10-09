"use client"
// src/components/experiences/ProjectList.tsx
import React, { useState, useEffect } from 'react';
import ProjectCard from '@/components/experiences/ProjectCard';

interface Project {
  id: string;
  title: string;
  startTime: string | null;
  endTime: string | null;
  media: string[];
  description: string;
  skills: string;
  link: string | null;
}

interface ProjectListProps {
  projects: Project[];
}

const ProjectList: React.FC<ProjectListProps> = ({ projects }) => {
  const [sortedProjects, setSortedProjects] = useState<Project[]>([]);

  useEffect(() => {
    const sorted = [...projects].sort((a, b) => a.title.localeCompare(b.title));
    setSortedProjects(sorted);
  }, [projects]);

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    let sorted: Project[];

    if (value === 'title') {
      sorted = [...projects].sort((a, b) => a.title.localeCompare(b.title));
    } else if (value === 'startTime') {
      sorted = [...projects].sort((a, b) => {
        if (!a.startTime) return 1;
        if (!b.startTime) return -1;
        return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
      });
    } else {
      sorted = projects; // Reset to original order if "none" selected
    }

    setSortedProjects(sorted);
  };

  return (
    <>
      <div className="mb-4">
        <label htmlFor="sort-select" className="mr-2 text-black dark:text-white">Sort by:</label>
        <select 
          id="sort-select" 
          onChange={handleSortChange} 
          className="p-2 border rounded text-black dark:text-white bg-white dark:bg-black border-gray-300 dark:border-gray-600"
        >
          <option value="title">Title</option>
          <option value="startTime">Start Time</option>
        </select>
      </div>

      {sortedProjects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4 rounded-md">
          {sortedProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <p className="mt-4 text-lg text-gray-100">No projects available.</p>
      )}
    </>
  );
};

export default ProjectList;
