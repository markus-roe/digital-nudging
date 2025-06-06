import { prisma } from '@/lib/prisma';
import { Version, TaskType } from '@prisma/client';
import {
  DemographicsCharts,
  TaskCompletion,
  ErrorRates,
  NasaTLX,
  SUS,
  Confidence,
  HesitationTime,
  CaseDurations,
  TaskEfficiencyVsErrorRate,
  UserEfficiencyVsErrorRate,
} from '../components/analysis/Charts';
import { RefreshButton } from '../components/analysis/RefreshButton';
import { ParticipantTable } from '../components/analysis/ParticipantTable';
import { AnalysisTable, KeyMetricsTable } from '../components/analysis/Tables';


interface ChartData {
  name: string;
  versionA: number;
  versionB: number;
  improvement?: string;
  reduction?: string;
  higherIsBetter: boolean;
}

interface VersionDistributionData {
  name: string;
  value: number;
}

interface TaskSpecificMetrics {
  sequenceErrors: { A: number; B: number };
  zoneMatchErrors: { A: number; B: number };
}

interface ValidationMetrics {
  validationErrors: { A: number; B: number };
}

interface SchedulingMetrics {
  preferenceMismatches: { A: number; B: number };
}

interface SusScores {
  versionA: number;
  versionB: number;
}

interface ConfidenceRatings {
  versionA: number;
  versionB: number;
}

interface ParticipantStats {
  demographics: {
    age: Record<string, number>;
    gender: Record<string, number>;
    experience: Record<string, number>;
    education: Record<string, number>;
  };
  completionStatus: {
    total: number;
    registeredOnly: number;
    completedTasks: number;
    completedQuestionnaire: number;
    fullyCompleted: number;
  };
  taskCompletion: Record<TaskType, { A: number; B: number }>;
  caseDurations: Record<TaskType, { A: number[]; B: number[] }>;
  errorRates: Record<TaskType, { A: number; B: number }>;
  hesitationTimes: {
    [TaskType.ORDER_ASSIGNMENT]: { A: number[]; B: number[] };
  };
  taskSpecificMetrics: {
    [TaskType.ORDER_ASSIGNMENT]: TaskSpecificMetrics;
    [TaskType.ORDER_VALIDATION]: ValidationMetrics;
    [TaskType.DELIVERY_SCHEDULING]: SchedulingMetrics;
  };
  nasaTlx: {
    mental: { A: number; B: number };
    physical: { A: number; B: number };
    temporal: { A: number; B: number };
    performance: { A: number; B: number };
    effort: { A: number; B: number };
    frustration: { A: number; B: number };
  };
  susScores: { A: number; B: number };
  confidenceRatings: { A: number; B: number };
}

async function getParticipantStats(): Promise<ParticipantStats> {
  const participants = await prisma.participant.findMany({
    include: {
      actionLogs: true,
      errorLogs: true,
      questionnaire: true,
    },
    where: {
      actionLogs: {
        some: {
          action: 'TASK_END',
        },
      },
    },
  });

  const stats: ParticipantStats = {
    demographics: {
      age: {},
      gender: {},
      experience: {},
      education: {},
    },
    completionStatus: {
      total: participants.length,
      registeredOnly: 0,
      completedTasks: 0,
      completedQuestionnaire: 0,
      fullyCompleted: 0,
    },
    taskCompletion: {
      [TaskType.ORDER_ASSIGNMENT]: { A: 0, B: 0 },
      [TaskType.ORDER_VALIDATION]: { A: 0, B: 0 },
      [TaskType.DELIVERY_SCHEDULING]: { A: 0, B: 0 },
    },
    caseDurations: {
      [TaskType.ORDER_ASSIGNMENT]: { A: [], B: [] },
      [TaskType.ORDER_VALIDATION]: { A: [], B: [] },
      [TaskType.DELIVERY_SCHEDULING]: { A: [], B: [] },
    },
    errorRates: {
      [TaskType.ORDER_ASSIGNMENT]: { A: 0, B: 0 },
      [TaskType.ORDER_VALIDATION]: { A: 0, B: 0 },
      [TaskType.DELIVERY_SCHEDULING]: { A: 0, B: 0 },
    },
    hesitationTimes: {
      [TaskType.ORDER_ASSIGNMENT]: { A: [], B: [] },
    },
    taskSpecificMetrics: {
      [TaskType.ORDER_ASSIGNMENT]: {
        sequenceErrors: { A: 0, B: 0 },
        zoneMatchErrors: { A: 0, B: 0 },
      },
      [TaskType.ORDER_VALIDATION]: {
        validationErrors: { A: 0, B: 0 },
      },
      [TaskType.DELIVERY_SCHEDULING]: {
        preferenceMismatches: { A: 0, B: 0 },
      },
    },
    nasaTlx: {
      mental: { A: 0, B: 0 },
      physical: { A: 0, B: 0 },
      temporal: { A: 0, B: 0 },
      performance: { A: 0, B: 0 },
      effort: { A: 0, B: 0 },
      frustration: { A: 0, B: 0 },
    },
    susScores: { A: 0, B: 0 },
    confidenceRatings: { A: 0, B: 0 },
  };

  participants.forEach(participant => {
    // Track completion status
    const hasCompletedTasks = participant.actionLogs.some(log => 
      log.action === 'TASK_END' && 
      (log.task === TaskType.ORDER_ASSIGNMENT || 
       log.task === TaskType.ORDER_VALIDATION || 
       log.task === TaskType.DELIVERY_SCHEDULING)
    );
    const hasCompletedQuestionnaire = participant.questionnaire !== null;

    if (!hasCompletedTasks && !hasCompletedQuestionnaire) {
      stats.completionStatus.registeredOnly++;
    } else if (hasCompletedTasks && !hasCompletedQuestionnaire) {
      stats.completionStatus.completedTasks++;
    } else if (!hasCompletedTasks && hasCompletedQuestionnaire) {
      stats.completionStatus.completedQuestionnaire++;
    } else {
      stats.completionStatus.fullyCompleted++;
    }

    // Demographics
    if (participant.age) stats.demographics.age[participant.age] = (stats.demographics.age[participant.age] || 0) + 1;
    if (participant.gender) stats.demographics.gender[participant.gender] = (stats.demographics.gender[participant.gender] || 0) + 1;
    if (participant.experience) stats.demographics.experience[participant.experience] = (stats.demographics.experience[participant.experience] || 0) + 1;
    if (participant.education) stats.demographics.education[participant.education] = (stats.demographics.education[participant.education] || 0) + 1;

    // Task completion times and case durations
    participant.actionLogs.forEach(log => {
      if (log.action === 'TASK_END') {
        const taskStart = participant.actionLogs.find(
          l => l.action === 'TASK_START' && l.task === log.task
        );
        if (taskStart) {
          const duration = log.timestamp.getTime() - taskStart.timestamp.getTime();
          stats.taskCompletion[log.task][participant.version] += duration;
        }
      } else if (log.action === 'CASE_SUBMIT') {
        // Find all ORDER_SELECT actions for this order and task
        const selects = participant.actionLogs.filter(
          l => l.action === 'ORDER_SELECT' && 
          l.task === log.task && 
          l.orderId === log.orderId &&
          l.timestamp < log.timestamp
        );
        
        if (selects.length > 0) {
          // Get the last selection before this submit
          const lastSelect = selects.reduce((latest, current) => {
            if (!latest) return current;
            return current.timestamp > latest.timestamp ? current : latest;
          }, selects[0]);
          
          const duration = log.timestamp.getTime() - lastSelect.timestamp.getTime();
          stats.caseDurations[log.task][participant.version].push(duration);
        }
      }
    });

    // Error rates and task-specific metrics
    participant.errorLogs.forEach(error => {
      stats.errorRates[error.task][participant.version]++;
      
      // Task-specific error counting
      if (error.task === TaskType.ORDER_ASSIGNMENT) {
        if (error.errorType === 'SEQUENCE_ERROR') {
          stats.taskSpecificMetrics[TaskType.ORDER_ASSIGNMENT].sequenceErrors[participant.version]++;
        } else if (error.errorType === 'ZONE_MATCH_ERROR') {
          stats.taskSpecificMetrics[TaskType.ORDER_ASSIGNMENT].zoneMatchErrors[participant.version]++;
        }
      } else if (error.task === TaskType.ORDER_VALIDATION) {
        if (error.errorType === 'VALIDATION_ERROR') {
          stats.taskSpecificMetrics[TaskType.ORDER_VALIDATION].validationErrors[participant.version]++;
        }
      } else if (error.task === TaskType.DELIVERY_SCHEDULING) {
        if (error.errorType === 'SCHEDULING_ERROR') {
          stats.taskSpecificMetrics[TaskType.DELIVERY_SCHEDULING].preferenceMismatches[participant.version]++;
        }
      }
    });

    // Calculate hesitation times for order assignment
    const orderAssignmentLogs = participant.actionLogs.filter(
      log => log.task === TaskType.ORDER_ASSIGNMENT
    );

    // Group logs by orderId to calculate hesitation times
    const orderGroups = orderAssignmentLogs.reduce((groups, log) => {
      if (!log.orderId) return groups;
      if (!groups[log.orderId]) groups[log.orderId] = [];
      groups[log.orderId].push(log);
      return groups;
    }, {} as Record<string, typeof orderAssignmentLogs>);

    // Calculate hesitation time for each order
    Object.values(orderGroups).forEach(group => {
      // Find all ORDER_SELECT and CASE_SUBMIT actions for this order
      const submits = group.filter(log => log.action === 'CASE_SUBMIT');
      const selects = group.filter(log => log.action === 'ORDER_SELECT');
      
      if (submits.length > 0 && selects.length > 0) {
        // Get the last selection before the first submit
        const lastSelect = selects.reduce((latest, current) => {
          if (!latest) return current;
          return current.timestamp > latest.timestamp ? current : latest;
        }, selects[0]);
        
        const firstSubmit = submits[0];
        
        // Only calculate if the selection was before the submit
        if (lastSelect.timestamp < firstSubmit.timestamp) {
          const hesitationTime = firstSubmit.timestamp.getTime() - lastSelect.timestamp.getTime();
          stats.hesitationTimes[TaskType.ORDER_ASSIGNMENT][participant.version].push(hesitationTime);
        }
      }
    });

    // Questionnaire data
    if (participant.questionnaire) {
      stats.nasaTlx.mental[participant.version] += participant.questionnaire.nasaTlxMental;
      stats.nasaTlx.physical[participant.version] += participant.questionnaire.nasaTlxPhysical;
      stats.nasaTlx.temporal[participant.version] += participant.questionnaire.nasaTlxTemporal;
      stats.nasaTlx.performance[participant.version] += participant.questionnaire.nasaTlxPerformance;
      stats.nasaTlx.effort[participant.version] += participant.questionnaire.nasaTlxEffort;
      stats.nasaTlx.frustration[participant.version] += participant.questionnaire.nasaTlxFrustration;
      
      // Calculate SUS score
      const susPoints = participant.questionnaire.susResponses.map((response, index) => {
        return index % 2 === 0
          ? response - 1 // positive Qs
          : 5 - response; // negative Qs
      });
      const userSUSScore = susPoints.reduce((a, b) => a + b, 0) * 2.5;
      
      
      stats.susScores[participant.version] += userSUSScore;
      
      
      stats.confidenceRatings[participant.version] += participant.questionnaire.confidenceRating;
    }
  });

  // Calculate averages
  const versionACount = participants.filter(p => p.version === Version.A).length;
  const versionBCount = participants.filter(p => p.version === Version.B).length;

  // Average task completion times
  Object.keys(stats.taskCompletion).forEach(task => {
    stats.taskCompletion[task as TaskType].A /= versionACount;
    stats.taskCompletion[task as TaskType].B /= versionBCount;
  });

  // Average case durations
  Object.keys(stats.caseDurations).forEach(task => {
    const taskKey = task as TaskType;
    const aDurations = stats.caseDurations[taskKey].A;
    const bDurations = stats.caseDurations[taskKey].B;
    const avgADuration = aDurations.length > 0 ? aDurations.reduce((a, b) => a + b, 0) / aDurations.length : 0;
    const avgBDuration = bDurations.length > 0 ? bDurations.reduce((a, b) => a + b, 0) / bDurations.length : 0;
    stats.caseDurations[taskKey].A = [avgADuration];
    stats.caseDurations[taskKey].B = [avgBDuration];
  });

  // Average NASA-TLX scores
  Object.keys(stats.nasaTlx).forEach(dimension => {
    stats.nasaTlx[dimension as keyof typeof stats.nasaTlx].A /= versionACount;
    stats.nasaTlx[dimension as keyof typeof stats.nasaTlx].B /= versionBCount;
  });

  // Average SUS scores and confidence ratings
  stats.susScores.A /= versionACount;
  stats.susScores.B /= versionBCount;
  stats.confidenceRatings.A /= versionACount;
  stats.confidenceRatings.B /= versionBCount;

  // Calculate average hesitation times
  Object.keys(stats.hesitationTimes).forEach(task => {
    const taskKey = task as keyof typeof stats.hesitationTimes;
    const aTimes = stats.hesitationTimes[taskKey].A;
    const bTimes = stats.hesitationTimes[taskKey].B;
    const avgATime = aTimes.length > 0 ? aTimes.reduce((a: number, b: number) => a + b, 0) / aTimes.length : 0;
    const avgBTime = bTimes.length > 0 ? bTimes.reduce((a: number, b: number) => a + b, 0) / bTimes.length : 0;
    stats.hesitationTimes[taskKey].A = [avgATime];
    stats.hesitationTimes[taskKey].B = [avgBTime];
  });

  return stats;
}

async function getRawParticipantData() {
  const participants = await prisma.participant.findMany({
    include: {
      actionLogs: true,
      errorLogs: true,
      questionnaire: true,
    },
  });

  const rawData = participants.map(participant => {
    // Calculate task completion times
    const taskTimes = {
      [TaskType.ORDER_VALIDATION]: 0,
      [TaskType.ORDER_ASSIGNMENT]: 0,
      [TaskType.DELIVERY_SCHEDULING]: 0,
    };

    participant.actionLogs.forEach(log => {
      if (log.action === 'TASK_END') {
        const taskStart = participant.actionLogs.find(
          l => l.action === 'TASK_START' && l.task === log.task
        );
        if (taskStart) {
          const duration = log.timestamp.getTime() - taskStart.timestamp.getTime();
          taskTimes[log.task] = duration / 1000; // Convert to seconds
        }
      }
    });

    // Calculate error counts
    const errorCounts = {
      [TaskType.ORDER_VALIDATION]: 0,
      [TaskType.ORDER_ASSIGNMENT]: 0,
      [TaskType.DELIVERY_SCHEDULING]: 0,
    };

    participant.errorLogs.forEach(error => {
      errorCounts[error.task]++;
    });

    // Get NASA-TLX scores
    const nasaTlx = participant.questionnaire ? {
      mental: participant.questionnaire.nasaTlxMental,
      physical: participant.questionnaire.nasaTlxPhysical,
      temporal: participant.questionnaire.nasaTlxTemporal,
      performance: participant.questionnaire.nasaTlxPerformance,
      effort: participant.questionnaire.nasaTlxEffort,
      frustration: participant.questionnaire.nasaTlxFrustration,
    } : null;

    // Calculate SUS score
    let susScore = 0;
    if (participant.questionnaire) {
      const susPoints = participant.questionnaire.susResponses.map((response, index) => {
        return index % 2 === 0
          ? response - 1 // positive Qs
          : 5 - response; // negative Qs
      });
      susScore = susPoints.reduce((a, b) => a + b, 0) * 2.5;
    }

    return {
      participantId: participant.id,
      version: participant.version,
      taskTimes,
      errorCounts,
      nasaTlx,
      susScore,
      confidenceRating: participant.questionnaire?.confidenceRating || 0,
    };
  });

  return rawData;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AnalysisPage() {
  const stats = await getParticipantStats();
  const participants = await prisma.participant.findMany({
    include: {
      actionLogs: true,
      errorLogs: true,
      questionnaire: true,
    },
  });
  const rawData = await getRawParticipantData();
  const participantCount = participants.length;


  const taskCompletionData: ChartData[] = Object.entries(stats.taskCompletion)
    .sort(([a], [b]) => {
      const order = {
        [TaskType.ORDER_VALIDATION]: 0,
        [TaskType.ORDER_ASSIGNMENT]: 1,
        [TaskType.DELIVERY_SCHEDULING]: 2
      };
      return order[a as TaskType] - order[b as TaskType];
    })
    .map(([task, times]) => ({
      name: task.replace('_', ' '),
      versionA: times.A,
      versionB: times.B,
      improvement: ((times.A - times.B) / times.A * 100).toFixed(1),
      higherIsBetter: false
    }));

  const errorRatesData: ChartData[] = Object.entries(stats.errorRates)
    .sort(([a], [b]) => {
      const order = {
        [TaskType.ORDER_VALIDATION]: 0,
        [TaskType.ORDER_ASSIGNMENT]: 1,
        [TaskType.DELIVERY_SCHEDULING]: 2
      };
      return order[a as TaskType] - order[b as TaskType];
    })
    .map(([task, rates]) => ({
      name: task.replace('_', ' '),
      versionA: rates.A,
      versionB: rates.B,
      reduction: rates.A === 0 ? '100.0' : ((rates.A - rates.B) / rates.A * 100).toFixed(1),
      higherIsBetter: false
    }));

  const hesitationTimeData: ChartData[] = Object.entries(stats.hesitationTimes).map(([task, times]) => {
    const versionA = (times.A[0] || 0) / 1000;
    const versionB = (times.B[0] || 0) / 1000;
    const improvement = versionA === 0 ? '100.0' : ((versionB - versionA) / versionA * 100).toFixed(1);
    return {
      name: task.replace('_', ' '),
      versionA: Number(versionA.toFixed(2)),
      versionB: Number(versionB.toFixed(2)),
      improvement,
      higherIsBetter: false
    };
  });

  const nasaTlxData: ChartData[] = [
    { 
      name: 'Mental', 
      versionA: stats.nasaTlx.mental.A, 
      versionB: stats.nasaTlx.mental.B,
      improvement: ((stats.nasaTlx.mental.A - stats.nasaTlx.mental.B) / stats.nasaTlx.mental.A * 100).toFixed(1),
      higherIsBetter: false
    },
    { 
      name: 'Physical', 
      versionA: stats.nasaTlx.physical.A, 
      versionB: stats.nasaTlx.physical.B,
      improvement: ((stats.nasaTlx.physical.A - stats.nasaTlx.physical.B) / stats.nasaTlx.physical.A * 100).toFixed(1),
      higherIsBetter: false
    },
    { 
      name: 'Temporal', 
      versionA: stats.nasaTlx.temporal.A, 
      versionB: stats.nasaTlx.temporal.B,
      improvement: ((stats.nasaTlx.temporal.A - stats.nasaTlx.temporal.B) / stats.nasaTlx.temporal.A * 100).toFixed(1),
      higherIsBetter: false
    },
    { 
      name: 'Performance', 
      versionA: stats.nasaTlx.performance.A, 
      versionB: stats.nasaTlx.performance.B,
      improvement: ((stats.nasaTlx.performance.A - stats.nasaTlx.performance.B) / stats.nasaTlx.performance.A * 100).toFixed(1),
      higherIsBetter: false
    },
    { 
      name: 'Effort', 
      versionA: stats.nasaTlx.effort.A, 
      versionB: stats.nasaTlx.effort.B,
      improvement: ((stats.nasaTlx.effort.A - stats.nasaTlx.effort.B) / stats.nasaTlx.effort.A * 100).toFixed(1),
      higherIsBetter: false
    },
    { 
      name: 'Frustration', 
      versionA: stats.nasaTlx.frustration.A, 
      versionB: stats.nasaTlx.frustration.B,
      improvement: ((stats.nasaTlx.frustration.A - stats.nasaTlx.frustration.B) / stats.nasaTlx.frustration.A * 100).toFixed(1),
      higherIsBetter: false
    },
  ];

  const susScores: SusScores = {
    versionA: stats.susScores.A,
    versionB: stats.susScores.B,
  };

  const confidenceRatings: ConfidenceRatings = {
    versionA: stats.confidenceRatings.A,
    versionB: stats.confidenceRatings.B,
  };

  const versionDistributionData: VersionDistributionData[] = [
    { name: 'Version A', value: participants.filter(p => p.version === Version.A).length },
    { name: 'Version B', value: participants.filter(p => p.version === Version.B).length }
  ];

  const caseDurationsData = Object.entries(stats.caseDurations)
    .sort(([a], [b]) => {
      const order = {
        [TaskType.ORDER_VALIDATION]: 0,
        [TaskType.ORDER_ASSIGNMENT]: 1,
        [TaskType.DELIVERY_SCHEDULING]: 2
      };
      return order[a as TaskType] - order[b as TaskType];
    })
    .map(([task, durations]) => ({
      task,
      versionA: durations.A,
      versionB: durations.B
    }));

  const susQuestions = [
    "I think that I would like to use this system frequently.",
    "I found the system unnecessarily complex.",
    "I thought the system was easy to use.",
    "I think that I would need the support of a technical person to be able to use this system.",
    "I found the various functions in this system were well integrated.",
    "I thought there was too much inconsistency in this system.",
    "I would imagine that most people would learn to use this system very quickly.",
    "I found the system very cumbersome to use.",
    "I felt very confident using the system.",
    "I needed to learn a lot of things before I could get going with this system."
  ];

  const susQuestionsTableData = susQuestions.map((question, index) => {
    const avgResponseA = participants.reduce((acc, p) => {
      if (p.questionnaire && p.version === Version.A) {
        return acc + p.questionnaire.susResponses[index];
      }
      return acc;
    }, 0) / participants.filter(p => p.version === Version.A && p.questionnaire).length;

    const avgResponseB = participants.reduce((acc, p) => {
      if (p.questionnaire && p.version === Version.B) {
        return acc + p.questionnaire.susResponses[index];
      }
      return acc;
    }, 0) / participants.filter(p => p.version === Version.B && p.questionnaire).length;

    // For even-numbered questions (negative statements), lower score is better
    // For odd-numbered questions (positive statements), higher score is better
    const isPositiveQuestion = index % 2 === 0;
    const improvement = avgResponseA === 0 ? 0 : 
      isPositiveQuestion 
        ? ((avgResponseB - avgResponseA) / avgResponseA * 100)  // Higher is better
        : ((avgResponseA - avgResponseB) / avgResponseA * 100); // Lower is better

    return {
      name: question,
      versionA: avgResponseA,
      versionB: avgResponseB,
      improvement: improvement.toFixed(1)
    };
  });

  // Create feedback table data
  const feedbackTableData = participants
    .filter(p => p.questionnaire?.feedback)
    .map(p => ({
      name: p.id,
      versionA: p.version === Version.A ? 1 : 0,
      versionB: p.version === Version.B ? 1 : 0,
      feedback: p.questionnaire?.feedback || ''
    })).sort((a, b) => b.versionA - a.versionA);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Header */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 border-b border-gray-200/50 shadow-sm mb-8">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Experiment Analysis</h1>
              <p className="mt-2 text-sm sm:text-base text-gray-600">
                Analyzing the impact of digital nudging in ERP interfaces
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <RefreshButton />
              <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 w-full sm:w-auto">
                <div className="text-xs font-medium text-gray-600">Total Participants</div>
                <div className="text-2xl font-bold text-gray-800">{participantCount}</div>
                <div className="mt-1 text-xs">
                  <span className="text-blue-600 font-bold">A: {versionDistributionData[0].value}</span>
                  <span className="text-green-600 ml-3 font-bold">B: {versionDistributionData[1].value}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Improvements with Digital Nudging - moved to top */}
      <div className="max-w-[1920px] mx-auto px-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Key Improvements with Digital Nudging</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Task Efficiency */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-medium text-gray-900">Task Efficiency</h3>
              <span className="text-green-600 text-2xl font-semibold">
                +{Math.abs((Object.values(stats.taskCompletion).reduce((acc, curr) => 
                  acc + ((curr.A - curr.B) / curr.A), 0) / Object.keys(stats.taskCompletion).length * 100)).toFixed(1)}%
              </span>
            </div>
            <p className="text-sm text-gray-500">Average completion time reduction</p>
          </div>

          {/* Error Reduction */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-medium text-gray-900">Error Reduction</h3>
              <span className="text-green-600 text-2xl font-semibold">
                -{((Object.values(stats.errorRates).reduce((acc, curr) => 
                  curr.A === 0 ? acc + 100 : acc + ((curr.A - curr.B) / curr.A * 100), 0) / Object.keys(stats.errorRates).length)).toFixed(1)}%
              </span>
            </div>
            <p className="text-sm text-gray-500">Average error rate reduction</p>
          </div>

          {/* Cognitive Load */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-medium text-gray-900">Cognitive Load</h3>
              <span className="text-green-600 text-2xl font-semibold">
                -{Math.abs(([
                  stats.nasaTlx.mental,
                  stats.nasaTlx.effort,
                  stats.nasaTlx.frustration,
                  stats.nasaTlx.physical,
                  stats.nasaTlx.temporal,
                  stats.nasaTlx.performance
                ].reduce((acc, curr) => acc + ((curr.A - curr.B) / curr.A), 0) / 6 * 100)).toFixed(1)}%
              </span>
            </div>
            <p className="text-sm text-gray-500">Mental workload reduction</p>
          </div>

          {/* User Experience */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-medium text-gray-900">User Experience</h3>
              <span className="text-green-600 text-2xl font-semibold">
                +{((stats.susScores.B - stats.susScores.A) / stats.susScores.A * 100).toFixed(1)}%
              </span>
            </div>
            <p className="text-sm text-gray-500">SUS score improvement</p>
          </div>
        </div>
      </div>

      {/* Key Metrics Table */}
      <div className="max-w-[1920px] mx-auto px-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Key Metrics Summary</h2>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <KeyMetricsTable
            title="Key Performance Metrics"
            data={[
              {
                name: 'Average Task Completion Time',
                versionA: Object.values(stats.taskCompletion).reduce((acc, curr) => acc + curr.A, 0) / Object.keys(stats.taskCompletion).length / 1000,
                versionB: Object.values(stats.taskCompletion).reduce((acc, curr) => acc + curr.B, 0) / Object.keys(stats.taskCompletion).length / 1000,
                improvement: (((Object.values(stats.taskCompletion).reduce((acc, curr) => acc + curr.B, 0) / Object.keys(stats.taskCompletion).length / 1000) -
                              (Object.values(stats.taskCompletion).reduce((acc, curr) => acc + curr.A, 0) / Object.keys(stats.taskCompletion).length / 1000)) /
                              (Object.values(stats.taskCompletion).reduce((acc, curr) => acc + curr.A, 0) / Object.keys(stats.taskCompletion).length / 1000) * 100).toFixed(1),
                higherIsBetter: false
              },
              {
                name: 'Average Error Count',
                versionA: Object.values(stats.errorRates).reduce((acc, curr) => acc + curr.A, 0) / (participants.filter(p => p.version === Version.A).length || 1),
                versionB: Object.values(stats.errorRates).reduce((acc, curr) => acc + curr.B, 0) / (participants.filter(p => p.version === Version.B).length || 1),
                improvement: (((Object.values(stats.errorRates).reduce((acc, curr) => acc + curr.B, 0) / (participants.filter(p => p.version === Version.B).length || 1)) -
                              (Object.values(stats.errorRates).reduce((acc, curr) => acc + curr.A, 0) / (participants.filter(p => p.version === Version.A).length || 1))) /
                              (Object.values(stats.errorRates).reduce((acc, curr) => acc + curr.A, 0) / (participants.filter(p => p.version === Version.A).length || 1)) * 100).toFixed(1),
                higherIsBetter: false
              },
              {
                name: 'NASA-TLX Average',
                versionA: (stats.nasaTlx.mental.A + stats.nasaTlx.physical.A + stats.nasaTlx.temporal.A +
                          stats.nasaTlx.performance.A + stats.nasaTlx.effort.A + stats.nasaTlx.frustration.A) / 6,
                versionB: (stats.nasaTlx.mental.B + stats.nasaTlx.physical.B + stats.nasaTlx.temporal.B +
                          stats.nasaTlx.performance.B + stats.nasaTlx.effort.B + stats.nasaTlx.frustration.B) / 6,
                improvement: ((((stats.nasaTlx.mental.B + stats.nasaTlx.physical.B + stats.nasaTlx.temporal.B +
                              stats.nasaTlx.performance.B + stats.nasaTlx.effort.B + stats.nasaTlx.frustration.B) / 6) -
                             ((stats.nasaTlx.mental.A + stats.nasaTlx.physical.A + stats.nasaTlx.temporal.A +
                              stats.nasaTlx.performance.A + stats.nasaTlx.effort.A + stats.nasaTlx.frustration.A) / 6)) /
                             ((stats.nasaTlx.mental.A + stats.nasaTlx.physical.A + stats.nasaTlx.temporal.A +
                              stats.nasaTlx.performance.A + stats.nasaTlx.effort.A + stats.nasaTlx.frustration.A) / 6) * 100).toFixed(1),
                higherIsBetter: false
              },
              {
                name: 'SUS Score Average',
                versionA: stats.susScores.A,
                versionB: stats.susScores.B,
                improvement: ((stats.susScores.B - stats.susScores.A) / stats.susScores.A * 100).toFixed(1),
                higherIsBetter: true
              },
              {
                name: 'Decision Confidence',
                versionA: stats.confidenceRatings.A,
                versionB: stats.confidenceRatings.B,
                improvement: ((stats.confidenceRatings.B - stats.confidenceRatings.A) / stats.confidenceRatings.A * 100).toFixed(1),
                higherIsBetter: true
              },
            ]}
            showChange
            inline={false}
          />
        </div>
      </div>

      <div className="max-w-[1920px] mx-auto px-6">
        {/* Participant Details Table */}
        <ParticipantTable participants={participants} completionStatus={stats.completionStatus} />

        {/* Main Content */}
        <div className="space-y-12">
          {/* Demographics Section */}
          <section className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Participant Demographics</h2>
              <DemographicsCharts demographics={stats.demographics} />
          </section>

          {/* Task Performance Section */}
          <section className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Task Performance Analysis</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <TaskCompletion taskCompletionData={taskCompletionData} />
                <CaseDurations caseDurationsData={caseDurationsData} />
            </div>
           
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <ErrorRates errorRatesData={errorRatesData} />
            </div>
            <div className="mb-6">
              <TaskEfficiencyVsErrorRate 
                taskCompletionData={taskCompletionData}
                errorRatesData={errorRatesData}
              />
            </div>
            <div className="mb-6">
              <UserEfficiencyVsErrorRate participants={participants} />
            </div>
            <div className="mb-6">
            <HesitationTime hesitationTimeData={hesitationTimeData} />
            </div>
          </section>

          {/* User Experience Section */}
          <section className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">User Experience Analysis</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <NasaTLX nasaTlxData={nasaTlxData} />
                <Confidence confidenceRatings={confidenceRatings} />
                <SUS susScores={susScores} />
            </div>
            <AnalysisTable
              inline={false}
              title="System Usability Scale (SUS) Questions"
              data={susQuestionsTableData}
              showChange
              higherIsBetter={true}
            />
          </section>

          {/* Feedback Section */}
          <section className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Participant Feedback</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Version</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Feedback</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {feedbackTableData.map((item) => (
                    <tr key={item.name} className={item.versionA === 1 ? 'bg-blue-50' : 'bg-green-50'}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {item.versionA === 1 ? 'Version A' : 'Version B'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{item.feedback}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
} 