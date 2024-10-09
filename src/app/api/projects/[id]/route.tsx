import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import pool from '@/lib/db'; // Ensure the correct path to your DB connection
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// Helper function to ensure the upload directory exists
async function ensureDirectoryExists(dir: string) {
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
}

// Regular expression for UUID validation
const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

// GET function to retrieve a project by ID
export async function GET(req: NextRequest) {
  const id = req.nextUrl.pathname.split('/').pop();

  // Validate the UUID format
  if (!id || !uuidRegex.test(id)) {
    return NextResponse.json({ error: 'Invalid Project ID format. A valid UUID is required.' }, { status: 400 });
  }

  try {
    // Fetch the project and its media from the database
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM projects WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const project = rows[0]; // Fetch the first result, as we are expecting only one row
    return NextResponse.json(project, { status: 200 });
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
  }
}

// PUT function to update a project by ID
export async function PUT(req: NextRequest) {
  const id = req.nextUrl.pathname.split('/').pop();

  if (!id || !uuidRegex.test(id)) {
    return NextResponse.json({ error: 'Invalid Project ID format. A valid UUID is required.' }, { status: 400 });
  }

  try {
    const formData = await req.formData();
    const title = formData.get('title') as string;
    const startTime = formData.get('startTime') as string;
    const endTime = formData.get('endTime') as string;
    const skills = formData.get('skills') as string;
    const link = formData.get('link') as string;
    const description = formData.get('description') as string;

    // Format dates to `YYYY-MM-DD`
    const formattedStartTime = startTime ? new Date(startTime).toISOString().split('T')[0] : null;
    const formattedEndTime = endTime ? new Date(endTime).toISOString().split('T')[0] : null;

    // Parse existing media from formData
    const existingMediaRaw = formData.get('existingMedia') as string || '[]';
    let remainingMedia: string[];
    try {
      remainingMedia = JSON.parse(existingMediaRaw);
    } catch (err) {
      remainingMedia = existingMediaRaw.split(',').map(media => media.trim());
    }

    // Fetch existing media from the database
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT media FROM projects WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const existingMediaInDatabase = rows[0].media;
    const mediaToDelete = existingMediaInDatabase.filter((media: string) => !remainingMedia.includes(media));

    // Handle new media file uploads
    const mediaFiles = formData.getAll('media').filter(item => item instanceof File) as File[];
    const uploadDir = path.join(process.cwd(), 'public/uploads/projects');
    await ensureDirectoryExists(uploadDir);

    const newMediaPaths = await Promise.all(
      mediaFiles.map(async (file: File) => {
        const fileExtension = path.extname(file.name);
        const uniqueFileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${fileExtension}`;
        const filePath = path.join(uploadDir, uniqueFileName);

        await fs.writeFile(filePath, Buffer.from(await file.arrayBuffer()));
        return `uploads/projects/${uniqueFileName}`;
      })
    );

    // Combine remaining media and newly uploaded media
    const combinedMediaPaths = [...remainingMedia, ...newMediaPaths];

    // Delete removed media files from the server
    await Promise.all(
      mediaToDelete.map(async (media: string) => {
        const filePath = path.join(process.cwd(), 'public', media);
        try {
          await fs.unlink(filePath);
        } catch (err) {
          console.error(`Error deleting file: ${filePath}`, err);
        }
      })
    );

    // Update project in the database
    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE projects 
       SET title = ?, startTime = ?, endTime = ?, skills = ?, link = ?, description = ?, media = ?
       WHERE id = ?`,
      [title, formattedStartTime, formattedEndTime, skills, link, description, JSON.stringify(combinedMediaPaths), id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Failed to update project or project not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Project updated successfully' });
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

// DELETE function to remove a project and associated media files
export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.pathname.split('/').pop();

  if (!id || !uuidRegex.test(id)) {
    return NextResponse.json({ error: 'Invalid Project ID format. A valid UUID is required.' }, { status: 400 });
  }

  try {
    // Fetch the project and its media from the database
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT media FROM projects WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const projectMedia = rows[0].media;

    // Delete associated media files from the server
    await Promise.all(
      projectMedia.map(async (mediaPath: string) => {
        const filePath = path.join(process.cwd(), 'public', mediaPath);
        try {
          await fs.unlink(filePath);
        } catch (err) {
          console.error(`Error deleting media file: ${filePath}`, err);
        }
      })
    );

    // Delete the project from the database
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM projects WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Failed to delete project or project not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
