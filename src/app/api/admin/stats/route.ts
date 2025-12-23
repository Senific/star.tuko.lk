import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { ApplicationStatus, ContestantStatus } from '@prisma/client';

/**
 * GET /api/admin/stats
 * 
 * Get dashboard statistics
 */
export async function GET() {
  try {
    // Get current date for today's votes
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Fetch all stats in parallel
    const [
      totalContestants,
      pendingApplications,
      approvedContestants,
      rejectedApplications,
      totalVotes,
      todayVotes,
      totalDistricts,
      reportedContent,
      recentApplications,
      topContestants,
    ] = await Promise.all([
      // Total contestants (approved)
      prisma.contestant.count({
        where: { status: ContestantStatus.APPROVED },
      }),
      // Pending applications
      prisma.application.count({
        where: { status: ApplicationStatus.PENDING },
      }),
      // Approved applications (total)
      prisma.application.count({
        where: { status: ApplicationStatus.APPROVED },
      }),
      // Rejected applications
      prisma.application.count({
        where: { status: ApplicationStatus.REJECTED },
      }),
      // Total votes
      prisma.vote.count(),
      // Today's votes
      prisma.vote.count({
        where: {
          createdAt: { gte: today },
        },
      }),
      // Districts with contestants
      prisma.contestant.groupBy({
        by: ['districtId'],
        _count: true,
      }).then(result => result.length),
      // Reported content pending review
      prisma.report.count({
        where: { status: 'PENDING' },
      }),
      // Recent applications (last 5)
      prisma.application.findMany({
        take: 5,
        orderBy: { submittedAt: 'desc' },
        include: {
          contestant: {
            include: {
              district: true,
            },
          },
        },
      }),
      // Top contestants by vote count
      prisma.voteCount.findMany({
        take: 5,
        orderBy: { count: 'desc' },
        where: {
          count: { gt: 0 },
        },
      }),
    ]);

    // Get contestant details for top contestants
    const topContestantDetails = await Promise.all(
      topContestants.map(async (vc) => {
        const contestant = await prisma.contestant.findUnique({
          where: { id: vc.contestantId },
          include: { district: true },
        });
        return {
          id: contestant?.id,
          name: contestant ? `${contestant.firstName} ${contestant.lastName}` : 'Unknown',
          district: contestant?.district?.nameEn || 'Unknown',
          votes: vc.count,
        };
      })
    );

    // Format recent applications
    const formattedRecentApplications = recentApplications.map((app) => ({
      id: app.contestant.id,
      name: `${app.contestant.firstName} ${app.contestant.lastName}`,
      district: app.contestant.district?.nameEn || 'Unknown',
      date: app.submittedAt.toISOString().split('T')[0],
      status: app.status.toLowerCase(),
    }));

    return NextResponse.json({
      stats: {
        totalContestants,
        pendingApplications,
        approvedContestants,
        rejectedApplications,
        totalVotes,
        todayVotes,
        districts: totalDistricts,
        reportedContent,
      },
      recentApplications: formattedRecentApplications,
      topContestants: topContestantDetails.filter(c => c.id), // Filter out any nulls
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    );
  }
}
