import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcrypt';

// PUT: Update the password for the admin with the given account (id)
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  console.log('Params:', params); // It will log { id: '123456' }

  if (!id) {
    return NextResponse.json({ error: 'Account (ID) is required' }, { status: 400 });
  }

  const { password } = await req.json();

  if (!password) {
    return NextResponse.json({ error: 'Password is required' }, { status: 400 });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = 'UPDATE admins SET password = ? WHERE account = ?';
    const [result] = await pool.query(sql, [hashedPassword, id]);

    if ((result as any).affectedRows === 0) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Password updated successfully' });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error('Failed to update password:', errorMessage);
    return NextResponse.json({ error: 'Failed to update password' }, { status: 500 });
  }
}

// DELETE: Delete an admin by id
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: 'Account (ID) is required' }, { status: 400 });
  }

  try {
    const sql = 'DELETE FROM admins WHERE account = ?';
    const [result] = await pool.query(sql, [id]);

    if ((result as any).affectedRows === 0) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Admin deleted successfully' });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error('Failed to delete admin:', errorMessage);
    return NextResponse.json({ error: 'Failed to delete admin' }, { status: 500 });
  }
}
