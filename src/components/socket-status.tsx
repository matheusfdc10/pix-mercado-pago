"use client"

import { cn } from "@/lib/utils";
import { socket } from "@/socket-client";
import { useEffect, useState } from "react";


const SocketStatus = () => {
    const [status, setStatus] = useState(false);

    useEffect(() => {    
        socket.on("connect", () => {
            setStatus(true)
            console.log('connect')
        });

        socket.on("disconnect", () => {
            setStatus(false)
            console.log('disconnect')
        });

        return () => {
            socket.off('connect');
            socket.off('disconnect');
        };
    }, [])

    return (
        <div className={cn(
            "fixed right-1 top-1 px-3 py-0.5 rounded-full shadow-md",
            status ? "bg-green-500" : "bg-red-500"
        )}>
            <span className="text-xs font-bold text-white">
                Socket {status ? "Online" : "Offline"}
            </span>
        </div>
    );
}
 
export default SocketStatus;