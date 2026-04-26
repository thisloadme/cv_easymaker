'use client'

import type { ATSAnalysis } from '@/types'

interface ATSScoreIndicatorProps {
  score: number
  breakdown?: ATSAnalysis['breakdown']
  recommendations?: string[]
}

export function ATSScoreIndicator({ score, breakdown, recommendations = [] }: ATSScoreIndicatorProps) {
  const getScoreColor = (s: number) => {
    if (s >= 85) return 'text-green-600'
    if (s >= 70) return 'text-amber-600'
    return 'text-red-600'
  }

  const getScoreBg = (s: number) => {
    if (s >= 85) return 'bg-green-50 border-green-200'
    if (s >= 70) return 'bg-amber-50 border-amber-200'
    return 'bg-red-50 border-red-200'
  }

  return (
    <div className={`p-4 rounded-sm border ${getScoreBg(score)}`}>
      <div className="flex items-center justify-between mb-4">
        <span className="font-ui text-sm font-medium text-ink">ATS Score</span>
        <span className={`font-display text-2xl font-bold ${getScoreColor(score)}`}>
          {score}
        </span>
      </div>

      {breakdown && (
        <div className="space-y-2 mb-4">
          {[
            { label: 'Format', value: breakdown.format },
            { label: 'Keywords', value: breakdown.keywords },
            { label: 'Contact', value: breakdown.contact },
            { label: 'Completeness', value: breakdown.completeness },
            { label: 'Bullets', value: breakdown.bullets },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between">
              <span className="text-xs font-ui text-muted">{label}</span>
              <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${value >= 80 ? 'bg-green-500' : value >= 60 ? 'bg-amber-500' : 'bg-red-500'}`}
                  style={{ width: `${value}%` }}
                />
              </div>
              <span className="text-xs font-ui text-muted w-8 text-right">{value}</span>
            </div>
          ))}
        </div>
      )}

      {recommendations.length > 0 && (
        <div className="space-y-1">
          <p className="text-xs font-ui font-medium text-ink">Recommendations:</p>
          {recommendations.slice(0, 3).map((rec, i) => (
            <p key={i} className="text-xs text-muted font-body">• {rec}</p>
          ))}
        </div>
      )}
    </div>
  )
}
