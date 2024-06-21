import { getPayment } from "@/actions/payment";
import { NextResponse } from "next/server";

interface IParams {
    paymentId?: string;
}

export async function GET(request: Request, { params }: {params: IParams}) {

    const paymentId = params.paymentId;

    if (!paymentId) {
        return NextResponse.error();
    }

    const response = await getPayment(paymentId as string)

    if (!response?.status) {
        return NextResponse.error();
    }

    return NextResponse.json({
        status: response.status
    })
}