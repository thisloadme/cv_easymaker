import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request, { params }: { params: { id: string } }) {
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

  return NextResponse.json(cv)
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()

    const cv = await prisma.cV.findFirst({
      where: { id: params.id, userId: session.user.id },
    })

    if (!cv) {
      return NextResponse.json({ error: 'CV not found' }, { status: 404 })
    }

    const updated = await prisma.cV.update({
      where: { id: params.id },
      data: body,
    })

    return NextResponse.json(updated)
  } catch (error) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
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

  await prisma.cV.delete({ where: { id: params.id } })

  return NextResponse.json({ success: true })
}