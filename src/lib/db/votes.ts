import prisma from '@/lib/prisma';
import { CompetitionRound, Prisma } from '@prisma/client';

// Types
export type VoteResult = {
  success: boolean;
  message: string;
  alreadyVoted?: boolean;
};

// Cast a vote
export async function castVote(
  userId: string,
  contestantId: string,
  round: CompetitionRound,
  metadata?: { ipAddress?: string; userAgent?: string }
): Promise<VoteResult> {
  try {
    // Check if user already voted for this contestant in this round
    const existingVote = await prisma.vote.findUnique({
      where: {
        userId_contestantId_round: {
          userId,
          contestantId,
          round,
        },
      },
    });

    if (existingVote) {
      return {
        success: false,
        message: 'You have already voted for this contestant in this round',
        alreadyVoted: true,
      };
    }

    // Check if voting is enabled for this round
    const phase = await prisma.competitionPhase.findUnique({
      where: { round },
    });

    if (!phase?.votingEnabled || !phase.isActive) {
      return {
        success: false,
        message: 'Voting is not currently open for this round',
      };
    }

    // Check if contestant exists and is approved
    const contestant = await prisma.contestant.findUnique({
      where: { id: contestantId },
    });

    if (!contestant || contestant.status !== 'APPROVED') {
      return {
        success: false,
        message: 'Contestant not found or not eligible for voting',
      };
    }

    // Create the vote
    await prisma.vote.create({
      data: {
        userId,
        contestantId,
        round,
        ipAddress: metadata?.ipAddress,
        userAgent: metadata?.userAgent,
      },
    });

    // Update vote count cache
    await updateVoteCount(contestantId, round);

    return {
      success: true,
      message: 'Vote cast successfully!',
    };
  } catch (error) {
    console.error('Error casting vote:', error);
    return {
      success: false,
      message: 'An error occurred while casting your vote',
    };
  }
}

// Check if user has voted for a contestant
export async function hasUserVoted(
  userId: string,
  contestantId: string,
  round: CompetitionRound
): Promise<boolean> {
  const vote = await prisma.vote.findUnique({
    where: {
      userId_contestantId_round: {
        userId,
        contestantId,
        round,
      },
    },
  });
  return !!vote;
}

// Get user's votes
export async function getUserVotes(userId: string, round?: CompetitionRound) {
  return prisma.vote.findMany({
    where: {
      userId,
      ...(round && { round }),
    },
    include: {
      contestant: {
        include: {
          district: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

// Get vote count for a contestant
export async function getVoteCount(contestantId: string, round?: CompetitionRound): Promise<number> {
  return prisma.vote.count({
    where: {
      contestantId,
      ...(round && { round }),
    },
  });
}

// Update vote count cache
export async function updateVoteCount(contestantId: string, round: CompetitionRound) {
  const count = await getVoteCount(contestantId, round);
  
  await prisma.voteCount.upsert({
    where: {
      contestantId_round: {
        contestantId,
        round,
      },
    },
    update: {
      count,
      lastUpdated: new Date(),
    },
    create: {
      contestantId,
      round,
      count,
    },
  });
}

// Get votes statistics
export async function getVoteStats(options?: {
  round?: CompetitionRound;
  startDate?: Date;
  endDate?: Date;
}) {
  const { round, startDate, endDate } = options || {};

  const where: Prisma.VoteWhereInput = {
    ...(round && { round }),
    ...(startDate && endDate && {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    }),
  };

  const [totalVotes, uniqueVoters, votesByRound] = await Promise.all([
    prisma.vote.count({ where }),
    prisma.vote.groupBy({
      by: ['userId'],
      where,
    }).then(result => result.length),
    prisma.vote.groupBy({
      by: ['round'],
      where,
      _count: true,
    }),
  ]);

  return {
    totalVotes,
    uniqueVoters,
    votesByRound: votesByRound.map(v => ({
      round: v.round,
      count: v._count,
    })),
  };
}

// Get hourly vote distribution (for analytics)
export async function getHourlyVotes(date: Date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const votes = await prisma.vote.findMany({
    where: {
      createdAt: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
    select: {
      createdAt: true,
    },
  });

  // Group by hour
  const hourlyData: Record<string, number> = {};
  for (let i = 0; i < 24; i++) {
    hourlyData[i.toString().padStart(2, '0')] = 0;
  }

  votes.forEach(vote => {
    const hour = vote.createdAt.getHours().toString().padStart(2, '0');
    hourlyData[hour]++;
  });

  return hourlyData;
}

// Get votes by district
export async function getVotesByDistrict(round?: CompetitionRound) {
  const votes = await prisma.vote.findMany({
    where: round ? { round } : undefined,
    include: {
      contestant: {
        select: {
          districtId: true,
        },
      },
    },
  });

  const votesByDistrict: Record<string, number> = {};
  votes.forEach(vote => {
    const districtId = vote.contestant.districtId;
    votesByDistrict[districtId] = (votesByDistrict[districtId] || 0) + 1;
  });

  return votesByDistrict;
}

// Detect suspicious voting patterns
export async function detectSuspiciousVotes(options?: {
  timeWindow?: number; // minutes
  maxVotesFromSameIP?: number;
}) {
  const { timeWindow = 5, maxVotesFromSameIP = 10 } = options || {};

  const since = new Date();
  since.setMinutes(since.getMinutes() - timeWindow);

  // Get votes grouped by IP
  const votesGroupedByIP = await prisma.vote.groupBy({
    by: ['ipAddress'],
    where: {
      createdAt: { gte: since },
      ipAddress: { not: null },
    },
    _count: true,
    having: {
      ipAddress: {
        _count: {
          gt: maxVotesFromSameIP,
        },
      },
    },
  });

  return votesGroupedByIP.map(v => ({
    ipAddress: v.ipAddress,
    count: v._count,
    suspicious: true,
    reason: `${v._count} votes from same IP in ${timeWindow} minutes`,
  }));
}
