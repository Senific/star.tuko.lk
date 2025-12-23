import prisma from '@/lib/prisma';
import { Contestant, ContestantStatus, CompetitionRound, Prisma } from '@prisma/client';

// Types
export type ContestantWithRelations = Prisma.ContestantGetPayload<{
  include: {
    district: true;
    province: true;
    photos: true;
    votes: true;
  };
}>;

export type ContestantListItem = Prisma.ContestantGetPayload<{
  include: {
    district: true;
    province: true;
    _count: {
      select: { votes: true };
    };
  };
}>;

// Get all contestants with filters
export async function getContestants(options?: {
  status?: ContestantStatus;
  districtId?: string;
  provinceId?: string;
  round?: CompetitionRound;
  featured?: boolean;
  search?: string;
  page?: number;
  limit?: number;
  orderBy?: 'votes' | 'name' | 'createdAt' | 'rank';
  order?: 'asc' | 'desc';
}) {
  const {
    status = ContestantStatus.APPROVED,
    districtId,
    provinceId,
    round,
    featured,
    search,
    page = 1,
    limit = 20,
    orderBy = 'votes',
    order = 'desc',
  } = options || {};

  const where: Prisma.ContestantWhereInput = {
    status,
    ...(districtId && { districtId }),
    ...(provinceId && { provinceId }),
    ...(round && { currentRound: round }),
    ...(featured !== undefined && { isFeatured: featured }),
    ...(search && {
      OR: [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { contestantNo: { contains: search, mode: 'insensitive' } },
      ],
    }),
  };

  const [contestants, total] = await Promise.all([
    prisma.contestant.findMany({
      where,
      include: {
        district: true,
        province: true,
        _count: {
          select: { votes: true },
        },
      },
      orderBy: orderBy === 'votes' 
        ? { votes: { _count: order } }
        : orderBy === 'name'
        ? { firstName: order }
        : orderBy === 'rank'
        ? { overallRank: order }
        : { createdAt: order },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.contestant.count({ where }),
  ]);

  return {
    contestants,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

// Get single contestant by ID
export async function getContestantById(id: string): Promise<ContestantWithRelations | null> {
  return prisma.contestant.findUnique({
    where: { id },
    include: {
      district: true,
      province: true,
      photos: {
        orderBy: { sortOrder: 'asc' },
      },
      votes: true,
    },
  });
}

// Get contestant by contestant number
export async function getContestantByNo(contestantNo: string): Promise<ContestantWithRelations | null> {
  return prisma.contestant.findUnique({
    where: { contestantNo },
    include: {
      district: true,
      province: true,
      photos: {
        orderBy: { sortOrder: 'asc' },
      },
      votes: true,
    },
  });
}

// Get featured contestants
export async function getFeaturedContestants(limit = 6) {
  return prisma.contestant.findMany({
    where: {
      status: ContestantStatus.APPROVED,
      isFeatured: true,
    },
    include: {
      district: true,
      province: true,
      _count: {
        select: { votes: true },
      },
    },
    orderBy: {
      votes: { _count: 'desc' },
    },
    take: limit,
  });
}

// Get top contestants (leaderboard)
export async function getTopContestants(options?: {
  districtId?: string;
  provinceId?: string;
  round?: CompetitionRound;
  limit?: number;
}) {
  const { districtId, provinceId, round, limit = 10 } = options || {};

  return prisma.contestant.findMany({
    where: {
      status: ContestantStatus.APPROVED,
      ...(districtId && { districtId }),
      ...(provinceId && { provinceId }),
      ...(round && { currentRound: round }),
    },
    include: {
      district: true,
      province: true,
      _count: {
        select: { votes: true },
      },
    },
    orderBy: {
      votes: { _count: 'desc' },
    },
    take: limit,
  });
}

// Get contestant vote count
export async function getContestantVoteCount(contestantId: string, round?: CompetitionRound) {
  return prisma.vote.count({
    where: {
      contestantId,
      ...(round && { round }),
    },
  });
}

// Update contestant rankings
export async function updateContestantRankings() {
  // Get all approved contestants with vote counts
  const contestants = await prisma.contestant.findMany({
    where: { status: ContestantStatus.APPROVED },
    include: {
      _count: {
        select: { votes: true },
      },
    },
    orderBy: {
      votes: { _count: 'desc' },
    },
  });

  // Update overall ranks
  for (let i = 0; i < contestants.length; i++) {
    await prisma.contestant.update({
      where: { id: contestants[i].id },
      data: { overallRank: i + 1 },
    });
  }

  // Update district ranks
  const districts = await prisma.district.findMany();
  for (const district of districts) {
    const districtContestants = contestants.filter(c => c.districtId === district.id);
    for (let i = 0; i < districtContestants.length; i++) {
      await prisma.contestant.update({
        where: { id: districtContestants[i].id },
        data: { districtRank: i + 1 },
      });
    }
  }

  // Update province ranks
  const provinces = await prisma.province.findMany();
  for (const province of provinces) {
    const provinceContestants = contestants.filter(c => c.provinceId === province.id);
    for (let i = 0; i < provinceContestants.length; i++) {
      await prisma.contestant.update({
        where: { id: provinceContestants[i].id },
        data: { provinceRank: i + 1 },
      });
    }
  }
}

// Search contestants
export async function searchContestants(query: string, limit = 10) {
  return prisma.contestant.findMany({
    where: {
      status: ContestantStatus.APPROVED,
      OR: [
        { firstName: { contains: query, mode: 'insensitive' } },
        { lastName: { contains: query, mode: 'insensitive' } },
        { contestantNo: { contains: query, mode: 'insensitive' } },
        { district: { nameEn: { contains: query, mode: 'insensitive' } } },
      ],
    },
    include: {
      district: true,
      province: true,
    },
    take: limit,
  });
}
