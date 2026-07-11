import express from "express";
import Stripe from "stripe";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const priceMap: Record<string, string> = {
  starter: "price_xxx_starter",
  pro: "price_xxx_pro",
  enterprise: "price_xxx_enterprise",
};

router.post("/create-checkout-session", async (req, res) => {
  const { tierId } = req.body;
  const priceId = priceMap[tierId];
  if (!priceId) return res.status(400).json({ error: "Invalid tier" });

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.FRONTEND_URL}/billing/success`,
    cancel_url: `${process.env.FRONTEND_URL}/billing/cancel`,
  });

  res.json({ url: session.url });
});

export default router;
