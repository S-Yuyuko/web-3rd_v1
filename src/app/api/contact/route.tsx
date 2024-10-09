import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

// GET: Fetch all contact entries
export async function GET() {
  try {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM contact');
    if (rows.length === 0) {
      return NextResponse.json({ message: 'No contact entries found' }, { status: 404 });
    }
    return NextResponse.json({ contact: rows });
  } catch (error) {
    console.error('Error fetching contact entries:', error);
    return NextResponse.json({ message: 'Failed to fetch contact entries' }, { status: 500 });
  }
}

// POST: Add a new contact entry
export async function POST(req: NextRequest) {
  const { id, phone, email, linkedin, github } = await req.json();

  // Validate input
  if (!id || !phone || !email || !linkedin || !github) {
    return NextResponse.json({ message: 'Phone, email, LinkedIn, and GitHub are required' }, { status: 400 });
  }

  try {
    await pool.query(
      'INSERT INTO contact (id, phone, email, linkedin, github) VALUES (?, ?, ?, ?, ?)',
      [id, phone, email, linkedin, github]
    );
    return NextResponse.json({ message: 'Contact entry added successfully', id }, { status: 201 });
  } catch (error) {
    console.error('Error adding contact entry:', error);
    return NextResponse.json({ message: 'Failed to add contact entry' }, { status: 500 });
  }
}
