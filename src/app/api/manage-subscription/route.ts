import { NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS(): Promise<NextResponse> {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const customerCode = searchParams.get("customer");

  if (!customerCode || !customerCode.startsWith("CUS_")) {
    return NextResponse.json(
      { error: "A valid CUS_xxx customer code is required" },
      { status: 400, headers: corsHeaders },
    );
  }

  const paystackSecretKey =
    process.env.PAYSTACK_SECRET_KEY ??
    "sk_test_c521c50c9ab2b643dfc88d3ebea1795cdd46a231";

  try {
    const subRes = await fetch(
      `https://api.paystack.co/subscription?customer=${customerCode}&status=active`,
      { headers: { Authorization: `Bearer ${paystackSecretKey}` } },
    );
    const subData = await subRes.json();

    let subscriptionCode: string | null = null;

    if (subData.status && subData.data?.length) {
      subscriptionCode = subData.data[0].subscription_code;
    } else {
      const allRes = await fetch(
        `https://api.paystack.co/subscription?customer=${customerCode}`,
        { headers: { Authorization: `Bearer ${paystackSecretKey}` } },
      );
      const allData = await allRes.json();
      if (allData.status && allData.data?.length) {
        subscriptionCode = allData.data[0].subscription_code;
      }
    }

    if (!subscriptionCode) {
      return NextResponse.json(
        { error: "No subscription found for this account" },
        { status: 404, headers: corsHeaders },
      );
    }

    const linkRes = await fetch(
      `https://api.paystack.co/subscription/${subscriptionCode}/manage/link`,
      { headers: { Authorization: `Bearer ${paystackSecretKey}` } },
    );
    const linkData = await linkRes.json();

    if (!linkData.status || !linkData.data?.link) {
      console.error("[ManageSubscription] Link generation failed:", linkData);
      return NextResponse.json(
        { error: "Could not generate management link" },
        { status: 502, headers: corsHeaders },
      );
    }

    return NextResponse.json({ link: linkData.data.link }, { headers: corsHeaders });
  } catch (error) {
    console.error("[ManageSubscription] Error:", error);
    return NextResponse.json(
      { error: "Server error - please try again" },
      { status: 500, headers: corsHeaders },
    );
  }
}
