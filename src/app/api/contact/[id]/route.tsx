import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

// PUT: Update an existing contact entry by ID
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params; // Extract ID from the URL params

  let body;
  try {
    body = await req.json(); // Parse the JSON body
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return NextResponse.json({ message: 'Invalid JSON format' }, { status: 400 });
  }

  const { phone, email, linkedin, github } = body;

  // Validate input
  if (!phone || !email || !linkedin || !github) {
    return NextResponse.json({ message: 'Phone, email, LinkedIn, and GitHub are required' }, { status: 400 });
  }

  try {
    const [result] = await pool.query(
      'UPDATE contact SET phone = ?, email = ?, linkedin = ?, github = ? WHERE id = ?',
      [phone, email, linkedin, github, id]
    );

    if ((result as any).affectedRows === 0) {
      return NextResponse.json({ message: 'Contact entry not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Contact entry updated successfully' });
  } catch (error) {
    console.error('Error updating contact entry:', error);
    return NextResponse.json({ message: 'Failed to update contact entry' }, { status: 500 });
  }
}
