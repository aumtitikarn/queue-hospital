import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all queue tickets
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const departmentId = searchParams.get('departmentId')
    const status = searchParams.get('status')

    const where: any = {}
    if (departmentId) where.departmentId = departmentId
    if (status) where.status = status

    const queues = await prisma.queueTicket.findMany({
      where,
      include: {
        department: true,
      },
      orderBy: [
        { createdAt: 'desc' },
      ],
    })

    return NextResponse.json(queues)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch queues' },
      { status: 500 }
    )
  }
}

// POST create new queue ticket
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { patientName, phoneNumber, departmentId } = body

    if (!patientName || !departmentId) {
      return NextResponse.json(
        { error: 'Patient name and department ID are required' },
        { status: 400 }
      )
    }

    // Get the latest queue number for this department
    const latestQueue = await prisma.queueTicket.findFirst({
      where: {
        departmentId,
        status: { in: ['waiting', 'serving'] },
      },
      orderBy: { queueNumber: 'desc' },
    })

    const nextQueueNumber = latestQueue ? latestQueue.queueNumber + 1 : 1

    const queueTicket = await prisma.queueTicket.create({
      data: {
        patientName,
        phoneNumber: phoneNumber || null,
        departmentId,
        queueNumber: nextQueueNumber,
        status: 'waiting',
      },
      include: {
        department: true,
      },
    })

    return NextResponse.json(queueTicket, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create queue ticket' },
      { status: 500 }
    )
  }
}

