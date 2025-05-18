import { NextResponse } from 'next/server'
import { z } from 'zod'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const appSchema = z.object({
  name: z.string().min(1).max(100),
  domain: z.string().min(1).max(255),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = appSchema.parse(body)

    const app = await prisma.app.create({
      data: {
        name: validatedData.name,
        domain: validatedData.domain,
      },
    })

    return NextResponse.json(app, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating app:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 