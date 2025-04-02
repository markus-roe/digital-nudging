import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const {
      participantId,
      version,
      nasaTlx,
      sus,
      confidence,
      feedback
    } = data;

    // Store questionnaire data in the database
    const questionnaire = await prisma.questionnaire.create({
      data: {
        participantId,
        version,
        nasaTlxMental: nasaTlx.mental,
        nasaTlxPhysical: nasaTlx.physical,
        nasaTlxTemporal: nasaTlx.temporal,
        nasaTlxPerformance: nasaTlx.performance,
        nasaTlxEffort: nasaTlx.effort,
        nasaTlxFrustration: nasaTlx.frustration,
        susResponses: sus,
        confidenceRating: confidence,
        feedback
      }
    });

    return NextResponse.json({ success: true, questionnaire });
  } catch (error) {
    console.error('Error saving questionnaire data:', error);
    return NextResponse.json(
      { error: 'Failed to save questionnaire data' },
      { status: 500 }
    );
  }
} 