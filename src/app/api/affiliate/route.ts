import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Affiliate from '@/models/Affiliate';
import AffiliateStatistics from '@/models/AffiliateStatistics';
import User from '@/models/User';
import { NextRequest, NextResponse } from 'next/server';

// Generate unique affiliate code
function generateAffiliateCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// GET - Retrieve affiliate info
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const affiliate = await Affiliate.findOne({
      userId: (session.user as any).discordId,
    });

    if (!affiliate) {
      return NextResponse.json(
        { error: 'No affiliate found' },
        { status: 404 }
      );
    }

    return NextResponse.json(affiliate);
  } catch (error) {
    console.error('Error fetching affiliate:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new affiliate
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const discordId = (session.user as any).discordId;

    // Check if affiliate already exists
    const existingAffiliate = await Affiliate.findOne({
      userId: discordId,
    });

    if (existingAffiliate) {
      return NextResponse.json(
        { error: 'Affiliate already exists' },
        { status: 400 }
      );
    }

    const user = await User.findOne({ discordId });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Generate unique affiliate code
    let affiliateCode = generateAffiliateCode();
    let codeExists = await Affiliate.findOne({ affiliateCode });

    while (codeExists) {
      affiliateCode = generateAffiliateCode();
      codeExists = await Affiliate.findOne({ affiliateCode });
    }

    const discordInvite = process.env.NEXT_PUBLIC_DISCORD_INVITE || '';

    const affiliate = await Affiliate.create({
      userId: discordId,
      discordUsername: user.discordUsername,
      discordInvite,
      affiliateCode,
      partnerName: 'Sai Café',
      partnered: true,
    });

    // Create statistics record
    await AffiliateStatistics.create({
      affiliateCode,
      userId: discordId,
      pageVisits: 0,
      discordButtonClicks: 0,
    });

    return NextResponse.json(affiliate, { status: 201 });
  } catch (error) {
    console.error('Error creating affiliate:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update affiliate info
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const discordId = (session.user as any).discordId;
    const body = await request.json();

    const affiliate = await Affiliate.findOne({
      userId: discordId,
    });

    if (!affiliate) {
      return NextResponse.json(
        { error: 'Affiliate not found' },
        { status: 404 }
      );
    }

    // Only allow updating certain fields
    const allowedFields = [
      'youtube',
      'twitter',
      'roblox',
      'favoriteGames',
      'profileDescription',
      'customBackgroundUrl',
    ];

    for (const field of allowedFields) {
      if (field in body) {
        if (field === 'favoriteGames') {
          // Limit to 3 games
          affiliate[field] = body[field].slice(0, 3);
        } else {
          affiliate[field] = body[field];
        }
      }
    }

    await affiliate.save();

    return NextResponse.json(affiliate);
  } catch (error) {
    console.error('Error updating affiliate:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
