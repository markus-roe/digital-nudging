import { Participant, Version, TaskType, ActionLog, Questionnaire } from '@prisma/client';

interface ParticipantWithRelations {
  id: string;
  version: Version;
  createdAt: Date;
  age?: string | null;
  gender?: string | null;
  experience?: string | null;
  education?: string | null;
  actionLogs: ActionLog[];
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
  const participantCount = participants.length;

  return (
    <section className="bg-white rounded-xl shadow-sm p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Participant Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm font-medium text-gray-500">Total Participants</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{participantCount}</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm font-medium text-gray-500">Registered Only</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{completionStatus.registeredOnly}</div>
          <div className="text-sm text-gray-500 mt-1">
            {((completionStatus.registeredOnly / participantCount) * 100).toFixed(1)}% of total
          </div>
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
      
      {/* All Participants Table */}
      <div className="mt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">All Participants</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-xs">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">V</th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exp.</th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Edu.</th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Flow</th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Feedback</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {participants.map(participant => {
                // Define the expected flow steps
                const flowSteps = [
                  { name: 'Reg', check: () => true }, // Always true since they are in the table
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

                return (
                  <tr key={participant.id} className="hover:bg-gray-50">
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
                    <td className="px-2 py-2 text-xs text-gray-900 max-w-xs">
                      {participant.questionnaire?.feedback || '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}; 