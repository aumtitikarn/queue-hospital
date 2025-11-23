import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all departments
export async function GET() {
  try {
    const departments = await prisma.department.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(departments)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch departments' },
      { status: 500 }
    )
  }
}

// POST create new department
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description } = body

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    const department = await prisma.department.create({
      data: {
        name,
        description: description || null,
      },
    })

    return NextResponse.json(department, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create department' },
      { status: 500 }
    )
  }
}

