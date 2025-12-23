import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { ContestantStatus } from '@prisma/client';

/**
 * GET /api/contestants/[id]
 * 
 * Get a single contestant by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Fetch contestant with related data
    const contestant = await prisma.contestant.findUnique({
      where: { id },
      include: {
        district: true,
        province: true,
        photos: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    if (!contestant) {
      return NextResponse.json(
        { error: 'Contestant not found' },
        { status: 404 }
      );
    }

    // Only show approved contestants publicly
    if (contestant.status !== ContestantStatus.APPROVED) {
      return NextResponse.json(
        { error: 'Contestant not found' },
        { status: 404 }
      );
    }

    // Get vote count
    const voteCounts = await prisma.voteCount.findMany({
      where: { contestantId: id },
    });
    const totalVotes = voteCounts.reduce((sum, vc) => sum + vc.count, 0);

    // Get rank by comparing votes with other contestants
    const allContestants = await prisma.contestant.findMany({
      where: { status: ContestantStatus.APPROVED },
      select: { id: true },
    });

    const contestantIds = allContestants.map(c => c.id);
    const allVoteCounts = await prisma.voteCount.findMany({
      where: { contestantId: { in: contestantIds } },
    });

    // Calculate total votes per contestant
    const votesByContestant = new Map<string, number>();
    allVoteCounts.forEach(vc => {
      const current = votesByContestant.get(vc.contestantId) || 0;
      votesByContestant.set(vc.contestantId, current + vc.count);
    });

    // Sort by votes and find rank
    const sortedIds = Array.from(votesByContestant.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([id]) => id);
    
    // Include contestants with 0 votes at the end
    allContestants.forEach(c => {
      if (!sortedIds.includes(c.id)) {
        sortedIds.push(c.id);
      }
    });

    const rank = sortedIds.indexOf(id) + 1;

    // Format response
    const formattedContestant = {
      id: contestant.id,
      contestantNo: contestant.contestantNo,
      name: `${contestant.firstName} ${contestant.lastName}`,
      firstName: contestant.firstName,
      lastName: contestant.lastName,
      age: contestant.age,
      height: contestant.height ? `${contestant.height} cm` : null,
      bio: contestant.bio || '',
      profilePhoto: contestant.profilePhoto || '/placeholder.svg',
      photos: contestant.photos.map(p => p.url),
      video: contestant.videoUrl,
      districtId: contestant.districtId,
      district: contestant.district?.nameEn || '',
      districtName: {
        en: contestant.district?.nameEn || '',
        si: contestant.district?.nameSi || '',
        ta: contestant.district?.nameTa || '',
      },
      provinceId: contestant.provinceId,
      province: contestant.province?.nameEn || '',
      provinceName: {
        en: contestant.province?.nameEn || '',
        si: contestant.province?.nameSi || '',
        ta: contestant.province?.nameTa || '',
      },
      votes: totalVotes,
      rank,
      talents: contestant.talents || [],
      status: contestant.status,
      currentRound: contestant.currentRound,
      districtRank: contestant.districtRank,
      provinceRank: contestant.provinceRank,
      createdAt: contestant.createdAt.toISOString(),
    };

    return NextResponse.json({ contestant: formattedContestant });
  } catch (error) {
    console.error('Error fetching contestant:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contestant' },
      { status: 500 }
    );
  }
}
