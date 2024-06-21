import { NextApiRequest } from "next";
import { NextApiResponseServerIo } from "@/types";
import { getPayment } from "@/actions/payment";
import { connectWebSocket } from "@/socket-server";
import io from 'socket.io-client';

const url = 'https://websocket-server-kqkl.onrender.com';


const notificationHandler = async (req: NextApiRequest, res: NextApiResponseServerIo) => {
    if (req.method === "POST") {
        const query = req.body;
        const id = req.query["data.id"]

        if (id) {
            try {
                const response = await getPayment(id as string)
                
                if (response) {
                    // const socket = connectWebSocket()
                    const paymentId = id
                    const status = response.status

                    const socket = io(url, {
                        transports: ["websocket"],
                        // autoConnect: false,
                    });

                    socket.on('connect', () => {
                        console.log('Connected to WebSocket server');
                        socket.emit('updatePaymentStatus', { paymentId, status });
                        res.status(200).json({ message: response.status });
                        socket.disconnect();
                    })

                    socket.on('connect_error', (error) => {
                        console.error('Connection error:', error);
                        res.status(500).json({ message: 'Failed to connect to WebSocket server' });
                      });

                    // socket.emit('updatePaymentStatus', { paymentId, status })
                    // res.status(200).json({ message: response.status });
                } else {
                    res.status(500).json({ message: "Payment null" });
                }
            } catch(error) {
                res.status(405).json({ message: "Method not allowed" });
            }
        } else {
            res.status(405).json({ message: "Method not allowed" });
        }



        // if (id) {
        //     try {
        //         const response = await getPayment(id as string)
        //         console.log("STATUS:", response?.status)

        //         if (res.socket.server.io) {
        //             res.socket.server.io.emit(`teste:${id}`, response?.status);
        //             res.status(200).json({ message: response?.status });
        //         } else {
        //             res.status(500).json({ message: "Socket.io server not initialized" });
        //         }
        //     } catch(error) {
        //         res.status(405).json({ message: "Method not allowed" });
        //     }
        // } else {
        //     res.status(405).json({ message: "Method not allowed" });
        // }
    }
};

export default notificationHandler;
