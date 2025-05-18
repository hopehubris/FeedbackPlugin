import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const settingsSchema = z.object({
  widgetPosition: z.enum(['bottom-right', 'bottom-left', 'top-right', 'top-left']),
  widgetColor: z.string(),
  autoShowWidget: z.boolean(),
  autoShowDelay: z.number().min(5).max(300),
  enableEmailNotifications: z.boolean(),
  notificationEmail: z.string().email().optional(),
  enableAnalytics: z.boolean(),
  retentionPeriod: z.number().min(30).max(365),
  maxFeedbackLength: z.number().min(100).max(5000),
})

export async function GET() {
  try {
    const settings = await prisma.settings.findFirst()
    
    if (!settings) {
      // Return default settings if none exist
      return NextResponse.json({
        widgetPosition: 'bottom-right',
        widgetColor: '#4A5568',
        autoShowWidget: false,
        autoShowDelay: 30,
        enableEmailNotifications: false,
        notificationEmail: '',
        enableAnalytics: true,
        retentionPeriod: 90,
        maxFeedbackLength: 1000,
      })
    }
    
    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const validatedData = settingsSchema.parse(body)
    
    const settings = await prisma.settings.upsert({
      where: {
        id: '1', // We'll use a single settings record
      },
      update: validatedData,
      create: {
        id: '1',
        ...validatedData,
      },
    })
    
    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error updating settings:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid settings data' },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 