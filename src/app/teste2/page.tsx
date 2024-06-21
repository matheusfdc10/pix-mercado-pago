"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { socket } from "@/socket-client";
import { useEffect, useState } from "react";

const Page = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");
  const [message, setmessage] = useState('');
  const [messages, setmessages] = useState([]);
  
  const enviar = () => {
    socket.emit("messages", 
      [
        ...messages,
        message
      ]
    );

    setmessage('')
  }

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      // socket.on('messages', (messages) => {
      //   console.log('2')
      //   console.log(messages)
      // })

      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }

    if (socket.connected) {
      onConnect();
    }

    socket.on("connect", () => {
      console.log("Connected to server");
    });

    console.log('1')
    socket.on('message', (messages) => {
      console.log('2')
      console.log('teste',messages)
      setmessages(messages)
    })

    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("messages")
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, [])

  return (
    <main >
      <div>
        <p>Status: { isConnected ? "connected" : "disconnected" }</p>
        <p>Transport: { JSON.stringify(transport) }</p>
        <Input 
          type="text"
          value={message}
          onChange={(e) => setmessage(e.target.value)}
        />
        <Button
          onClick={enviar}
        >
          Click
        </Button>
      </div>
      <div>
        {messages.map((text, key) => (
          <p key={key}>{text}</p>
        ))}
      </div>
    </main>
  );
}


export default Page;