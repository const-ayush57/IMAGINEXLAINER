import { Router } from 'express';
import Stripe from 'stripe';
import { db } from '../../db';
import { usersTable } from '../../db/schema';
import { eq } from 'drizzle-orm';
import "dotenv/config";

export const webhookRouter = Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-06-20' as any,
});

// Credit allocation per plan
const PLAN_CREDITS: Record<string, { credits: number; tier: string }> = {
  basic: { credits: 10, tier: "basic" },
  pro:   { credits: 30, tier: "pro" },
};

// CRITICAL: This route bypasses express.json() — Stripe requires raw byte buffers for signature verification.
webhookRouter.post('/stripe', async (req: any, res: any) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret as string);
  } catch (err: any) {
    console.error('[Stripe Webhook] Signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.client_reference_id;
    const planId = session.metadata?.planId ?? "basic";
    const planConfig = PLAN_CREDITS[planId] ?? PLAN_CREDITS.basic;

    if (userId) {
      console.log(`[Stripe] Payment confirmed for user ${userId} — Plan: ${planId} (+${planConfig.credits} credits)`);
      try {
        // Fetch current credits to add on top (supports future re-purchases)
        const [user] = await db.select().from(usersTable).where(eq(usersTable.id, parseInt(userId, 10)));
        const newCredits = (user?.credits ?? 0) + planConfig.credits;

        await db.update(usersTable)
          .set({
            subscriptionTier: planConfig.tier,
            credits: newCredits,
            isOnboarded: true,
          })
          .where(eq(usersTable.id, parseInt(userId, 10)));

        console.log(`[Stripe] User ${userId} updated: tier=${planConfig.tier}, credits=${newCredits}`);
      } catch (dbError) {
        console.error('[Stripe Webhook] DB update failed:', dbError);
      }
    }
  }

  res.status(200).json({ received: true });
});
