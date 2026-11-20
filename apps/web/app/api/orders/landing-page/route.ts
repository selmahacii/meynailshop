import { NextResponse } from 'next/server';

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

    const wilayaName = body.shippingAddress?.wilayaName || body.wilayaName || body.wilaya || 'Alger';
    const commune = (body.shippingAddress?.commune || body.commune || 'البلدية المركزية').trim();
    const fullAddress = body.shippingAddress?.fullAddress || body.address || `${wilayaName} — ${commune}`;
    const rawDeliveryType = body.shippingAddress?.deliveryType || body.deliveryType || 'home';
    const deliveryType: 'home' | 'office' = (rawDeliveryType === 'desk' || rawDeliveryType === 'office') ? 'office' : 'home';
    const landingPageTitle = body.landingPageTitle || body.title || 'باك متكامل للأظافر';
    const landingPageSlug = body.landingPageSlug || body.slug || 'pack-onglerie';
    const variantName = body.items?.[0]?.variantName || body.variantName || null;
    const price = Number(body.productPrice || body.items?.[0]?.price || body.price || 6500);
    const image = body.items?.[0]?.image || body.image || '';

    const backendPayload = {
      deliveryType,
      paymentMethod: 'cash_on_delivery',
      source: 'landing_page',
      notes: `[Commande Landing Page: /lp/${landingPageSlug}] - ${landingPageTitle}${variantName ? ` (${variantName})` : ''}`,
      shippingAddress: {
        fullName: customerName,
        phone: customerPhone,
        wilaya: wilayaName,
        commune: commune,
        address: fullAddress,
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

    return NextResponse.json({
      success: true,
      statusCode: 201,
      data: backendData?.data || backendData,
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
