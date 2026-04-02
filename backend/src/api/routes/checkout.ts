import { Router } from "express";
import Stripe from "stripe";
import { requireAuth } from "../../middleware/auth";
import "dotenv/config";

export const checkoutRouter = Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-06-20' as any,
});

// Plan definitions — amount is in cents for Stripe
const PLANS = {
  basic: { amount: 500,  name: "ImagineXplainer Basic", description: "10 video credits / month" },
  pro:   { amount: 1000, name: "ImagineXplainer Pro",   description: "30 video credits / month" },
};

checkoutRouter.post("/session", requireAuth, async (req: any, res: any) => {
  try {
    const userId = req.user.id;
    const planId = req.body.planId as "basic" | "pro" ?? "basic";
    const plan = PLANS[planId] ?? PLANS.basic;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{
        price_data: {
          currency: "usd",
          product_data: { name: plan.name, description: plan.description },
          unit_amount: plan.amount,
        },
        quantity: 1,
      }],
      mode: "payment",
      client_reference_id: String(userId),
      // Pass plan metadata so the webhook can determine which plan was purchased
      metadata: { planId },
      success_url: `${process.env.FRONTEND_URL || "http://localhost:5173"}/?payment=success`,
      cancel_url:  `${process.env.FRONTEND_URL || "http://localhost:5173"}/?payment=cancelled`,
    });

    res.status(200).json({ checkoutUrl: session.url });
  } catch (err: any) {
    console.error("[Stripe Checkout]", err);
    res.status(500).json({ error: "Failed to create checkout session." });
  }
});
