import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import AffiliateStatistics from '@/models/AffiliateStatistics';

function hashIP(ip: string | null): string {
  if (!ip) return 'unknown';
  return crypto.createHash('sha256').update(ip).digest('hex');
}

function getClientIP(request: NextRequest): string | null {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    request.headers.get('x-real-ip') ||
    request.ip ||
    null
  );
}

// Track page visit
export async function POST(request: NextRequest) {
  try {
    const { affiliateCode, eventType } = await request.json();

    if (!affiliateCode || !eventType) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    await dbConnect();

    const ip = getClientIP(request);
    const ipHash = hashIP(ip);
    const userAgent = request.headers.get('user-agent') || 'unknown';

    const stats = await AffiliateStatistics.findOne({
      affiliateCode,
    });

    if (!stats) {
      return NextResponse.json(
        { error: 'Affiliate not found' },
        { status: 404 }
      );
    }

    // Check if this IP+UserAgent combination already visited
    const existingVisitor = stats.visitors.find(
      (v: any) => v.ipHash === ipHash && v.userAgent === userAgent
    );

    // Add visitor record
    if (!existingVisitor) {
      stats.visitors.push({
        ipHash,
        userAgent,
        country: request.headers.get('cf-ipcountry'),
        timestamp: new Date(),
      });

      // Update unique visitors count
      if (eventType === 'page_visit') {
        stats.uniqueVisitors = stats.uniqueVisitors + 1;
      } else if (eventType === 'discord_click') {
        stats.uniqueDiscordClickVisitors = stats.uniqueDiscordClickVisitors + 1;
      }
    }

    // Increment counters
    if (eventType === 'page_visit') {
      stats.pageVisits = stats.pageVisits + 1;
    } else if (eventType === 'discord_click') {
      stats.discordButtonClicks = stats.discordButtonClicks + 1;
    }

    await stats.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Get statistics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const affiliateCode = searchParams.get('code');

    if (!affiliateCode) {
      return NextResponse.json(
        { error: 'Missing affiliate code' },
        { status: 400 }
      );
    }

    await dbConnect();

    const stats = await AffiliateStatistics.findOne({
      affiliateCode,
    });

    if (!stats) {
      return NextResponse.json(
        { error: 'Statistics not found' },
        { status: 404 }
      );
    }

    // Don't expose individual visitor details
    return NextResponse.json({
      affiliateCode: stats.affiliateCode,
      pageVisits: stats.pageVisits,
      discordButtonClicks: stats.discordButtonClicks,
      uniqueVisitors: stats.uniqueVisitors,
      uniqueDiscordClickVisitors: stats.uniqueDiscordClickVisitors,
      updatedAt: stats.updatedAt,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
