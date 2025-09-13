import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit
    const suspicious = searchParams.get('suspicious') === 'true'
    const currency = searchParams.get('currency')

    let whereClause: any = {}
    if (suspicious) {
      whereClause.isSuspicious = true
    }
    if (currency) {
      whereClause.currency = currency
    }

    const [transactions, total] = await Promise.all([
      db.transaction.findMany({
        where: whereClause,
        include: {
          fromWallet: {
            select: {
              id: true,
              address: true,
              type: true,
              balance: true,
              entity: {
                select: {
                  id: true,
                  alias: true,
                  username: true
                }
              }
            }
          },
          toWallet: {
            select: {
              id: true,
              address: true,
              type: true,
              balance: true,
              entity: {
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
        orderBy: { timestamp: 'desc' }
      }),
      db.transaction.count({ where: whereClause })
    ])

    return NextResponse.json({
      transactions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching transactions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { hash, amount, currency, fromWalletId, toWalletId, isSuspicious } = body

    if (!hash || !amount || !currency || !fromWalletId || !toWalletId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const transaction = await db.transaction.create({
      data: {
        hash,
        amount: parseFloat(amount),
        currency,
        fromWalletId,
        toWalletId,
        isSuspicious: isSuspicious || false
      },
      include: {
        fromWallet: {
          include: {
            entity: true
          }
        },
        toWallet: {
          include: {
            entity: true
          }
        }
      }
    })

    return NextResponse.json(transaction, { status: 201 })
  } catch (error) {
    console.error('Error creating transaction:', error)
    return NextResponse.json(
      { error: 'Failed to create transaction' },
      { status: 500 }
    )
  }
}