"use client";

import React from 'react';
import { Button } from './Button';

export function SaveButton() {
  return (
    <div className="mt-6">
      <Button variant="primary" onClick={() => console.log('Saving assignments')}>
        Save Assignments
      </Button>
    </div>
  );
} 