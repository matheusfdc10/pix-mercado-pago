import { Server as NetServer, Socket } from "net"
import { NextApiResponse } from "next";
import { Server as SocketIOServer } from "socket.io";

export type NextApiResponseServerIo = NextApiResponse & {
    socket: Socket & {
        server: NetServer & {
            io: SocketIOServer;
        }
    }
}

export type Items = {
    id: string;
    title: string;
    description?: string;
    picture_url?: string;
    category_id?: string;
    quantity: number;
    unit_price: number;
}[]

// PAGADOR
export type Payer = {
    first_name?: string;
    last_name?: string;
    email?: string;
    identification?: {
        type?: 'CPF' | 'CNPJ';
        number?: string;
    };
    phone?: {
        area_code?: string;
        extension?: string;
        number?: string;
    };
    address?: {
        street_number?: number;
        street_name?: string;
        zip_code?: string;
    }
}

export type Shipments = {
    receiver_address?: {
        apartment?: string;
        city_name?: string;
        floor?: string;
        state_name?: string;
    }
}

export type AdditionalInfo = {
    items?: Items,
    payer?: Payer,
    shipments?: Shipments,
}

export type PayerRequest = {
    id?: string;
    first_name?: string;
    last_name?: string;
    entity_type?: 'individual' | 'association';
    type?: 'customer' | 'guest';
    email?: string;
    identification?: {
        type?: 'CPF' | 'CNPJ';
        number?: string;
    },
    phone?: {
        area_code?: string;
        extension?: string;
        number?: string;
    }
}

export type PaymentRequest = {
    body: {
        additional_info?: AdditionalInfo,
        application_fee?: string;
        binary_mode?: boolean;
        campaign_id?: string;
        capture?: boolean;
        coupon_amount?: number;
        description?: string;
        differential_pricing_id?: number;
        external_reference?: string;
        installments?: number;
        metadata?: any;
        payer?: PayerRequest,
        payment_method_id?: string;
        token?: string;
        transaction_amount?: number;
        date_of_expiration?: string;
        notification_url?: string;
    },
    requestOptions?: {
        idempotencyKey?: string;
    }
}




export type PaymentResponse = {
    id?: number;
    date_created?: string;
    date_approved?: string;
    date_last_updated?: string;
    money_release_date?: string;
    issuer_id?: string;
    payment_method_id?: string;
    payment_type_id?: string;
    status?: string; //  approved | pending | cancelled
    status_detail?: string;
    currency_id?: string;
    description?: string;
    taxes_amount?: number;
    shipping_amount?: number;
    collector_id?: number;
    payer?: {
        id?: string;
        email?: string;
        first_name?: string;
        last_name?: string;
        identification?: {
            type?: string;
            number?: string;
        }
        type?: string;
    }
    additional_info?: AdditionalInfo;
    metadata?: any;
    notification_url?: string;
    external_reference?: string;
    transaction_amount?: number;
    point_of_interaction?: {
        type?: string;
        transaction_data?: {
            qr_code_base64?: string;
            qr_code?: string;
            ticket_url?: string
        }
    }
}