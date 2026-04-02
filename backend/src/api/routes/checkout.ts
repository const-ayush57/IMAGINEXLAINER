import { Router } from 'express';
import Stripe from 'stripe';
import { requireAuth } from '../../middleware/auth';
import "dotenv/config";

export const checkoutRouter = Router();

// Configure strictly scoped Stripe configurations
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-06-20' as any,
});

// Exposed natively authenticated checkout tunnel payload maps
checkoutRouter.post('/session', requireAuth, async (req: any, res: any) => {
  try {
    const userId = req.user.id;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'ImagineXplainer Premium Node Sequence',
              description: 'Unlock maximum slide generation lengths securely mapping onto priority GPU executions.',
            },
            unit_amount: 500, // Explicitly $5.00 executed structurally mapping cents mathematically
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      // Critically hook our internal Postgres references securely mapping explicitly back tracking native IDs
      client_reference_id: String(userId),
      success_url: 'http://localhost:5173/?payment=success',
      cancel_url: 'http://localhost:5173/?payment=cancelled',
    });

    res.status(200).json({ checkoutUrl: session.url });
  } catch (err: any) {
    console.error(`[Stripe Flow] Checkout generation sequence blocked actively:`, err);
    res.status(500).json({ error: 'Failed to build cryptographic session dynamically mappings.' });
  }
});
