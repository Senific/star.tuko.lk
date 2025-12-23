import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { AdminRole, Prisma } from '@prisma/client';

// Types
export type AdminWithoutPassword = Omit<Prisma.AdminGetPayload<{}>, 'passwordHash'>;

// Authenticate admin
export async function authenticateAdmin(
  email: string,
  password: string
): Promise<AdminWithoutPassword | null> {
  const admin = await prisma.admin.findUnique({
    where: { email },
  });

  if (!admin || !admin.isActive) {
    return null;
  }

  const isValid = await bcrypt.compare(password, admin.passwordHash);
  if (!isValid) {
    return null;
  }

  // Update last login
  await prisma.admin.update({
    where: { id: admin.id },
    data: { lastLoginAt: new Date() },
  });

  // Return admin without password
  const { passwordHash, ...adminWithoutPassword } = admin;
  return adminWithoutPassword;
}

// Get admin by ID
export async function getAdminById(id: string): Promise<AdminWithoutPassword | null> {
  const admin = await prisma.admin.findUnique({
    where: { id },
  });

  if (!admin) return null;

  const { passwordHash, ...adminWithoutPassword } = admin;
  return adminWithoutPassword;
}

// Get all admins
export async function getAdmins() {
  const admins = await prisma.admin.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return admins.map(({ passwordHash, ...admin }) => admin);
}

// Create admin
export async function createAdmin(data: {
  email: string;
  password: string;
  name: string;
  role?: AdminRole;
}): Promise<AdminWithoutPassword> {
  const passwordHash = await bcrypt.hash(data.password, 12);

  const admin = await prisma.admin.create({
    data: {
      email: data.email,
      passwordHash,
      name: data.name,
      role: data.role || AdminRole.MODERATOR,
    },
  });

  const { passwordHash: _, ...adminWithoutPassword } = admin;
  return adminWithoutPassword;
}

// Update admin password
export async function updateAdminPassword(adminId: string, newPassword: string) {
  const passwordHash = await bcrypt.hash(newPassword, 12);

  await prisma.admin.update({
    where: { id: adminId },
    data: { passwordHash },
  });
}

// Check admin permission
export function hasPermission(role: AdminRole, permission: string): boolean {
  const permissions: Record<AdminRole, string[]> = {
    SUPER_ADMIN: ['all'],
    MODERATOR: [
      'view_contestants',
      'approve_applications',
      'reject_applications',
      'view_votes',
      'view_reports',
      'resolve_reports',
      'view_analytics',
    ],
    CONTENT_MANAGER: [
      'view_contestants',
      'edit_contestants',
      'feature_contestants',
      'view_analytics',
    ],
  };

  const rolePermissions = permissions[role];
  return rolePermissions.includes('all') || rolePermissions.includes(permission);
}

// Log admin action
export async function logAdminAction(
  adminId: string,
  action: string,
  details?: {
    targetType?: string;
    targetId?: string;
    data?: Record<string, unknown>;
    ipAddress?: string;
  }
) {
  await prisma.adminLog.create({
    data: {
      adminId,
      action,
      targetType: details?.targetType,
      targetId: details?.targetId,
      details: details?.data as Prisma.InputJsonValue | undefined,
      ipAddress: details?.ipAddress,
    },
  });
}

// Get admin activity logs
export async function getAdminLogs(options?: {
  adminId?: string;
  action?: string;
  page?: number;
  limit?: number;
}) {
  const { adminId, action, page = 1, limit = 50 } = options || {};

  const where: Prisma.AdminLogWhereInput = {
    ...(adminId && { adminId }),
    ...(action && { action }),
  };

  const [logs, total] = await Promise.all([
    prisma.adminLog.findMany({
      where,
      include: {
        admin: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.adminLog.count({ where }),
  ]);

  return {
    logs,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}
