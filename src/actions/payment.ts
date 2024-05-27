"use server"
import { PaymentResponse } from "@/types";
import axios from "axios";
import { randomUUID } from "crypto";

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

export const payment = async ({
    notification_url,
    description,
    email,
    typeIdentification,
    numberIdentification,
    transaction_amount,
    reference
}: PaymentType) => {
    
    const codigo = randomUUID();
    
    const client = new MercadoPagoConfig(
        { 
            accessToken: process.env.ACCESS_TOKEN!, 
            options: { timeout: 5000, idempotencyKey: codigo } 
        }
    );

    const payment = new Payment(client);

    const body = {
        description: description,
        notification_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/socket/notification`,
        payer: {
          email: email,
        },
        payment_method_id: "pix",
        transaction_amount: transaction_amount
    };
    
    const requestOptions = {
        idempotencyKey: codigo,
    };

    const response = await payment.create({ body, requestOptions });

    // const response2 = await payment.create({
    //     body: {
    //       additional_info: {
    //         items: [
    //           {
    //             id: 'MLB2907679857',
    //             title: 'Point Mini',
    //             description: 'Point product for card payments via Bluetooth.',
    //             picture_url: 'https://http2.mlstatic.com/resources/frontend/statics/growth-sellers-landings/device-mlb-point-i_medium2x.png',
    //             category_id: 'electronics',
    //             quantity: 1,
    //             unit_price: 58.8,
    //           }
    //         ],
    //         payer: {
    //           first_name: 'Test',
    //           last_name: 'Test',
    //           phone: {
    //             area_code: '11',
    //             number: '987654321',
    //           },
    //           address: {
    //             street_number: undefined,
    //             street_name: undefined,
    //             zip_code: ""
    //           }
    //         },
    //         shipments: {
    //           receiver_address: {
    //             zip_code: '12312-123',
    //             state_name: 'Rio de Janeiro',
    //             city_name: 'Buzios',
    //             street_name: 'Av das Nacoes Unidas',
    //             street_number: 3003
    //           },
    //         }
    //       },
    //       notification_url: "",
    //       date_of_expiration: "",
    //       application_fee: undefined,
    //       binary_mode: false,
    //       campaign_id: undefined,
    //       capture: false,
    //       coupon_amount: undefined,
    //       description: 'Payment for product',
    //       differential_pricing_id: undefined,
    //       external_reference: 'MP0001',
    //       installments: 1,
    //       metadata: null,
    //       payer: {
    //         id: '123',
    //         first_name: '',
    //         last_name: '',
    //         entity_type: 'individual',
    //         type: 'customer',
    //         email: 'test_user_123@testuser.com',
    //         identification: {
    //           type: 'CPF',
    //           number: '95749019047'
    //         },
    //         phone: {
    //             area_code: '43',
    //             extension: '',
    //             number: ''
    //         },
    //       },
    //       payment_method_id: 'master',
    //       token: 'ff8080814c11e237014c1ff593b57b4d',
    //       transaction_amount: 58.8
    //     },
    //     requestOptions: { idempotencyKey: '<SOME_UNIQUE_VALUE>' }
    // });

    if (!response.id) {
        return response
    }
    
    // console.log(response)

    return {
        id: response.id,
        date_approved: response.date_approved,
        date_created: response.date_created,
        date_last_updated: response.date_last_updated,
        date_of_expiration: response.date_of_expiration,
        description: response.description,
        status: response.status,
        status_detail: response.status_detail,
        transaction_amount: response.transaction_amount,
        point_of_interaction: {
            transaction_data: {
                bank_info: {
                    collector: {
                        account_id: response.point_of_interaction?.transaction_data?.bank_info?.collector?.account_id,
                        long_name: response.point_of_interaction?.transaction_data?.bank_info?.collector?.long_name,
                    }
                },
                bank_transfer_id: response.point_of_interaction?.transaction_data?.bank_transfer_id,
                qr_code: response.point_of_interaction?.transaction_data?.qr_code,
                ticket_url: response.point_of_interaction?.transaction_data?.ticket_url,
                qr_code_base64: response.point_of_interaction?.transaction_data?.qr_code_base64,
                transaction_id: response.point_of_interaction?.transaction_data?.transaction_id
            }
        }
    }
}

export const getPayment = async (id: string) => {
    try {
        const codigo = randomUUID();
        
        const client = new MercadoPagoConfig(
            { 
                accessToken: process.env.ACCESS_TOKEN!, 
                options: { timeout: 5000, idempotencyKey: codigo } 
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

export const getStatusPayment = async (id: number) => {
    try {
        const codigo = randomUUID();
        
        const client = new MercadoPagoConfig(
            { 
                accessToken: process.env.ACCESS_TOKEN!, 
                options: { timeout: 5000, idempotencyKey: codigo } 
            }
        );

        const payment = new Payment(client);

        const response = await payment.get({id})

        if (!response.id) {
            return null
        }
        // console.log(response)
        return {
            id: response.id,
            status: response.status,
        }
    } catch(error) {
        console.log(error)
        return null
    }
    
}

















export const payment1 = async ({
    notification_url,
    description,
    email,
    typeIdentification,
    numberIdentification,
    transaction_amount,
    reference
}: PaymentType) => {
    const data = JSON.stringify({
        "description": description,
        "external_reference": reference,
        "notification_url": notification_url,
        "payer": {
          "email": email,
          "identification": {
            "type": typeIdentification,
            "number": numberIdentification
          }
        },
        "payment_method_id": "pix",
        "transaction_amount": transaction_amount
    });
    
    const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://api.mercadopago.com/v1/payments',
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
            'Content-Type': 'application/json', 
            'X-Idempotency-Key': randomUUID(), 
            'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`
        },
        data : data
    };
    
    const response = await axios.request(config)

    if (response.status !== 200 && response.status !== 201) {
        return response
    }

    if (!response.data.id) {
        return response
    }
    
    // console.log(response.data)

    return {
        id: response.data.id,
        date_approved: response.data.date_approved,
        date_created: response.data.date_created,
        date_last_updated: response.data.date_last_updated,
        date_of_expiration: response.data.date_of_expiration,
        description: response.data.description,
        status: response.data.status,
        status_detail: response.data.status_detail,
        transaction_amount: response.data.transaction_amount,
        point_of_interaction: {
            transaction_data: {
                bank_info: {
                    collector: {
                        account_holder_name: response.data.point_of_interaction.transaction_data.bank_info.collector.account_holder_name,
                        account_id: response.data.point_of_interaction.transaction_data.bank_info.collector.account_id,
                        long_name: response.data.point_of_interaction.transaction_data.bank_info.collector.long_name,
                        transfer_account_id: response.data.point_of_interaction.transaction_data.bank_info.collector.transfer_account_id
                    }
                },
                bank_transfer_id: response.data.point_of_interaction.transaction_data.bank_transfer_id,
                qr_code: response.data.point_of_interaction.transaction_data.qr_code,
                qr_code_base64: response.data.point_of_interaction.transaction_data.qr_code_base64,
                ticket_url: response.data.point_of_interaction.transaction_data.ticket_url,
                transaction_id: response.data.point_of_interaction.transaction_data.transaction_id
            }
        }
    }
}


export const payment2 = async ({
    notification_url,
    description,
    email,
    typeIdentification,
    numberIdentification,
    transaction_amount,
    reference
}: PaymentType) => {
    
    const codigo = randomUUID();
    
    const client = new MercadoPagoConfig(
        { 
            accessToken: process.env.ACCESS_TOKEN!, 
            options: { timeout: 5000, idempotencyKey: codigo } 
        }
    );

    const payment = new Payment(client);

    const body = {
        description: description,
        notification_url: notification_url,
        payer: {
          email: email,
        },
        payment_method_id: "pix",
        transaction_amount: transaction_amount
    };
    
    const requestOptions = {
        idempotencyKey: codigo,
    };

    const response = await payment.create({ body, requestOptions });

    if (!response.id) {
        return response
    }
    
    // console.log(response)

    return {
        id: response.id,
        date_approved: response.date_approved,
        date_created: response.date_created,
        date_last_updated: response.date_last_updated,
        date_of_expiration: response.date_of_expiration,
        description: response.description,
        status: response.status,
        status_detail: response.status_detail,
        transaction_amount: response.transaction_amount,
        point_of_interaction: {
            transaction_data: {
                bank_info: {
                    collector: {
                        account_id: response.point_of_interaction?.transaction_data?.bank_info?.collector?.account_id,
                        long_name: response.point_of_interaction?.transaction_data?.bank_info?.collector?.long_name,
                    }
                },
                bank_transfer_id: response.point_of_interaction?.transaction_data?.bank_transfer_id,
                qr_code: response.point_of_interaction?.transaction_data?.qr_code,
                ticket_url: response.point_of_interaction?.transaction_data?.ticket_url,
                qr_code_base64: response.point_of_interaction?.transaction_data?.qr_code_base64,
                transaction_id: response.point_of_interaction?.transaction_data?.transaction_id
            }
        }
    }
}