import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * GET /api/settings/voting-status
 * 
 * Get current voting status (whether voting is enabled)
 */
export async function GET(request: NextRequest) {
  try {
    // Get active competition phases with voting enabled
    const activePhases = await prisma.competitionPhase.findMany({
      where: {
        isActive: true,
        votingEnabled: true,
      },
    });

    const votingEnabled = activePhases.length > 0;
    const currentRound = activePhases.length > 0 ? activePhases[0].round : null;

    return NextResponse.json({
      votingEnabled,
      currentRound,
      message: votingEnabled 
        ? 'Voting is currently open' 
        : 'Voting is not currently open',
    });
  } catch (error) {
    console.error('Error fetching voting status:', error);
    return NextResponse.json({
      votingEnabled: false,
      currentRound: null,
      message: 'Unable to fetch voting status',
    });
  }
}
