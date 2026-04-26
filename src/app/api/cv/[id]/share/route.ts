import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { nanoid } from 'nanoid'

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const cv = await prisma.cV.findFirst({
    where: { id: params.id, userId: session.user.id },
  })

  if (!cv) {
    return NextResponse.json({ error: 'CV not found' }, { status: 404 })
  }

  const newSlug = nanoid(10)

  await prisma.cV.update({
    where: { id: params.id },
    data: { shareSlug: newSlug },
  })

  return NextResponse.json({ shareSlug: newSlug })
}