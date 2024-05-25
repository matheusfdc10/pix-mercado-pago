"use client"

import { useSocket } from "@/hooks/use-socket";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface PaymentClientProps {
    id?: number;
    qr_code?: string;
    qr_code_base64?: string;
    ticket_url?: string;
    name_payment?: string;
    status?: string;
    description?: string;
    date_created?: string;
    date_of_expiratio?: string;
    transaction_amount?: number;
}

const PaymentClient = ({
    id,
    status,
    transaction_amount,
    description,
    name_payment,
    qr_code,
    qr_code_base64,
    ticket_url,
    date_created,
    date_of_expiratio
}: PaymentClientProps) => {
    // const [statuss, setStatuss] = useState<string>()

    const { data } = useSocket<string>({
        key: `teste:${id}`,
        // action: (data: string) => setStatuss(data)
    })

    const statusPayment = data || status;
    
    return (
        <div className="border shadow-sm max-w-[577px] w-full bg-white rounded-md">
            <div className="flex items-center justify-center my-4">
                <h1 className="font-bold text-4xl">
                    Pagamento PIX
                </h1>
            </div>
            <div className="border-t" />
            <div className="flex flex-col space-y-6 m-4">
                <span>
                    Pagador: {name_payment}
                </span>
                <span>
                    Pague R$ {transaction_amount} via Pix
                </span>
                <span>
                    Vencimento: {date_of_expiratio}
                </span>
                <span>
                    Para pagar, escolha uma destas opções:
                </span>
                <div className="space-y-2">
                    <span>
                        Código QR
                    </span>
                    <div className="flex items-center justify-center">
                        <Image 
                            src={`data:image/png;base64, ${qr_code_base64}`}
                            width={200}
                            height={200} 
                            alt="qrCode"
                            className="items-center"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <span>Código de pagamento</span>
                    <div className="overflow-hidden">
                        <span>
                            {qr_code}
                        </span>
                    </div>
                </div>
                <Link href={ticket_url!}>Link mercado Pago</Link>
                <span>
                    Descrição: {description}
                </span>
                <span>
                    {status}
                </span>
                <span>
                    Data status: {data}
                </span>
                <span>
                    statusPayment: {statusPayment}
                </span>
            </div>
        </div>
    );
}
 
export default PaymentClient;