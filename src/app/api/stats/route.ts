import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { NextRequest } from 'next/server'


export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = user.id

    // Get request body
    const { focusTime } = await request.json()
    
    if (typeof focusTime !== 'number' || focusTime < 0) {
      return NextResponse.json({ error: 'Invalid focusTime value' }, { status: 400 })
    }

    // Get current date (UTC midnight)
    const today = new Date()
    today.setUTCHours(0, 0, 0, 0)

    // Update or create stats for today
    const stats = await prisma.stats.upsert({
      where: {
        userId_date: {
          userId,
          date: today
        }
      },
      update: {
        focusTime: {
          increment: focusTime
        },
        updatedAt: new Date()
      },
      create: {
        userId,
        date: today,
        focusTime,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Detailed error saving stats:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
    
    if (error instanceof Error) {
      if (error.message.includes("Can't reach database server")) {
        return NextResponse.json(
          { error: "Database connection error. Please try again later." },
          { status: 503 }
        )
      }
      return NextResponse.json(
        { error: `Database error: ${error.message}` },
        { status: 500 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to save stats' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get authenticated user
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = user.id
    
    // Get date from query params or use today
    const url = new URL(request.url)
    const dateParam = url.searchParams.get('date')
    
    let date
    if (dateParam) {
      date = new Date(dateParam)
      date.setUTCHours(0, 0, 0, 0)
    } else {
      date = new Date()
      date.setUTCHours(0, 0, 0, 0)
    }

    // Get stats for the specified date
    const stats = await prisma.stats.findUnique({
      where: {
        userId_date: {
          userId,
          date
        }
      }
    })

    return NextResponse.json(stats || { userId, date, focusTime: 0 })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
