import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { ExperimentTask } from '@/lib/types/experiment';

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
    
    const participantId = uuidv4();
    
    const task: ExperimentTask = 'order-assignment';
    
    const version = Math.random() < 0.5 ? 'a' : 'b';
    
    console.log(`Assigned participant to ${task} version ${version}`);
    
    return NextResponse.json({
      participantId,
      task,
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