import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import pool from '@/lib/db'; // Ensure the correct path to your DB connection
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// Helper function to check valid file extensions
const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];

// DELETE: Remove a slide by its file name (including extension)
export async function DELETE(req: NextRequest) {
  const fileName = req.nextUrl.pathname.split('/').pop();

  // Validate that the file name has a valid extension
  if (!fileName || !allowedExtensions.includes(path.extname(fileName).toLowerCase())) {
    return NextResponse.json({ error: 'Invalid file name or extension' }, { status: 400 });
  }

  try {
    // Fetch the slide path from the database
    const [rows] = await pool.query<RowDataPacket[]>(`
      SELECT path FROM slides WHERE path LIKE ?
    `, [`%${fileName}`]);

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Slide not found' }, { status: 404 });
    }

    const slidePath = rows[0].path;

    // Delete the slide file from the server
    const filePath = path.join(process.cwd(), 'public', slidePath);
    try {
      await fs.unlink(filePath);
    } catch (err) {
      console.error(`Error deleting slide file: ${filePath}`, err);
    }

    // Delete the slide from the database
    const [result] = await pool.query<ResultSetHeader>('DELETE FROM slides WHERE path = ?', [slidePath]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Failed to delete slide or slide not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Slide deleted successfully' });
  } catch (error) {
    console.error('Error deleting slide:', error);
    return NextResponse.json({ error: 'Failed to delete slide' }, { status: 500 });
  }
}
