import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { ContestantStatus } from '@prisma/client';

/**
 * GET /api/contestants
 * 
 * Get all approved contestants with optional filters
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const provinceId = searchParams.get('provinceId');
    const districtId = searchParams.get('districtId');
    const sortBy = searchParams.get('sortBy') || 'votes';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    // Build where clause - only approved contestants
    const where: any = {
      status: ContestantStatus.APPROVED,
    };

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { bio: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (provinceId && provinceId !== 'all') {
      where.provinceId = provinceId;
    }

    if (districtId && districtId !== 'all') {
      where.districtId = districtId;
    }

    // Build orderBy
    let orderBy: any = { createdAt: 'desc' };
    if (sortBy === 'name') {
      orderBy = { firstName: 'asc' };
    }
    // For votes, we'll sort after fetching since votes are in VoteCount table

    // Fetch contestants
    const [contestants, total] = await Promise.all([
      prisma.contestant.findMany({
        where,
        include: {
          district: true,
          province: true,
          photos: {
            orderBy: { sortOrder: 'asc' },
            take: 3,
          },
        },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.contestant.count({ where }),
    ]);

    // Get vote counts for all contestants
    const contestantIds = contestants.map(c => c.id);
    const voteCounts = await prisma.voteCount.findMany({
      where: {
        contestantId: { in: contestantIds },
      },
    });

    // Create a map of contestant ID to total votes
    const voteMap = new Map<string, number>();
    voteCounts.forEach(vc => {
      const current = voteMap.get(vc.contestantId) || 0;
      voteMap.set(vc.contestantId, current + vc.count);
    });

    // Format response
    let formattedContestants = contestants.map(c => ({
      id: c.id,
      contestantNo: c.contestantNo,
      name: `${c.firstName} ${c.lastName}`,
      fullName: `${c.firstName} ${c.lastName}`,
      firstName: c.firstName,
      lastName: c.lastName,
      age: c.age,
      bio: c.bio || '',
      profilePhoto: c.profilePhoto || '/placeholder.svg',
      photos: c.photos.map(p => p.url),
      districtId: c.districtId,
      district: c.district?.nameEn || '',
      provinceId: c.provinceId,
      province: c.province?.nameEn || '',
      votes: voteMap.get(c.id) || 0,
      talents: c.talents || [],
      status: c.status,
      createdAt: c.createdAt.toISOString(),
    }));

    // Sort by votes if requested
    if (sortBy === 'votes') {
      formattedContestants.sort((a, b) => b.votes - a.votes);
    }

    return NextResponse.json({
      contestants: formattedContestants,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching contestants:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contestants' },
      { status: 500 }
    );
  }
}
