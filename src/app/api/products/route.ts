import { NextResponse } from 'next/server';
import stripe from '@/utils/stripe';
import { Product } from '@/types/Product';

export async function GET() {
  try {
    const products = await stripe.products.list();
    const prices = await stripe.prices.list();

  
    const result: Product[] = products.data.map((product) => {
      const productPrices = prices.data.filter(price => price.product === product.id);
      const priceInfo = productPrices.length > 0 ? productPrices[0] : null;

      return {
        id: product.id,
        name: product.name,
        description: product.description ?? '',
        price: priceInfo && priceInfo.unit_amount !== null 
          ? `$${(priceInfo.unit_amount / 100).toFixed(2)} ${priceInfo.recurring ? `/${priceInfo.recurring.interval}` : ''}`
          : 'N/A',
        image: product.images.length > 0 ? product.images[0] : '/default.png',
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching products from Stripe:', error);
    return NextResponse.json({ error: "An unknown error occurred." }, { status: 500 });
  }
}
