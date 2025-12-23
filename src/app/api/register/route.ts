import { NextRequest, NextResponse } from 'next/server';
import { createApplication } from '@/lib/db/applications';
import { cookies } from 'next/headers';

/**
 * POST /api/register
 * 
 * Submit a new contestant registration application
 */
export async function POST(request: NextRequest) {
  try {
    // Get the logged-in user from cookie
    const cookieStore = cookies();
    const userCookie = cookieStore.get('tuko_user');
    
    if (!userCookie) {
      return NextResponse.json(
        { error: 'You must be logged in to register' },
        { status: 401 }
      );
    }

    let user;
    try {
      user = JSON.parse(userCookie.value);
    } catch {
      return NextResponse.json(
        { error: 'Invalid session. Please log in again.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    const {
      firstName,
      lastName,
      dateOfBirth,
      phone,
      email,
      bio,
      districtId,
      provinceId,
      profilePhoto,
      photos = [],
      videoUrl,
      height,
      talents = [],
    } = body;

    // Validate required fields
    if (!firstName || !lastName || !dateOfBirth || !phone || !districtId || !provinceId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create the application with all data
    const result = await createApplication({
      tukoUserId: user.id || user.username || 'tuko_user_' + Date.now(),
      firstName,
      lastName,
      dateOfBirth: new Date(dateOfBirth),
      phone,
      email: email || undefined, // Pass undefined instead of empty string
      bio,
      districtId,
      provinceId,
      profilePhoto: profilePhoto || '/placeholder.svg',
      photos: photos.filter(Boolean), // Filter out any empty strings
      videoUrl: videoUrl || undefined,
      height: height ? parseInt(height) : undefined,
      talents: Array.isArray(talents) ? talents : [],
    });

    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully',
      data: {
        applicationId: result.application.id,
        contestantNo: result.contestant.contestantNo,
      }
    });
  } catch (error: any) {
    console.error('Error submitting registration:', error);
    
    // Check for unique constraint violation (already registered)
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'You have already submitted an application' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to submit registration. Please try again.' },
      { status: 500 }
    );
  }
}
