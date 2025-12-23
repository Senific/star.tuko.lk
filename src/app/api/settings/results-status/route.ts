import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { CompetitionRound } from '@prisma/client';

/**
 * GET /api/settings/results-status
 * 
 * Check if results have been released (competition has ended and results are public)
 */
export async function GET() {
  try {
    // Results are released when the COMPLETED phase is active
    // or when the FINALE phase is active and has ended
    const completedPhase = await prisma.competitionPhase.findFirst({
      where: {
        round: CompetitionRound.COMPLETED,
        isActive: true,
      },
    });

    // Also check if FINALE has ended
    const finalePhase = await prisma.competitionPhase.findFirst({
      where: {
        round: CompetitionRound.FINALE,
        isActive: true,
        endDate: { lte: new Date() },
      },
    });

    const resultsReleased = !!completedPhase || !!finalePhase;

    return NextResponse.json({
      resultsReleased,
      message: resultsReleased 
        ? 'Results have been released' 
        : 'Results will be available after the competition ends',
    });
  } catch (error) {
    console.error('Error checking results status:', error);
    // Default to not released if there's an error
    return NextResponse.json({
      resultsReleased: false,
      message: 'Results will be available after the competition ends',
    });
  }
}
