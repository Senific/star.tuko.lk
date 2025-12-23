import { NextRequest, NextResponse } from 'next/server';
import { castVote } from '@/lib/db/votes';
import { CompetitionRound } from '@prisma/client';
import { cookies } from 'next/headers';

/**
 * POST /api/votes
 * 
 * Cast a vote for a contestant
 */
export async function POST(request: NextRequest) {
  try {
    // Get user from cookie (Tuko OAuth sets user info in cookie)
    const cookieStore = await cookies();
    const userCookie = cookieStore.get('tuko_user');
    
    if (!userCookie?.value) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    let user;
    try {
      user = JSON.parse(userCookie.value);
    } catch {
      return NextResponse.json(
        { error: 'Invalid authentication' },
        { status: 401 }
      );
    }

    const { contestantId } = await request.json();

    if (!contestantId) {
      return NextResponse.json(
        { error: 'Contestant ID is required' },
        { status: 400 }
      );
    }

    // Get client IP and user agent for metadata
    const ipAddress = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Cast vote for the current active round (default to DISTRICT which is first voting round)
    const result = await castVote(
      user.id,
      contestantId,
      CompetitionRound.DISTRICT,
      { ipAddress, userAgent }
    );

    if (result.success) {
      return NextResponse.json({ success: true, message: result.message });
    } else {
      return NextResponse.json(
        { 
          success: false, 
          error: result.message,
          alreadyVoted: result.alreadyVoted 
        },
        { status: result.alreadyVoted ? 409 : 400 }
      );
    }
  } catch (error) {
    console.error('Error casting vote:', error);
    return NextResponse.json(
      { error: 'Failed to cast vote' },
      { status: 500 }
    );
  }
}
