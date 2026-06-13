import { NextResponse } from 'next/server';

/**
 * Avatar upload proxy → Cloudinary unsigned upload
 *
 * Uses Cloudinary's free unsigned upload preset — no token/secret needed
 * on the client side. The server proxies the file to Cloudinary and returns
 * the permanent public URL back to the APK.
 *
 * CORS headers are required because the APK loads index.html from
 * file:///android_asset/ which makes this a cross-origin request.
 * Without them the browser preflight (OPTIONS) fails silently.
 */

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME ?? 'connect-cards';
const UPLOAD_PRESET = process.env.CLOUDINARY_UPLOAD_PRESET ?? 'connect_avatars';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400',
};

// Handle CORS preflight — browsers send OPTIONS before the actual POST
export async function OPTIONS(): Promise<NextResponse> {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const contentType = request.headers.get('content-type') || 'image/jpeg';
    const buffer = await request.arrayBuffer();

    if (buffer.byteLength === 0) {
      return NextResponse.json({ error: 'Empty file' }, { status: 400, headers: corsHeaders });
    }

    if (buffer.byteLength > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 413, headers: corsHeaders });
    }

    // Convert to base64 data URI for Cloudinary unsigned upload
    const base64 = Buffer.from(buffer).toString('base64');
    const dataUri = `data:${contentType};base64,${base64}`;

    const formData = new FormData();
    formData.append('file', dataUri);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('folder', 'connect-avatars');

    const cloudRes = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      { method: 'POST', body: formData }
    );

    if (!cloudRes.ok) {
      const err = await cloudRes.text();
      console.error('[Upload] Cloudinary error:', err);
      return NextResponse.json({ error: 'Upload service error', detail: err }, { status: 502, headers: corsHeaders });
    }

    const data = await cloudRes.json();

    // Return in the same shape the APK expects: { url: "https://..." }
    return NextResponse.json({ url: data.secure_url }, { headers: corsHeaders });

  } catch (error) {
    console.error('[Upload] Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers: corsHeaders });
  }
}
