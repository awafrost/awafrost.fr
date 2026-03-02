import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Affiliate from '@/models/Affiliate';

// GET public affiliate info
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json(
        { error: 'Missing affiliate code' },
        { status: 400 }
      );
    }

    await dbConnect();

    const affiliate = await Affiliate.findOne({
      affiliateCode: code,
      isActive: true,
    });

    if (!affiliate) {
      return NextResponse.json(
        { error: 'Affiliate not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(affiliate);
  } catch (error) {
    console.error('Error fetching public affiliate:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
