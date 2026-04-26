'use client'

import { SECTION_ORDER, SECTION_LABELS } from '@/lib/interview/questions'

interface ProgressBarProps {
  currentSection: number
  className?: string
}

export function ProgressBar({ currentSection, className = '' }: ProgressBarProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex justify-between text-sm font-ui">
        <span className="text-muted">
          Step {currentSection + 1} of {SECTION_ORDER.length}
        </span>
        <span className="text-accent font-medium">
          {SECTION_LABELS[SECTION_ORDER[currentSection]]}
        </span>
      </div>
      <div className="h-1 bg-border overflow-hidden rounded-sm">
        <div
          className="h-full bg-accent transition-all duration-500 ease-out"
          style={{ width: `${((currentSection + 1) / SECTION_ORDER.length) * 100}%` }}
        />
      </div>
    </div>
  )
}