import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, demographics } = body;
    
    // if (!email) {
    //   return NextResponse.json(
    //     { error: 'Email is required' },
    //     { status: 400 }
    //   );
    // }
    
    const version = Math.random() < 0.5 ? 'A' : 'B';
    
    const participant = await prisma.participant.create({
      data: {
        email,
        age: demographics.age,
        gender: demographics.gender,
        experience: demographics.experience,
        education: demographics.education,
        version,
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