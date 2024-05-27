import { getPayment } from "@/actions/payment";
import { redirect } from "next/navigation";
import StatusClient from "./_components/status-client";

interface StatusPageProps {
    params: {
        paymentId: string;
    }
}

const StatusPage = async ({
    params,
}: StatusPageProps) => {
    const payment = await getPayment(params.paymentId);

    if (!payment?.id) {
        redirect(`/`)
    }
    
    if (payment.status === "pending") {
        redirect(`/payment/${payment.id}`)
    }

    return (
        <StatusClient
            id={payment.id}
            date_approved={payment.date_approved}
            date_of_expiration={payment.date_of_expiration}
            status={payment.status}
        />
    );
}
 
export default StatusPage;