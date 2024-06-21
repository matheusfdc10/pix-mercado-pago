"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { socket } from "@/socket-client";
import { useEffect, useState } from "react";


interface PageProps {
    params: {
        id: string;
    }
}

const Page = ({
    params: { id }
}: PageProps) => {
    // const [isConnected, setIsConnected] = useState(false);
    // const [transport, setTransport] = useState("N/A");
    // const [message, setmessage] = useState('');
    // const [messages, setmessages] = useState<string[]>([]);

    // const enviar = () => {
    //     socket.emit('messages', { id, message });
    //     setmessage('');
    // }

    // useEffect(() => {
    //     function onConnect() {
    //         setIsConnected(true);
    //         setTransport(socket.io.engine.transport.name);

    //         socket.emit('join', id);

    //         socket.io.engine.on("upgrade", (transport) => {
    //             setTransport(transport.name);
    //         });
    //     }

    //     function onDisconnect() {
    //         setIsConnected(false);
    //         setTransport("N/A");
    //     }

    //     if (socket.connected) {
    //         onConnect();
    //     }

    //     socket.on("connect", onConnect);

    //     socket.on('message', (newMessage) => {
    //         setmessages((prevMessages) => [...prevMessages, newMessage]);
    //     });

    //     socket.on("disconnect", onDisconnect);

    //     return () => {
    //         socket.off("message");
    //         socket.off("connect", onConnect);
    //         socket.off("disconnect", onDisconnect);
    //     };
    // }, [id]);


    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<string[]>([]);
    
    const sendMessage = () => {
        socket.emit('messages', { id, message });
        setMessage('');
    };

    useEffect(() => {
        socket.on("connect", () => {
            console.log('connect')
        });

        socket.emit('join', id);

        socket.on('message', (newMessage) => {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        });

        socket.on("disconnect", () => {
            console.log('disconnect')
        });

        return () => {
            socket.off('message');
            socket.off('disconnect')
        };
    }, [id]);

    return (
        <main>
            <div>
                {/* <p>Status: {isConnected ? "connected" : "disconnected"}</p>
                <p>Transport: {JSON.stringify(transport)}</p> */}
                <Input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <Button onClick={sendMessage}>
                    Click
                </Button>
            </div>
            <div className="flex flex-col-reverse">
                {messages.map((text, key) => (
                    <p key={key}>{text}</p>
                ))}
            </div>
        </main>
    )
}

export default Page;
