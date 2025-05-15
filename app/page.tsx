"use client";

import { Suspense, useEffect, useState } from 'react';
import ERPExperiment from "@/app/components/experiment/ERPExperiment";
import { ExperimentVersion } from "@/lib/types/experiment";

function StudyClosedScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-lg w-full mx-4 p-8 bg-white rounded-2xl shadow-xl transform transition-all duration-500 hover:shadow-2xl">
        <div className="space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>

          {/* Content */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Study Closed
            </h1>
            <div className="space-y-3">
              <p className="text-gray-500">
                The data collection phase has been completed successfully.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ERPPage() {
  return <StudyClosedScreen />;

  return (
    <Suspense fallback={<LoadingScreen />}>
      <ERPPageContent />
    </Suspense>
  );
}

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    </div>
  );
}

function ERPPageContent() {
  const [version, setVersion] = useState<ExperimentVersion>('a');
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchVersion = async () => {
      try {
        const response = await fetch('/api/version-assignment');
        const data = await response.json();
        setVersion(data.version);
      } catch (error) {
        console.error('Error fetching version:', error);
        // Default to version A if there's an error
        setVersion('a');
      } finally {
        setLoading(false);
      }
    };
    
    fetchVersion();
  }, []);
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  return (
    <ERPExperiment version={version} />
  );
} 