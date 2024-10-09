import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

// PUT: Update an existing experience word by ID
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

  const { title, description } = body;

  // Validate input
  if (!title || !description) {
    return NextResponse.json({ message: 'Title and description are required' }, { status: 400 });
  }

  try {
    // Perform the database update
    const [result] = await pool.query(
      'UPDATE experiencewords SET title = ?, description = ? WHERE id = ?',
      [title, description, id]
    );

    if ((result as any).affectedRows === 0) {
      return NextResponse.json({ message: 'Experience word not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Experience word updated successfully' });
  } catch (error) {
    console.error('Error updating experience word:', error);
    return NextResponse.json({ message: 'Failed to update experience word' }, { status: 500 });
  }
}
