import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

// GET: Fetch project summaries (id, title, startTime, endTime, media)
export async function GET(req: NextRequest) {
  try {
    // Query to fetch selected fields from all projects
    const [projects] = await pool.query<RowDataPacket[]>(
      'SELECT id, title, startTime, endTime, media FROM projects'
    );

    // Return the list of project summaries
    return NextResponse.json(projects, { status: 200 });
  } catch (error) {
    console.error('Error fetching project summaries:', error);
    return NextResponse.json({ message: 'Failed to fetch project summaries' }, { status: 500 });
  }
}
