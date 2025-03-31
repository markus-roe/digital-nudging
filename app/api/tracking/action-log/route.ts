import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  const { participantId, action, task, orderId, timestamp } = await request.json();
  
  try {
    await prisma.actionLog.create({
      data: {
        participantId,
        action,
        task,
        orderId,
        timestamp,
      }
    });
    
    return Response.json({ success: true });
  } catch (error) {
    console.error('Failed to log action:', error);
    return Response.json({ success: false }, { status: 500 });
  }
} 