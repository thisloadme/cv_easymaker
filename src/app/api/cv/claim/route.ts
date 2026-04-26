import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()

    // Create CV with user's ID
    const cv = await prisma.cV.create({
      data: {
        userId: session.user.id,
        targetRole: body.targetRole,
        personal: body.personal,
        summary: body.summary,
        experience: body.experience,
        education: body.education,
        skills: body.skills,
        projects: body.projects,
        status: 'completed',
      },
    })

    return NextResponse.json(cv, { status: 201 })
  } catch (error) {
    console.error('Claim CV error:', error)
    return NextResponse.json({ error: 'Failed to save CV' }, { status: 500 })
  }
}
