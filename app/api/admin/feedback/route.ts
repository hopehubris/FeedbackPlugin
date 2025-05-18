import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const feedbackQuerySchema = z.object({
  rating: z.string().optional(),
  app: z.string().optional(),
  search: z.string().optional(),
  dateRange: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
})

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = Object.fromEntries(searchParams.entries())
    
    const validatedQuery = feedbackQuerySchema.parse(query)
    
    const where: any = {}
    
    // Apply rating filter
    if (validatedQuery.rating) {
      where.rating = {
        gte: parseInt(validatedQuery.rating),
      }
    }
    
    // Apply app filter
    if (validatedQuery.app) {
      where.appId = validatedQuery.app
    }
    
    // Apply search filter
    if (validatedQuery.search) {
      where.OR = [
        { comment: { contains: validatedQuery.search, mode: 'insensitive' } },
        { pageUrl: { contains: validatedQuery.search, mode: 'insensitive' } },
        { userEmail: { contains: validatedQuery.search, mode: 'insensitive' } },
      ]
    }
    
    // Apply date range filter
    if (validatedQuery.dateRange && validatedQuery.dateRange !== 'all') {
      const now = new Date()
      let startDate = new Date()
      
      switch (validatedQuery.dateRange) {
        case '7d':
          startDate.setDate(now.getDate() - 7)
          break
        case '30d':
          startDate.setDate(now.getDate() - 30)
          break
        case '90d':
          startDate.setDate(now.getDate() - 90)
          break
      }
      
      where.createdAt = {
        gte: startDate,
      }
    }
    
    // Apply sorting
    const orderBy: any = {}
    if (validatedQuery.sortBy) {
      orderBy[validatedQuery.sortBy] = validatedQuery.sortOrder || 'desc'
    } else {
      orderBy.createdAt = 'desc'
    }
    
    const feedback = await prisma.feedback.findMany({
      where,
      orderBy,
      include: {
        app: {
          select: {
            name: true,
          },
        },
        responses: {
          select: {
            id: true,
            content: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    })
    
    return NextResponse.json(feedback)
  } catch (error) {
    console.error('Error fetching feedback:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid query parameters' },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 