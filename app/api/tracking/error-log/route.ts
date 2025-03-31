import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  const { participantId, errorType, task, orderId, timestamp } = await request.json();
  
  try {
    await prisma.errorLog.create({
      data: {
        participantId,
        errorType,
        task,
        orderId,
        timestamp,
      }
    });
    
    return Response.json({ success: true });
  } catch (error) {
    console.error('Failed to log error:', error);
    return Response.json({ success: false }, { status: 500 });
  }
} 