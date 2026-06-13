import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { origin } = new URL(request.url);

  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY ?? "sk_test_c521c50c9ab2b643dfc88d3ebea1795cdd46a231";
    if (!PAYSTACK_SECRET_KEY) {
      return NextResponse.json({ error: "Payment gateway not configured" }, { status: 500 });
    }

    // 1. Get customer by email
    const customerRes = await fetch(`https://api.paystack.co/customer/${encodeURIComponent(email)}`, {
      headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` },
    });

    const customerData = await customerRes.json();
    if (!customerData.status || !customerData.data?.customer_code) {
      return NextResponse.json({ error: "No account found for this email" }, { status: 404 });
    }

    const customerCode = customerData.data.customer_code;

    // 2. Check for active subscription
    const subRes = await fetch(`https://api.paystack.co/subscription?customer=${customerCode}&status=active`, {
      headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` },
    });

    const subData = await subRes.json();
    if (!subData.status || subData.meta?.total === 0) {
      return NextResponse.json({ error: "No active subscription found. Please subscribe." }, { status: 403 });
    }

    // 3. Grant access — return customer code so the client can redirect to /install
    const res = NextResponse.json({ success: true, customerCode });

    res.cookies.set({
      name: 'connect_access',
      value: 'true',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 365 * 10,
    });

    res.cookies.set({
      name: 'connect_customer',
      value: customerCode,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 365 * 10,
    });

    return res;
  } catch (error) {
    return NextResponse.json({ error: "Server error during restore" }, { status: 500 });
  }
}
