import { getPayment } from "@/actions/payment";
import { redirect } from "next/navigation";
import PaymentClient from "./_components/payment-client";

interface PaymentProps {
    params: {
        paymentId: string;
    }
}

const PaymentPage = async ({
    params
}: PaymentProps) => {
    const payment = await getPayment(params.paymentId)
    
    if (!payment?.id) {
        redirect(`/`)
    }

    if (payment.status !== "pending") {
        redirect(`/payment/${payment.id}/status`)
    }

    return (
        <PaymentClient
            id={payment.id}
            status={payment.status}
            transaction_amount={payment.transaction_amount}
            description={payment.description}
            name_payment={payment.additional_info?.payer?.first_name}
            qr_code={payment.point_of_interaction?.transaction_data?.qr_code}
            qr_code_base64={payment.point_of_interaction?.transaction_data?.qr_code_base64}
            ticket_url={payment.point_of_interaction?.transaction_data?.ticket_url}
            date_created={payment.date_created}
            date_of_expiration={payment.date_of_expiration}
        />
    );
}


export default PaymentPage;