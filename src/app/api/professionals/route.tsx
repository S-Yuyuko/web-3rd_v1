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

// POST: Add a new professional
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const id = formData.get('id') as string;
    const title = formData.get('title') as string;
    const startTime = formData.get('startTime') as string;
    const endTime = formData.get('endTime') as string;
    const skills = formData.get('skills') as string;
    const company = formData.get('company') as string;
    const description = formData.get('description') as string;
    const mediaFiles = formData.getAll('media').filter(item => item instanceof File) as File[]; // Filter to only include File objects

    // Define the directory for file uploads
    const uploadDir = path.join(process.cwd(), 'public/uploads/professionals');
    await ensureDirectoryExists(uploadDir); // Ensure the directory exists

    // Array to store the paths of uploaded media files
    const mediaPaths: string[] = [];

    // Handle media file uploads and generate paths with the same format as the update function
    if (mediaFiles.length > 0) {
      const mediaUploadPromises = mediaFiles.map(async (file: File) => {
        const fileExtension = path.extname(file.name);
        const uniqueFileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${fileExtension}`;
        const filePath = path.join(uploadDir, uniqueFileName);

        // Save the file to the uploads directory
        const fileBuffer = Buffer.from(await file.arrayBuffer());
        await fs.writeFile(filePath, fileBuffer);

        // Store relative file path (for public access)
        const relativeFilePath = `/uploads/professionals/${uniqueFileName}`;
        mediaPaths.push(relativeFilePath);
      });

      await Promise.all(mediaUploadPromises);
    }

    // Insert professional data into the database, with media as a JSON field
    const [result] = await pool.query<ResultSetHeader>(`
      INSERT INTO professionals (id, title, startTime, endTime, skills, company, description, media)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        title,
        startTime,
        endTime,
        skills,
        company,
        description,
        JSON.stringify(mediaPaths) // Store media paths as a JSON array
      ]
    );

    return NextResponse.json({ message: 'Professional added successfully', id });
  } catch (error) {
    console.error('Error uploading professional:', error);
    return NextResponse.json({ error: 'Failed to add professional' }, { status: 500 });
  }
}

// GET: Fetch all professionals
export async function GET(req: NextRequest) {
  try {
    const [professionals] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM professionals'
    );
    return NextResponse.json(professionals, { status: 200 });
  } catch (error) {
    console.error('Error fetching all professionals:', error);
    return NextResponse.json({ message: 'Failed to fetch professionals' }, { status: 500 });
  }
}
