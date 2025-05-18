import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const analyticsQuerySchema = z.object({
  timeRange: z.string().optional(),
})

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = Object.fromEntries(searchParams.entries())
    
    const validatedQuery = analyticsQuerySchema.parse(query)
    
    const now = new Date()
    let startDate = new Date()
    
    if (validatedQuery.timeRange && validatedQuery.timeRange !== 'all') {
      switch (validatedQuery.timeRange) {
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
    }
    
    // Get total feedback count
    const totalFeedback = await prisma.feedback.count({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
    })
    
    // Get average rating
    const averageRating = await prisma.feedback.aggregate({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
      _avg: {
        rating: true,
      },
    })
    
    // Get response rate
    const totalResponses = await prisma.response.count({
      where: {
        feedback: {
          createdAt: {
            gte: startDate,
          },
        },
      },
    })
    
    const responseRate = totalFeedback > 0
      ? Math.round((totalResponses / totalFeedback) * 100)
      : 0
    
    // Get rating distribution
    const ratingDistribution = await prisma.feedback.groupBy({
      by: ['rating'],
      where: {
        createdAt: {
          gte: startDate,
        },
      },
      _count: {
        rating: true,
      },
      orderBy: {
        rating: 'asc',
      },
    })
    
    // Get feedback trend
    const feedbackTrend = await prisma.feedback.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: {
          gte: startDate,
        },
      },
      _count: {
        id: true,
      },
      _avg: {
        rating: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    })
    
    // Get top pages
    const topPages = await prisma.feedback.groupBy({
      by: ['pageUrl'],
      where: {
        createdAt: {
          gte: startDate,
        },
      },
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: 10,
    })
    
    return NextResponse.json({
      totalFeedback,
      averageRating: averageRating._avg.rating || 0,
      responseRate,
      ratingDistribution: ratingDistribution.map((item) => ({
        rating: item.rating,
        count: item._count.rating,
      })),
      feedbackTrend: feedbackTrend.map((item) => ({
        date: item.createdAt.toISOString().split('T')[0],
        count: item._count.id,
        averageRating: item._avg.rating || 0,
      })),
      topPages: topPages.map((item) => ({
        pageUrl: item.pageUrl,
        count: item._count.id,
      })),
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
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