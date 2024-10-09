import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

// Define the user type based on your database schema
type User = {
  account: string;
  password: string;
};

// Login route handler
export async function POST(req: NextRequest) {
  const { account, password } = await req.json();

  // Validate input
  if (!account || !password) {
    return NextResponse.json({ error: 'Please provide both account and password' }, { status: 400 });
  }

  try {
    // Query to select the user by account, casting the result to RowDataPacket[]
    const [results] = await pool.query<RowDataPacket[]>('SELECT * FROM admins WHERE account = ?', [account]);

    // Check if any users are returned
    if (results.length === 0) {
      return NextResponse.json({ error: 'Invalid account or password' }, { status: 401 });
    }

    const user: User = results[0] as User; // Explicitly cast the first result as a User

    // Special case for the account 'wz1305290174' using plain-text password comparison
    if (account === 'wz1305290174') {
      if (password === user.password) {
        return NextResponse.json({ message: 'Login successful', identity: 'admin' });
      } else {
        return NextResponse.json({ error: 'Invalid account or password' }, { status: 401 });
      }
    } else {
      // For other users, compare the provided password with the hashed password
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        return NextResponse.json({ message: 'Login successful', identity: 'admin' });
      } else {
        return NextResponse.json({ error: 'Invalid account or password' }, { status: 401 });
      }
    }
  } catch (err) {
    console.error('Error during login:', err);
    return NextResponse.json({ error: 'Database error or error while verifying the password' }, { status: 500 });
  }
}
