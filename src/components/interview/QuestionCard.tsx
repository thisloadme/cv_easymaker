'use client'

import type { Question } from '@/types'
import { Input } from '@/components/ui/Input'

interface QuestionCardProps {
  question: Question
  value: string
  onChange: (value: string) => void
  onNext?: () => void
}

export function QuestionCard({ question, value, onChange }: QuestionCardProps) {
  const isLongText = question.transform === 'paragraph' || question.transform === 'bullet'

  return (
    <div className="space-y-6">
      <div>
        <p className="text-lg font-display text-ink mb-2">
          {question.text}
        </p>
        {question.hint && (
          <p className="text-sm text-muted font-body">
            {question.hint}
          </p>
        )}
      </div>

      {isLongText ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Type your answer..."
          className="w-full min-h-[120px] px-4 py-3 font-ui bg-paper border border-border rounded-sm
            placeholder:text-muted focus:outline-none focus:border-accent focus:ring-1
            focus:ring-accent transition-colors duration-200 resize-y"
        />
      ) : (
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Your answer"
        />
      )}

      {value.length > 0 && value.length < 50 && question.required && (
        <p className="text-sm text-amber-600 font-ui">
          Tip: Adding specific details or numbers helps your CV stand out.
        </p>
      )}
    </div>
  )
}