'use client'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

interface PageProps {
  params: { slug: string }
}

async function getCV(slug: string) {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
  const res = await fetch(`${baseUrl}/api/cv/s/${slug}`, { cache: 'no-store' })
  if (!res.ok) return null
  return res.json()
}

export default async function SharedCVPage({ params }: PageProps) {
  const cv = await getCV(params.slug)

  if (!cv) {
    notFound()
  }

  return (
    <main className="min-h-screen py-12 px-6 bg-accent-muted/20">
      <div className="max-w-4xl mx-auto">
        {/* Header with export actions */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-sm text-muted font-ui mb-1">Shared CV</p>
            <h1 className="text-2xl font-display font-medium text-ink">
              {cv.personal?.name || 'CV Preview'}
            </h1>
          </div>
          <div className="flex gap-2">
            <a href={`/api/cv/${cv.id}/export`} target="_blank">
              <Button>Export PDF</Button>
            </a>
            <a href={`/api/cv/${cv.id}/export-docx`} target="_blank">
              <Button variant="secondary">Export DOCX</Button>
            </a>
          </div>
        </div>

        {/* CV Preview */}
        <Card variant="bordered" className="bg-white max-w-[816px] mx-auto shadow-xl">
          <div className="p-8 min-h-[1054px]">
            {/* Header */}
            <header className="mb-6">
              <h1 className="text-3xl font-display font-bold text-ink mb-2">
                {cv.personal?.name || 'Your Name'}
              </h1>
              <p className="text-sm text-muted">
                {cv.personal?.email}
                {cv.personal?.phone && ` • ${cv.personal.phone}`}
                {cv.personal?.location && ` • ${cv.personal.location}`}
              </p>
              {(cv.personal?.linkedin || cv.personal?.portfolio) && (
                <p className="text-sm text-muted">
                  {cv.personal?.linkedin}
                  {cv.personal?.linkedin && cv.personal?.portfolio && ' • '}
                  {cv.personal?.portfolio}
                </p>
              )}
            </header>

            {/* Summary */}
            {cv.summary && (
              <section className="mb-6">
                <h2 className="text-sm font-display font-bold uppercase tracking-wider text-ink border-b border-ink pb-1 mb-2">
                  Summary
                </h2>
                <p className="text-sm font-body text-ink leading-relaxed">{cv.summary}</p>
              </section>
            )}

            {/* Experience */}
            {cv.experience?.length > 0 && (
              <section className="mb-6">
                <h2 className="text-sm font-display font-bold uppercase tracking-wider text-ink border-b border-ink pb-1 mb-2">
                  Experience
                </h2>
                {cv.experience.map((exp: any, idx: number) => (
                  <div key={idx} className="mb-4">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="text-sm font-display font-semibold text-ink">{exp.role}</h3>
                      <span className="text-xs text-muted">
                        {exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    <p className="text-xs font-body italic text-muted mb-1">{exp.company}</p>
                    {exp.bullets?.length > 0 && (
                      <ul className="list-none space-y-1 ml-2">
                        {exp.bullets.map((bullet: string, bIdx: number) => (
                          <li key={bIdx} className="text-xs font-body text-ink flex">
                            <span className="mr-2">•</span>
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </section>
            )}

            {/* Education */}
            {cv.education?.length > 0 && (
              <section className="mb-6">
                <h2 className="text-sm font-display font-bold uppercase tracking-wider text-ink border-b border-ink pb-1 mb-2">
                  Education
                </h2>
                {cv.education.map((edu: any, idx: number) => (
                  <div key={idx} className="mb-3">
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-sm font-display font-semibold text-ink">{edu.degree}</h3>
                      <span className="text-xs text-muted">{edu.endYear}</span>
                    </div>
                    <p className="text-xs font-body italic text-muted">{edu.school}</p>
                  </div>
                ))}
              </section>
            )}

            {/* Skills */}
            {cv.skills?.length > 0 && (
              <section className="mb-6">
                <h2 className="text-sm font-display font-bold uppercase tracking-wider text-ink border-b border-ink pb-1 mb-2">
                  Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {cv.skills.map((skill: any, idx: number) => (
                    <span key={idx} className="px-2 py-1 text-xs font-ui bg-gray-100 text-ink rounded-sm">
                      {skill.name}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Projects */}
            {cv.projects?.length > 0 && (
              <section>
                <h2 className="text-sm font-display font-bold uppercase tracking-wider text-ink border-b border-ink pb-1 mb-2">
                  Projects
                </h2>
                {cv.projects.map((proj: any, idx: number) => (
                  <div key={idx} className="mb-3">
                    <h3 className="text-sm font-display font-semibold text-ink">{proj.name}</h3>
                    {proj.tech?.length > 0 && (
                      <p className="text-xs text-muted mb-1">{proj.tech.join(' • ')}</p>
                    )}
                    <p className="text-xs font-body text-ink">{proj.description}</p>
                  </div>
                ))}
              </section>
            )}
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-muted font-body mb-4">
            Create your own ATS-optimized CV
          </p>
          <Link href="/">
            <Button variant="secondary">Build Your CV</Button>
          </Link>
        </div>
      </div>
    </main>
  )
}