'use client';

interface TableData {
  name: string;
  versionA: number;
  versionB: number;
  improvement?: string;
  reduction?: string;
}

interface TableProps {
  title: string;
  data: TableData[];
  unit?: string;
  showImprovement?: boolean;
  showReduction?: boolean;
}

const AnalysisTable = ({ title, data, unit, showImprovement, showReduction }: TableProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
      <h3 className="text-sm font-medium text-gray-700 mb-4">{title}</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metric</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Version A</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Version B</th>
              {showImprovement && (
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Improvement</th>
              )}
              {showReduction && (
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Reduction</th>
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
                {showImprovement && item.improvement && (
                  <td className={`px-4 py-3 whitespace-nowrap text-sm text-right ${parseFloat(item.improvement) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {parseFloat(item.improvement) > 0 ? '+' : ''}{item.improvement}%
                  </td>
                )}
                {showReduction && item.reduction && (
                  <td className={`px-4 py-3 whitespace-nowrap text-sm text-right ${parseFloat(item.reduction) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {item.reduction}%
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
    showImprovement
  />
);

const ErrorAnalysisTable = ({ data }: { data: TableData[] }) => (
  <AnalysisTable
    title="Error Analysis"
    data={data}
    showReduction
  />
);

const NasaTLXTable = ({ data }: { data: TableData[] }) => (
  <AnalysisTable
    title="NASA-TLX Scores (1-10 scale)"
    data={data}
    showImprovement
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

  return <AnalysisTable title="Usability and Confidence Metrics" data={data} showImprovement />;
};

const HesitationTimeTable = ({ data }: { data: TableData[] }) => (
  <AnalysisTable
    title="Hesitation Time Analysis"
    data={data}
    unit="s"
    showImprovement
  />
);

const Tables = {
  TaskPerformanceTable,
  ErrorAnalysisTable,
  NasaTLXTable,
  UsabilityTable,
  HesitationTimeTable
} as const;

export type { TableData, TableProps };
export {
  TaskPerformanceTable,
  ErrorAnalysisTable,
  NasaTLXTable,
  UsabilityTable,
  HesitationTimeTable
};
export default Tables; 