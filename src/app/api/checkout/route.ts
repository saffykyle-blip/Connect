import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const email = searchParams.get('email');
  const referralCode = searchParams.get('referralCode') || "";

  if (!email) {
    return NextResponse.redirect(`${origin}/?error=missing_email`);
  }

  const PAYSTACK_SECRET_KEY = "sk_test_c521c50c9ab2b643dfc88d3ebea1795cdd46a231";
  if (!PAYSTACK_SECRET_KEY) {
    return NextResponse.json({ error: "Missing Paystack Secret Key" }, { status: 500 });
  }

  try {
    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        amount: 5000, // ZAR 50.00 in cents
        plan: "PLN_99pa84mf8310iyy",
        currency: "ZAR",
        callback_url: `${origin}/api/verify`,
        metadata: {
          referral_code: referralCode,
          custom_fields: [
            {
              display_name: "Referral Code",
              variable_name: "referral_code",
              value: referralCode || "None"
            }
          ]
        }
      }),
    });

    const data = await response.json();

    if (data.status && data.data?.authorization_url) {
      return NextResponse.redirect(data.data.authorization_url);
    } else {
      console.error("Paystack Init Error:", data);
      return NextResponse.json({ error: "Failed to initialize payment", details: data }, { status: 500 });
    }
  } catch (error) {
    console.error("Paystack Request Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
