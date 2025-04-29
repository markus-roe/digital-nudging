'use client';

import { Participant, Version, TaskType, ActionLog, ErrorLog, Questionnaire } from '@prisma/client';
import { useState } from 'react';

interface ParticipantWithRelations extends Participant {
  actionLogs: ActionLog[];
  errorLogs: ErrorLog[];
  questionnaire: Questionnaire | null;
}

interface ParticipantTableProps {
  participants: ParticipantWithRelations[];
  completionStatus: {
    total: number;
    registeredOnly: number;
    completedTasks: number;
    completedQuestionnaire: number;
    fullyCompleted: number;
  };
}

export const ParticipantTable = ({ participants, completionStatus }: ParticipantTableProps) => {
  const [showMetrics, setShowMetrics] = useState(false);
  const [expandedFeedback, setExpandedFeedback] = useState<Record<string, boolean>>({});
  const [selectedFeedback, setSelectedFeedback] = useState<{ id: string; feedback: string } | null>(null);
  const [versionFilter, setVersionFilter] = useState<Version | 'ALL'>('ALL');

  const participantCount = participants.length;

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
      
      // Find the last ORDER_SELECT before CASE_SUBMIT for the current order
      const currentSubmits = currentGroup.filter(log => log.action === 'CASE_SUBMIT');
      const currentSelects = currentGroup.filter(log => log.action === 'ORDER_SELECT');
      
      if (currentSubmits.length > 0 && currentSelects.length > 0) {
        // Get the last selection before the first submit
        const lastSelect = currentSelects.reduce((latest, current) => {
          if (!latest) return current;
          return current.timestamp > latest.timestamp ? current : latest;
        }, currentSelects[0]);
        
        const firstSubmit = currentSubmits[0];
        
        // Only calculate if the selection was before the submit
        if (lastSelect.timestamp < firstSubmit.timestamp) {
          const hesitationTime = firstSubmit.timestamp.getTime() - lastSelect.timestamp.getTime();
          totalHesitationTime += hesitationTime;
          hesitationCount++;
        }
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

  // Custom error heatmap color: gradient starts at 1 error
  const getErrorHeatmapColor = (value: number, stats: { mean: number; stdDev: number }) => {
    if (value === 0) return 'bg-white';
    if (value === 1) return 'bg-red-50';
    const zScore = (value - stats.mean) / stats.stdDev;
    if (zScore > 1) return 'bg-red-200';
    if (zScore > 0.5) return 'bg-red-100';
    return 'bg-red-50';
  };

  const stats = calculateStatistics();

  const handleToggleAllFeedback = () => {
    const hasAnyExpanded = Object.values(expandedFeedback).some(Boolean);
    if (hasAnyExpanded) {
      setExpandedFeedback({});
    } else {
      const allExpanded = participants.reduce((acc, participant) => {
        if (participant.questionnaire?.feedback) {
          acc[participant.id] = true;
        }
        return acc;
      }, {} as Record<string, boolean>);
      setExpandedFeedback(allExpanded);
    }
  };

  return (
    <section className="bg-white rounded-xl shadow-sm p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Participant Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm font-medium text-gray-500">Total Participants</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{participantCount}</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm font-medium text-gray-500">Tasks Only</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{completionStatus.completedTasks}</div>
          <div className="text-sm text-gray-500 mt-1">
            {((completionStatus.completedTasks / participantCount) * 100).toFixed(1)}% of total
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm font-medium text-gray-500">Fully Completed</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{completionStatus.fullyCompleted}</div>
          <div className="text-sm text-gray-500 mt-1">
            {((completionStatus.fullyCompleted / participantCount) * 100).toFixed(1)}% of total
          </div>
        </div>
      </div>
      
      {/* Combined Participants Table */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Participant Details</h3>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setVersionFilter('ALL')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors cursor-pointer ${
                  versionFilter === 'ALL'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setVersionFilter(Version.A)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors cursor-pointer ${
                  versionFilter === Version.A
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Version A
              </button>
              <button
                onClick={() => setVersionFilter(Version.B)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors cursor-pointer ${
                  versionFilter === Version.B
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Version B
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleToggleAllFeedback}
                className="px-4 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors cursor-pointer"
              >
                {Object.values(expandedFeedback).some(Boolean) ? 'Collapse Feedback' : 'Expand Feedback'}
              </button>
              <button
                onClick={() => setShowMetrics(!showMetrics)}
                className="px-4 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors cursor-pointer"
              >
                {showMetrics ? 'Hide Metrics' : 'Show Metrics'}
              </button>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-xs">
            <thead className="bg-gray-50">
              <tr>
                {/* Participant Details */}
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">V</th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exp.</th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Edu.</th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Flow</th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Feedback</th>
                
                {/* Performance Metrics - Only show when expanded */}
                {showMetrics && (
                  <>
                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task Time</th>
                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Case Time</th>
                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Errors</th>
                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Val. Errors</th>
                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asn. Errors</th>
                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sch. Errors</th>
                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hesitation</th>
                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SUS</th>
                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Confidence</th>
                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NASA-TLX</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {participants
                .filter(participant => versionFilter === 'ALL' || participant.version === versionFilter)
                .map(participant => {
                  const metrics = calculateParticipantMetrics(participant);
                  const avgCaseDuration = Object.values(metrics.caseDurations).flat().reduce((a, b) => a + b, 0) / 
                    Object.values(metrics.caseDurations).flat().length || 0;
                  const totalErrors = Object.values(metrics.errorRates).reduce((a, b) => a + b, 0);
                  const avgNasaTlx = Object.values(metrics.nasaTlx).reduce((a, b) => a + b, 0) / 6;
                  const totalTaskTime = Object.values(metrics.taskCompletion).reduce((a, b) => a + b, 0);

                  // Define the expected flow steps
                  const flowSteps = [
                    { name: 'Reg', check: () => true },
                    { 
                      name: 'Val', 
                      check: () => participant.actionLogs.some(log => 
                        log.action === 'TASK_END' && log.task === TaskType.ORDER_VALIDATION
                      )
                    },
                    { 
                      name: 'Asn', 
                      check: () => participant.actionLogs.some(log => 
                        log.action === 'TASK_END' && log.task === TaskType.ORDER_ASSIGNMENT
                      )
                    },
                    { 
                      name: 'Sch', 
                      check: () => participant.actionLogs.some(log => 
                        log.action === 'TASK_END' && log.task === TaskType.DELIVERY_SCHEDULING
                      )
                    },
                    { 
                      name: 'Qst', 
                      check: () => participant.questionnaire !== null
                    }
                  ];

                  // Check completion status for each step
                  const flowStatus = flowSteps.map(step => ({
                    ...step,
                    completed: step.check()
                  }));

                  const feedback = participant.questionnaire?.feedback;
                  const isExpanded = expandedFeedback[participant.id] || false;

                  return (
                    <tr 
                      key={participant.id} 
                      className={`hover:bg-opacity-80 ${
                        participant.version === Version.A 
                          ? 'bg-blue-50 hover:bg-blue-100' 
                          : 'bg-green-50 hover:bg-green-100'
                      }`}
                    >
                      {/* Participant Details */}
                      <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">{participant.id}</td>
                      <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">{participant.version}</td>
                      <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">
                        {participant.createdAt.toLocaleDateString()}
                      </td>
                      <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">{participant.age || '-'}</td>
                      <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">{participant.gender || '-'}</td>
                      <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">{participant.experience || '-'}</td>
                      <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">{participant.education || '-'}</td>
                      <td className="px-2 py-2 whitespace-nowrap text-xs">
                        <div className="flex items-center space-x-1">
                          {flowStatus.map((step) => (
                            <div key={step.name} className="flex items-center">
                              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                                step.completed 
                                  ? 'bg-green-100 text-green-600 border border-green-400' 
                                  : 'bg-gray-100 text-gray-400 border border-gray-300'
                              }`}>
                                {step.name[0]}
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-2 py-2 text-xs text-gray-900 w-32">
                        {feedback ? (
                          <div className="relative">
                            <button
                              onClick={() => setExpandedFeedback(prev => ({
                                ...prev,
                                [participant.id]: !prev[participant.id]
                              }))}
                              className="text-blue-600 hover:text-blue-700 cursor-pointer"
                            >
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                              </svg>
                            </button>
                            {isExpanded && (
                              <div className="max-w-xs mt-2">
                                {feedback}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>

                      {/* Performance Metrics - Only show when expanded */}
                      {showMetrics && (
                        <>
                          <td className={`px-2 py-2 whitespace-nowrap text-xs text-gray-900 ${getHeatmapColor(totalTaskTime, stats.taskTime)}`}>
                            {formatTime(totalTaskTime)}
                          </td>
                          <td className={`px-2 py-2 whitespace-nowrap text-xs text-gray-900 ${getHeatmapColor(avgCaseDuration, stats.caseDuration)}`}>
                            {formatTime(avgCaseDuration)}
                          </td>
                          <td className={`px-2 py-2 whitespace-nowrap text-xs text-gray-900 ${getErrorHeatmapColor(totalErrors, stats.errors)}`}>
                            {totalErrors}
                          </td>
                          <td className={`px-2 py-2 whitespace-nowrap text-xs text-gray-900 ${getErrorHeatmapColor(metrics.errorRates[TaskType.ORDER_VALIDATION], stats.errors)}`}>
                            {metrics.errorRates[TaskType.ORDER_VALIDATION]}
                          </td>
                          <td className={`px-2 py-2 whitespace-nowrap text-xs text-gray-900 ${getErrorHeatmapColor(metrics.errorRates[TaskType.ORDER_ASSIGNMENT], stats.errors)}`}>
                            {metrics.errorRates[TaskType.ORDER_ASSIGNMENT]}
                          </td>
                          <td className={`px-2 py-2 whitespace-nowrap text-xs text-gray-900 ${getErrorHeatmapColor(metrics.errorRates[TaskType.DELIVERY_SCHEDULING], stats.errors)}`}>
                            {metrics.errorRates[TaskType.DELIVERY_SCHEDULING]}
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
                        </>
                      )}
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        {showMetrics && (
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
        )}
      </div>

      {/* Feedback Modal */}
      {selectedFeedback && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium text-gray-900">Feedback from Participant {selectedFeedback.id}</h3>
              <button
                onClick={() => setSelectedFeedback(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="text-sm text-gray-700 whitespace-pre-wrap">
              {selectedFeedback.feedback}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}; 