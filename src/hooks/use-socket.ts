"use client"

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

type SocketProps = {
    key: string;
    action?: (data: any) => void;
};

type UseSocketReturn<T> = {
    data: T | null;
};

export const useSocket = <T,>({ key, action }: SocketProps): UseSocketReturn<T> => {
    const [data, setData] = useState<T | null>(null);

    useEffect(() => {
        const socket: Socket = io(process.env.NEXT_PUBLIC_SITE_URL!, {
            path: "/api/socket/io",
            addTrailingSlash: false,
        });

        socket.on("connect", () => {
            console.log("Connected to server");
        });

        socket.on(key, (data: T) => {
            setData(data);
            if (action) action(data);
        });

        socket.on("connect_error", (err) => {
            console.error("Connection error:", err);
        });

        return () => {
            socket.off(key);
            socket.off("connect");
            socket.off("connect_error");
            socket.disconnect();
        };
    }, [key]);

    return { data };
};