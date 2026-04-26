import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { calculateATSScore } from '@/lib/ats/analyzer'
import { nanoid } from 'nanoid'
import type { ParsedCV } from '@/types'

const createCVSchema = z.object({
  targetRole: z.string().min(1),
  personal: z.string(), // JSON string
  summary: z.string(),
  experience: z.string(), // JSON string array
  education: z.string(),
  skills: z.string(),
  projects: z.string(),
})

export async function GET(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const cvs = await prisma.cV.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: 'desc' },
  })

  return NextResponse.json(cvs)
}

export async function POST(req: Request) {
  const session = await auth()

  try {
    const body = await req.json()
    const parsed = createCVSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }

    // Build ParsedCV for ATS scoring
    const parsedCVForATS: ParsedCV = {
      id: '',
      userId: session?.user?.id || null,
      targetRole: parsed.data.targetRole,
      status: 'draft',
      personal: JSON.parse(parsed.data.personal),
      summary: parsed.data.summary,
      experience: JSON.parse(parsed.data.experience),
      education: JSON.parse(parsed.data.education),
      skills: JSON.parse(parsed.data.skills),
      projects: JSON.parse(parsed.data.projects),
      atsScore: 0,
      atsKeywords: [],
      atsMissingKeywords: [],
      lastExportedAt: null,
      exportFormat: null,
      shareSlug: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const atsAnalysis = calculateATSScore(parsedCVForATS)

    const cv = await prisma.cV.create({
      data: {
        userId: session?.user?.id || null,
        targetRole: parsed.data.targetRole,
        personal: parsed.data.personal,
        summary: parsed.data.summary,
        experience: parsed.data.experience,
        education: parsed.data.education,
        skills: parsed.data.skills,
        projects: parsed.data.projects,
        status: 'draft',
        atsScore: atsAnalysis.totalScore,
        atsKeywords: JSON.stringify(atsAnalysis.breakdown),
        atsMissingKeywords: JSON.stringify(atsAnalysis.missingKeywords),
        shareSlug: nanoid(10),
        version: 1,
        isLatest: true,
      },
    })

    return NextResponse.json(cv, { status: 201 })
  } catch (error) {
    console.error('Create CV error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}