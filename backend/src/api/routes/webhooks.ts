import { Router } from 'express';
import Stripe from 'stripe';
import { db } from '../../db';
import { usersTable } from '../../db/schema';
import { eq } from 'drizzle-orm';
import "dotenv/config";

export const webhookRouter = Router();

// Initialize internal Stripe Network natively securing key access
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-06-20' as any,
});

// CRITICAL SECURITY NODE:
// This execution bypasses `express.json()` globally yielding raw byte buffers mapped to Stripe cryptography math.
webhookRouter.post('/stripe', async (req: any, res: any) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    // Cryptographically verify the payload mapping native Node logic avoiding spoof exploits
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret as string);
  } catch (err: any) {
    console.error(`[Stripe Firewall Array] Signature tracking dropped explicitly:`, err.message);
    return res.status(400).send(`Webhook execution invalidated critically: ${err.message}`);
  }

  // Synchronously parse native Webhook routing structures
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.client_reference_id;

    if (userId) {
      console.log(`[Stripe Success Map] Transaction validated flawlessly! Elevating User ${userId} schemas...`);
      try {
         // Drizzle Native Upgrades
         await db.update(usersTable)
          .set({ subscriptionTier: 'premium' })
          .where(eq(usersTable.id, parseInt(userId, 10)));
      } catch (dbError) {
         console.error(`[Stripe Transaction Error] Drizzle hook decoupled tracking:`, dbError);
      }
    }
  }

  // Returning valid 200 checks ensuring Stripe's retry handlers abort cleanly
  res.status(200).json({ received: true });
});
