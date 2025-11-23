import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET single queue ticket
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const queueTicket = await prisma.queueTicket.findUnique({
      where: { id },
      include: {
        department: true,
      },
    })

    if (!queueTicket) {
      return NextResponse.json(
        { error: 'Queue ticket not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(queueTicket)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch queue ticket' },
      { status: 500 }
    )
  }
}

// PUT update queue ticket status
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { status } = body

    if (!status || !['waiting', 'serving', 'completed', 'cancelled'].includes(status)) {
      return NextResponse.json(
        { error: 'Valid status is required' },
        { status: 400 }
      )
    }

    const queueTicket = await prisma.queueTicket.update({
      where: { id },
      data: { status },
      include: {
        department: true,
      },
    })

    return NextResponse.json(queueTicket)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update queue ticket' },
      { status: 500 }
    )
  }
}

