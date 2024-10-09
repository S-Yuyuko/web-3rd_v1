import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

// Define the ExperienceWord type based on your table structure
type ExperienceWord = {
  id: string;
  title: string;
  description: string;
};

// POST: Add a new experience word
export async function POST(req: NextRequest) {
  let body;
  try {
    // Parse the JSON body
    body = await req.json();
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return NextResponse.json({ message: 'Invalid JSON format' }, { status: 400 });
  }

  const { id, title, description } = body;

  // Validate input
  if (!id || !title || !description) {
    return NextResponse.json({ message: 'ID, title, and description are required' }, { status: 400 });
  }

  try {
    // Insert a new experience word into the database
    await pool.query('INSERT INTO experiencewords (id, title, description) VALUES (?, ?, ?)', [
      id,
      title,
      description,
    ]);

    return NextResponse.json({ message: 'Experience word added successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error adding experience word:', error);
    return NextResponse.json({ message: 'Failed to add experience word' }, { status: 500 });
  }
}

// GET: Fetch all experience words
export async function GET() {
  try {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM experiencewords');
    if (rows.length === 0) {
      return NextResponse.json({ message: 'No experience words found' }, { status: 404 });
    }
    return NextResponse.json({ words: rows[0] });
  } catch (error) {
    console.error('Error fetching experience words:', error);
    return NextResponse.json({ message: 'Failed to fetch experience words' }, { status: 500 });
  }
}
