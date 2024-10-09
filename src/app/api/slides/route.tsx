import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import pool from '@/lib/db'; // Ensure this is the correct path to your DB connection
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// Helper function to ensure the upload directory exists
async function ensureDirectoryExists(dir: string) {
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
}

// POST: Add a new slide (upload slide image)
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    // Use 'file' instead of 'slide', based on the console.log output
    const slideFiles = formData.getAll('file').filter(item => item instanceof File) as File[]; 
    console.log(slideFiles);

    // Define the directory for slide uploads
    const uploadDir = path.join(process.cwd(), 'public/uploads/slides');
    await ensureDirectoryExists(uploadDir);

    // Array to store the paths and file names of uploaded slide files
    const slidePaths: { name: string, path: string }[] = [];

    // Handle slide file uploads
    if (slideFiles.length > 0) {
      const slideUploadPromises = slideFiles.map(async (file: File) => {
        const fileExtension = path.extname(file.name);
        const uniqueFileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${fileExtension}`;
        const filePath = path.join(uploadDir, uniqueFileName);

        // Save the file
        const fileBuffer = Buffer.from(await file.arrayBuffer());
        await fs.writeFile(filePath, fileBuffer);

        // Store both name and relative file path
        slidePaths.push({ name: uniqueFileName, path: `/uploads/slides/${uniqueFileName}` });
      });

      await Promise.all(slideUploadPromises);
    }

    // Insert slide data into the database
    const insertPromises = slidePaths.map(async slide => {
      await pool.query<ResultSetHeader>(`INSERT INTO slides (name, path) VALUES (?, ?)`, [slide.name, slide.path]);
    });
    await Promise.all(insertPromises);

    return NextResponse.json({ message: 'Slide(s) added successfully' });
  } catch (error) {
    console.error('Error uploading slide:', error);
    return NextResponse.json({ error: 'Failed to add slide' }, { status: 500 });
  }
}

// GET: Fetch all slides
export async function GET(req: NextRequest) {
  try {
    const [slides] = await pool.query<RowDataPacket[]>('SELECT * FROM slides');
    return NextResponse.json({ pictures: slides }, { status: 200 });
  } catch (error) {
    console.error('Error fetching slides:', error);
    return NextResponse.json({ message: 'Failed to fetch slides' }, { status: 500 });
  }
}
