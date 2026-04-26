import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateDOCX } from '@/lib/export/docx'
import type { ParsedCV } from '@/types'

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cv = await prisma.cV.findUnique({ where: { id: params.id } })
    if (!cv) {
      return NextResponse.json({ error: 'CV not found' }, { status: 404 })
    }

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

    const docxBuffer = await generateDOCX(parsedCV)

    await prisma.cV.update({
      where: { id: cv.id },
      data: { lastExportedAt: new Date(), exportFormat: 'docx' },
    })

    return new NextResponse(new Uint8Array(docxBuffer), {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${parsedCV.personal?.name || 'CV'}_${parsedCV.targetRole}.docx"`,
      },
    })
  } catch (error) {
    console.error('DOCX export error:', error)
    return NextResponse.json({ error: 'Failed to export DOCX' }, { status: 500 })
  }
}
