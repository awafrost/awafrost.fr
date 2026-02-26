import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');

    if (!userId) {
      return Response.json({ error: 'userId is required' }, { status: 400 });
    }

    // Récupérer les infos du profil Roblox
    const profileRes = await fetch(`https://users.roblox.com/v1/users/${userId}`);
    const profileData = await profileRes.json();

    // Récupérer le statut premium
    const premiumRes = await fetch(`https://premiumfeatures.roblox.com/v1/users/${userId}/premium-membership`);
    const premiumData = await premiumRes.json();

    // Récupérer les amis et followers
    const friendsRes = await fetch(`https://friends.roblox.com/v1/users/${userId}/friends/count`);
    const friendsData = await friendsRes.json();

    const followersRes = await fetch(`https://friends.roblox.com/v1/users/${userId}/followers/count`);
    const followersData = await followersRes.json();

    return Response.json({
      profile: profileData,
      premium: premiumData,
      friends: friendsData,
      followers: followersData,
    });
  } catch (error) {
    console.error('Error fetching Roblox profile:', error);
    return Response.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}
