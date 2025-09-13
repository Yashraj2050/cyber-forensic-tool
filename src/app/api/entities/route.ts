import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit

    let whereClause = {}
    if (search) {
      whereClause = {
        OR: [
          { alias: { contains: search, mode: 'insensitive' } },
          { username: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } }
        ]
      }
    }

    const [entities, total] = await Promise.all([
      db.entity.findMany({
        where: whereClause,
        include: {
          posts: {
            select: {
              id: true,
              title: true,
              forumName: true,
              timestamp: true
            }
          },
          wallets: {
            select: {
              id: true,
              address: true,
              type: true,
              balance: true
            }
          },
          links: {
            include: {
              toEntity: {
                select: {
                  id: true,
                  alias: true,
                  username: true
                }
              }
            }
          },
          linkedTo: {
            include: {
              fromEntity: {
                select: {
                  id: true,
                  alias: true,
                  username: true
                }
              }
            }
          }
        },
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      db.entity.count({ where: whereClause })
    ])

    return NextResponse.json({
      entities,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching entities:', error)
    return NextResponse.json(
      { error: 'Failed to fetch entities' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { alias, username, email, riskLevel, isMalicious } = body

    if (!alias) {
      return NextResponse.json(
        { error: 'Alias is required' },
        { status: 400 }
      )
    }

    const entity = await db.entity.create({
      data: {
        alias,
        username,
        email,
        riskLevel: riskLevel || 1,
        isMalicious: isMalicious || false
      },
      include: {
        posts: true,
        wallets: true,
        links: true,
        linkedTo: true
      }
    })

    return NextResponse.json(entity, { status: 201 })
  } catch (error) {
    console.error('Error creating entity:', error)
    return NextResponse.json(
      { error: 'Failed to create entity' },
      { status: 500 }
    )
  }
}