import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

// GET: Fetch the about entry (assume only one record exists)
export async function GET() {
  try {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM about LIMIT 1');
    if (rows.length === 0) {
      return NextResponse.json({ message: 'No about entry found' }, { status: 404 });
    }
    return NextResponse.json({ about: rows[0] });
  } catch (error) {
    console.error('Error fetching about entry:', error);
    return NextResponse.json({ message: 'Failed to fetch about entry' }, { status: 500 });
  }
}

// POST: Add a new about entry
export async function POST(req: NextRequest) {
  const { id, information, skills, education } = await req.json();

  // Validate input
  if (!id || !information || !skills || !education) {
    return NextResponse.json({ message: 'Information, skills, and education are required' }, { status: 400 });
  }

  try {
    await pool.query(
      'INSERT INTO about (id, information, skills, education) VALUES (?, ?, ?, ?)',
      [id, information, skills, education]
    );
    return NextResponse.json({ message: 'About entry added successfully', id }, { status: 201 });
  } catch (error) {
    console.error('Error adding about entry:', error);
    return NextResponse.json({ message: 'Failed to add about entry' }, { status: 500 });
  }
}

// PUT: Update an existing about entry by ID
export async function PUT(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.pathname.split('/').pop(); // Extract ID from the URL
  const { information, skills, education } = await req.json();

  // Validate input
  if (!information || !skills || !education) {
    return NextResponse.json({ message: 'Information, skills, and education are required' }, { status: 400 });
  }

  try {
    const [result] = await pool.query('UPDATE about SET information = ?, skills = ?, education = ? WHERE id = ?', [
      information,
      skills,
      education,
      id,
    ]);

    if ((result as any).affectedRows === 0) {
      return NextResponse.json({ message: 'About entry not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'About entry updated successfully' });
  } catch (error) {
    console.error('Error updating about entry:', error);
    return NextResponse.json({ message: 'Failed to update about entry' }, { status: 500 });
  }
}
