import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateParticipantId } from '@/lib/utils/participantUtils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { demographics, version } = body;
    
    // Generate custom participant ID
    const participantId = generateParticipantId();
    
    const participant = await prisma.participant.create({
      data: {
        id: participantId,
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