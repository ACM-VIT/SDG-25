import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    console.log('Fetching class with ID:', id);

    const response = await fetch(`${API_URL}/api/classes/${id}`);
    const data = await response.json();

    console.log('Backend response:', { ok: response.ok, status: response.status, data });

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || 'Failed to fetch class' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching class:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
