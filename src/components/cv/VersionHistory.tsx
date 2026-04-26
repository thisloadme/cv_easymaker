'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { formatDistanceToNow } from 'date-fns'

interface Version {
  id: string
  version: number
  createdAt: string
  updatedAt: string
  status: string
  atsScore: number
  targetRole: string
}

interface VersionHistoryProps {
  cvId: string
  currentVersion: number
  onRestore: (versionId: string) => void
}

export function VersionHistory({ cvId, currentVersion, onRestore }: VersionHistoryProps) {
  const [versions, setVersions] = useState<Version[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const fetchVersions = async () => {
    if (versions.length > 0) return
    setLoading(true)
    try {
      const res = await fetch(`/api/cv/${cvId}/versions`)
      if (res.ok) {
        const data = await res.json()
        setVersions(data)
      }
    } catch (error) {
      console.error('Failed to fetch versions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleOpen = () => {
    setOpen(true)
    fetchVersions()
  }

  const handleCreateVersion = async () => {
    try {
      const res = await fetch(`/api/cv/${cvId}/versions`, { method: 'POST' })
      if (res.ok) {
        fetchVersions() // refresh
      }
    } catch (error) {
      console.error('Failed to create version:', error)
    }
  }

  return (
    <>
      <Button variant="ghost" size="sm" onClick={handleOpen}>
        Version History ({currentVersion})
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm">
          <Card className="w-full max-w-lg max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-display font-semibold">Version History</h2>
              <button onClick={() => setOpen(false)} className="text-muted hover:text-ink">✕</button>
            </div>

            <div className="space-y-3 mb-4">
              <Button size="sm" onClick={handleCreateVersion} className="w-full">
                Create New Version
              </Button>
            </div>

            {loading ? (
              <p className="text-muted font-ui text-sm">Loading...</p>
            ) : (
              <div className="space-y-2">
                {versions.map((v) => (
                  <div
                    key={v.id}
                    className={`p-3 border rounded-sm ${
                      v.version === currentVersion ? 'border-accent bg-accent-muted/20' : 'border-border'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-ui font-medium">Version {v.version}</span>
                      <span className="text-xs text-muted">
                        {formatDistanceToNow(new Date(v.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted">{v.targetRole}</span>
                      {v.atsScore > 0 && (
                        <span className="text-accent">ATS: {v.atsScore}</span>
                      )}
                    </div>
                    {v.version !== currentVersion && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2 w-full"
                        onClick={() => onRestore(v.id)}
                      >
                        Restore this version
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}
    </>
  )
}