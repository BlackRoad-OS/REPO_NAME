import { NextRequest, NextResponse } from 'next/server'
import { createCheckoutSession } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  try {
    const { customerId, priceId, successUrl, cancelUrl } = await req.json()

    if (!customerId || !priceId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const session = await createCheckoutSession({
      customerId,
      priceId,
      successUrl: successUrl || `${req.nextUrl.origin}/success`,
      cancelUrl: cancelUrl || `${req.nextUrl.origin}/pricing`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error('Checkout session error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
