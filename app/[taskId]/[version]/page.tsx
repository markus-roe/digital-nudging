"use client";

import { use } from 'react';
import TaskRouter from '@/app/components/router/TaskRouter';

interface TaskPageProps {
  params: Promise<{
    taskId: string;
    version: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default function TaskPage({ params }: TaskPageProps) {
  // Unwrap params using React's use function
  const { taskId, version } = use(params);
  
  return <TaskRouter taskId={taskId} version={version} />;
} 