import { NextResponse } from 'next/server';
import crypto from 'crypto';

const META_PIXEL_ID = process.env.META_PIXEL_ID || '1702992101434180';
const META_CAPI_TOKEN =
  process.env.META_CAPI_TOKEN ||
  'EAAVVVuwAbZA0BTAWhd4ycZCnGEB2ZANylxZA8QyZBUx4vx8ReIv7QDmoAiRK8PTmY4xuaoZCWiuYYf5NYuRZA50lD4lNzQeJ2a4h2ZBX0vbJdX71fk8hQff82T4REE7ZAB6gtjtFZB3HWoZAVZBU39ukQk2MV8M3hc4HSy10KmzU6zVLi43e8IfSzuvwNpJWoa4dTfyLNgZDZD';

function sha256(val: string): string {
  if (!val) return '';
  return crypto.createHash('sha256').update(val.trim().toLowerCase()).digest('hex');
}

function normalizeDzPhone(rawPhone: string): string {
  let cleaned = rawPhone.replace(/\D/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '213' + cleaned.substring(1);
  } else if (!cleaned.startsWith('213')) {
    cleaned = '213' + cleaned;
  }
  return cleaned;
}

async function sendMetaCapiPurchase(params: {
  orderNumber: string;
  totalAmount: number;
  landingPageTitle: string;
  landingPageSlug: string;
  customerName: string;
  customerPhone: string;
  wilayaName: string;
  commune: string;
  clientIp?: string | null;
  userAgent?: string | null;
}) {
  try {
    const nameParts = params.customerName.trim().split(/\s+/);
    const firstName = nameParts[0] || 'Selma';
    const lastName = nameParts.slice(1).join(' ') || firstName;
    const normalizedPhone = normalizeDzPhone(params.customerPhone);

    const payload = {
      data: [
        {
          event_name: 'Purchase',
          event_time: Math.floor(Date.now() / 1000),
          action_source: 'website',
          event_source_url: `https://www.meeynailshop.com/lp/${params.landingPageSlug}`,
          event_id: params.orderNumber,
          user_data: {
            ph: [sha256(normalizedPhone)],
            fn: [sha256(firstName)],
            ln: [sha256(lastName)],
            ct: [sha256(params.commune)],
            st: [sha256(params.wilayaName)],
            country: [sha256('dz')],
            client_ip_address: params.clientIp || undefined,
            client_user_agent: params.userAgent || undefined,
          },
          custom_data: {
            currency: 'DZD',
            value: params.totalAmount,
            content_name: params.landingPageTitle,
            order_id: params.orderNumber,
          },
        },
      ],
    };

    const res = await fetch(
      `https://graph.facebook.com/v19.0/${META_PIXEL_ID}/events?access_token=${META_CAPI_TOKEN}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );

    const resJson = await res.json();
    console.log('[Meta CAPI] Server-side event Purchase sent:', resJson);
  } catch (err) {
    console.warn('[Meta CAPI] Failed to dispatch server-side event:', err);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const customerName = (body.customerName || body.name || 'Selma').trim();
    const customerPhone = (body.customerPhone || body.phone || '').trim().replace(/\s+/g, '');

    if (!customerPhone) {
      return NextResponse.json(
        { success: false, message: 'Le numéro de téléphone est obligatoire' },
        { status: 400 }
      );
    }

    const clientIp =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      '';
    const userAgent = request.headers.get('user-agent') || '';

    const wilayaName = body.shippingAddress?.wilayaName || body.wilayaName || body.wilaya || 'Alger';
    const commune = (body.shippingAddress?.commune || body.commune || 'البلدية المركزية').trim();
    const fullAddress = body.shippingAddress?.fullAddress || body.address || `${wilayaName} — ${commune}`;
    const rawDeliveryType = body.shippingAddress?.deliveryType || body.deliveryType || 'home';
    const deliveryType: 'home' | 'office' =
      rawDeliveryType === 'desk' || rawDeliveryType === 'office' ? 'office' : 'home';
    const landingPageTitle = body.landingPageTitle || body.title || 'باك متكامل للأظافر';
    const landingPageSlug = body.landingPageSlug || body.slug || 'pack-onglerie';
    const variantName = body.items?.[0]?.variantName || body.variantName || null;
    const price = Number(body.productPrice || body.items?.[0]?.price || body.price || 6500);
    const shippingCost = Number(body.shippingCost !== undefined ? body.shippingCost : 500);
    const image = body.items?.[0]?.image || body.image || '';

    const nameParts = customerName.split(/\s+/);
    const firstName = nameParts[0] || 'Selma';
    const lastName = nameParts.slice(1).join(' ') || '';

    const backendPayload = {
      deliveryType,
      paymentMethod: 'cash_on_delivery',
      source: 'instagram',
      shippingCost,
      notes: `[Commande Landing Page: /lp/${landingPageSlug}] - ${landingPageTitle}${variantName ? ` (${variantName})` : ''}`,
      shippingAddress: {
        fullName: customerName,
        firstName: firstName,
        lastName: lastName,
        phone: customerPhone,
        wilaya: wilayaName,
        wilayaName: wilayaName,
        commune: commune,
        address: fullAddress,
        fullAddress: fullAddress,
        deliveryType,
      },
      items: [
        {
          productName: `${landingPageTitle}${variantName ? ` (${variantName})` : ''}`,
          productImage: image,
          unitPrice: price,
          quantity: 1,
          variantSku: `LP-${landingPageSlug.toUpperCase()}`,
        },
      ],
    };

    const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
    const defaultBackend = isProduction ? 'https://meeynailshop-api.onrender.com' : 'http://localhost:3001';
    const apiUrl = (process.env.NEXT_PUBLIC_API_URL || defaultBackend)
      .replace(/\/api\/?$/, '')
      .replace(/\/$/, '');

    // Send order to NestJS backend
    const backendRes = await fetch(`${apiUrl}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(backendPayload),
    });

    const backendData = await backendRes.json();

    if (!backendRes.ok) {
      console.error('[API Landing Page Order] Backend error:', backendData);
      return NextResponse.json(
        {
          success: false,
          message: backendData?.message || 'Erreur lors de la création de la commande',
        },
        { status: backendRes.status }
      );
    }

    const orderData = backendData?.data || backendData;
    const orderNumber = orderData?.orderNumber || `MEEY-${Math.floor(100000 + Math.random() * 900000)}`;
    const totalOrderAmount = Number(orderData?.total || body.totalAmount || price);

    // Déclenchement serveur Meta Conversions API (CAPI) non-bloquant
    sendMetaCapiPurchase({
      orderNumber,
      totalAmount: totalOrderAmount,
      landingPageTitle,
      landingPageSlug,
      customerName,
      customerPhone,
      wilayaName,
      commune,
      clientIp,
      userAgent,
    }).catch((e) => console.warn('[Meta CAPI Async Error]:', e));

    return NextResponse.json({
      success: true,
      statusCode: 201,
      data: orderData,
      message: 'Commande enregistrée avec succès',
    });
  } catch (error: any) {
    console.error('[API Landing Page Order] Internal error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error?.message || 'Erreur interne lors de la création de la commande',
      },
      { status: 500 }
    );
  }
}
