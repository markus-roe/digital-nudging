import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { demographics, version } = body;
    
    // Use the version provided by the client (which was assigned by the version-assignment API)
    // This ensures we maintain the version balance
    const participant = await prisma.participant.create({
      data: {
        age: demographics.age,
        gender: demographics.gender,
        experience: demographics.experience,
        education: demographics.education,
        version: version.toUpperCase() as 'A' | 'B',
      }
    });
    
    return NextResponse.json({
      participantId: participant.id,
      version,
    });
  } catch (error) {
    console.error('Error registering participant:', error);
    return NextResponse.json(
      { error: 'Failed to register participant' },
      { status: 500 }
    );
  }
} 