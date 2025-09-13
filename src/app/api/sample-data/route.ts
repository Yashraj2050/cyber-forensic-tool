import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

const sampleEntities = [
  {
    alias: 'ShadowHunter',
    username: 'shadow_hunter',
    email: 'shadow@onionmail.com',
    riskLevel: 4,
    isMalicious: true
  },
  {
    alias: 'CryptoKing',
    username: 'crypto_king2024',
    email: 'king@crypto.onion',
    riskLevel: 5,
    isMalicious: true
  },
  {
    alias: 'DarkWebTrader',
    username: 'trader_dark',
    email: 'trader@darkweb.onion',
    riskLevel: 3,
    isMalicious: true
  },
  {
    alias: 'AnonymousUser',
    username: 'anon_user',
    riskLevel: 1,
    isMalicious: false
  },
  {
    alias: 'MarketplaceVendor',
    username: 'vendor123',
    email: 'vendor@market.onion',
    riskLevel: 4,
    isMalicious: true
  }
]

const samplePosts = [
  {
    title: 'Marketplace Discussion',
    content: 'Looking for reliable vendors in the marketplace. Need someone who can deliver quality products discreetly.',
    forumName: 'DarkNet Forum',
    onionUrl: 'http://forum3ion5k7y.onion',
    authorAlias: 'ShadowHunter'
  },
  {
    title: 'Investment Opportunities',
    content: 'High ROI investment opportunities available in cryptocurrency. Guaranteed returns of 200% within 30 days.',
    forumName: 'Crypto Forum',
    onionUrl: 'http://crypto4forum2x7.onion',
    authorAlias: 'CryptoKing'
  },
  {
    title: 'Trading Tips',
    content: 'Best practices for secure trading on darknet markets. Always use escrow and verify vendor reputation.',
    forumName: 'Trading Forum',
    onionUrl: 'http://trade7forum9x3.onion',
    authorAlias: 'DarkWebTrader'
  },
  {
    title: 'General Discussion',
    content: 'Just browsing the forums. Interested in learning about online security and privacy.',
    forumName: 'General Forum',
    onionUrl: 'http://general5forum8y2.onion',
    authorAlias: 'AnonymousUser'
  },
  {
    title: 'Product Listings',
    content: 'Premium products available at competitive prices. Fast shipping and discrete packaging guaranteed.',
    forumName: 'Marketplace',
    onionUrl: 'http://market2forum6x4.onion',
    authorAlias: 'MarketplaceVendor'
  }
]

const sampleWallets = [
  {
    address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
    type: 'BTC',
    balance: 2.5,
    entityAlias: 'ShadowHunter'
  },
  {
    address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    type: 'ETH',
    balance: 15.7,
    entityAlias: 'CryptoKing'
  },
  {
    address: '3FZbgi29cpjq2GjdwV8eyHuJJnkLtktZc5',
    type: 'BTC',
    balance: 8.3,
    entityAlias: 'DarkWebTrader'
  },
  {
    address: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B',
    type: 'ETH',
    balance: 32.1,
    entityAlias: 'MarketplaceVendor'
  },
  {
    address: '1FeexV6bAHb8ybZiQLN2M7Y9b5zH8nN7X7',
    type: 'BTC',
    balance: 45.2,
    entityAlias: 'CryptoKing'
  }
]

const sampleTransactions = [
  {
    hash: 'tx1_hash_example',
    amount: 1.2,
    currency: 'BTC',
    fromWalletAddress: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
    toWalletAddress: '3FZbgi29cpjq2GjdwV8eyHuJJnkLtktZc5',
    isSuspicious: false
  },
  {
    hash: 'tx2_hash_example',
    amount: 5.5,
    currency: 'ETH',
    fromWalletAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    toWalletAddress: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B',
    isSuspicious: true
  },
  {
    hash: 'tx3_hash_example',
    amount: 3.1,
    currency: 'BTC',
    fromWalletAddress: '3FZbgi29cpjq2GjdwV8eyHuJJnkLtktZc5',
    toWalletAddress: '1FeexV6bAHb8ybZiQLN2M7Y9b5zH8nN7X7',
    isSuspicious: false
  },
  {
    hash: 'tx4_hash_example',
    amount: 8.7,
    currency: 'ETH',
    fromWalletAddress: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B',
    toWalletAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    isSuspicious: true
  }
]

export async function POST(request: NextRequest) {
  try {
    // Clear existing data
    await db.entity.deleteMany()
    await db.post.deleteMany()
    await db.wallet.deleteMany()
    await db.transaction.deleteMany()
    await db.entityLink.deleteMany()
    await db.extractedEntity.deleteMany()

    // Create entities
    const createdEntities = await Promise.all(
      sampleEntities.map(entity => 
        db.entity.create({
          data: entity
        })
      )
    )

    // Create posts and associate with entities
    await Promise.all(
      samplePosts.map(post => {
        const entity = createdEntities.find(e => e.alias === post.authorAlias)
        if (entity) {
          return db.post.create({
            data: {
              ...post,
              authorId: entity.id
            }
          })
        }
      })
    )

    // Create wallets and associate with entities
    const createdWallets = await Promise.all(
      sampleWallets.map(wallet => {
        const entity = createdEntities.find(e => e.alias === wallet.entityAlias)
        return db.wallet.create({
          data: {
            address: wallet.address,
            type: wallet.type,
            balance: wallet.balance,
            entityId: entity?.id
          }
        })
      })
    )

    // Create transactions
    await Promise.all(
      sampleTransactions.map(transaction => {
        const fromWallet = createdWallets.find(w => w.address === transaction.fromWalletAddress)
        const toWallet = createdWallets.find(w => w.address === transaction.toWalletAddress)
        
        if (fromWallet && toWallet) {
          return db.transaction.create({
            data: {
              hash: transaction.hash,
              amount: transaction.amount,
              currency: transaction.currency,
              fromWalletId: fromWallet.id,
              toWalletId: toWallet.id,
              isSuspicious: transaction.isSuspicious
            }
          })
        }
      })
    )

    // Create some entity links
    const shadowHunter = createdEntities.find(e => e.alias === 'ShadowHunter')
    const cryptoKing = createdEntities.find(e => e.alias === 'CryptoKing')
    
    if (shadowHunter && cryptoKing) {
      await db.entityLink.create({
        data: {
          fromEntityId: shadowHunter.id,
          toEntityId: cryptoKing.id,
          linkType: 'similar_pattern',
          confidence: 0.87
        }
      })
    }

    return NextResponse.json({
      message: 'Sample data created successfully',
      entities: createdEntities.length,
      posts: samplePosts.length,
      wallets: createdWallets.length,
      transactions: sampleTransactions.length
    })
  } catch (error) {
    console.error('Error creating sample data:', error)
    return NextResponse.json(
      { error: 'Failed to create sample data' },
      { status: 500 }
    )
  }
}