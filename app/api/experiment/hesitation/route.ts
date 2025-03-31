import { NextResponse } from 'next/server';

interface HesitationRecord {
  orderId: string;
  taskId: string;
  participantId: string;
  time: number;
  timestamp: string;
}

export async function POST(request: Request) {
  try {
    const record: HesitationRecord = await request.json();
    
    // TODO: Add validation
    if (!record.orderId || !record.taskId || !record.participantId || !record.time || !record.timestamp) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // TODO: Add database integration
    // For now, we'll just log the record
    console.log('[HesitationAPI] Received record:', record);
    
    // Return success response
    return NextResponse.json(
      { message: 'Hesitation record saved successfully' },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('[HesitationAPI] Error processing request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 