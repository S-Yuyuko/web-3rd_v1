// Since you're using Next.js API routes, there's no need to import an external API_URL
// Simply use relative paths to call your API routes

// Export functions from various route files
export { loginRoute } from './routes/login'; // Export loginRoute from login.ts
export { fetchAdmins, addAdmin, updateAdmin, deleteAdmin } from './routes/admin'; // Export admin functions
export { uploadSlide, getSlidePictures, deleteSlidePicture } from './routes/slides'; // Export slide-related functions
export { addHomeWord, getHomeWords, updateHomeWord } from './routes/homewords'; // Export homeword functions

// Project and professional experience functions
export { fetchProjects, addProject, updateProject, deleteProject } from './routes/projectExperiences'; // Export project-related functions
export { fetchProfessionals, addProfessional, updateProfessional, deleteProfessional } from './routes/professionalExperiences'; // Export professional-related functions

// Experience words functions
export { addExperienceWord, getExperienceWords, updateExperienceWord } from './routes/experiencewords'; // Export experience word functions

// About section functions
export { addAboutEntry, getAboutEntries, updateAboutEntry } from './routes/about'; // Export about functions

// Contact section functions
export { addContactEntry, getContactEntries, updateContactEntry } from './routes/contact'; // Export contact functions
