import React from 'react'
import { NextResponse } from 'next/server'
import { renderToBuffer } from '@react-pdf/renderer'
import { prisma } from '@/lib/prisma'
import { CVPDFDocument } from '@/lib/export/pdf'
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

    // Parse stored JSON strings to objects
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

    const pdfBuffer = await renderToBuffer(<CVPDFDocument cv={parsedCV} />)

    // Update last exported
    await prisma.cV.update({
      where: { id: cv.id },
      data: { lastExportedAt: new Date(), exportFormat: 'pdf' },
    })

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${parsedCV.personal.name}_CV_${parsedCV.targetRole}.pdf"`,
      },
    })
  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json({ error: 'Failed to export PDF' }, { status: 500 })
  }
}