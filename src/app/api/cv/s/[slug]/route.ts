import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { ParsedCV } from '@/types'

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const cv = await prisma.cV.findUnique({
      where: { shareSlug: params.slug },
    })

    if (!cv) {
      return NextResponse.json({ error: 'CV not found' }, { status: 404 })
    }

    // Return CV data for public view (no auth required)
    const parsedCV: ParsedCV = {
      id: cv.id,
      userId: cv.userId,
      targetRole: cv.targetRole,
      status: cv.status as ParsedCV['status'],
      personal: JSON.parse(cv.personal),
      summary: cv.summary,
      experience: JSON.parse(cv.experience),
      education: JSON.parse(cv.education),
      skills: JSON.parse(cv.skills),
      projects: JSON.parse(cv.projects),
      atsScore: cv.atsScore,
      atsKeywords: JSON.parse(cv.atsKeywords),
      atsMissingKeywords: JSON.parse(cv.atsMissingKeywords),
      lastExportedAt: cv.lastExportedAt,
      exportFormat: cv.exportFormat,
      shareSlug: cv.shareSlug,
      createdAt: cv.createdAt,
      updatedAt: cv.updatedAt,
    }

    return NextResponse.json(parsedCV)
  } catch (error) {
    console.error('Share CV error:', error)
    return NextResponse.json({ error: 'Failed to fetch CV' }, { status: 500 })
  }
}