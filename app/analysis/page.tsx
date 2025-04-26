import { prisma } from '@/lib/prisma';
import { Version, TaskType, Participant, ActionLog, ErrorLog, Questionnaire, ActionType } from '@prisma/client';
import {
  DemographicsCharts,
  VersionDistribution,
  TaskCompletion,
  ErrorRates,
  NasaTLX,
  SUS,
  Confidence,
  HesitationTime,
  CaseDurations
} from '../components/analysis/Charts';
import {
  TaskPerformanceTable,
  ErrorAnalysisTable,
  NasaTLXTable,
  UsabilityTable,
  HesitationTimeTable,
  CaseDurationTable
} from '../components/analysis/Tables';
import { RefreshButton } from '../components/analysis/RefreshButton';
import { ParticipantTable } from '../components/analysis/ParticipantTable';

type ParticipantWithRelations = Participant & {
  actionLogs: ActionLog[];
  errorLogs: ErrorLog[];
  questionnaire: Questionnaire | null;
};

interface ChartData {
  name: string;
  versionA: number;
  versionB: number;
  improvement?: string;
  reduction?: string;
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
        const caseStart = participant.actionLogs.find(
          l => l.action === 'ORDER_SELECT' && l.task === log.task && l.orderId === log.orderId
        );
        if (caseStart) {
          const duration = log.timestamp.getTime() - caseStart.timestamp.getTime();
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

    // Calculate hesitation time between order groups
    const orderIds = Object.keys(orderGroups);
    for (let i = 0; i < orderIds.length - 1; i++) {
      const currentGroup = orderGroups[orderIds[i]];
      const nextGroup = orderGroups[orderIds[i + 1]];
      
      const currentSubmit = currentGroup.find(log => log.action === 'CASE_SUBMIT');
      const nextSelect = nextGroup.find(log => log.action === 'ORDER_SELECT');
      
      if (currentSubmit && nextSelect) {
        const hesitationTime = nextSelect.timestamp.getTime() - currentSubmit.timestamp.getTime();
        stats.hesitationTimes[TaskType.ORDER_ASSIGNMENT][participant.version].push(hesitationTime);
      }
    }

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
  const participantCount = participants.length;
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
  const participantCount = participants.length;

  // Analyze action logs
  const actionLogStats = participants.reduce((acc, participant) => {
    participant.actionLogs.forEach(log => {
      if (!acc[log.action]) {
        acc[log.action] = {
          total: 0,
          byVersion: { A: 0, B: 0 },
          byTask: {
            [TaskType.ORDER_ASSIGNMENT]: 0,
            [TaskType.ORDER_VALIDATION]: 0,
            [TaskType.DELIVERY_SCHEDULING]: 0
          }
        };
      }
      acc[log.action].total++;
      acc[log.action].byVersion[participant.version]++;
      if (log.task) {
        acc[log.action].byTask[log.task]++;
      }
    });
    return acc;
  }, {} as Record<string, {
    total: number;
    byVersion: { A: number; B: number };
    byTask: Record<TaskType, number>;
  }>);

  const taskCompletionData: ChartData[] = Object.entries(stats.taskCompletion).map(([task, times]) => ({
    name: task.replace('_', ' '),
    versionA: times.A,
    versionB: times.B,
    improvement: ((times.A - times.B) / times.A * 100).toFixed(1)
  }));

  const errorRatesData: ChartData[] = Object.entries(stats.errorRates).map(([task, rates]) => ({
    name: task.replace('_', ' '),
    versionA: rates.A,
    versionB: rates.B,
    reduction: rates.A === 0 ? '100.0' : ((rates.A - rates.B) / rates.A * 100).toFixed(1)
  }));

  const hesitationTimeData: ChartData[] = Object.entries(stats.hesitationTimes).map(([task, times]) => {
    const versionA = times.A[0] || 0;
    const versionB = times.B[0] || 0;
    // Calculate percentage reduction (positive means improvement, negative means worse)
    const improvement = versionA === 0 ? '100.0' : ((versionA - versionB) / versionA * 100).toFixed(1);
    
    return {
      name: task.replace('_', ' '),
      versionA,
      versionB,
      improvement
    };
  });

  const nasaTlxData: ChartData[] = [
    { name: 'Mental', versionA: stats.nasaTlx.mental.A, versionB: stats.nasaTlx.mental.B },
    { name: 'Physical', versionA: stats.nasaTlx.physical.A, versionB: stats.nasaTlx.physical.B },
    { name: 'Temporal', versionA: stats.nasaTlx.temporal.A, versionB: stats.nasaTlx.temporal.B },
    { name: 'Performance', versionA: stats.nasaTlx.performance.A, versionB: stats.nasaTlx.performance.B },
    { name: 'Effort', versionA: stats.nasaTlx.effort.A, versionB: stats.nasaTlx.effort.B },
    { name: 'Frustration', versionA: stats.nasaTlx.frustration.A, versionB: stats.nasaTlx.frustration.B },
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

  const caseDurationsData = Object.entries(stats.caseDurations).map(([task, durations]) => ({
    task,
    versionA: durations.A,
    versionB: durations.B
  }));

  // Calculate table data
  const taskPerformanceData = Object.entries(stats.taskCompletion).map(([task, times]) => ({
    name: task.replace('_', ' '),
    versionA: times.A / 1000, // Convert to seconds
    versionB: times.B / 1000,
    improvement: ((times.A - times.B) / times.A * 100).toFixed(1)
  }));

  const errorAnalysisData = Object.entries(stats.errorRates).map(([task, rates]) => ({
    name: task.replace('_', ' '),
    versionA: rates.A,
    versionB: rates.B,
    reduction: rates.A === 0 ? '100.0' : ((rates.A - rates.B) / rates.A * 100).toFixed(1)
  }));

  const nasaTLXTableData = [
    { name: 'Mental Demand', versionA: stats.nasaTlx.mental.A, versionB: stats.nasaTlx.mental.B, improvement: ((stats.nasaTlx.mental.A - stats.nasaTlx.mental.B) / stats.nasaTlx.mental.A * 100).toFixed(1) },
    { name: 'Physical Demand', versionA: stats.nasaTlx.physical.A, versionB: stats.nasaTlx.physical.B, improvement: ((stats.nasaTlx.physical.A - stats.nasaTlx.physical.B) / stats.nasaTlx.physical.A * 100).toFixed(1) },
    { name: 'Temporal Demand', versionA: stats.nasaTlx.temporal.A, versionB: stats.nasaTlx.temporal.B, improvement: ((stats.nasaTlx.temporal.A - stats.nasaTlx.temporal.B) / stats.nasaTlx.temporal.A * 100).toFixed(1) },
    { name: 'Performance', versionA: stats.nasaTlx.performance.A, versionB: stats.nasaTlx.performance.B, improvement: ((stats.nasaTlx.performance.B - stats.nasaTlx.performance.A) / stats.nasaTlx.performance.A * 100).toFixed(1) },
    { name: 'Effort', versionA: stats.nasaTlx.effort.A, versionB: stats.nasaTlx.effort.B, improvement: ((stats.nasaTlx.effort.A - stats.nasaTlx.effort.B) / stats.nasaTlx.effort.A * 100).toFixed(1) },
    { name: 'Frustration', versionA: stats.nasaTlx.frustration.A, versionB: stats.nasaTlx.frustration.B, improvement: ((stats.nasaTlx.frustration.A - stats.nasaTlx.frustration.B) / stats.nasaTlx.frustration.A * 100).toFixed(1) }
  ];

  const hesitationTimeTableData = Object.entries(stats.hesitationTimes).map(([task, times]) => {
    const versionA = times.A[0] || 0;
    const versionB = times.B[0] || 0;
    return {
      name: task.replace('_', ' '),
      versionA: versionA / 1000, // Convert to seconds
      versionB: versionB / 1000,
      improvement: versionA === 0 ? '100.0' : ((versionA - versionB) / versionA * 100).toFixed(1)
    };
  });

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
                <div className="text-2xl font-bold text-blue-600">{participantCount}</div>
              </div>
              <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 w-full sm:w-auto">
                <div className="text-xs font-medium text-gray-600">Version Distribution</div>
                <div className="mt-1">
                  <div className="flex items-center space-x-1">
                    <div className="flex-1 bg-blue-100 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${(versionDistributionData[0].value / participantCount) * 100}%` }}></div>
                    </div>
                    <div className="text-xs text-gray-600">A: {versionDistributionData[0].value}</div>
                  </div>
                  <div className="flex items-center space-x-1 mt-1">
                    <div className="flex-1 bg-green-100 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: `${(versionDistributionData[1].value / participantCount) * 100}%` }}></div>
                    </div>
                    <div className="text-xs text-gray-600">B: {versionDistributionData[1].value}</div>
                  </div>
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
                  stats.nasaTlx.frustration
                ].reduce((acc, curr) => acc + ((curr.A - curr.B) / curr.A), 0) / 3 * 100)).toFixed(1)}%
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
            <div className="grid gap-6">
              <TaskPerformanceTable data={taskPerformanceData} />
              <CaseDurationTable data={caseDurationsData} />
            </div>
          </section>

          {/* Error Analysis Section */}
          <section className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Error Analysis</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <ErrorRates errorRatesData={errorRatesData} />
                <HesitationTime hesitationTimeData={hesitationTimeData} />
            </div>
            <div className="grid gap-6">
              <ErrorAnalysisTable data={errorAnalysisData} />
              <HesitationTimeTable data={hesitationTimeTableData} />
            </div>
          </section>

          {/* User Experience Section */}
          <section className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">User Experience Analysis</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <SUS susScores={susScores} />
                <Confidence confidenceRatings={confidenceRatings} />
                <NasaTLX nasaTlxData={nasaTlxData} />
            </div>
            <div className="grid gap-6">
              <NasaTLXTable data={nasaTLXTableData} />
              <UsabilityTable 
                susScores={{
                  versionA: susScores.versionA,
                  versionB: susScores.versionB
                }}
                confidenceRatings={{
                  versionA: confidenceRatings.versionA,
                  versionB: confidenceRatings.versionB
                }}
              />
            </div>
          </section>

          {/* Questionnaire Details Section */}
          <section className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Questionnaire Details</h2>
            
            {/* Summary Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h3 className="text-sm font-medium text-blue-900 mb-2">SUS Score (Version A)</h3>
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold text-blue-600">{stats.susScores.A.toFixed(1)}</span>
                  <span className="text-sm text-blue-600 ml-1">/ 100</span>
                </div>
                <p className="text-xs text-blue-600 mt-1">Average System Usability Score</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <h3 className="text-sm font-medium text-green-900 mb-2">SUS Score (Version B)</h3>
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold text-green-600">{stats.susScores.B.toFixed(1)}</span>
                  <span className="text-sm text-green-600 ml-1">/ 100</span>
                </div>
                <p className="text-xs text-green-600 mt-1">Average System Usability Score</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                <h3 className="text-sm font-medium text-purple-900 mb-2">Improvement</h3>
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold text-purple-600">
                    {((stats.susScores.B - stats.susScores.A) / stats.susScores.A * 100).toFixed(1)}%
                  </span>
                </div>
                <p className="text-xs text-purple-600 mt-1">SUS Score Improvement</p>
              </div>
            </div>
            
            {/* SUS Questions */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">System Usability Scale (SUS) Questions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
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
                ].map((question, index) => {
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

                  const negativeIndices = [1, 3, 5, 7, 9]; // 0-based indices for Q2, Q4, Q6, Q8, Q10
                  let improvement = ((avgResponseB - avgResponseA) / avgResponseA * 100);
                  if (negativeIndices.includes(index)) {
                    improvement = -improvement; // Invert for negative questions
                  }
                  const improvementStr = improvement.toFixed(1);

                  return (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-700 mb-3">
                        <span className="font-medium">Q{index + 1}:</span> {question}
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <span className="text-blue-600 font-medium mr-2">A:</span>
                            <div className="w-24 bg-blue-100 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${(avgResponseA / 5) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-gray-600 ml-2">{avgResponseA.toFixed(1)}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <span className="text-green-600 font-medium mr-2">B:</span>
                            <div className="w-24 bg-green-100 rounded-full h-2">
                              <div 
                                className="bg-green-600 h-2 rounded-full" 
                                style={{ width: `${(avgResponseB / 5) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-gray-600 ml-2">{avgResponseB.toFixed(1)}</span>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          <span className={improvement > 0 ? "text-green-600" : "text-red-600"}>
                            {improvement > 0 ? `+${improvementStr}% improvement` : `${improvementStr}% change`}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* NASA-TLX Descriptions */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">NASA-TLX Dimensions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries({
                  mental: {
                    label: "Mental Demand",
                    description: "How much mental and perceptual activity was required? For example, how much did you need to think, decide, calculate, remember, look, search, etc.?"
                  },
                  physical: {
                    label: "Physical Demand",
                    description: "How much physical activity was required? For example, how much did you need to push, pull, turn, control, or activate?"
                  },
                  temporal: {
                    label: "Time Pressure",
                    description: "How much time pressure did you feel due to the rate or pace at which the tasks or task elements occurred?"
                  },
                  performance: {
                    label: "Task Performance",
                    description: "How successful were you in accomplishing what you were asked to do? How satisfied were you with your performance in accomplishing these tasks?"
                  },
                  effort: {
                    label: "Effort Required",
                    description: "How hard did you have to work (mentally and physically) to accomplish your level of performance?"
                  },
                  frustration: {
                    label: "Frustration Level",
                    description: "How irritated, stressed, and annoyed versus content, relaxed, and complacent did you feel during the tasks?"
                  }
                }).map(([key, { label, description }]) => {
                  const avgScoreA = stats.nasaTlx[key as keyof typeof stats.nasaTlx].A;
                  const avgScoreB = stats.nasaTlx[key as keyof typeof stats.nasaTlx].B;
                  // For NASA-TLX, lower scores are better (except for Performance)
                  const improvement = key === 'performance' 
                    ? ((avgScoreB - avgScoreA) / avgScoreA * 100).toFixed(1)  // Higher is better for Performance
                    : ((avgScoreA - avgScoreB) / avgScoreA * 100).toFixed(1); // Lower is better for other dimensions

                  return (
                    <div key={key} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h4 className="font-medium text-gray-900 mb-2">{label}</h4>
                      <p className="text-sm text-gray-700 mb-3">{description}</p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <span className="text-blue-600 font-medium mr-2">A:</span>
                            <div className="w-24 bg-blue-100 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${(avgScoreA / 100) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-gray-600 ml-2">{avgScoreA.toFixed(1)}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <span className="text-green-600 font-medium mr-2">B:</span>
                            <div className="w-24 bg-green-100 rounded-full h-2">
                              <div 
                                className="bg-green-600 h-2 rounded-full" 
                                style={{ width: `${(avgScoreB / 100) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-gray-600 ml-2">{avgScoreB.toFixed(1)}</span>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {parseFloat(improvement) > 0 ? (
                            <span className="text-green-600">+{improvement}% improvement</span>
                          ) : (
                            <span className="text-red-600">{improvement}% change</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
} 