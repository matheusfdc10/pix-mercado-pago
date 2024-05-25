"use client"

import { useEffect, useState } from "react";
import { payment1, payment2, getPayment } from "@/actions/payment";

import { io } from "socket.io-client";
import Image from "next/image";

interface PaymentProps {
    params: {
        paymentId: string;
    }
}

const PaymentPage = ({
    params
}: PaymentProps) => {
  const [status, setStatus] = useState<undefined | string>(undefined)
  const [dataPayment, setDataPayment] = useState<any>(null);
  const [value, setValue] = useState<number>(0);
    console.log(params.paymentId)
  const pagamento = () => {
    payment2({
      description: "Compra dos numeros (43, 76, 87, 34, 07)",
      email: "matheusfdc10@hotmail.com",
      notification_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/socket/notification`,
      numberIdentification: 17633759780,
      typeIdentification: 'CPF',
      transaction_amount: value,
      reference: "M0001"
    })
      .then((response) => {
        console.log(response);
        setDataPayment(response)
        setStatus(response.status)
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const verificarPagamento = () => {
    if (dataPayment.id) {
      getPayment(dataPayment.id)
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        })
    }
  }

  // useTeste({
  //   key: "teste"
  // })

  // const { socket } = useSocket()
  // useEffect(() => {
  //   if (!socket) {
  //     return
  //   }
  //   console.log(socket)

  //   socket.on("connect", (data: string) => {
  //     console.log("DATA", data)
  //   })

  //   return () => {
  //     socket.off("connect")
  //   }
  // }, [socket])



  

  useEffect(() => {
    // if (!socket) {
    //   return
    // }

    if(!dataPayment?.id){
      return
    }

    const socket = new (io as any)(process.env.NEXT_PUBLIC_SITE_URL!, {
      path: "/api/socket/io",
      addTrailingSlash: false
    });

    console.log(socket)

    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on(`teste:${dataPayment.id}`, (status: string) => {
      setStatus(status)
      console.log("Status:", status)
    })

    return () => {
      socket.off(`teste:${dataPayment.id}`);
      socket.off("connect");
    }
  }, [dataPayment?.id])

  return (
    <main >
      <input onChange={(e) => setValue(e.target.valueAsNumber)} type="number" className="text-black" />
      <br />
      {status && (
        <div>Status: {status}</div>
      )}
      <button className="bg-blue-600 p-2 rounded-md active:scale-90 transition" onClick={pagamento}>Botão</button>
      <button className="bg-blue-600 p-2 rounded-md active:scale-90 transition" onClick={verificarPagamento}>Verificar</button>
      <div>
        {JSON.stringify(dataPayment)}
        {dataPayment &&
          <Image src={`data:image/png;base64, ${dataPayment.point_of_interaction.transaction_data.qr_code_base64}`} width={200} height={200} alt="" />
        }
      </div>
    </main>
  );
}


export default PaymentPage;