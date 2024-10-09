import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcrypt';
import { RowDataPacket } from 'mysql2';

// Handle GET request for fetching admins except the specific account 'wz1305290174'
export async function GET(req: NextRequest) {
  try {
    // SQL query to fetch all admins excluding 'wz1305290174'
    const sql = 'SELECT * FROM admins WHERE account != ?';
    const [result] = await pool.query<RowDataPacket[]>(sql, ['wz1305290174']);

    // Return the result as JSON
    return NextResponse.json(result);
  } catch (err) {
    // Handle errors, providing more context if available
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error('Failed to fetch admins:', errorMessage);

    // Return an error response with status 500
    return NextResponse.json({ error: 'Failed to fetch admins' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { account, password } = await req.json();

  if (!account || !password) {
    return NextResponse.json({ error: 'Account and password are required' }, { status: 400 });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = 'INSERT INTO admins (account, password) VALUES (?, ?)';
    await pool.query(sql, [account, hashedPassword]);

    return NextResponse.json({ message: 'Admin added successfully' });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    if (err instanceof Error && err.message.includes('ER_DUP_ENTRY')) {
      return NextResponse.json({ error: 'Admin already exists' }, { status: 400 });
    }
    console.error('Failed to add admin:', errorMessage);
    return NextResponse.json({ error: 'Failed to add admin' }, { status: 500 });
  }
}
