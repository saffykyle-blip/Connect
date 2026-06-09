import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const reference = searchParams.get('reference');

  if (!reference) {
    return NextResponse.redirect(`${origin}/?error=missing_reference`);
  }

  const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
  if (!PAYSTACK_SECRET_KEY) {
    return NextResponse.json({ error: "Missing Paystack Secret Key" }, { status: 500 });
  }

  try {
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      },
    });

    const data = await response.json();

    if (data.status && data.data?.status === "success") {
      // Payment verified!
      const res = NextResponse.redirect(`${origin}/builder`);
      // Set long-lived secure cookie
      res.cookies.set({
        name: 'connect_access',
        value: 'true',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 365 * 10, // 10 years
      });
      return res;
    } else {
      return NextResponse.redirect(`${origin}/?error=payment_failed`);
    }
  } catch (error) {
    return NextResponse.redirect(`${origin}/?error=verification_error`);
  }
}
