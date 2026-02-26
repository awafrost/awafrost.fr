import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');

    if (!userId) {
      return Response.json({ error: 'userId is required' }, { status: 400 });
    }

    const response = await fetch(
      `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=420x420&format=png&isCircular=false`
    );

    if (!response.ok) {
      console.error('Avatar API error:', response.status);
      return Response.json({ data: [] });
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error('Error fetching avatar:', error);
    return Response.json({ data: [] });
  }
}
