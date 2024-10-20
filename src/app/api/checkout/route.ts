import { NextRequest, NextResponse } from 'next/server';
import stripe from '@/utils/stripe';



export async function POST(req: NextRequest) {
  try {
    const { productId, price } = await req.json();
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Product ${productId}`,
            },
            unit_amount: price,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/PaySuccess`,
      cancel_url: `${req.headers.get('origin')}/PayFailed`,
    });

    return NextResponse.json({ id: session.id });
  } catch (error) {
    console.error("Error creating Stripe session:", error);
    return NextResponse.json({ error: "An unknown error occurred." }, { status: 500 });
  }
}
