import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET queue status - count remaining queues before this ticket
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Get the queue ticket
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

    // Count queues that are waiting and have lower queue number (before this ticket)
    const queuesBefore = await prisma.queueTicket.count({
      where: {
        departmentId: queueTicket.departmentId,
        status: { in: ['waiting', 'serving'] },
        queueNumber: { lt: queueTicket.queueNumber },
      },
    })

    // Get current serving queue number
    const currentServing = await prisma.queueTicket.findFirst({
      where: {
        departmentId: queueTicket.departmentId,
        status: 'serving',
      },
      orderBy: { queueNumber: 'asc' },
    })

    return NextResponse.json({
      queueTicket,
      queuesBefore,
      currentServing: currentServing?.queueNumber || null,
      estimatedWait: queuesBefore * 5, // Estimate 5 minutes per queue
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch queue status' },
      { status: 500 }
    )
  }
}

