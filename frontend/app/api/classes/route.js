import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, professorId, professorName } = body;

    if (!name || !professorId || !professorName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const response = await fetch(`${API_URL}/api/classes/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, professorId, professorName }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || 'Failed to create class' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating class:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const professorId = searchParams.get('professorId');
    const studentId = searchParams.get('studentId');

    let url = `${API_URL}/api/classes`;

    if (professorId) {
      url = `${API_URL}/api/classes/professor/${professorId}`;
    } else if (studentId) {
      url = `${API_URL}/api/classes/student/${studentId}`;
    } else {
      return NextResponse.json(
        { error: 'Missing professorId or studentId parameter' },
        { status: 400 }
      );
    }

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || 'Failed to fetch classes' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching classes:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
