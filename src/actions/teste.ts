'use server'

import { NextApiResponseServerIo } from "@/types";
import { NextApiRequest } from "next";
import { getPayment } from "./payment";

const teste = async (req: NextApiRequest, res: NextApiResponseServerIo) => {
    res.socket?.server?.io?.emit(`teste:1`, 'TESTE');
    console.log(req.method)
    if (req.method === "POST") {
        const query = req.body;
        const id = req.query["data.id"]

        if (id) {
            try {
                const response = await getPayment(id as string)
                console.log("STATUS:", response?.status)

                if (res.socket.server.io) {
                    res.socket.server.io.emit(`teste:1`, response?.status);
                    res.status(200).json({ message: response?.status });
                } else {
                    res.status(500).json({ message: "Socket.io server not initialized" });
                }
            } catch(error) {
                res.status(405).json({ message: "Method not allowed" });
            }
        } else {
            res.status(405).json({ message: "Method not allowed" });
        }
    }
};

export default teste;
