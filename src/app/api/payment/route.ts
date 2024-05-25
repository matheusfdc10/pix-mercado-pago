import { NextResponse } from "next/server";

import { randomUUID } from "crypto";

import { MercadoPagoConfig, Payment } from 'mercadopago';
import { PaymentRequest } from "@/types";

export async function POST(request: Request) {
    const body = await request.json();

    const {
        first_name,
        email,
        transaction_amount,
        description
    } = body

    if (!email) {
        return new NextResponse("Email is required", { status: 400 })
    }
    
    if (!transaction_amount) {
        return new NextResponse("Value is required", { status: 400 })
    }

    const codigo = randomUUID();

    const client = new MercadoPagoConfig(
        { 
            accessToken: process.env.ACCESS_TOKEN!, 
            options: { timeout: 5000, idempotencyKey: codigo } 
        }
    );

    const payment = new Payment(client);

    const paymentData: PaymentRequest = {
        body: {
            notification_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/socket/notification`,
            additional_info: {
                payer: {
                    first_name: first_name,
                }
            },
            payer: {
                email: email
            },
            description: description,
            payment_method_id: "pix",
            transaction_amount: transaction_amount
        },
        requestOptions: {
            idempotencyKey: codigo
        }
    };

    const response = await payment.create(paymentData);

    return NextResponse.json(response, { status: 200 })
}

