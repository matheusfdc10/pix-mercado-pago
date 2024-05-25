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

    if (payment.status === "approved") {
        redirect(`/payment/${payment.id}/success`)
    }

    return (
        <main className="min-h-full flex flex-col justify-center items-center space-y-4 bg-slate-100 py-10 px-4">
            <PaymentClient
                status={payment.status}
                transaction_amount={payment.transaction_amount}
                description={payment.description}
                name_payment={payment.additional_info?.payer?.first_name}
                qr_code={payment.point_of_interaction?.transaction_data?.qr_code}
                qr_code_base64={payment.point_of_interaction?.transaction_data?.qr_code_base64}
                ticket_url={payment.point_of_interaction?.transaction_data?.ticket_url}
                date_created={payment.date_created}
                date_of_expiratio={payment.date_of_expiration}
            />
        </main>
    );
}


export default PaymentPage;