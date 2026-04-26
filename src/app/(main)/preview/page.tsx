'use client'

import { useState } from 'react'
import { CVPreview } from '@/components/cv/CVPreview'
import { JobDescriptionModal } from '@/components/cv/JobDescriptionModal'
import { CoverLetterModal } from '@/components/cv/CoverLetterModal'

export default function PreviewPage() {
  const [showJobModal, setShowJobModal] = useState(false)
  const [showCoverLetter, setShowCoverLetter] = useState(false)

  return (
    <main className="min-h-screen py-12 px-6 bg-accent-muted/20">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-medium text-ink mb-2">
            Your CV Preview
          </h1>
          <p className="text-muted font-body">
            Review your CV and export when ready
          </p>
        </div>

        <CVPreview
          onAnalyzeJobMatch={() => setShowJobModal(true)}
          onGenerateCoverLetter={() => setShowCoverLetter(true)}
        />

        <JobDescriptionModal
          isOpen={showJobModal}
          onClose={() => setShowJobModal(false)}
        />

        <CoverLetterModal
          isOpen={showCoverLetter}
          onClose={() => setShowCoverLetter(false)}
        />
      </div>
    </main>
  )
}
