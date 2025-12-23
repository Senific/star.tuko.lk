import { NextRequest, NextResponse } from 'next/server';
import { getApplicationById, approveApplication, rejectApplication, deleteApplication } from '@/lib/db/applications';
import prisma from '@/lib/prisma';

// Helper to get or create admin record for Tuko user
async function getOrCreateAdmin(tukoUserId: string, name: string, phone: string) {
  // Check if admin exists by email (using phone as email placeholder)
  const email = `tuko_${tukoUserId}@admin.local`;
  
  let admin = await prisma.admin.findUnique({
    where: { email },
  });

  if (!admin) {
    // Create admin record for this Tuko user
    admin = await prisma.admin.create({
      data: {
        email,
        passwordHash: 'TUKO_OAUTH', // Placeholder since we use OAuth
        name: name || 'Tuko Admin',
        role: 'MODERATOR',
      },
    });
  }

  return admin;
}

/**
 * GET /api/admin/applications/[id]
 * 
 * Get a specific application by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const application = await getApplicationById(params.id);
    
    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(application);
  } catch (error) {
    console.error('Error fetching application:', error);
    return NextResponse.json(
      { error: 'Failed to fetch application' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/applications/[id]
 * 
 * Approve or reject an application
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { action, adminId, adminName, adminPhone, rejectionReason } = body;

    if (!action) {
      return NextResponse.json(
        { error: 'Missing required field: action' },
        { status: 400 }
      );
    }

    // Get or create admin record for the Tuko user
    const admin = await getOrCreateAdmin(
      adminId || 'unknown',
      adminName || 'Admin',
      adminPhone || ''
    );

    let result;

    if (action === 'approve') {
      result = await approveApplication(params.id, admin.id);
    } else if (action === 'reject') {
      if (!rejectionReason) {
        return NextResponse.json(
          { error: 'Rejection reason is required' },
          { status: 400 }
        );
      }
      result = await rejectApplication(params.id, admin.id, rejectionReason);
    } else {
      return NextResponse.json(
        { error: 'Invalid action. Use "approve" or "reject"' },
        { status: 400 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating application:', error);
    return NextResponse.json(
      { error: 'Failed to update application' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/applications/[id]
 * 
 * Delete an application and its associated contestant
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const adminId = searchParams.get('adminId') || 'unknown';
    const adminName = searchParams.get('adminName') || 'Admin';
    const adminPhone = searchParams.get('adminPhone') || '';

    // Get or create admin record for the Tuko user
    const admin = await getOrCreateAdmin(adminId, adminName, adminPhone);

    const result = await deleteApplication(params.id, admin.id);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error deleting application:', error);
    return NextResponse.json(
      { error: 'Failed to delete application' },
      { status: 500 }
    );
  }
}
