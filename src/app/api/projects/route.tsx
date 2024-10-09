import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import pool from '@/lib/db'; // Ensure this is the correct path
import { RowDataPacket, ResultSetHeader } from 'mysql2'; // Import both RowDataPacket and ResultSetHeader

// Helper function to ensure the upload directory exists
async function ensureDirectoryExists(dir: string) {
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    // Extract the id from formData or use uuidv4 (already imported elsewhere)
    const id = formData.get('id') as string;
    const title = formData.get('title') as string;
    const startTime = formData.get('startTime') as string;
    const endTime = formData.get('endTime') as string;
    const skills = formData.get('skills') as string;
    const link = formData.get('link') as string;
    const description = formData.get('description') as string;
    const mediaFiles = formData.getAll('media').filter(item => item instanceof File) as File[]; // Filter to only include File objects

    // Define the directory for file uploads
    const uploadDir = path.join(process.cwd(), 'public/uploads/projects');
    await ensureDirectoryExists(uploadDir); // Ensure the directory exists

    // Array to store the paths of uploaded media files
    const mediaPaths: string[] = [];

    // Handle media file uploads and generate paths with the same format as the update function
    if (mediaFiles.length > 0) {
      const mediaUploadPromises = mediaFiles.map(async (file: File) => {
        // Extract the file extension (e.g., .jpg, .png)
        const fileExtension = path.extname(file.name);
        // Generate a unique filename: current timestamp + random number + file extension
        const uniqueFileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${fileExtension}`;
        const filePath = path.join(uploadDir, uniqueFileName); // Full path to save the file

        // Save the file to the uploads directory
        const fileBuffer = Buffer.from(await file.arrayBuffer());
        await fs.writeFile(filePath, fileBuffer);

        // Store relative file path (for public access)
        const relativeFilePath = `/uploads/projects/${uniqueFileName}`;
        mediaPaths.push(relativeFilePath);
      });

      await Promise.all(mediaUploadPromises);
    }

    // Insert project data into the database, with media as a JSON field
    const [result] = await pool.query<ResultSetHeader>(`
      INSERT INTO projects (id, title, startTime, endTime, skills, link, description, media)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        title,
        startTime,
        endTime,
        skills,
        link,
        description,
        JSON.stringify(mediaPaths) // Store media paths as a JSON array
      ]
    );

    return NextResponse.json({ message: 'Project added successfully', id });
  } catch (error) {
    console.error('Error uploading project:', error);
    return NextResponse.json({ error: 'Failed to add project' }, { status: 500 });
  }
}

// GET function to fetch all project details
export async function GET(req: NextRequest) {
  try {
    const [projects] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM projects'
    );
    return NextResponse.json(projects, { status: 200 });
  } catch (error) {
    console.error('Error fetching all projects:', error);
    return NextResponse.json({ message: 'Failed to fetch projects' }, { status: 500 });
  }
}
