// src/app/api/homewords/route.ts

import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

// Define the HomeWord type based on your table structure
type HomeWord = {
  id: string;
  title: string;
  description: string;
};

// POST: Add a new home word
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
    // Insert a new home word into the database
    await pool.query('INSERT INTO homewords (id, title, description) VALUES (?, ?, ?)', [
      id,
      title,
      description,
    ]);

    return NextResponse.json({ message: 'Home word added successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error adding home word:', error);
    return NextResponse.json({ message: 'Failed to add home word' }, { status: 500 });
  }
}

// GET: Fetch the home word (assuming only one record exists)
export async function GET() {
  try {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM homewords LIMIT 1');
    if (rows.length === 0) {
      return NextResponse.json({ message: 'No home word found' }, { status: 404 });
    }
    return NextResponse.json({ words: rows[0] });
  } catch (error) {
    console.error('Error fetching home word:', error);
    return NextResponse.json({ message: 'Failed to fetch home word' }, { status: 500 });
  }
}
