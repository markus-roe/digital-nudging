"use client";

import { Suspense, useEffect, useState } from 'react';
import ERPExperiment from "@/app/components/experiment/ERPExperiment";
import { ExperimentVersion } from "@/lib/types/experiment";

export default function ERPPage() {
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