import { loadStripe, Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null> | null = null;

const getStripe = () => {
  const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  if (!stripeKey) {
    throw new Error("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY must be defined in the environment variables.");
  }

  if (!stripePromise) {
    stripePromise = loadStripe(stripeKey);
  }

  return stripePromise;
};

export default getStripe;

