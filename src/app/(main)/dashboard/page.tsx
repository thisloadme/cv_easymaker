'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { formatDistanceToNow } from 'date-fns'
import { VersionHistory } from '@/components/cv/VersionHistory'

interface CVSummary {
  id: string
  targetRole: string
  status: string
  atsScore: number
  updatedAt: string
  personal: string
  version: number
  shareSlug: string | null
}

function CopyShareButton({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const shareUrl = `${window.location.origin}/cv/s/${slug}`
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleCopy} className="text-accent">
      {copied ? 'Copied!' : 'Copy Link'}
    </Button>
  )
}

function RegenerateShareButton({ cvId, onRegenerated }: { cvId: string; onRegenerated: () => void }) {
  const [loading, setLoading] = useState(false)

  const handleRegenerate = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/cv/${cvId}/share`, { method: 'POST' })
      if (res.ok) {
        onRegenerated()
      }
    } catch (error) {
      console.error('Failed to regenerate share link:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleRegenerate} disabled={loading} className="text-muted">
      {loading ? '...' : 'Regenerate'}
    </Button>
  )
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const [cvs, setCvs] = useState<CVSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      window.location.href = '/login'
      return
    }

    if (status === 'authenticated') {
      fetchCvs()
    }
  }, [status])

  const fetchCvs = async () => {
    try {
      const res = await fetch('/api/cv')
      if (res.ok) {
        const data = await res.json()
        setCvs(data)
      }
    } catch (error) {
      console.error('Failed to fetch CVs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this CV? This cannot be undone.')) return

    try {
      await fetch(`/api/cv/${id}`, { method: 'DELETE' })
      setCvs(cvs.filter((cv) => cv.id !== id))
    } catch (error) {
      console.error('Delete failed:', error)
    }
  }

  const handleRestore = async (versionId: string) => {
    if (!confirm('Restore this version? Current version will be replaced.')) return

    try {
      const res = await fetch(`/api/cv/${versionId}`, { method: 'PATCH' })
      if (res.ok) {
        fetchCvs() // refresh list
      }
    } catch (error) {
      console.error('Restore failed:', error)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted font-ui">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-medium text-ink">Your CVs</h1>
            <p className="text-muted font-body mt-1">
              {session?.user?.name || session?.user?.email}
            </p>
          </div>
          <Link href="/interview/new">
            <Button>+ Create new CV</Button>
          </Link>
        </div>

        {cvs.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-muted font-body mb-4">
              You haven't created any CVs yet.
            </p>
            <Link href="/interview/new">
              <Button variant="secondary">Start your first CV</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid gap-4">
            {cvs.map((cv) => {
              const personal = JSON.parse(cv.personal)
              return (
                <Card key={cv.id} variant="bordered" className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-display text-lg font-medium text-ink">
                        {personal.name || 'Untitled CV'}
                      </h3>
                      <span className={`px-2 py-0.5 text-xs font-ui rounded-sm ${
                        cv.status === 'exported'
                          ? 'bg-green-100 text-green-700'
                          : cv.status === 'completed'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {cv.status}
                      </span>
                      {cv.atsScore > 0 && (
                        <span className="text-sm font-ui text-accent">
                          ATS: {cv.atsScore}
                        </span>
                      )}
                      {cv.version > 0 && (
                        <span className="text-sm font-ui text-muted">
                          v{cv.version}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted font-ui">
                      {cv.targetRole} • Updated {formatDistanceToNow(new Date(cv.updatedAt), { addSuffix: true })}
                    </p>
                    {cv.shareSlug && (
                      <p className="text-xs text-accent font-ui mt-1">
                        Share: /cv/s/{cv.shareSlug}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {cv.shareSlug && (
                      <>
                        <a href={`/cv/s/${cv.shareSlug}`} target="_blank" rel="noopener noreferrer">
                          <Button variant="ghost" size="sm">Preview</Button>
                        </a>
                        <CopyShareButton slug={cv.shareSlug} />
                        <RegenerateShareButton cvId={cv.id} onRegenerated={fetchCvs} />
                      </>
                    )}
                    <VersionHistory cvId={cv.id} currentVersion={cv.version} onRestore={handleRestore} />
                    <Link href={`/preview?id=${cv.id}`}>
                      <Button variant="ghost" size="sm">View</Button>
                    </Link>
                    <Link href={`/api/cv/${cv.id}/export`}>
                      <Button size="sm">Export PDF</Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(cv.id)}
                      className="text-red-500 hover:bg-red-50"
                    >
                      Delete
                    </Button>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}