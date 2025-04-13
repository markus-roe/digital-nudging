'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const COLORS = ['#1f77b4', '#2ca02c', '#ff7f0e', '#d62728', '#9467bd'];

interface DemographicsChartsProps {
  demographics: {
    age: Record<string, number>;
    gender: Record<string, number>;
    experience: Record<string, number>;
    education: Record<string, number>;
  };
}

// Common chart options for scientific appearance
const commonChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        font: {
          family: 'Inter, system-ui, sans-serif',
          size: 12,
        },
        padding: 20,
      },
    },
    tooltip: {
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      titleColor: '#1f2937',
      bodyColor: '#1f2937',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      padding: 12,
      boxPadding: 6,
      usePointStyle: true,
      callbacks: {
        label: (context: any) => {
          const value = context.raw.toFixed(2);
          return `${context.dataset.label}: ${value}`;
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: '#e5e7eb',
        drawBorder: false,
      },
      ticks: {
        font: {
          family: 'Inter, system-ui, sans-serif',
          size: 11,
        },
        padding: 8,
      },
    },
    x: {
      grid: {
        display: false,
      },
      ticks: {
        font: {
          family: 'Inter, system-ui, sans-serif',
          size: 11,
        },
        padding: 8,
      },
    }
  }
};

function DemographicsCharts({ demographics }: DemographicsChartsProps) {
  const formatData = (data: Record<string, number>) => {
    return {
      labels: Object.keys(data),
      datasets: [{
        data: Object.values(data),
        backgroundColor: COLORS,
        borderRadius: 2,
        borderWidth: 1,
        borderColor: '#ffffff',
      }]
    };
  };

  const barOptions = {
    ...commonChartOptions,
    plugins: {
      ...commonChartOptions.plugins,
      legend: {
        display: false,
      },
      tooltip: {
        ...commonChartOptions.plugins.tooltip,
        callbacks: {
          label: (context: any) => {
            const value = context.raw;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${value} participants (${percentage}%)`;
          }
        }
      }
    },
  };

  const pieOptions = {
    ...commonChartOptions,
    plugins: {
      ...commonChartOptions.plugins,
      legend: {
        position: 'bottom' as const,
      },
      tooltip: {
        ...commonChartOptions.plugins.tooltip,
        callbacks: {
          label: (context: any) => {
            const value = context.raw;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${value} participants (${percentage}%)`;
          }
        }
      },
      scales: {},
    },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Age Distribution</h3>
        <div className="h-[160px]">
          <Bar options={barOptions} data={formatData(demographics.age)} />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Gender Distribution</h3>
        <div className="h-[240px]">
          <Pie options={pieOptions} data={formatData(demographics.gender)} />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Experience</h3>
        <div className="h-[160px]">
          <Bar options={barOptions} data={formatData(demographics.experience)} />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Education</h3>
        <div className="h-[160px]">
          <Bar options={barOptions} data={formatData(demographics.education)} />
        </div>
      </div>
    </div>
  );
}

interface ChartData {
  name: string;
  versionA: number;
  versionB: number;
  improvement?: string;
  reduction?: string;
}

interface ChartsProps {
  demographics: {
    age: Record<string, number>;
    gender: Record<string, number>;
    experience: Record<string, number>;
    education: Record<string, number>;
  };
  taskCompletionData: any[];
  errorRatesData: any[];
  nasaTlxData: any[];
  versionDistributionData: any[];
  susScores: { versionA: number; versionB: number };
  confidenceRatings: { versionA: number; versionB: number };
  hesitationTimeData: ChartData[];
}

const VersionDistribution = ({ versionDistributionData }: { versionDistributionData: any[] }) => {
  const pieChartOptions = {
    ...commonChartOptions,
    plugins: {
      ...commonChartOptions.plugins,
      legend: {
        position: 'bottom' as const,
      },
      tooltip: {
        ...commonChartOptions.plugins.tooltip,
        callbacks: {
          label: (context: any) => {
            const value = context.raw;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${value} participants (${percentage}%)`;
          }
        }
      }
    },
    scales: {},
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
      <h3 className="text-sm font-medium text-gray-700 mb-4">Version Distribution</h3>
      <div className="h-[240px]">
        <Pie
          data={{
            labels: versionDistributionData.map(item => item.name),
            datasets: [{
              data: versionDistributionData.map(item => item.value),
              backgroundColor: COLORS,
              borderWidth: 1,
              borderColor: '#ffffff',
            }],
          }}
          options={pieChartOptions}
        />
      </div>
    </div>
  );
};

const TaskCompletion = ({ taskCompletionData }: { taskCompletionData: any[] }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
      <h3 className="text-sm font-medium text-gray-700 mb-4">Task Completion Time</h3>
      <div className="text-xs text-gray-500 mb-4">Time in seconds (lower is better)</div>
      <div className="h-[240px]">
        <Bar
          data={{
            labels: taskCompletionData.map(d => d.name),
            datasets: [
              {
                label: 'Version A',
                data: taskCompletionData.map(d => d.versionA / 1000),
                backgroundColor: COLORS[0],
                borderRadius: 2,
              },
              {
                label: 'Version B',
                data: taskCompletionData.map(d => d.versionB / 1000),
                backgroundColor: COLORS[1],
                borderRadius: 2,
              }
            ]
          }}
          options={{
            ...commonChartOptions,
            scales: {
              ...commonChartOptions.scales,
              y: {
                ...commonChartOptions.scales.y,
                title: {
                  display: true,
                  text: 'Time (seconds)',
                  font: {
                    family: 'Inter, system-ui, sans-serif',
                    size: 11,
                    weight: 500,
                  },
                },
              },
            },
          }}
        />
      </div>
      <div className="mt-4 text-xs text-gray-600">
        {taskCompletionData.map((d, i) => (
          <div key={i} className="flex justify-between items-center py-1">
            <span>{d.name}</span>
            <span className="text-green-600">Time reduced by {d.improvement}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const ErrorRates = ({ errorRatesData }: { errorRatesData: any[] }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
      <h3 className="text-sm font-medium text-gray-700 mb-4">Error Rates</h3>
      <div className="text-xs text-gray-500 mb-4">Errors per task (lower is better)</div>
      <div className="h-[240px]">
        <Bar
          data={{
            labels: errorRatesData.map(d => d.name),
            datasets: [
              {
                label: 'Version A',
                data: errorRatesData.map(d => d.versionA),
                backgroundColor: COLORS[0],
                borderRadius: 2,
              },
              {
                label: 'Version B',
                data: errorRatesData.map(d => d.versionB),
                backgroundColor: COLORS[1],
                borderRadius: 2,
              }
            ]
          }}
          options={{
            ...commonChartOptions,
            scales: {
              ...commonChartOptions.scales,
              y: {
                ...commonChartOptions.scales.y,
                title: {
                  display: true,
                  text: 'Number of Errors',
                  font: {
                    family: 'Inter, system-ui, sans-serif',
                    size: 11,
                    weight: 500,
                  },
                },
              },
            },
          }}
        />
      </div>
      <div className="mt-4 text-xs text-gray-600">
        {errorRatesData.map((d, i) => (
          <div key={i} className="flex justify-between items-center py-1">
            <span>{d.name}</span>
            <span className="text-green-600">Errors reduced by {d.reduction}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const NasaTLX = ({ nasaTlxData }: { nasaTlxData: any[] }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
      <h3 className="text-sm font-medium text-gray-700 mb-4">NASA-TLX Scores</h3>
      <div className="text-xs text-gray-500 mb-4">1-10 scale (lower is better, except Performance)</div>
      <div className="h-[240px]">
        <Bar
          data={{
            labels: nasaTlxData.map(d => d.name),
            datasets: [
              {
                label: 'Version A',
                data: nasaTlxData.map(d => d.versionA),
                backgroundColor: COLORS[0],
                borderRadius: 2,
              },
              {
                label: 'Version B',
                data: nasaTlxData.map(d => d.versionB),
                backgroundColor: COLORS[1],
                borderRadius: 2,
              }
            ]
          }}
          options={{
            ...commonChartOptions,
            scales: {
              ...commonChartOptions.scales,
              y: {
                ...commonChartOptions.scales.y,
                min: 0,
                max: 10,
                title: {
                  display: true,
                  text: 'Score',
                  font: {
                    family: 'Inter, system-ui, sans-serif',
                    size: 11,
                    weight: 500,
                  },
                },
              },
            },
          }}
        />
      </div>
      <div className="mt-4 text-xs text-gray-600">
        {nasaTlxData.map((d, i) => {
          const isPerformance = d.name === 'Performance';
          const improvement = isPerformance
            ? ((d.versionB - d.versionA) / d.versionA * 100).toFixed(1)
            : ((d.versionA - d.versionB) / d.versionA * 100).toFixed(1);
          const sign = isPerformance ? '+' : '-';
          const label = 'improved by';
          
          return (
            <div key={i} className="flex justify-between items-center py-1">
              <span>{d.name}</span>
              <span className="text-green-600">Score {label} {Math.abs(parseFloat(improvement))}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const SUS = ({ susScores }: { susScores: { versionA: number; versionB: number } }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
      <h3 className="text-sm font-medium text-gray-700 mb-4">System Usability Scale (SUS)</h3>
      <div className="text-xs text-gray-500 mb-4">0-100 scale (higher is better)</div>
      <div className="h-[240px]">
        <Bar
          options={{
            ...commonChartOptions,
            plugins: {
              ...commonChartOptions.plugins,
              legend: {
                display: false,
              },
              tooltip: {
                ...commonChartOptions.plugins.tooltip,
                callbacks: {
                  label: (context: any) => {
                    return `SUS Score: ${context.raw.toFixed(1)}`;
                  }
                }
              }
            },
            scales: {
              ...commonChartOptions.scales,
              y: {
                ...commonChartOptions.scales.y,
                min: 0,
                max: 100,
                title: {
                  display: true,
                  text: 'SUS Score',
                  font: {
                    family: 'Inter, system-ui, sans-serif',
                    size: 11,
                    weight: 500,
                  },
                },
              },
            },
          }}
          data={{
            labels: ['Version A', 'Version B'],
            datasets: [{
              data: [susScores.versionA, susScores.versionB],
              backgroundColor: [COLORS[0], COLORS[1]],
              borderRadius: 2,
            }],
          }}
        />
      </div>
      <div className="mt-4 text-xs text-gray-600">
        Usability improved by {((susScores.versionB - susScores.versionA) / susScores.versionA * 100).toFixed(1)}%
      </div>
    </div>
  );
};

const Confidence = ({ confidenceRatings }: { confidenceRatings: { versionA: number; versionB: number } }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
      <h3 className="text-sm font-medium text-gray-700 mb-4">Confidence Ratings</h3>
      <div className="text-xs text-gray-500 mb-4">1-10 scale (higher is better)</div>
      <div className="h-[240px]">
        <Bar
          options={{
            ...commonChartOptions,
            plugins: {
              ...commonChartOptions.plugins,
              legend: {
                display: false,
              },
              tooltip: {
                ...commonChartOptions.plugins.tooltip,
                callbacks: {
                  label: (context: any) => {
                    return `Confidence Score: ${context.raw.toFixed(1)}`;
                  }
                }
              }
            },
            scales: {
              ...commonChartOptions.scales,
              y: {
                ...commonChartOptions.scales.y,
                min: 0,
                max: 10,
                title: {
                  display: true,
                  text: 'Confidence Score',
                  font: {
                    family: 'Inter, system-ui, sans-serif',
                    size: 11,
                    weight: 500,
                  },
                },
              },
            },
          }}
          data={{
            labels: ['Version A', 'Version B'],
            datasets: [{
              data: [confidenceRatings.versionA, confidenceRatings.versionB],
              backgroundColor: [COLORS[0], COLORS[1]],
              borderRadius: 2,
            }],
          }}
        />
      </div>
      <div className="mt-4 text-xs text-gray-600">
        Confidence improved by {((confidenceRatings.versionB - confidenceRatings.versionA) / confidenceRatings.versionA * 100).toFixed(1)}%
      </div>
    </div>
  );
};

const HesitationTime = ({ hesitationTimeData }: { hesitationTimeData: ChartData[] }) => {
  console.log('Raw Hesitation Time Data:', hesitationTimeData);
  
  // Filter out any invalid data points and ensure we have valid numbers
  const validData = hesitationTimeData.filter(d => 
    typeof d.versionA === 'number' && 
    typeof d.versionB === 'number' && 
    !isNaN(d.versionA) && 
    !isNaN(d.versionB) &&
    d.versionA > 0 &&  // Only include positive values
    d.versionB > 0
  );

  console.log('Valid Hesitation Time Data:', validData);

  if (validData.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Order Transition Time</h3>
        <div className="text-xs text-gray-500 mb-4">Time between completing one order and starting the next (lower is better)</div>
        <div className="h-[240px] flex items-center justify-center text-gray-500">
          No transition time data available
        </div>
      </div>
    );
  }

  // Convert milliseconds to seconds and ensure we have valid numbers
  const chartData = {
    labels: validData.map(d => d.name),
    datasets: [
      {
        label: 'Version A',
        data: validData.map(d => Number((d.versionA / 1000).toFixed(2))),
        backgroundColor: COLORS[0],
        borderRadius: 2,
      },
      {
        label: 'Version B',
        data: validData.map(d => Number((d.versionB / 1000).toFixed(2))),
        backgroundColor: COLORS[1],
        borderRadius: 2,
      }
    ]
  };

  console.log('Chart Data:', chartData);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
      <h3 className="text-sm font-medium text-gray-700 mb-4">Order Transition Time</h3>
      <div className="text-xs text-gray-500 mb-4">Time between completing one order and starting the next (lower is better)</div>
      <div className="h-[240px]">
        <Bar
          data={chartData}
          options={{
            ...commonChartOptions,
            scales: {
              ...commonChartOptions.scales,
              y: {
                ...commonChartOptions.scales.y,
                title: {
                  display: true,
                  text: 'Time (seconds)',
                  font: {
                    family: 'Inter, system-ui, sans-serif',
                    size: 11,
                    weight: 500,
                  },
                },
                ticks: {
                  callback: function(value: number | string) {
                    return `${Number(value).toFixed(1)}s`;
                  }
                }
              },
            },
          }}
        />
      </div>
      <div className="mt-4 text-xs text-gray-600">
        {validData.map((d, i) => (
          <div key={i} className="flex justify-between items-center py-1">
            <span>{d.name}</span>
            <span className="text-green-600">
              {parseFloat(d.improvement || '0') > 0 
                ? `Faster by ${d.improvement}%` 
                : `Slower by ${Math.abs(parseFloat(d.improvement || '0'))}%`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const CaseDurations = ({ caseDurationsData }: { caseDurationsData: { task: string; versionA: number[]; versionB: number[] }[] }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
      <h3 className="text-sm font-medium text-gray-700 mb-4">Case Duration</h3>
      <div className="text-xs text-gray-500 mb-4">Average time per case in seconds (lower is better)</div>
      <div className="h-[240px]">
        <Bar
          data={{
            labels: caseDurationsData.map(d => d.task.replace('_', ' ')),
            datasets: [
              {
                label: 'Version A',
                data: caseDurationsData.map(d => d.versionA[0] / 1000), // Convert ms to seconds
                backgroundColor: COLORS[0],
                borderRadius: 2,
              },
              {
                label: 'Version B',
                data: caseDurationsData.map(d => d.versionB[0] / 1000), // Convert ms to seconds
                backgroundColor: COLORS[1],
                borderRadius: 2,
              }
            ]
          }}
          options={{
            ...commonChartOptions,
            scales: {
              ...commonChartOptions.scales,
              y: {
                ...commonChartOptions.scales.y,
                title: {
                  display: true,
                  text: 'Time (seconds)',
                  font: {
                    family: 'Inter, system-ui, sans-serif',
                    size: 11,
                    weight: 500,
                  },
                },
                ticks: {
                  callback: function(value: number | string) {
                    return `${Number(value).toFixed(1)}s`;
                  }
                }
              },
            },
          }}
        />
      </div>
      <div className="mt-4 text-xs text-gray-600">
        {caseDurationsData.map((d, i) => {
          const improvement = ((d.versionA[0] - d.versionB[0]) / d.versionA[0] * 100).toFixed(1);
          return (
            <div key={i} className="flex justify-between items-center py-1">
              <span>{d.task.replace('_', ' ')}</span>
              <span className="text-green-600">Time per case reduced by {improvement}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Main Charts component with all subcomponents
const Charts = {
  DemographicsCharts,
  VersionDistribution,
  TaskCompletion,
  ErrorRates,
  NasaTLX,
  SUS,
  Confidence,
  HesitationTime,
  CaseDurations,
};

export {
  DemographicsCharts,
  VersionDistribution,
  TaskCompletion,
  ErrorRates,
  NasaTLX,
  SUS,
  Confidence,
  HesitationTime,
  CaseDurations,
};

export default Charts; 