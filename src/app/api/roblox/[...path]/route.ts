import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, { params }: { params: { path?: string[] } }) {
  try {
    if (!params?.path || params.path.length === 0) {
      return NextResponse.json({ error: 'Missing path' }, { status: 400 });
    }

    const pathArray = params.path;
    const path = pathArray.join('/');
    const searchParams = new URLSearchParams(request.nextUrl.search);

    // Déterminer le domaine basé sur le chemin (ordre important!)
    let domain = 'apis.roblox.com'; // valeur par défaut
    
    if (path.includes('avatar-headshot') || path.includes('headshot')) {
      domain = 'thumbnails.roblox.com';
    } else if (path.includes('friends')) {
      domain = 'friends.roblox.com';
    } else if (path.includes('groups')) {
      domain = 'groups.roblox.com';
    } else if (path.includes('avatar')) {
      domain = 'avatar.roblox.com';
    } else if (path.includes('games')) {
      domain = 'games.roblox.com';
    } else if (path.includes('users')) {
      domain = 'users.roblox.com';
    }

    // Construire l'URL complète
    const queryString = searchParams.toString();
    const url = `https://${domain}/${path}${queryString ? `?${queryString}` : ''}`;
    
    console.log('🔵 Proxy GET:', url);

    const res = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0'
      }
    });

    if (!res.ok) {
      console.error(`❌ API error: ${res.status} ${res.statusText}`);
      const errorText = await res.text();
      console.error('Error body:', errorText);
      return NextResponse.json({ error: `API error: ${res.status}` }, { status: res.status });
    }

    const data = await res.json();
    console.log('✅ Proxy response ok');
    return NextResponse.json(data);
  } catch (e) {
    console.error('❌ Proxy error:', e);
    return NextResponse.json({ error: 'Proxy error', details: String(e) }, { status: 500 });
  }
}
