"use client";

import React from 'react';

interface TableProps {
  children?: React.ReactNode;
  className?: string;
}

export function Table({ children, className = '' }: TableProps) {
  return (
    <div className="overflow-x-auto">
      <table className={`min-w-full divide-y divide-gray-200 ${className}`}>
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ children, className = '' }: TableProps) {
  return (
    <thead className={`bg-gray-50 ${className}`}>
      {children}
    </thead>
  );
}

export function TableBody({ children, className = '' }: TableProps) {
  return (
    <tbody className={`bg-white divide-y divide-gray-200 ${className}`}>
      {children}
    </tbody>
  );
}

export function TableRow({ 
  children, 
  className = '', 
  onClick, 
  noHover = false,
  isSelected = false
}: TableProps & { 
  onClick?: () => void,
  noHover?: boolean,
  isSelected?: boolean
}) {
  return (
    <tr 
      className={`
        ${!noHover && !isSelected ? 'hover:bg-gray-50' : ''}
        ${isSelected ? 'hover:bg-blue-100' : ''}
        ${onClick ? 'cursor-pointer' : ''} 
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </tr>
  );
}

export function TableCell({ children, className = '' }: TableProps) {
  return (
    <td className={`px-6 py-4 whitespace-nowrap ${className}`}>
      {children}
    </td>
  );
}

export function TableHeaderCell({ children, className = '' }: TableProps) {
  return (
    <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider ${className}`}>
      {children}
    </th>
  );
} 