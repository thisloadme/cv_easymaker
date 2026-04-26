'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { useInterviewStore } from '@/store/interviewStore'

interface JobDescriptionModalProps {
  isOpen: boolean
  onClose: () => void
}

interface MatchResult {
  matchedKeywords: string[]
  missingKeywords: string[]
  matchPercentage: number
  suggestions: string[]
}

export function JobDescriptionModal({ isOpen, onClose }: JobDescriptionModalProps) {
  const store = useInterviewStore()
  const [jobDescription, setJobDescription] = useState('')
  const [result, setResult] = useState<MatchResult | null>(null)
  const [loading, setLoading] = useState(false)

  const handleAnalyze = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/job-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cv: {
            personal: store.personal,
            summary: store.summary,
            experience: store.experience,
            skills: store.skills,
            projects: store.projects,
            targetRole: store.targetRole,
          },
          jobDescription,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        setResult(data)
      }
    } catch (error) {
      console.error('Match failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setJobDescription('')
    setResult(null)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Job Description Match">
      <div className="space-y-4">
        <p className="text-sm text-muted font-body">
          Paste a job description to see how well your CV matches the role.
        </p>

        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste job description here..."
          className="w-full min-h-[200px] px-4 py-3 font-ui bg-paper border border-border rounded-sm
            placeholder:text-muted focus:outline-none focus:border-accent focus:ring-1
            focus:ring-accent transition-colors duration-200 resize-y text-sm"
        />

        <Button
          onClick={handleAnalyze}
          disabled={loading || jobDescription.length < 50}
          className="w-full"
        >
          {loading ? 'Analyzing...' : 'Analyze Match'}
        </Button>

        {result && (
          <div className="space-y-4 pt-4 border-t border-border">
            {/* Match Score */}
            <div className="flex items-center justify-between">
              <span className="font-ui text-sm font-medium">Match Score</span>
              <span className={`font-display text-2xl font-bold ${
                result.matchPercentage >= 70 ? 'text-green-600' :
                result.matchPercentage >= 50 ? 'text-amber-600' : 'text-red-600'
              }`}>
                {result.matchPercentage}%
              </span>
            </div>

            {/* Matched Keywords */}
            {result.matchedKeywords.length > 0 && (
              <div>
                <p className="text-xs font-ui text-muted mb-2">Matched keywords:</p>
                <div className="flex flex-wrap gap-1">
                  {result.matchedKeywords.map((kw) => (
                    <span key={kw} className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-sm">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Missing Keywords */}
            {result.missingKeywords.length > 0 && (
              <div>
                <p className="text-xs font-ui text-muted mb-2">Missing keywords (add these to your CV):</p>
                <div className="flex flex-wrap gap-1">
                  {result.missingKeywords.map((kw) => (
                    <span key={kw} className="px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded-sm">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Suggestions */}
            {result.suggestions.length > 0 && (
              <div>
                <p className="text-xs font-ui text-muted mb-2">Suggestions:</p>
                <ul className="space-y-1">
                  {result.suggestions.map((s, i) => (
                    <li key={i} className="text-sm font-body text-ink flex">
                      <span className="mr-2">→</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  )
}