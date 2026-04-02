import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');

    if (!userId) {
      return Response.json({ error: 'userId is required' }, { status: 400 });
    }

    console.log('🔵 Fetching all groups for user:', userId);

    // API pour récupérer TOUS les groupes de l'utilisateur
    const res = await fetch(
      `https://groups.roblox.com/v1/users/${userId}/groups`,
      { headers: { 'Accept': 'application/json' } }
    );

    console.log('Status:', res.status);

    if (!res.ok) {
      console.error('❌ Groups API error:', res.status);
      return Response.json({ groups: [] });
    }

    const data = await res.json();
    console.log('✅ Groups found:', data.data?.length || 0);

    // Transformer les données
    const groups = (data.data || []).map((item: any) => ({
      id: item.group.id,
      name: item.group.name,
      memberCount: item.group.memberCount,
      description: item.group.description,
    }));

    return Response.json({ groups });
  } catch (error) {
    console.error('❌ Error fetching groups:', error);
    return Response.json({ groups: [], error: String(error) }, { status: 500 });
  }
}
