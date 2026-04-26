'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useInterviewStore } from '@/store/interviewStore'

export default function ClaimPage() {
  const router = useRouter()
  const store = useInterviewStore()
  const [loading, setLoading] = useState(false)

  const hasGuestCV = store.sessionId !== null

  useEffect(() => {
    if (!hasGuestCV) {
      router.push('/dashboard')
    }
  }, [hasGuestCV, router])

  const handleClaim = async () => {
    setLoading(true)

    try {
      // Save guest CV to user's account via API
      const res = await fetch('/api/cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetRole: store.targetRole,
          personal: JSON.stringify(store.personal),
          summary: store.summary,
          experience: JSON.stringify(store.experience),
          education: JSON.stringify(store.education),
          skills: JSON.stringify(store.skills),
          projects: JSON.stringify(store.projects),
        }),
      })

      if (res.ok) {
        store.reset()
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Claim error:', error)
      setLoading(false)
    }
  }

  const handleSkip = () => {
    store.reset()
    router.push('/dashboard')
  }

  if (!hasGuestCV) return null

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-6">
      <Card className="max-w-md w-full text-center">
        <h1 className="text-2xl font-display font-medium text-ink mb-4">
          Save your CV?
        </h1>
        <p className="text-muted font-body mb-8">
          You have an unsaved CV from your previous session.
          Create an account to save it and access it anywhere.
        </p>

        <div className="space-y-3">
          <Button onClick={handleClaim} className="w-full" disabled={loading}>
            {loading ? 'Saving...' : 'Save CV to my account'}
          </Button>
          <Button variant="ghost" onClick={handleSkip} className="w-full">
            Skip — start fresh
          </Button>
        </div>
      </Card>
    </div>
  )
}