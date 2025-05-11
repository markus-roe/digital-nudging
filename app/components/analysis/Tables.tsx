'use client';

interface TableData {
  name: string;
  versionA: number;
  versionB: number;
  improvement?: string;
  reduction?: string;
  higherIsBetter?: boolean;
}

interface TableProps {
  title: string;
  data: TableData[];
  unit?: string;
  showChange?: boolean;
  inline?: boolean;
  higherIsBetter?: boolean;
}

export const AnalysisTable = ({ title, data, unit, showChange, inline = true, higherIsBetter }: TableProps) => {
  return (
    <div className={`bg-white rounded-lg ${inline ? '' : 'shadow-sm p-6 border border-gray-100'}`}>
      <h3 className="text-sm font-medium text-gray-700 mb-4">{title}</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metric</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Version A</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Version B</th>
              {showChange && (
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item, index) => (
              <tr key={index}>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{item.name}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                  {item.versionA.toFixed(2)}{unit ? ` ${unit}` : ''}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                  {item.versionB.toFixed(2)}{unit ? ` ${unit}` : ''}
                </td>
                {showChange && (item.improvement || item.reduction) && (
                  <td
                    className={`px-4 py-3 whitespace-nowrap text-sm text-right ${
                      (item.higherIsBetter ?? higherIsBetter ?? false)
                        ? (parseFloat(item.improvement ?? item.reduction ?? '0') >= 0 ? 'text-green-600' : 'text-red-600')
                        : (parseFloat(item.improvement ?? item.reduction ?? '0') < 0 ? 'text-green-600' : 'text-red-600')
                    }`}
                  >
                    {parseFloat(item.improvement ?? item.reduction ?? '0') > 0 ? '+' : ''}
                    {item.improvement ?? item.reduction}%
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const TaskPerformanceTable = ({ data }: { data: TableData[] }) => (
  <AnalysisTable
    title="Task Performance Metrics"
    data={data}
    unit="s"
    showChange
  />
);

const ErrorAnalysisTable = ({ data }: { data: TableData[] }) => (
  <AnalysisTable
    title="Error Analysis"
    data={data}
    showChange
  />
);

const NasaTLXTable = ({ data }: { data: TableData[] }) => (
  <AnalysisTable
    title="NASA-TLX Scores (1-10 scale)"
    data={data}
    showChange
  />
);

const UsabilityTable = ({ susScores, confidenceRatings }: { 
  susScores: { versionA: number; versionB: number };
  confidenceRatings: { versionA: number; versionB: number };
}) => {
  const data = [
    {
      name: 'System Usability Scale (SUS)',
      versionA: susScores.versionA,
      versionB: susScores.versionB,
      improvement: ((susScores.versionB - susScores.versionA) / susScores.versionA * 100).toFixed(1)
    },
    {
      name: 'Decision Confidence',
      versionA: confidenceRatings.versionA,
      versionB: confidenceRatings.versionB,
      improvement: ((confidenceRatings.versionB - confidenceRatings.versionA) / confidenceRatings.versionA * 100).toFixed(1)
    }
  ];

  return <AnalysisTable title="Usability and Confidence Metrics" data={data} />;
};

const HesitationTimeTable = ({ data }: { data: TableData[] }) => (
  <AnalysisTable
    title="Hesitation Time Analysis"
    data={data}
    unit="s"
    showChange
  />
);

const CaseDurationTable = ({ data }: { data: { task: string; versionA: number[]; versionB: number[] }[] }) => {
  const tableData = data.map(item => ({
    name: item.task.replace('_', ' '),
    versionA: item.versionA[0] / 1000, // Convert to seconds
    versionB: item.versionB[0] / 1000,
    improvement: item.versionA[0] === 0 ? '100.0' : ((item.versionA[0] - item.versionB[0]) / item.versionA[0] * 100).toFixed(1)
  }));

  return <AnalysisTable title="Case Duration Analysis" data={tableData} unit="s" showChange />;
};

const Tables = {
  TaskPerformanceTable,
  ErrorAnalysisTable,
  NasaTLXTable,
  UsabilityTable,
  HesitationTimeTable,
  CaseDurationTable
} as const;

export type { TableData, TableProps };
export {
  TaskPerformanceTable,
  ErrorAnalysisTable,
  NasaTLXTable,
  UsabilityTable,
  HesitationTimeTable,
  CaseDurationTable
};
export default Tables; 