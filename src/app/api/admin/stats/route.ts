import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Affiliate from '@/models/Affiliate';
import AffiliateStatistics from '@/models/AffiliateStatistics';

const ADMIN_ID = '1223271105184268412';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userDiscordId = (session.user as any).discordId;

    if (userDiscordId !== ADMIN_ID) {
      return NextResponse.json(
        { error: 'Forbidden - Admin only' },
        { status: 403 }
      );
    }

    await dbConnect();

    // Get all affiliates
    const affiliates = await Affiliate.find({}).sort({ createdAt: -1 });

    // Get all statistics
    const allStats = await AffiliateStatistics.find({});

    // Combine data
    const affiliateData = affiliates.map((affiliate: any) => {
      const stats = allStats.find(
        (s: any) => s.affiliateCode === affiliate.affiliateCode
      );

      return {
        _id: affiliate._id,
        userId: affiliate.userId,
        discordUsername: affiliate.discordUsername,
        affiliateCode: affiliate.affiliateCode,
        youtube: affiliate.youtube,
        twitter: affiliate.twitter,
        roblox: affiliate.roblox,
        favoriteGames: affiliate.favoriteGames,
        pageVisits: stats?.pageVisits || 0,
        discordButtonClicks: stats?.discordButtonClicks || 0,
        uniqueVisitors: stats?.uniqueVisitors || 0,
        uniqueDiscordClickVisitors: stats?.uniqueDiscordClickVisitors || 0,
        isActive: affiliate.isActive,
        createdAt: affiliate.createdAt,
      };
    });

    // Calculate totals
    const totals = {
      totalAffiliates: affiliates.length,
      totalVisits: allStats.reduce((sum: number, s: any) => sum + s.pageVisits, 0),
      totalDiscordClicks: allStats.reduce(
        (sum: number, s: any) => sum + s.discordButtonClicks,
        0
      ),
      totalUniqueVisitors: allStats.reduce(
        (sum: number, s: any) => sum + s.uniqueVisitors,
        0
      ),
    };

    return NextResponse.json({
      affiliates: affiliateData,
      totals,
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
