import { Participant, Version, TaskType, ActionLog, ErrorLog, Questionnaire } from '@prisma/client';

interface ParticipantWithRelations extends Participant {
  actionLogs: ActionLog[];
  errorLogs: ErrorLog[];
  questionnaire: Questionnaire | null;
}

interface IndividualMetricsTableProps {
  participants: ParticipantWithRelations[];
}

export const IndividualMetricsTable = ({ participants }: IndividualMetricsTableProps) => {
  const calculateParticipantMetrics = (participant: ParticipantWithRelations) => {
    const metrics = {
      taskCompletion: {
        [TaskType.ORDER_VALIDATION]: 0,
        [TaskType.ORDER_ASSIGNMENT]: 0,
        [TaskType.DELIVERY_SCHEDULING]: 0,
      },
      caseDurations: {
        [TaskType.ORDER_VALIDATION]: [] as number[],
        [TaskType.ORDER_ASSIGNMENT]: [] as number[],
        [TaskType.DELIVERY_SCHEDULING]: [] as number[],
      },
      errorRates: {
        [TaskType.ORDER_VALIDATION]: 0,
        [TaskType.ORDER_ASSIGNMENT]: 0,
        [TaskType.DELIVERY_SCHEDULING]: 0,
      },
      hesitationTime: 0,
      susScore: 0,
      confidenceRating: 0,
      nasaTlx: {
        mental: 0,
        physical: 0,
        temporal: 0,
        performance: 0,
        effort: 0,
        frustration: 0,
      },
    };

    // Calculate task completion times
    participant.actionLogs.forEach(log => {
      if (log.action === 'TASK_END') {
        const taskStart = participant.actionLogs.find(
          l => l.action === 'TASK_START' && l.task === log.task
        );
        if (taskStart) {
          const duration = log.timestamp.getTime() - taskStart.timestamp.getTime();
          metrics.taskCompletion[log.task] = duration;
        }
      } else if (log.action === 'CASE_SUBMIT') {
        const caseStart = participant.actionLogs.find(
          l => l.action === 'ORDER_SELECT' && l.task === log.task && l.orderId === log.orderId
        );
        if (caseStart) {
          const duration = log.timestamp.getTime() - caseStart.timestamp.getTime();
          metrics.caseDurations[log.task].push(duration);
        }
      }
    });

    // Calculate error rates
    participant.errorLogs.forEach(error => {
      metrics.errorRates[error.task]++;
    });

    // Calculate hesitation time for order assignment
    const orderAssignmentLogs = participant.actionLogs.filter(
      log => log.task === TaskType.ORDER_ASSIGNMENT
    );
    const orderGroups = orderAssignmentLogs.reduce((groups, log) => {
      if (!log.orderId) return groups;
      if (!groups[log.orderId]) groups[log.orderId] = [];
      groups[log.orderId].push(log);
      return groups;
    }, {} as Record<string, typeof orderAssignmentLogs>);

    const orderIds = Object.keys(orderGroups);
    let totalHesitationTime = 0;
    let hesitationCount = 0;
    for (let i = 0; i < orderIds.length - 1; i++) {
      const currentGroup = orderGroups[orderIds[i]];
      const nextGroup = orderGroups[orderIds[i + 1]];
      
      const currentSubmit = currentGroup.find(log => log.action === 'CASE_SUBMIT');
      const nextSelect = nextGroup.find(log => log.action === 'ORDER_SELECT');
      
      if (currentSubmit && nextSelect) {
        const hesitationTime = nextSelect.timestamp.getTime() - currentSubmit.timestamp.getTime();
        totalHesitationTime += hesitationTime;
        hesitationCount++;
      }
    }
    metrics.hesitationTime = hesitationCount > 0 ? totalHesitationTime / hesitationCount : 0;

    // Calculate questionnaire metrics
    if (participant.questionnaire) {
      metrics.nasaTlx = {
        mental: participant.questionnaire.nasaTlxMental,
        physical: participant.questionnaire.nasaTlxPhysical,
        temporal: participant.questionnaire.nasaTlxTemporal,
        performance: participant.questionnaire.nasaTlxPerformance,
        effort: participant.questionnaire.nasaTlxEffort,
        frustration: participant.questionnaire.nasaTlxFrustration,
      };

      // Calculate SUS score
      const susPoints = participant.questionnaire.susResponses.map((response, index) => {
        return index % 2 === 0
          ? response - 1 // positive Qs
          : 5 - response; // negative Qs
      });
      metrics.susScore = susPoints.reduce((a, b) => a + b, 0) * 2.5;
      metrics.confidenceRating = participant.questionnaire.confidenceRating;
    }

    return metrics;
  };

  const formatTime = (ms: number) => {
    return (ms / 1000).toFixed(1) + 's';
  };

  const formatScore = (score: number) => {
    return score.toFixed(1);
  };

  // Calculate statistics for heatmap
  const calculateStatistics = () => {
    const allMetrics = participants.map(participant => {
      const metrics = calculateParticipantMetrics(participant);
      const avgCaseDuration = Object.values(metrics.caseDurations).flat().reduce((a, b) => a + b, 0) / 
        Object.values(metrics.caseDurations).flat().length || 0;
      const totalErrors = Object.values(metrics.errorRates).reduce((a, b) => a + b, 0);
      const avgNasaTlx = Object.values(metrics.nasaTlx).reduce((a, b) => a + b, 0) / 6;
      const totalTaskTime = Object.values(metrics.taskCompletion).reduce((a, b) => a + b, 0);

      return {
        taskTime: totalTaskTime,
        caseDuration: avgCaseDuration,
        errors: totalErrors,
        hesitation: metrics.hesitationTime,
        sus: metrics.susScore,
        confidence: metrics.confidenceRating,
        nasaTlx: avgNasaTlx,
      };
    });

    const stats = {
      taskTime: calculateStats(allMetrics.map(m => m.taskTime)),
      caseDuration: calculateStats(allMetrics.map(m => m.caseDuration)),
      errors: calculateStats(allMetrics.map(m => m.errors)),
      hesitation: calculateStats(allMetrics.map(m => m.hesitation)),
      sus: calculateStats(allMetrics.map(m => m.sus)),
      confidence: calculateStats(allMetrics.map(m => m.confidence)),
      nasaTlx: calculateStats(allMetrics.map(m => m.nasaTlx)),
    };

    return stats;
  };

  const calculateStats = (values: number[]) => {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const stdDev = Math.sqrt(
      values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length
    );
    return { mean, stdDev };
  };

  const getHeatmapColor = (value: number, stats: { mean: number; stdDev: number }, reverse: boolean = false) => {
    const zScore = (value - stats.mean) / stats.stdDev;
    if (isNaN(zScore)) return 'bg-white';
    
    // For metrics where lower is better (time, errors, hesitation, nasa-tlx)
    if (!reverse) {
      if (zScore > 1.5) return 'bg-red-100';
      if (zScore > 1) return 'bg-red-50';
      if (zScore < -1.5) return 'bg-green-100';
      if (zScore < -1) return 'bg-green-50';
    } 
    // For metrics where higher is better (sus, confidence)
    else {
      if (zScore > 1.5) return 'bg-green-100';
      if (zScore > 1) return 'bg-green-50';
      if (zScore < -1.5) return 'bg-red-100';
      if (zScore < -1) return 'bg-red-50';
    }
    return 'bg-white';
  };

  const stats = calculateStatistics();

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 text-xs">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">V</th>
            <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task Time</th>
            <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Case Time</th>
            <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Errors</th>
            <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hesitation</th>
            <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SUS</th>
            <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Confidence</th>
            <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NASA-TLX</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {participants.map(participant => {
            const metrics = calculateParticipantMetrics(participant);
            const avgCaseDuration = Object.values(metrics.caseDurations).flat().reduce((a, b) => a + b, 0) / 
              Object.values(metrics.caseDurations).flat().length || 0;
            const totalErrors = Object.values(metrics.errorRates).reduce((a, b) => a + b, 0);
            const avgNasaTlx = Object.values(metrics.nasaTlx).reduce((a, b) => a + b, 0) / 6;
            const totalTaskTime = Object.values(metrics.taskCompletion).reduce((a, b) => a + b, 0);

            return (
              <tr key={participant.id} className="hover:bg-gray-50">
                <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">{participant.id}</td>
                <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">{participant.version}</td>
                <td className={`px-2 py-2 whitespace-nowrap text-xs text-gray-900 ${getHeatmapColor(totalTaskTime, stats.taskTime)}`}>
                  {formatTime(totalTaskTime)}
                </td>
                <td className={`px-2 py-2 whitespace-nowrap text-xs text-gray-900 ${getHeatmapColor(avgCaseDuration, stats.caseDuration)}`}>
                  {formatTime(avgCaseDuration)}
                </td>
                <td className={`px-2 py-2 whitespace-nowrap text-xs text-gray-900 ${getHeatmapColor(totalErrors, stats.errors)}`}>
                  {totalErrors}
                </td>
                <td className={`px-2 py-2 whitespace-nowrap text-xs text-gray-900 ${getHeatmapColor(metrics.hesitationTime, stats.hesitation)}`}>
                  {formatTime(metrics.hesitationTime)}
                </td>
                <td className={`px-2 py-2 whitespace-nowrap text-xs text-gray-900 ${getHeatmapColor(metrics.susScore, stats.sus, true)}`}>
                  {formatScore(metrics.susScore)}
                </td>
                <td className={`px-2 py-2 whitespace-nowrap text-xs text-gray-900 ${getHeatmapColor(metrics.confidenceRating, stats.confidence, true)}`}>
                  {formatScore(metrics.confidenceRating)}
                </td>
                <td className={`px-2 py-2 whitespace-nowrap text-xs text-gray-900 ${getHeatmapColor(avgNasaTlx, stats.nasaTlx)}`}>
                  {formatScore(avgNasaTlx)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="mt-4 text-xs text-gray-500">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-100 mr-2"></div>
            <span>Significantly worse (z-score &gt; 1.5)</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-50 mr-2"></div>
            <span>Worse (z-score &gt; 1)</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-50 mr-2"></div>
            <span>Better (z-score &lt; -1)</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-100 mr-2"></div>
            <span>Significantly better (z-score &lt; -1.5)</span>
          </div>
        </div>
      </div>
    </div>
  );
}; 