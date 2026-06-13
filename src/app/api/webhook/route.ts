import { NextResponse } from "next/server";
import crypto from "crypto";

/**
 * Paystack Webhook Handler
 *
 * Set up in Paystack Dashboard → Settings → API Keys & Webhooks:
 *   Webhook URL: https://your-domain.com/api/webhook
 *
 * Events handled:
 *   - subscription.disable  → subscription has lapsed / cancelled
 *   - subscription.create   → new subscription created
 *   - charge.success        → payment succeeded (renewal or new)
 *   - invoice.payment_failed → payment failed, Paystack will retry
 */

export async function POST(request: Request) {
  const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY ?? "sk_test_c521c50c9ab2b643dfc88d3ebea1795cdd46a231";

  // 1. Validate Paystack HMAC-SHA512 signature
  const signature = request.headers.get("x-paystack-signature");
  const rawBody = await request.text();

  if (PAYSTACK_SECRET_KEY && signature) {
    const expectedSignature = crypto
      .createHmac("sha512", PAYSTACK_SECRET_KEY)
      .update(rawBody)
      .digest("hex");

    if (signature !== expectedSignature) {
      console.error("[Webhook] Invalid signature — request rejected");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  }

  let event: { event: string; data: Record<string, unknown> };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { event: eventType, data } = event;
  const customerCode = (data?.customer as Record<string, string>)?.customer_code ?? "unknown";
  const subscriptionCode = (data as Record<string, string>)?.subscription_code ?? "";

  console.log(`[Webhook] Event: ${eventType} | Customer: ${customerCode} | Sub: ${subscriptionCode}`);

  switch (eventType) {
    case "subscription.create":
      // A new subscriber has just signed up — subscription is active
      console.log(`[Webhook] New subscription created for ${customerCode}`);
      // TODO: Could trigger a welcome email or onboarding notification here
      break;

    case "charge.success":
      // Monthly renewal payment succeeded — subscription remains active
      console.log(`[Webhook] Renewal payment succeeded for ${customerCode}`);
      // The /card page re-checks Paystack live on each tap, so no action needed here.
      // This is a good place to send a "Payment received" email confirmation.
      break;

    case "invoice.payment_failed":
      // Payment failed — Paystack will retry automatically (usually 3 attempts).
      // The customer's subscription is still technically active during retries.
      // Paystack also emails the customer automatically to update their card.
      console.warn(`[Webhook] Payment FAILED for ${customerCode} — Paystack will retry`);
      // TODO: Could send a custom "Update your payment method" email
      break;

    case "subscription.disable":
      // All retries exhausted — subscription is now cancelled/inactive.
      // The /card page will now show "Profile Unavailable" on next tap.
      console.warn(`[Webhook] Subscription DISABLED for ${customerCode} (${subscriptionCode})`);
      // TODO: Could send a "Your Connect card has been suspended" email
      // TODO: Could log to a database for admin visibility
      break;

    case "subscription.enable":
      // Customer reactivated their subscription (e.g. after updating payment details)
      console.log(`[Webhook] Subscription RE-ENABLED for ${customerCode}`);
      // TODO: Could send a "Welcome back" email
      break;

    default:
      // Log unhandled events for future reference
      console.log(`[Webhook] Unhandled event type: ${eventType}`);
  }

  // Always return 200 to Paystack so it doesn't retry
  return NextResponse.json({ received: true }, { status: 200 });
}
