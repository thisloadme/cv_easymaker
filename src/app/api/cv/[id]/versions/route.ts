import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Find the CV and its siblings (same original parent chain)
  const cv = await prisma.cV.findFirst({
    where: { id: params.id, userId: session.user.id },
  })

  if (!cv) {
    return NextResponse.json({ error: 'CV not found' }, { status: 404 })
  }

  // Find all versions - by parentId chain or by original CV
  const originalId = cv.parentId || cv.id

  const versions = await prisma.cV.findMany({
    where: {
      OR: [
        { id: originalId },
        { parentId: originalId },
      ],
      userId: session.user.id,
    },
    orderBy: { version: 'desc' },
    select: {
      id: true,
      version: true,
      createdAt: true,
      updatedAt: true,
      status: true,
      atsScore: true,
      targetRole: true,
    },
  })

  return NextResponse.json(versions)
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Get current CV
  const current = await prisma.cV.findFirst({
    where: { id: params.id, userId: session.user.id },
  })

  if (!current) {
    return NextResponse.json({ error: 'CV not found' }, { status: 404 })
  }

  // Mark current as not latest, create new version
  await prisma.$transaction([
    prisma.cV.update({
      where: { id: params.id },
      data: { isLatest: false },
    }),
    prisma.cV.create({
      data: {
        userId: current.userId,
        targetRole: current.targetRole,
        personal: current.personal,
        summary: current.summary,
        experience: current.experience,
        education: current.education,
        skills: current.skills,
        projects: current.projects,
        atsScore: current.atsScore,
        atsKeywords: current.atsKeywords,
        atsMissingKeywords: current.atsMissingKeywords,
        version: current.version + 1,
        parentId: current.parentId || current.id,
        isLatest: true,
        status: 'draft',
      },
    }),
  ])

  return NextResponse.json({ success: true, message: 'New version created' })
}