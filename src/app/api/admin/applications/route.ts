import { NextRequest, NextResponse } from 'next/server';
import { getApplications } from '@/lib/db/applications';
import { ApplicationStatus } from '@prisma/client';

/**
 * GET /api/admin/applications
 * 
 * Fetch applications with optional filters
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const status = searchParams.get('status') as ApplicationStatus | null;
    const districtId = searchParams.get('districtId');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const result = await getApplications({
      status: status || undefined,
      districtId: districtId || undefined,
      search: search || undefined,
      page,
      limit,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}
