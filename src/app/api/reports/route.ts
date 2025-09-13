import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit
    const format = searchParams.get('format')

    let whereClause: any = {}
    if (format) {
      whereClause.format = format
    }

    const [reports, total] = await Promise.all([
      db.forensicReport.findMany({
        where: whereClause,
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      db.forensicReport.count({ where: whereClause })
    ])

    return NextResponse.json({
      reports,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching reports:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reports' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, format } = body

    if (!title || !description || !format) {
      return NextResponse.json(
        { error: 'Title, description, and format are required' },
        { status: 400 }
      )
    }

    // Generate report content based on current data
    const entities = await db.entity.findMany({
      include: {
        posts: true,
        wallets: true
      }
    })

    const transactions = await db.transaction.findMany({
      include: {
        fromWallet: true,
        toWallet: true
      }
    })

    const reportContent = {
      generatedAt: new Date().toISOString(),
      title,
      description,
      summary: {
        totalEntities: entities.length,
        maliciousEntities: entities.filter(e => e.isMalicious).length,
        totalTransactions: transactions.length,
        suspiciousTransactions: transactions.filter(t => t.isSuspicious).length
      },
      entities: entities.map(entity => ({
        id: entity.id,
        alias: entity.alias,
        username: entity.username,
        email: entity.email,
        riskLevel: entity.riskLevel,
        isMalicious: entity.isMalicious,
        postCount: entity.posts.length,
        walletCount: entity.wallets.length
      })),
      transactions: transactions.map(transaction => ({
        id: transaction.id,
        hash: transaction.hash,
        amount: transaction.amount,
        currency: transaction.currency,
        isSuspicious: transaction.isSuspicious,
        timestamp: transaction.timestamp,
        fromWallet: transaction.fromWallet.address,
        toWallet: transaction.toWallet.address
      }))
    }

    const report = await db.forensicReport.create({
      data: {
        title,
        description,
        content: JSON.stringify(reportContent),
        format
      }
    })

    return NextResponse.json(report, { status: 201 })
  } catch (error) {
    console.error('Error creating report:', error)
    return NextResponse.json(
      { error: 'Failed to create report' },
      { status: 500 }
    )
  }
}