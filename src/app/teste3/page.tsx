"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { socket } from "@/socket-client"; 
import { useEffect, useState } from "react";

const Page = () => {
  const [text, setText] = useState("")
  const [msg, setMsg] = useState("")

  
  useEffect(() => {
    socket.on("connect", () => {
      console.log('connect')
    });
    
    socket.on('receber', (res) => {
      console.log('res',res)
      setMsg(res)
    })
    
    socket.on("disconnect", () => {
      console.log('disconnect')
    });
    
    return () => {
      socket.off('receber')
      socket.off('disconnect')
    }
  } ,[])

  return (
    <main >
      <Input
        onChange={(e) => setText(e.target.value)}
        value={text}
      />
      <Button onClick={() => {
        socket.emit('enviar', { res: text, id: 'teste'})
      }}>Enviar</Button>
      <p>
        {msg}
      </p>
    </main>
  );
}


export default Page;