'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useInterviewStore } from '@/store/interviewStore'
import type { CoverLetterSection } from '@/lib/coverLetter/generator'

interface CoverLetterModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CoverLetterModal({ isOpen, onClose }: CoverLetterModalProps) {
  const store = useInterviewStore()
  const [jobTitle, setJobTitle] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [hiringManagerName, setHiringManagerName] = useState('')
  const [loading, setLoading] = useState(false)
  const [sections, setSections] = useState<CoverLetterSection[] | null>(null)

  const handleGenerate = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/cover-letter', {
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
          jobTitle,
          companyName,
          hiringManagerName,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        setSections(data.sections)
      }
    } catch (error) {
      console.error('Generate failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleExportPDF = async () => {
    const url = `/api/cover-letter?format=pdf`
    const res = await fetch(url, {
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
        jobTitle,
        companyName,
        hiringManagerName,
      }),
    })

    if (res.ok) {
      const blob = await res.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = downloadUrl
      a.download = 'Cover_Letter.pdf'
      a.click()
    }
  }

  const handleClose = () => {
    setJobTitle('')
    setCompanyName('')
    setHiringManagerName('')
    setSections(null)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Generate Cover Letter">
      <div className="space-y-4">
        <p className="text-sm text-muted font-body">
          Generate a professional cover letter based on your CV data.
        </p>

        <div className="space-y-3">
          <Input
            label="Job Title (optional)"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="e.g., Senior Software Engineer"
          />

          <Input
            label="Company Name (optional)"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="e.g., Acme Corp"
          />

          <Input
            label="Hiring Manager Name (optional)"
            value={hiringManagerName}
            onChange={(e) => setHiringManagerName(e.target.value)}
            placeholder="e.g., Jane Smith"
          />
        </div>

        <Button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Generating...' : 'Generate Cover Letter'}
        </Button>

        {sections && (
          <div className="space-y-4 pt-4 border-t border-border">
            <div className="flex justify-between items-center">
              <h3 className="font-display font-semibold text-ink">Preview</h3>
              <Button size="sm" onClick={handleExportPDF}>
                Export PDF
              </Button>
            </div>

            <div className="bg-paper border border-border rounded-sm p-4 space-y-4 max-h-[400px] overflow-y-auto">
              {sections.map((section, i) => (
                <div key={i}>
                  {section.title !== 'Salutation' && section.title !== 'Closing' && (
                    <p className="text-xs font-ui font-medium text-muted uppercase tracking-wider mb-1">
                      {section.title}
                    </p>
                  )}
                  <p className="text-sm font-body text-ink whitespace-pre-wrap">
                    {section.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}
