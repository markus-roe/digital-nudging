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

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

interface DemographicsChartsProps {
  demographics: {
    age: Record<string, number>;
    gender: Record<string, number>;
    experience: Record<string, number>;
    education: Record<string, number>;
  };
}

function DemographicsCharts({ demographics }: DemographicsChartsProps) {
  const formatData = (data: Record<string, number>) => {
    return {
      labels: Object.keys(data),
      datasets: [{
        data: Object.values(data),
        backgroundColor: COLORS,
        borderRadius: 4,
      }]
    };
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white rounded-xl shadow-sm p-4">
        <h3 className="text-sm font-medium text-gray-500 mb-2">Age Distribution</h3>
        <div className="h-[120px]">
          <Bar options={barOptions} data={formatData(demographics.age)} />
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm p-4">
        <h3 className="text-sm font-medium text-gray-500 mb-2">Gender Distribution</h3>
        <div className="h-[120px]">
          <Pie options={pieOptions} data={formatData(demographics.gender)} />
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm p-4">
        <h3 className="text-sm font-medium text-gray-500 mb-2">Experience</h3>
        <div className="h-[120px]">
          <Bar options={barOptions} data={formatData(demographics.experience)} />
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm p-4">
        <h3 className="text-sm font-medium text-gray-500 mb-2">Education</h3>
        <div className="h-[120px]">
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
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <h3 className="text-lg font-medium mb-3">Version Distribution</h3>
      <div className="h-[200px]">
        <Pie
          data={{
            labels: versionDistributionData.map(item => item.name),
            datasets: [{
              data: versionDistributionData.map(item => item.value),
              backgroundColor: COLORS,
            }],
          }}
          options={pieChartOptions}
        />
      </div>
    </div>
  );
};

const TaskCompletion = ({ taskCompletionData }: { taskCompletionData: any[] }) => {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.raw.toFixed(1);
            return `${context.dataset.label}: ${value}${context.dataset.unit || ''}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: false,
        },
        ticks: {
          stepSize: 1,
        }
      },
      x: {
        grid: {
          display: false,
        }
      }
    }
  };

  const barChartOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: false,
        },
        ticks: {
          stepSize: 1,
        }
      },
      x: {
        grid: {
          display: false,
        }
      }
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <h3 className="text-lg font-medium mb-4">Task Completion Time</h3>
      <div className="text-sm text-gray-600 mb-2">Lower is better (milliseconds)</div>
      <div className="h-[200px]">
        <Bar
          data={{
            labels: taskCompletionData.map(d => d.name),
            datasets: [
              {
                label: 'Version A',
                data: taskCompletionData.map(d => d.versionA),
                backgroundColor: COLORS[0],
                borderRadius: 4,
              },
              {
                label: 'Version B',
                data: taskCompletionData.map(d => d.versionB),
                backgroundColor: COLORS[1],
                borderRadius: 4,
              }
            ]
          }}
          options={{
            ...barChartOptions,
            plugins: {
              ...barChartOptions.plugins,
              tooltip: {
                callbacks: {
                  label: (context: any) => {
                    const value = (context.raw / 1000).toFixed(1);
                    return `${context.dataset.label}: ${value} seconds`;
                  }
                }
              }
            }
          }}
        />
      </div>
      <div className="mt-2 text-sm text-gray-600">
        {taskCompletionData.map((d, i) => (
          <div key={i} className="flex justify-between items-center">
            <span>{d.name}</span>
            <span className="text-green-600">Time reduced by {d.improvement}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const ErrorRates = ({ errorRatesData }: { errorRatesData: any[] }) => {
  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: false,
        },
        ticks: {
          stepSize: 1,
        }
      },
      x: {
        grid: {
          display: false,
        }
      }
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <h3 className="text-lg font-medium mb-4">Error Rates</h3>
      <div className="text-sm text-gray-600 mb-2">Lower is better (errors per task)</div>
      <div className="h-[200px]">
        <Bar
          data={{
            labels: errorRatesData.map(d => d.name),
            datasets: [
              {
                label: 'Version A',
                data: errorRatesData.map(d => d.versionA),
                backgroundColor: COLORS[0],
                borderRadius: 4,
              },
              {
                label: 'Version B',
                data: errorRatesData.map(d => d.versionB),
                backgroundColor: COLORS[1],
                borderRadius: 4,
              }
            ]
          }}
          options={barChartOptions}
        />
      </div>
      <div className="mt-2 text-sm text-gray-600">
        {errorRatesData.map((d, i) => (
          <div key={i} className="flex justify-between items-center">
            <span>{d.name}</span>
            <span className="text-green-600">Errors reduced by {d.reduction}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const NasaTLX = ({ nasaTlxData }: { nasaTlxData: any[] }) => {
  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: false,
        },
        ticks: {
          stepSize: 1,
        }
      },
      x: {
        grid: {
          display: false,
        }
      }
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <h3 className="text-lg font-medium mb-4">NASA-TLX Scores</h3>
      <div className="text-sm text-gray-600 mb-2">Lower is better (1-10 scale), except Performance where higher is better</div>
      <div className="h-[200px]">
        <Bar
          data={{
            labels: nasaTlxData.map(d => d.name),
            datasets: [
              {
                label: 'Version A',
                data: nasaTlxData.map(d => d.versionA),
                backgroundColor: COLORS[0],
                borderRadius: 4,
              },
              {
                label: 'Version B',
                data: nasaTlxData.map(d => d.versionB),
                backgroundColor: COLORS[1],
                borderRadius: 4,
              }
            ]
          }}
          options={barChartOptions}
        />
      </div>
      <div className="mt-2 text-sm text-gray-600">
        {nasaTlxData.map((d, i) => {
          const isPerformance = d.name === 'Performance';
          const improvement = isPerformance
            ? ((d.versionB - d.versionA) / d.versionA * 100).toFixed(1)
            : ((d.versionA - d.versionB) / d.versionA * 100).toFixed(1);
          const sign = isPerformance ? '+' : '-';
          const label = isPerformance ? 'improved by' : 'reduced by';
          
          return (
            <div key={i} className="flex justify-between items-center">
              <span>{d.name}</span>
              <span className="text-green-600">Workload {label} {Math.abs(parseFloat(improvement))}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const SUS = ({ susScores }: { susScores: { versionA: number; versionB: number } }) => {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: false,
        },
        ticks: {
          stepSize: 1,
        }
      },
      x: {
        grid: {
          display: false,
        }
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <h3 className="text-lg font-medium mb-3">System Usability Scale (SUS)</h3>
      <div className="text-sm text-gray-600 mb-2">Higher is better (0-100 scale)</div>
      <div className="h-[200px]">
        <Bar
          options={chartOptions}
          data={{
            labels: ['Version A', 'Version B'],
            datasets: [{
              label: 'SUS Score',
              data: [susScores.versionA, susScores.versionB],
              backgroundColor: [COLORS[0], COLORS[1]],
              borderRadius: 4,
            }],
          }}
        />
      </div>
      <div className="mt-2 text-sm text-gray-600">
        Usability improved by {((susScores.versionB - susScores.versionA) / susScores.versionA * 100).toFixed(1)}%
      </div>
    </div>
  );
};

const Confidence = ({ confidenceRatings }: { confidenceRatings: { versionA: number; versionB: number } }) => {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: false,
        },
        ticks: {
          stepSize: 1,
        }
      },
      x: {
        grid: {
          display: false,
        }
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <h3 className="text-lg font-medium mb-3">Confidence Ratings</h3>
      <div className="text-sm text-gray-600 mb-2">Higher is better (1-5 scale)</div>
      <div className="h-[200px]">
        <Bar
          options={chartOptions}
          data={{
            labels: ['Version A', 'Version B'],
            datasets: [{
              label: 'Confidence Score',
              data: [confidenceRatings.versionA, confidenceRatings.versionB],
              backgroundColor: [COLORS[0], COLORS[1]],
              borderRadius: 4,
            }],
          }}
        />
      </div>
      <div className="mt-2 text-sm text-gray-600">
        Confidence improved by {((confidenceRatings.versionB - confidenceRatings.versionA) / confidenceRatings.versionA * 100).toFixed(1)}%
      </div>
    </div>
  );
};

const HesitationTime = ({ hesitationTimeData }: { hesitationTimeData: ChartData[] }) => {
  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = (context.raw / 1000).toFixed(2);
            return `${context.dataset.label}: ${value} seconds`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: false,
        },
        ticks: {
          callback: (value: any) => `${(value / 1000).toFixed(1)}s`
        }
      },
      x: {
        grid: {
          display: false,
        }
      }
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <h3 className="text-lg font-medium mb-4">Decision Hesitation Time</h3>
      <div className="text-sm text-gray-600 mb-2">Time between selecting and assigning an order (lower is better)</div>
      <div className="h-[200px]">
        <Bar
          data={{
            labels: hesitationTimeData.map(d => d.name),
            datasets: [
              {
                label: 'Version A',
                data: hesitationTimeData.map(d => d.versionA),
                backgroundColor: COLORS[0],
                borderRadius: 4,
              },
              {
                label: 'Version B',
                data: hesitationTimeData.map(d => d.versionB),
                backgroundColor: COLORS[1],
                borderRadius: 4,
              }
            ]
          }}
          options={barChartOptions}
        />
      </div>
      <div className="mt-2 text-sm text-gray-600">
        {hesitationTimeData.map((d, i) => (
          <div key={i} className="flex justify-between items-center">
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
};

export default Charts; 