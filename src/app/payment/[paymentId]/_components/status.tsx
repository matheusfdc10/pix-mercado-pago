"use client"

import { useSocket } from "@/hooks/use-socket";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

interface StatusProps {
    statusPayment?: string;
    paymentId?: number;
}

const Status = ({
    paymentId,
    statusPayment
}: StatusProps) => {
    const [status, setStatus] = useState<string>();

    const { data } = useSocket<string>({
        key: `teste:${paymentId}`,
        action: (data: string) => setStatus(data)
    })

    useEffect(() => {
        setStatus(statusPayment);
    }, [])


    // useEffect(() => {
    //     // if (!socket) {
    //     //   return
    //     // }

    //     const socket = new (io as any)(process.env.NEXT_PUBLIC_SITE_URL!, {
    //         path: "/api/socket/io",
    //         addTrailingSlash: false
    //     });

    //     // console.log(socket)
    
    //     socket.on("connect", () => {
    //       console.log("Connected to server");
    //     });
    
    //     socket.on(`teste:${paymentId}`, (status: string) => {
    //       setStatus(status)
    //       console.log("Status:", status)
    //     })
    
    //     return () => {
    //       socket.off(`teste:${paymentId}`);
    //       socket.off("connect");
    //     }
    // }, [paymentId])

    return (
        <div>
            <h1>{status}</h1>
        </div>
    );
}
 
export default Status;