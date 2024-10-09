import { FaPen, FaTrashAlt } from 'react-icons/fa';
import { ChangeEvent, useMemo } from 'react';
import { ExperiencesProvider, useExperiencesContext } from '@/contexts/ExperiencesContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import Notification from '@/components/Notification';
import Image from 'next/image'; // Import Image from Next.js

interface ExperiencesSectionProps {
  activeSubSection: string | null;
}

type Project = {
  id: string;
  title: string;
  startTime: string | null;
  endTime: string | null;
  skills: string | null;
  link: string | null;
  description: string | null;
  media: (string | File)[]; // Array of media file paths or blob URLs
};

type Professional = {
  id: string;
  title: string;
  startTime: string | null;
  endTime: string | null;
  company: string | null;
  skills: string | null;
  description: string | null;
  media: (string | File)[]; // Array of media file paths or blob URLs
};

interface ProfessionalFormProps {
  professional: Professional; // Renamed property
  setProfessional: (professional: Professional) => void; // Renamed function
  handleSubmit: () => void;
  isEdit: boolean;
  handleCancel?: () => void;
  handleMediaChange: (e: ChangeEvent<HTMLInputElement>, professionalType: 'edit' | 'new') => void; // Renamed parameter
}


interface ProjectFormProps {
  project: Project;
  setProject: (project: Project) => void;
  handleSubmit: () => void;
  isEdit: boolean;
  handleCancel?: () => void;
  handleMediaChange: (e: ChangeEvent<HTMLInputElement>, projectType: 'edit' | 'new') => void;
}

const ProjectForm = ({
  project,
  setProject,
  handleSubmit,
  isEdit,
  handleCancel,
  handleMediaChange,
}: ProjectFormProps) => {
  const handleMediaPreview = (preview: string | File) => {
    // Check if the media is from the server or locally uploaded (blob URL)
    if (typeof preview === 'string') {
      return preview.includes('blob') || !isEdit
        ? preview // Local blob URL or new media
        : `${process.env.NEXT_PUBLIC_API_URL}/${preview.replace(/\\/g, '/')}`; // Server media
    }
    return URL.createObjectURL(preview); // Preview for File objects
  };

  return (
    <div className="mb-4">
      <div className="mb-2">
        <label className="block text-gray-800 dark:text-gray-100">Project Title:</label>
        <input
          type="text"
          value={project.title}
          onChange={(e) => setProject({ ...project, title: e.target.value })}
          className="w-full px-3 py-2 border rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-2">
        <label className="block text-gray-800 dark:text-gray-100">Skills:</label>
        <input
          type="text"
          value={project.skills || ''} // Handle null
          onChange={(e) => setProject({ ...project, skills: e.target.value || null })}
          className="w-full px-3 py-2 border rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-2">
        <label className="block text-gray-800 dark:text-gray-100">Start Time:</label>
        <input
          type="date"
          value={project.startTime ? project.startTime.split('T')[0] : ''} // Handle null
          onChange={(e) => setProject({ ...project, startTime: e.target.value || null })}
          className="w-full px-3 py-2 border rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-2">
        <label className="block text-gray-800 dark:text-gray-100">End Time:</label>
        <input
          type="date"
          value={project.endTime ? project.endTime.split('T')[0] : ''} // Handle null
          onChange={(e) => setProject({ ...project, endTime: e.target.value || null })}
          className="w-full px-3 py-2 border rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-2">
        <label className="block text-gray-800 dark:text-gray-100">Link:</label>
        <input
          type="url"
          value={project.link || ''} // Handle null
          onChange={(e) => setProject({ ...project, link: e.target.value || null })}
          className="w-full px-3 py-2 border rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-2">
        <label className="block text-gray-800 dark:text-gray-100">Media Files:</label>
        <input
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={(e) => handleMediaChange(e, isEdit ? 'edit' : 'new')}
          className="w-full px-3 py-2 border rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-800 dark:text-gray-100">Media Previews:</label>
        <div className="flex flex-wrap gap-2">
          {project.media.map((preview, index) => (
            <div key={index} className="relative">
              <Image
                src={handleMediaPreview(preview)}
                alt={`media preview ${index}`}
                width={96}
                height={96}
                className="object-cover rounded-md"
              />

              <button
                onClick={() =>
                  setProject({
                    ...project,
                    media: project.media.filter((_, i) => i !== index),
                  })
                }
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="mb-2">
        <label className="block text-gray-800 dark:text-gray-100">Description:</label>
        <textarea
          value={project.description || ''} // Handle null
          onChange={(e) => setProject({ ...project, description: e.target.value || null })}
          className="w-full px-3 py-2 border rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex space-x-4">
        <button
          onClick={handleSubmit}
          className={`px-4 py-2 ${isEdit ? 'bg-blue-500' : 'bg-green-500'} text-white rounded-md hover:bg-${
            isEdit ? 'blue' : 'green'
          }-600`}
        >
          {isEdit ? 'Update Project' : 'Add Project'}
        </button>
        {isEdit && (
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};

const ProfessionalForm = ({
  professional,
  setProfessional,
  handleSubmit,
  isEdit,
  handleCancel,
  handleMediaChange,
}: ProfessionalFormProps) => {
  const handleMediaPreview = (preview: string | File) => {
    // Check if the media is from the server or locally uploaded (blob URL)
    if (typeof preview === 'string') {
      return preview.includes('blob') || !isEdit
        ? preview // Local blob URL or new media
        : `${process.env.NEXT_PUBLIC_API_URL}/${preview.replace(/\\/g, '/')}`; // Server media
    }
    return URL.createObjectURL(preview); // Preview for File objects
  };

  return (
    <div className="mb-4">
      <div className="mb-2">
        <label className="block text-gray-800 dark:text-gray-100">Job Title:</label>
        <input
          type="text"
          value={professional.title}
          onChange={(e) => setProfessional({ ...professional, title: e.target.value })}
          className="w-full px-3 py-2 border rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-2">
        <label className="block text-gray-800 dark:text-gray-100">Company:</label>
        <input
          type="text"
          value={professional.company || ''}
          onChange={(e) => setProfessional({ ...professional, company: e.target.value })}
          className="w-full px-3 py-2 border rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-2">
        <label className="block text-gray-800 dark:text-gray-100">Skills:</label>
        <input
          type="text"
          value={professional.skills || ''} // Handle null
          onChange={(e) => setProfessional({ ...professional, skills: e.target.value || null })}
          className="w-full px-3 py-2 border rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-2">
        <label className="block text-gray-800 dark:text-gray-100">Start Time:</label>
        <input
          type="date"
          value={professional.startTime ? professional.startTime.split('T')[0] : ''}
          onChange={(e) => setProfessional({ ...professional, startTime: e.target.value || null })}
          className="w-full px-3 py-2 border rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-2">
        <label className="block text-gray-800 dark:text-gray-100">End Time:</label>
        <input
          type="date"
          value={professional.endTime ? professional.endTime.split('T')[0] : ''}
          onChange={(e) => setProfessional({ ...professional, endTime: e.target.value || null })}
          className="w-full px-3 py-2 border rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-2">
        <label className="block text-gray-800 dark:text-gray-100">Media Files:</label>
        <input
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={(e) => handleMediaChange(e, isEdit ? 'edit' : 'new')}
          className="w-full px-3 py-2 border rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-800 dark:text-gray-100">Media Previews:</label>
        <div className="flex flex-wrap gap-2">
          {professional.media && professional.media.map((preview, index) => (
            <div key={index} className="relative">
              <Image
                src={handleMediaPreview(preview)}
                alt={`media preview ${index}`}
                width={96}
                height={96}
                className="object-cover rounded-md"
              />
              <button
                onClick={() =>
                  setProfessional({
                    ...professional,
                    media: professional.media.filter((_, i) => i !== index),
                  })
                }
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="mb-2">
        <label className="block text-gray-800 dark:text-gray-100">Description:</label>
        <textarea
          value={professional.description || ''}
          onChange={(e) => setProfessional({ ...professional, description: e.target.value || null })}
          className="w-full px-3 py-2 border rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex space-x-4">
        <button
          onClick={handleSubmit}
          className={`px-4 py-2 ${isEdit ? 'bg-blue-500' : 'bg-green-500'} text-white rounded-md hover:bg-${
            isEdit ? 'blue' : 'green'
          }-600`}
        >
          {isEdit ? 'Update Professional Experience' : 'Add Professional Experience'}
        </button>
        {isEdit && (
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};


const ExperiencesSectionContent = ({ activeSubSection }: ExperiencesSectionProps) => {
  const {
    projects,
    newProject,
    setNewProject,
    isNewProjectVisible,
    setIsNewProjectVisible,
    handleAddOrUpdateProject,
    handleDeleteProject,
    editProject,
    setEditProject,
    handleProjectMediaChange,
    professionals,
    newProfessional,
    setNewProfessional,
    isNewProfessionalVisible,
    setIsNewProfessionalVisible,
    handleAddOrUpdateProfessional,
    handleDeleteProfessional,
    editProfessional,
    setEditProfessional,
    handleProfessionalMediaChange,

    experienceWord, 
    setExperienceWord, 
    handleSaveExperienceWord, 

  } = useExperiencesContext();

  const projectList = useMemo(() => (Array.isArray(projects) ? projects : []), [projects]);
  const professionalList = useMemo(() => (Array.isArray(professionals) ? professionals : []), [professionals]);

  return (
    <div className="h-full">
      {activeSubSection === 'experienceWords' ? (
        <div>
            <h2 className="text-2xl font-bold mb-2">Experience Words</h2>
            <div className="mt-4">
            <label className="block mb-2 text-gray-800 dark:text-gray-100">Title:</label>
              
            <input 
              type="text" 
              value={experienceWord.title ?? ''}
              onChange={(e) => setExperienceWord({ ...experienceWord, title: e.target.value })}
              className="w-full px-4 py-2 border rounded-md mb-4 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" 
              placeholder="Enter the title"
              />
             <label className="block mb-2 text-gray-800 dark:text-gray-100">Description:</label>
              
            <textarea
              value={experienceWord.description ?? ''}
              onChange={(e) => setExperienceWord({ ...experienceWord, description: e.target.value })}
              className="w-full px-4 py-2 border rounded-md mb-4 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="Enter the description"
              />
            <button onClick={handleSaveExperienceWord} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
              Save Experience Words
            </button>
            </div>
        </div>
      ) : activeSubSection === 'projectExperiences' ? (
        <>
          <h2 className="text-2xl font-bold mb-4">Project Experiences</h2>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 mb-4"
            onClick={() => setIsNewProjectVisible(!isNewProjectVisible)}
          >
            {isNewProjectVisible ? 'Cancel New Project' : 'Add New Project'}
          </button>

          <div className="overflow-y-auto h-[500px]">
            {isNewProjectVisible && (
              <ProjectForm
                project={newProject}
                setProject={setNewProject}
                handleSubmit={() => handleAddOrUpdateProject()}
                handleMediaChange={handleProjectMediaChange}
                isEdit={false}
              />
            )}

            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border px-4 py-2">Title</th>
                  <th className="border px-4 py-2">Skill</th>
                  <th className="border px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projectList.map((project, index) => (
                  <tr key={index}>
                    <td className="border px-4 py-2">{project.title}</td>
                    <td className="border px-4 py-2">{project.skills}</td>
                    <td className="border px-4 py-2 flex space-x-4">
                      <button
                        onClick={() => setEditProject(project)}
                        className="flex items-center text-blue-500 hover:text-blue-700 focus:outline-none"
                      >
                        <FaPen className="mr-2" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProject(project.id)}
                        className="flex items-center text-red-500 hover:text-red-700 focus:outline-none"
                      >
                        <FaTrashAlt className="mr-2" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {editProject && (
              <ProjectForm
                project={editProject}
                setProject={setEditProject}
                handleSubmit={() => handleAddOrUpdateProject(true)}
                handleMediaChange={handleProjectMediaChange}
                isEdit
                handleCancel={() => setEditProject(null)}
              />
            )}
          </div>
        </>
      ) : activeSubSection === 'professionalExperiences' ? (
        <>
          <h2 className="text-2xl font-bold mb-4">Professional Experiences</h2>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 mb-4"
            onClick={() => setIsNewProfessionalVisible(!isNewProfessionalVisible)}
          >
            {isNewProfessionalVisible ? 'Cancel New Professional' : 'Add New Professional'}
          </button>
      
          <div className="overflow-y-auto h-[500px]">
            {isNewProfessionalVisible && (
              <ProfessionalForm
                professional={newProfessional} // Cast if necessary
                setProfessional={setNewProfessional}
                handleSubmit={() => handleAddOrUpdateProfessional()}
                handleMediaChange={handleProfessionalMediaChange}
                isEdit={false}
              />
            )}
      
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border px-4 py-2">Title</th>
                  <th className="border px-4 py-2">Company</th>
                  <th className="border px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {professionalList.map((experience, index) => (
                  <tr key={index}>
                    <td className="border px-4 py-2">{experience.title}</td>
                    <td className="border px-4 py-2">{experience.company}</td>
                    <td className="border px-4 py-2 flex space-x-4">
                      <button
                        onClick={() => setEditProfessional(experience)}
                        className="flex items-center text-blue-500 hover:text-blue-700 focus:outline-none"
                      >
                        <FaPen className="mr-2" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProfessional(experience.id)}
                        className="flex items-center text-red-500 hover:text-red-700 focus:outline-none"
                      >
                        <FaTrashAlt className="mr-2" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
      
            {editProfessional && (
              <ProfessionalForm
                professional={editProfessional} // Cast if necessary
                setProfessional={setEditProfessional}
                handleSubmit={() => handleAddOrUpdateProfessional(true)}
                handleMediaChange={handleProfessionalMediaChange}
                isEdit
                handleCancel={() => setEditProfessional(null)}
              />
            )}
          </div>
        </>
      ) : (
        <div>
          <h1 className="text-3xl font-bold mb-4">Experiences</h1>
          <p>Select a subcategory from the catalog.</p>
        </div>
      )}
    </div>
  );
};


export default function ExperiencesSection({ activeSubSection }: { activeSubSection: string }) { // Expecting activeSubSection as a prop
  return (
    <NotificationProvider>
      <ExperiencesProvider>
        <ExperiencesSectionContent activeSubSection={activeSubSection} />
        <Notification />
      </ExperiencesProvider>
    </NotificationProvider>
  );
}
