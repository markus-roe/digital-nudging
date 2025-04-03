import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ExperimentVersion } from '@/lib/types/experiment';

export async function GET() {
  try {
    // Count participants in each version
    const versionACount = await prisma.participant.count({
      where: { version: 'A' }
    });
    
    const versionBCount = await prisma.participant.count({
      where: { version: 'B' }
    });
    
    // Assign to the version with fewer participants
    let assignedVersion: ExperimentVersion;
    
    if (versionACount <= versionBCount) {
      assignedVersion = 'a';
    } else {
      assignedVersion = 'b';
    }
    
    return NextResponse.json({ version: assignedVersion });
  } catch (error) {
    console.error('Error assigning version:', error);
    // Default to version A if there's an error
    return NextResponse.json({ version: 'a' });
  }
} 