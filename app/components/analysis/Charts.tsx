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
  PointElement,
} from 'chart.js';
import { Bar, Pie, Scatter } from 'react-chartjs-2';
import { AnalysisTable } from '../analysis/Tables';
import { TaskType } from '@/lib/types/logging';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement
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

// --- Data label plugin for all bar charts ---
const dataLabelPlugin = {
  id: 'dataLabelPlugin',
  afterDatasetsDraw(chart: any) {
    const { ctx, data } = chart;
    ctx.save();
    chart.data.datasets.forEach((dataset: any, datasetIndex: number) => {
      const meta = chart.getDatasetMeta(datasetIndex);
      meta.data.forEach((bar: any, index: number) => {
        const value = dataset.data[index];
        if (typeof value !== 'number' || isNaN(value)) return;
        ctx.font = 'bold 11px Inter, system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        // If backgroundColor is an array, pick the correct color for this bar
        if (Array.isArray(dataset.backgroundColor)) {
          ctx.fillStyle = dataset.backgroundColor[index % dataset.backgroundColor.length];
        } else {
          ctx.fillStyle = dataset.backgroundColor;
        }
        // Value formatting by chart type
        let label = '';
        if (chart.options.scales?.y?.title?.text?.includes('seconds')) {
          label = `${value.toFixed(1)}s`;
        } else if (chart.options.scales?.y?.title?.text?.includes('Score')) {
          label = `${value.toFixed(1)}`;
        } else if (chart.options.scales?.y?.title?.text?.includes('Number of Errors')) {
          label = `${value}`;
        } else {
          label = `${value}`;
        }
        ctx.fillText(label, bar.x, bar.y - 4);
      });
    });
    ctx.restore();
  }
};

function DemographicsTable({ label, data }: { label: string; data: { value: string; count: number }[] }) {
  return (
    <div className="overflow-x-auto mt-2">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Participants</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, i) => (
            <tr key={i}>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{row.value}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">{row.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function getDemographicTableData(data: Record<string, number>) {
  return Object.entries(data).map(([value, count]) => ({
    value,
    count: Number(count),
  }));
}

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 flex flex-col">
          <h4 className="text-xs font-medium text-gray-700 mb-4">Age Distribution</h4>
          <div className="h-[160px] mb-4">
            <Bar options={barOptions} data={formatData(demographics.age)} />
          </div>
          <DemographicsTable label="Age" data={getDemographicTableData(demographics.age)} />
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 flex flex-col">
          <h4 className="text-xs font-medium text-gray-700 mb-4">Gender Distribution</h4>
          <div className="h-[240px] mb-4">
            <Pie options={pieOptions} data={formatData(demographics.gender)} />
          </div>
          <DemographicsTable label="Gender" data={getDemographicTableData(demographics.gender)} />
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 flex flex-col">
          <h4 className="text-xs font-medium text-gray-700 mb-4">Experience</h4>
          <div className="h-[160px] mb-4">
            <Bar options={barOptions} data={formatData(demographics.experience)} />
          </div>
          <DemographicsTable label="Experience" data={getDemographicTableData(demographics.experience)} />
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 flex flex-col">
          <h4 className="text-xs font-medium text-gray-700 mb-4">Education</h4>
          <div className="h-[160px] mb-4">
            <Bar options={barOptions} data={formatData(demographics.education)} />
          </div>
          <DemographicsTable label="Education" data={getDemographicTableData(demographics.education)} />
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

  const tableData = getVersionDistributionTableData(versionDistributionData);

  return (
    <div className="col-span-full bg-white rounded-lg shadow-sm p-6 border border-gray-100">
      <h3 className="text-sm font-medium text-gray-700 mb-4">Version Distribution</h3>
      <div className="h-[240px] w-full">
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
      <div className="mt-4">
        <AnalysisTable
          title="Version Distribution Data"
          data={tableData}
        />
      </div>
    </div>
  );
};

const getTaskCompletionTableData = (taskCompletionData: any[]) => {
  return taskCompletionData.map((d: any) => {
    const versionASeconds = d.versionA / 1000;
    const versionBSeconds = d.versionB / 1000;
    const change = ((d.versionB - d.versionA) / d.versionA * 100);
    return {
      name: d.name,
      versionA: Number(versionASeconds.toFixed(1)),
      versionB: Number(versionBSeconds.toFixed(1)),
      improvement: change.toFixed(1),
    };
  });
};

const TaskCompletion = ({ taskCompletionData }: { taskCompletionData: any[] }) => {
  const labels = taskCompletionData.map(d => d.name);
  const versionAData = taskCompletionData.map(d => d.versionA / 1000);
  const versionBData = taskCompletionData.map(d => d.versionB / 1000);

  const dataLabelPlugin = {
    id: 'dataLabelPlugin',
    afterDatasetsDraw(chart: any) {
      const { ctx, data } = chart;
      ctx.save();
      chart.data.datasets.forEach((dataset: any, datasetIndex: number) => {
        const meta = chart.getDatasetMeta(datasetIndex);
        meta.data.forEach((bar: any, index: number) => {
          const value = dataset.data[index];
          if (typeof value !== 'number' || isNaN(value)) return;
          ctx.font = 'bold 11px Inter, system-ui, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';
          ctx.fillStyle = dataset.backgroundColor;
          // Value formatting by chart type
          let label = '';
          if (chart.options.scales?.y?.title?.text?.includes('seconds')) {
            label = `${value.toFixed(1)}s`;
          } else if (chart.options.scales?.y?.title?.text?.includes('Score')) {
            label = `${value.toFixed(1)}`;
          } else if (chart.options.scales?.y?.title?.text?.includes('Number of Errors')) {
            label = `${value}`;
          } else {
            label = `${value}`;
          }
          ctx.fillText(label, bar.x, bar.y - 4);
        });
      });
      ctx.restore();
    }
  };

  const tableData = getTaskCompletionTableData(taskCompletionData);

  return (
    <div className="col-span-full bg-white rounded-lg shadow-sm p-6 border border-gray-100">
      <h3 className="text-sm font-medium text-gray-700 mb-4">Task Completion Time</h3>
      <div className="text-xs text-gray-500 mb-4">Time in seconds (lower is better)</div>
      <div className="h-[240px] w-full">
        <Bar
          data={{
            labels,
            datasets: [
              {
                label: 'Version A',
                data: versionAData,
                backgroundColor: COLORS[0],
                borderRadius: 2,
              },
              {
                label: 'Version B',
                data: versionBData,
                backgroundColor: COLORS[1],
                borderRadius: 2,
              }
            ]
          }}
          options={getBarChartOptions({
            yTitle: 'Time (seconds)',
            datasets: [versionAData, versionBData],
          })}
          plugins={[dataLabelPlugin]}
        />
      </div>
      <div className="mt-4">
        <AnalysisTable
          title="Task Completion Time Data"
          data={tableData}
          unit="s"
          showChange
        />
      </div>
    </div>
  );
};

const getErrorRatesTableData = (errorRatesData: any[]) => {
  return errorRatesData.map((d: any) => {
    const change = ((d.versionB - d.versionA) / d.versionA * 100);
    return {
      name: d.name,
      versionA: d.versionA,
      versionB: d.versionB,
      reduction: change.toFixed(1),
    };
  });
};

const ErrorRates = ({ errorRatesData }: { errorRatesData: any[] }) => {
  const tableData = getErrorRatesTableData(errorRatesData);
  return (
    <div className="col-span-full bg-white rounded-lg shadow-sm p-6 border border-gray-100">
      <h3 className="text-sm font-medium text-gray-700 mb-4">Error Rates</h3>
      <div className="text-xs text-gray-500 mb-4">Errors per task (lower is better)</div>
      <div className="h-[240px] w-full">
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
          options={getBarChartOptions({
            yTitle: 'Number of Errors',
            datasets: [errorRatesData.map(d => d.versionA), errorRatesData.map(d => d.versionB)],
          })}
          plugins={[dataLabelPlugin]}
        />
      </div>
      <div className="mt-4">
        <AnalysisTable
          title="Error Rates Data"
          data={tableData}
          showChange
        />
      </div>
    </div>
  );
};

const getNasaTlxTableData = (nasaTlxData: any[]) => {
  return nasaTlxData.map((d: any) => {
    const change = ((d.versionB - d.versionA) / d.versionA * 100);
    return {
      name: d.name,
      versionA: Number(d.versionA),
      versionB: Number(d.versionB),
      improvement: change.toFixed(1),
      higherIsBetter: false,
    };
  });
};

const NasaTLX = ({ nasaTlxData }: { nasaTlxData: any[] }) => {
  const tableData = getNasaTlxTableData(nasaTlxData);
  return (
    <div className="col-span-full bg-white rounded-lg shadow-sm p-6 border border-gray-100">
      <h3 className="text-sm font-medium text-gray-700 mb-4">NASA-TLX Scores</h3>
      <div className="text-xs text-gray-500 mb-4">1-10 scale (lower is better)</div>
      <div className="h-[240px] w-full">
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
          options={getBarChartOptions({
            yTitle: 'Score',
            datasets: [nasaTlxData.map(d => d.versionA), nasaTlxData.map(d => d.versionB)],
          })}
          plugins={[dataLabelPlugin]}
        />
      </div>
      <div className="mt-4">
        <AnalysisTable
          title="NASA-TLX Data"
          data={tableData}
          showChange
        />
      </div>
    </div>
  );
};

// SUS Table Data
const getSusTableData = (susScores: { versionA: number; versionB: number }) => {
  return [{
    name: 'System Usability Scale (SUS)',
    versionA: Number(susScores.versionA.toFixed(1)),
    versionB: Number(susScores.versionB.toFixed(1)),
    improvement: ((susScores.versionB - susScores.versionA) / susScores.versionA * 100).toFixed(1),
  }];
};

// Confidence Table Data
const getConfidenceTableData = (confidenceRatings: { versionA: number; versionB: number }) => {
  return [{
    name: 'Decision Confidence',
    versionA: Number(confidenceRatings.versionA.toFixed(1)),
    versionB: Number(confidenceRatings.versionB.toFixed(1)),
    improvement: ((confidenceRatings.versionB - confidenceRatings.versionA) / confidenceRatings.versionA * 100).toFixed(1),
  }];
};

const SUS = ({ susScores }: { susScores: { versionA: number; versionB: number } }) => {
  const tableData = getSusTableData(susScores);
  return (
    <div className="col-span-full bg-white rounded-lg shadow-sm p-6 border border-gray-100">
      <h3 className="text-sm font-medium text-gray-700 mb-4">System Usability Scale (SUS)</h3>
      <div className="text-xs text-gray-500 mb-4">0-100 scale (higher is better)</div>
      <div className="h-[240px] w-full">
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
          plugins={[dataLabelPlugin]}
        />
      </div>
      <div className="mt-4">
        <AnalysisTable
          title="SUS Data"
          data={tableData}
          showChange
          higherIsBetter
        />
      </div>
    </div>
  );
};

const Confidence = ({ confidenceRatings }: { confidenceRatings: { versionA: number; versionB: number } }) => {
  const tableData = getConfidenceTableData(confidenceRatings);
  return (
    <div className="col-span-full bg-white rounded-lg shadow-sm p-6 border border-gray-100">
      <h3 className="text-sm font-medium text-gray-700 mb-4">Confidence Ratings</h3>
      <div className="text-xs text-gray-500 mb-4">1-10 scale (higher is better)</div>
      <div className="h-[240px] w-full">
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
          plugins={[dataLabelPlugin]}
        />
      </div>
      <div className="mt-4">
        <AnalysisTable
          title="Confidence Data"
          data={tableData}
          showChange
          higherIsBetter
        />
      </div>
    </div>
  );
};

const HesitationTime = ({ hesitationTimeData }: { hesitationTimeData: ChartData[] }) => {
  // Only show rows with valid, positive numbers
  const validData = hesitationTimeData.filter(
    d => typeof d.versionA === 'number' && typeof d.versionB === 'number' && d.versionA > 0 && d.versionB > 0
  );

  const chartData = {
    labels: validData.map(d => d.name),
    datasets: [
      {
        label: 'Version A',
        data: validData.map(d => d.versionA), // already in seconds
        backgroundColor: COLORS[0],
        borderRadius: 2,
      },
      {
        label: 'Version B',
        data: validData.map(d => d.versionB), // already in seconds
        backgroundColor: COLORS[1],
        borderRadius: 2,
      }
    ]
  };

  return (
    <div className="col-span-full bg-white rounded-lg shadow-sm p-6 border border-gray-100">
      <h3 className="text-sm font-medium text-gray-700 mb-4">Hesitation Time</h3>
      <div className="text-xs text-gray-500 mb-4">
        Time between completing one order and starting the next (lower is better)
      </div>
      <div className="h-[240px] w-full">
        <Bar
          data={chartData}
          options={getBarChartOptions({
            yTitle: 'Time (seconds)',
            datasets: [validData.map(d => d.versionA), validData.map(d => d.versionB)],
          })}
          plugins={[dataLabelPlugin]}
        />
      </div>
      <div className="mt-4">
        <AnalysisTable
          title="Hesitation Time Data"
          data={hesitationTimeData}
          unit="s"
          showChange
        />
      </div>
    </div>
  );
};

const getCaseDurationsTableData = (caseDurationsData: { task: string; versionA: number[]; versionB: number[] }[]) => {
  return caseDurationsData.map(d => {
    const versionASeconds = d.versionA[0] / 1000;
    const versionBSeconds = d.versionB[0] / 1000;
    const change = ((d.versionB[0] - d.versionA[0]) / d.versionA[0] * 100);
    return {
      name: d.task.replace('_', ' '),
      versionA: Number(versionASeconds.toFixed(1)),
      versionB: Number(versionBSeconds.toFixed(1)),
      improvement: change.toFixed(1),
    };
  });
};

const CaseDurations = ({ caseDurationsData }: { caseDurationsData: { task: string; versionA: number[]; versionB: number[] }[] }) => {
  const tableData = getCaseDurationsTableData(caseDurationsData);
  return (
    <div className="col-span-full bg-white rounded-lg shadow-sm p-6 border border-gray-100">
      <h3 className="text-sm font-medium text-gray-700 mb-4">Case Duration</h3>
      <div className="text-xs text-gray-500 mb-4">Average time per case in seconds (lower is better)</div>
      <div className="h-[240px] w-full">
        <Bar
          data={{
            labels: caseDurationsData.map(d => d.task.replace('_', ' ')),
            datasets: [
              {
                label: 'Version A',
                data: caseDurationsData.map(d => d.versionA[0] / 1000),
                backgroundColor: COLORS[0],
                borderRadius: 2,
              },
              {
                label: 'Version B',
                data: caseDurationsData.map(d => d.versionB[0] / 1000),
                backgroundColor: COLORS[1],
                borderRadius: 2,
              }
            ]
          }}
          options={getBarChartOptions({
            yTitle: 'Time (seconds)',
            datasets: [caseDurationsData.map(d => d.versionA[0] / 1000), caseDurationsData.map(d => d.versionB[0] / 1000)],
          })}
          plugins={[dataLabelPlugin]}
        />
      </div>
      <div className="mt-4">
        <AnalysisTable
          title="Case Duration Data"
          data={tableData}
          unit="s"
          showChange
        />
      </div>
    </div>
  );
};

const getVersionDistributionTableData = (versionDistributionData: any[]) => {
  const total = versionDistributionData.reduce((sum, item) => sum + item.value, 0);
  return versionDistributionData.map(item => ({
    name: item.name,
    versionA: item.value,
    versionB: 0,
    improvement: ((item.value / total) * 100).toFixed(1),
  }));
};

function TaskEfficiencyTable({ data }: { data: {
  task: string;
  versionATime: number;
  versionBTime: number;
  timeChange: string;
  versionAErrors: number;
  versionBErrors: number;
  errorChange: string;
}[] }) {
  return (
    <div className="overflow-x-auto mt-2">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">A Time (s)</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">B Time (s)</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Δ Time (%)</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">A Errors</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">B Errors</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Δ Errors (%)</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, i) => (
            <tr key={i}>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{row.task}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">{row.versionATime.toFixed(1)}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">{row.versionBTime.toFixed(1)}</td>
              <td className={`px-4 py-3 whitespace-nowrap text-sm text-right ${parseFloat(row.timeChange) < 0 ? 'text-green-600' : 'text-red-600'}`}>{row.timeChange}%</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">{row.versionAErrors}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">{row.versionBErrors}</td>
              <td className={`px-4 py-3 whitespace-nowrap text-sm text-right ${parseFloat(row.errorChange) < 0 ? 'text-green-600' : 'text-red-600'}`}>{row.errorChange}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function getTaskEfficiencyTableData(taskCompletionData: ChartData[], errorRatesData: ChartData[]) {
  return taskCompletionData.map((task) => {
    const errorData = errorRatesData.find(e => e.name === task.name);
    const versionATime = task.versionA / 1000;
    const versionBTime = task.versionB / 1000;
    const timeChange = versionATime === 0 ? '0.0' : (((versionBTime - versionATime) / versionATime) * 100).toFixed(1);
    const versionAErrors = errorData?.versionA ?? 0;
    const versionBErrors = errorData?.versionB ?? 0;
    const errorChange = versionAErrors === 0 ? '0.0' : (((versionBErrors - versionAErrors) / versionAErrors) * 100).toFixed(1);
    return {
      task: task.name,
      versionATime,
      versionBTime,
      timeChange,
      versionAErrors,
      versionBErrors,
      errorChange,
    };
  });
}

const TaskEfficiencyVsErrorRate = ({ taskCompletionData, errorRatesData }: { taskCompletionData: ChartData[]; errorRatesData: ChartData[] }) => {
  // Assign a number to each task
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const scatterData = taskCompletionData.map((task, index) => {
    const errorData = errorRatesData.find(e => e.name === task.name);
    return {
      number: numbers[index],
      task: task.name,
      versionA: {
        x: task.versionA / 1000, // Convert to seconds
        y: errorData?.versionA || 0,
      },
      versionB: {
        x: task.versionB / 1000,
        y: errorData?.versionB || 0,
      }
    };
  });

  // Custom plugin to draw numbers next to each dot
  const drawNumbersPlugin = {
    id: 'drawNumbersPlugin',
    afterDatasetsDraw(chart: any) {
      const { ctx } = chart;
      ctx.save();
      chart.data.datasets.forEach((dataset: any, datasetIndex: any) => {
        ctx.font = 'bold 13px Inter, system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = dataset.backgroundColor;
        dataset.data.forEach((point: any, i: any) => {
          const meta = chart.getDatasetMeta(datasetIndex);
          const x = meta.data[i].x;
          const y = meta.data[i].y;
          // Find the number for this point
          const number = scatterData[i]?.number || '';
          ctx.fillText(number, x + 10, y - 10);
        });
      });
      ctx.restore();
    }
  };

  const tableData = getTaskEfficiencyTableData(taskCompletionData, errorRatesData);

  return (
    <div className="col-span-full bg-white rounded-lg shadow-sm p-6 border border-gray-100">
      <h3 className="text-sm font-medium text-gray-700 mb-4">Task Efficiency vs Error Rate</h3>
      <div className="text-xs text-gray-500 mb-2">
        <span className="font-semibold">Legend:</span> {numbers.slice(0, taskCompletionData.length).map((n, i) => `${n} = ${taskCompletionData[i].name}`).join('   ')}
      </div>
      <div className="text-xs text-gray-500 mb-4">
        Correlation between completion time and error rates
      </div>
      <div className="h-[300px] w-full mb-6">
        <Scatter
          data={{
            datasets: [
              {
                label: 'Version A',
                data: scatterData.map(d => d.versionA),
                backgroundColor: COLORS[0],
                pointRadius: 8,
                pointHoverRadius: 10,
              },
              {
                label: 'Version B',
                data: scatterData.map(d => d.versionB),
                backgroundColor: COLORS[1],
                pointRadius: 8,
                pointHoverRadius: 10,
              }
            ]
          }}
          options={{
            ...commonChartOptions,
            plugins: {
              ...commonChartOptions.plugins,
              tooltip: {
                ...commonChartOptions.plugins.tooltip,
                callbacks: {
                  label: (context: any) => {
                    const task = scatterData[context.dataIndex].task;
                    return `${task}: ${context.raw.y} errors in ${context.raw.x.toFixed(1)}s`;
                  }
                }
              }
            },
            scales: {
              x: {
                type: 'linear',
                position: 'bottom',
                title: {
                  display: true,
                  text: 'Task Completion Time (seconds)',
                  font: {
                    family: 'Inter, system-ui, sans-serif',
                    size: 11,
                    weight: 500,
                  },
                },
                min: 0,
              },
              y: {
                title: {
                  display: true,
                  text: 'Number of Errors',
                  font: {
                    family: 'Inter, system-ui, sans-serif',
                    size: 11,
                    weight: 500,
                  },
                },
                min: 0,
              }
            },
          }}
          plugins={[drawNumbersPlugin]}
        />
      </div>
      <div className="mt-4">
        <TaskEfficiencyTable data={tableData} />
      </div>
    </div>
  );
};

function getBarChartOptions({
  yTitle,
  datasets,
  min,
  max,
  ticks,
}: {
  yTitle: string,
  datasets: number[][],
  min?: number,
  max?: number,
  ticks?: any,
}) {
  const allValues = datasets.flat();
  const maxValue = allValues.length ? Math.max(...allValues) : 0;
  return {
    ...commonChartOptions,
    layout: {
      padding: { top: 24 },
    },
    scales: {
      ...commonChartOptions.scales,
      y: {
        ...commonChartOptions.scales.y,
        min,
        max,
        suggestedMax: max !== undefined ? max : maxValue * 1.15,
        title: {
          display: true,
          text: yTitle,
          font: {
            family: 'Inter, system-ui, sans-serif',
            size: 11,
            weight: 500,
          },
        },
        ...(ticks ? { ticks } : {}),
      },
    },
  };
}

const UserEfficiencyVsErrorRate = ({ participants }: { participants: any[] }) => {
  // Prepare data: one point per participant
  const userData = participants.map((participant, idx) => {
    // Calculate total task time (sum of all tasks)
    let totalTaskTime = 0;
    if (participant.actionLogs) {
      const taskTypes = [
        TaskType.ORDER_VALIDATION,
        TaskType.ORDER_ASSIGNMENT,
        TaskType.DELIVERY_SCHEDULING,
      ];
      taskTypes.forEach(task => {
        const start = participant.actionLogs.find(
          (l: any) => l.action === 'TASK_START' && l.task === task
        );
        const end = participant.actionLogs.find(
          (l: any) => l.action === 'TASK_END' && l.task === task
        );
        if (start && end) {
          totalTaskTime += (end.timestamp.getTime() - start.timestamp.getTime());
        }
      });
    }
    // Calculate total errors
    const totalErrors = participant.errorLogs ? participant.errorLogs.length : 0;
    return {
      x: totalTaskTime / 1000, // seconds
      y: totalErrors,
      version: participant.version,
      label: `User ${idx + 1}`,
    };
  });

  return (
    <div className="col-span-full bg-white rounded-lg shadow-sm p-6 border border-gray-100">
      <h3 className="text-sm font-medium text-gray-700 mb-4">User Task Efficiency vs Error Rate</h3>
      <div className="text-xs text-gray-500 mb-4">
        Each point represents a participant's total task time and total errors (lower left is better)
      </div>
      <div className="h-[320px] w-full">
        <Scatter
          data={{
            datasets: [
              {
                label: 'Version A',
                data: userData.filter(d => d.version === 'A'),
                backgroundColor: COLORS[0],
                pointRadius: 6,
                pointHoverRadius: 10,
                parsing: false,
              },
              {
                label: 'Version B',
                data: userData.filter(d => d.version === 'B'),
                backgroundColor: COLORS[1],
                pointRadius: 6,
                pointHoverRadius: 10,
                parsing: false,
              }
            ]
          }}
          options={{
            ...commonChartOptions,
            plugins: {
              ...commonChartOptions.plugins,
              tooltip: {
                ...commonChartOptions.plugins.tooltip,
                callbacks: {
                  label: (context: any) => {
                    const d = context.raw;
                    return `${d.label} (Version ${d.version}): ${d.x.toFixed(1)}s, ${d.y} errors`;
                  }
                }
              }
            },
            scales: {
              x: {
                type: 'linear',
                position: 'bottom',
                title: {
                  display: true,
                  text: 'Total Task Time (seconds)',
                  font: {
                    family: 'Inter, system-ui, sans-serif',
                    size: 11,
                    weight: 500,
                  },
                },
                min: 0,
                max: Math.max(...userData.map(d => d.x)) * 1.1,
              },
              y: {
                title: {
                  display: true,
                  text: 'Total Errors',
                  font: {
                    family: 'Inter, system-ui, sans-serif',
                    size: 11,
                    weight: 500,
                  },
                },
                min: 0,
              }
            },
          }}
        />
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
  TaskEfficiencyVsErrorRate,
  UserEfficiencyVsErrorRate,
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
  TaskEfficiencyVsErrorRate,
  UserEfficiencyVsErrorRate,
};

export default Charts; 