import { getPayment } from "@/actions/payment";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const body = request.body
    const url = request.url
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('data.id')

    console.log("BODY:", body)
    console.log("URL:", url)
    console.log("ID:", id)

    if (id) {
        const response = await getPayment(id)
        // console.log("STATUS:", response.status)
    }

    return new NextResponse("teste", { status: 200 })
}






















export async function GET(request: NextApiRequest, response: NextApiResponse) {
    if(response.socket) {
        response.socket.emit("connection", "TESTE")
        response.status(200).json({ message: "True"})
    }


    return new NextResponse("ola", { status: 200 })
}