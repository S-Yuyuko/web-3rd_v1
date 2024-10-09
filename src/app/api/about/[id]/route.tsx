import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

// PUT: Update an existing about entry by ID
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params; // Extract ID from the URL params

  let body;
  try {
    // Parse the JSON body
    body = await req.json();
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return NextResponse.json({ message: 'Invalid JSON format' }, { status: 400 });
  }

  const { information, skills, education } = body;

  // Validate input
  if (!information || !skills || !education) {
    return NextResponse.json({ message: 'Information, skills, and education are required' }, { status: 400 });
  }

  try {
    // Perform the database update
    const [result] = await pool.query(
      'UPDATE about SET information = ?, skills = ?, education = ? WHERE id = ?',
      [information, skills, education, id]
    );

    if ((result as any).affectedRows === 0) {
      return NextResponse.json({ message: 'About entry not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'About entry updated successfully' });
  } catch (error) {
    console.error('Error updating about entry:', error);
    return NextResponse.json({ message: 'Failed to update about entry' }, { status: 500 });
  }
}
