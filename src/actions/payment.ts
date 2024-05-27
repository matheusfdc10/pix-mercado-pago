"use server"

// import { randomUUID } from "crypto";

import { MercadoPagoConfig, Payment } from 'mercadopago';

type PaymentType = {
    notification_url: string;
    description: string;
    email: string
    typeIdentification: string;
    numberIdentification: number;
    transaction_amount: number;
    reference: string;
}

export const getPayment = async (id: string | number) => {
    try {
        // const codigo = randomUUID();
        
        const client = new MercadoPagoConfig(
            { 
                accessToken: process.env.ACCESS_TOKEN!, 
                options: { 
                    timeout: 5000, 
                    // idempotencyKey: codigo 
                } 
            }
        );

        const payment = new Payment(client);

        const response = await payment.get({id})
        
        if (!response.id) {
            return null
        }

        return response
    } catch(error) {
        console.log(error)
        return null
    }
    
}

export const getStatusPayment = async (id: number | string) => {
    try {
        // const codigo = randomUUID();
        
        const client = new MercadoPagoConfig(
            { 
                accessToken: process.env.ACCESS_TOKEN!, 
                options: { 
                    timeout: 5000, 
                    // idempotencyKey: codigo 
                } 
            }
        );

        const payment = new Payment(client);

        const response = await payment.get({id})

        if (!response.id) {
            return null
        }

        return {
            id: response.id,
            status: response.status,
        }
    } catch(error) {
        console.log(error)
        return null
    }
    
}