import prisma from '@/lib/prisma';
import { ApplicationStatus, ContestantStatus, Prisma } from '@prisma/client';

// Types
export type ApplicationWithContestant = Prisma.ApplicationGetPayload<{
  include: {
    contestant: {
      include: {
        district: true;
        province: true;
        photos: true;
      };
    };
    approvedBy: true;
    rejectedBy: true;
  };
}>;

// Get all applications with filters
export async function getApplications(options?: {
  status?: ApplicationStatus;
  districtId?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  const {
    status,
    districtId,
    search,
    page = 1,
    limit = 20,
  } = options || {};

  const where: Prisma.ApplicationWhereInput = {
    ...(status && { status }),
    ...(districtId && { contestant: { districtId } }),
    ...(search && {
      contestant: {
        OR: [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      },
    }),
  };

  const [applications, total] = await Promise.all([
    prisma.application.findMany({
      where,
      include: {
        contestant: {
          include: {
            district: true,
            province: true,
            photos: true,
          },
        },
        approvedBy: true,
        rejectedBy: true,
      },
      orderBy: {
        submittedAt: 'desc',
      },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.application.count({ where }),
  ]);

  return {
    applications,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

// Get application by ID
export async function getApplicationById(id: string): Promise<ApplicationWithContestant | null> {
  return prisma.application.findUnique({
    where: { id },
    include: {
      contestant: {
        include: {
          district: true,
          province: true,
          photos: true,
        },
      },
      approvedBy: true,
      rejectedBy: true,
    },
  });
}

// Approve application
export async function approveApplication(applicationId: string, adminId: string) {
  return prisma.$transaction(async (tx) => {
    // Update application status
    const application = await tx.application.update({
      where: { id: applicationId },
      data: {
        status: ApplicationStatus.APPROVED,
        reviewedAt: new Date(),
        approvedById: adminId,
      },
      include: {
        contestant: true,
      },
    });

    // Update contestant status
    await tx.contestant.update({
      where: { id: application.contestantId },
      data: {
        status: ContestantStatus.APPROVED,
        approvedAt: new Date(),
      },
    });

    // Log admin action
    await tx.adminLog.create({
      data: {
        adminId,
        action: 'APPROVE_APPLICATION',
        targetType: 'Application',
        targetId: applicationId,
        details: {
          contestantId: application.contestantId,
          contestantName: `${application.contestant.firstName} ${application.contestant.lastName}`,
        },
      },
    });

    return application;
  });
}

// Reject application
export async function rejectApplication(
  applicationId: string,
  adminId: string,
  reason: string
) {
  return prisma.$transaction(async (tx) => {
    // Update application status
    const application = await tx.application.update({
      where: { id: applicationId },
      data: {
        status: ApplicationStatus.REJECTED,
        reviewedAt: new Date(),
        rejectedById: adminId,
        rejectionReason: reason,
      },
      include: {
        contestant: true,
      },
    });

    // Update contestant status
    await tx.contestant.update({
      where: { id: application.contestantId },
      data: {
        status: ContestantStatus.REJECTED,
      },
    });

    // Log admin action
    await tx.adminLog.create({
      data: {
        adminId,
        action: 'REJECT_APPLICATION',
        targetType: 'Application',
        targetId: applicationId,
        details: {
          contestantId: application.contestantId,
          contestantName: `${application.contestant.firstName} ${application.contestant.lastName}`,
          reason,
        },
      },
    });

    return application;
  });
}

// Get application statistics
export async function getApplicationStats() {
  const [total, pending, approved, rejected] = await Promise.all([
    prisma.application.count(),
    prisma.application.count({ where: { status: ApplicationStatus.PENDING } }),
    prisma.application.count({ where: { status: ApplicationStatus.APPROVED } }),
    prisma.application.count({ where: { status: ApplicationStatus.REJECTED } }),
  ]);

  return {
    total,
    pending,
    approved,
    rejected,
  };
}

// Create new application (contestant registration)
export async function createApplication(data: {
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  dateOfBirth: Date;
  districtId: string;
  provinceId: string;
  bio?: string;
  talents?: string[];
  height?: number;
  profilePhoto: string;
  photos?: string[];
  videoUrl?: string;
  bankName?: string;
  bankBranch?: string;
  accountNumber?: string;
  accountName?: string;
  tukoUserId?: string;
}) {
  // Calculate age
  const today = new Date();
  const birthDate = new Date(data.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  // Normalize phone number (remove spaces, +94, leading 0)
  let normalizedPhone = data.phone?.replace(/\s/g, '') || '';
  if (normalizedPhone.startsWith('+94')) {
    normalizedPhone = normalizedPhone.slice(3);
  } else if (normalizedPhone.startsWith('94') && normalizedPhone.length > 9) {
    normalizedPhone = normalizedPhone.slice(2);
  }
  if (normalizedPhone.startsWith('0')) {
    normalizedPhone = normalizedPhone.slice(1);
  }

  // Check if user has an existing application by phone number OR tukoUserId
  let existingContestant = null;
  
  // Only check by phone if we have a valid phone number (at least 9 digits)
  if (normalizedPhone && normalizedPhone.length >= 9) {
    existingContestant = await prisma.contestant.findUnique({
      where: { phone: normalizedPhone },
      include: { application: true },
    });
  }
  
  // Also check by tukoUserId if provided and no match found by phone
  if (!existingContestant && data.tukoUserId) {
    existingContestant = await prisma.contestant.findFirst({
      where: { tukoUserId: data.tukoUserId },
      include: { application: true },
    });
  }

  if (existingContestant) {
    // If rejected, delete old record and allow new application
    if (existingContestant.application?.status === ApplicationStatus.REJECTED) {
      await prisma.$transaction(async (tx) => {
        // Delete photos first
        await tx.contestantPhoto.deleteMany({
          where: { contestantId: existingContestant!.id },
        });
        // Delete application
        if (existingContestant!.application) {
          await tx.application.delete({
            where: { id: existingContestant!.application.id },
          });
        }
        // Delete contestant
        await tx.contestant.delete({
          where: { id: existingContestant!.id },
        });
      });
    } else {
      // Still pending or approved - cannot reapply
      throw { code: 'P2002', message: 'You have already submitted an application' };
    }
  }

  // Use normalized phone for storage
  const phoneToStore = normalizedPhone && normalizedPhone.length >= 9 ? normalizedPhone : `temp_${Date.now()}_${Math.random().toString(36).slice(2)}`;

  // Generate contestant number using MAX to avoid conflicts with deleted records
  const lastContestant = await prisma.contestant.findFirst({
    orderBy: { contestantNo: 'desc' },
    select: { contestantNo: true },
  });
  
  let nextNumber = 1;
  if (lastContestant?.contestantNo) {
    const lastNum = parseInt(lastContestant.contestantNo.replace('C', ''), 10);
    if (!isNaN(lastNum)) {
      nextNumber = lastNum + 1;
    }
  }
  const contestantNo = `C${nextNumber.toString().padStart(4, '0')}`;

  return prisma.$transaction(async (tx) => {
    // Create contestant
    const contestant = await tx.contestant.create({
      data: {
        contestantNo,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email || null,
        phone: phoneToStore,
        dateOfBirth: data.dateOfBirth,
        age,
        districtId: data.districtId,
        provinceId: data.provinceId,
        bio: data.bio,
        talents: data.talents || [],
        height: data.height,
        profilePhoto: data.profilePhoto,
        videoUrl: data.videoUrl,
        bankName: data.bankName,
        bankBranch: data.bankBranch,
        accountNumber: data.accountNumber,
        accountName: data.accountName,
        tukoUserId: data.tukoUserId,
        status: ContestantStatus.PENDING,
      },
    });

    // Create additional photos
    if (data.photos && data.photos.length > 0) {
      await tx.contestantPhoto.createMany({
        data: data.photos.map((url, index) => ({
          contestantId: contestant.id,
          url,
          sortOrder: index + 1,
        })),
      });
    }

    // Create application
    const application = await tx.application.create({
      data: {
        contestantId: contestant.id,
        status: ApplicationStatus.PENDING,
        agreedToTerms: true,
        agreedToPrivacy: true,
      },
    });

    return { contestant, application };
  });
}

// Delete application and associated contestant
export async function deleteApplication(applicationId: string, adminId: string) {
  return prisma.$transaction(async (tx) => {
    // Get the application with contestant info
    const application = await tx.application.findUnique({
      where: { id: applicationId },
      include: {
        contestant: true,
      },
    });

    if (!application) {
      throw new Error('Application not found');
    }

    const contestantId = application.contestantId;
    const contestantName = `${application.contestant.firstName} ${application.contestant.lastName}`;

    // Delete votes first
    await tx.vote.deleteMany({
      where: { contestantId },
    });

    // Delete vote counts
    await tx.voteCount.deleteMany({
      where: { contestantId },
    });

    // Delete round results
    await tx.roundResult.deleteMany({
      where: { contestantId },
    });

    // Delete reports
    await tx.report.deleteMany({
      where: { contestantId },
    });

    // Delete photos
    await tx.contestantPhoto.deleteMany({
      where: { contestantId },
    });

    // Delete application
    await tx.application.delete({
      where: { id: applicationId },
    });

    // Delete contestant
    await tx.contestant.delete({
      where: { id: contestantId },
    });

    // Log admin action
    await tx.adminLog.create({
      data: {
        adminId,
        action: 'DELETE_APPLICATION',
        targetType: 'Application',
        targetId: applicationId,
        details: {
          contestantId,
          contestantName,
        },
      },
    });

    return { success: true, deletedContestantId: contestantId, contestantName };
  });
}
