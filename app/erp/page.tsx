"use client";

import { useSearchParams } from "next/navigation";
import ERPExperiment from "@/app/components/experiment/ERPExperiment";
import { ExperimentVersion } from "@/lib/types/experiment";

export default function ERPPage() {
  const searchParams = useSearchParams();
  const versionParam = searchParams.get("version") || "a";
  const version = (versionParam.toLowerCase() === "a" || versionParam.toLowerCase() === "b" 
    ? versionParam.toLowerCase() 
    : "a") as ExperimentVersion;
  const participantId = searchParams.get("participantId") || "unknown";
  
  return (
    <ERPExperiment 
      version={version} 
      participantId={participantId} 
    />
  );
} 