import { NextResponse } from 'next/server'
import { z } from 'zod'
import { matchJobDescription } from '@/lib/ats/jobMatcher'
import type { ParsedCV } from '@/types'

const requestSchema = z.object({
  cv: z.object({
    personal: z.unknown(),
    summary: z.string(),
    experience: z.array(z.unknown()),
    skills: z.array(z.unknown()),
    projects: z.array(z.unknown()),
    targetRole: z.string(),
  }),
  jobDescription: z.string(),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = requestSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }

    const { cv, jobDescription } = parsed.data

    const parsedCV: ParsedCV = {
      id: 'temp',
      userId: null,
      targetRole: cv.targetRole,
      status: 'draft',
      personal: cv.personal as ParsedCV['personal'],
      summary: cv.summary,
      experience: cv.experience as ParsedCV['experience'],
      education: [],
      skills: cv.skills as ParsedCV['skills'],
      projects: cv.projects as ParsedCV['projects'],
      atsScore: 0,
      atsKeywords: [],
      atsMissingKeywords: [],
      lastExportedAt: null,
      exportFormat: null,
      shareSlug: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = matchJobDescription(parsedCV, jobDescription)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Job match error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}