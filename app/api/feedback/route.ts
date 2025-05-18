import { NextResponse } from 'next/server'
import { z } from 'zod'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const feedbackSchema = z.object({
  appId: z.string(),
  pageUrl: z.string().url(),
  rating: z.number().min(1).max(5),
  comment: z.string().max(1500).optional(),
  email: z.string().email().optional(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = feedbackSchema.parse(body)

    const feedback = await prisma.feedback.create({
      data: {
        appId: validatedData.appId,
        pageUrl: validatedData.pageUrl,
        rating: validatedData.rating,
        comment: validatedData.comment,
        userEmail: validatedData.email,
      },
    })

    return NextResponse.json(feedback, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating feedback:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 