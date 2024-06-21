"use client"

import { getStatusPayment } from "@/actions/payment";
import { Button } from "@/components/ui/button";
import { ToastAction,  } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { useSocket } from "@/hooks/use-socket";
import { formatDate, formatNumber } from "@/lib/utils";
import { socket } from "@/socket-client";
import { CopyIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


interface PaymentClientProps {
    id?: number;
    qr_code?: string;
    qr_code_base64?: string;
    ticket_url?: string;
    name_payment?: string;
    status?: string;
    description?: string;
    date_created?: string;
    date_of_expiration?: string;
    transaction_amount?: number;
}

const PaymentClient = ({
    id,
    status,
    transaction_amount,
    description,
    name_payment,
    qr_code,
    qr_code_base64,
    ticket_url,
    date_created,
    date_of_expiration
}: PaymentClientProps) => {
    const [disabled, setDisabled] = useState(false)
    const [statuss, setStatuss] = useState<string | undefined>(status)
    const { toast } = useToast()
    const router = useRouter()
    // const [statuss, setStatuss] = useState<string>()

    // const { data: statusRealTime } = useSocket<string>({
    //     key: `teste:${id}`,
    //     // action: (data: string) => setStatuss(data)
    // })

    // const statusPayment = statusRealTime || status;

    const sendMessage = () => {
        // socket.emit('messages', { id, message });
    };

    useEffect(() => {
        if (!socket) return

        socket.on("connect", () => {
            console.log('connect')
        });

        socket.emit('joinPaymentRoom', id);

        // verification api
        socket.on(`paymentStatus`, ({ paymentId, status }) => {
            console.log(`Received status for payment ${paymentId}: ${status}`);
            setStatuss(status);
        });

        // return webhook
        socket.on(`paymentStatus:${id}`, ({ paymentId, status }) => {
            console.log(`Received status for payment ${paymentId}: ${status}`);
            setStatuss(status);
        });
        

        socket.on("disconnect", () => {
            console.log('disconnect')
        });

        return () => {
            socket.off(`paymentStatus:${id}`)
            socket.off('paymentStatus');
            socket.off('disconnect');
        };
    }, [id])

    const onCopy = () => {
        navigator.clipboard.writeText(qr_code!);
        toast({
            title: "Código copiado!",
            variant: "success",
        })
    }

    const checkPayment = async () => {
        try {
            setDisabled(true)
            const payment = await getStatusPayment(id!);

            switch(payment?.status) {
                case "pending":
                    toast({
                        title: "Pagamento pendente",
                        variant: "default",
                    })
                    setDisabled(false)
                break;
                case "approved":
                    toast({
                        title: "Pagamento concluído!",
                        variant: "success",
                        action: <Countdown onFinish={() => router.push(`/payment/${payment.id}/status`)} />
                    })
                break;
                case "cancelled":
                    toast({
                        title: "Pix expirado",
                        description: "Gere um novo pagamento pix.",
                        variant: "destructive",
                        action: <ToastAction altText="Gerar Pix" onClick={() => router.push("/")}>Gerar Pix</ToastAction>
                    })
                    setDisabled(false)
                break;
                default:
                    toast({
                        title: "Algo deu errado.",
                        description: "Gere um novo pagamento pix.",
                        variant: "destructive",
                        action: <ToastAction altText="Gerar Pix" onClick={() => router.push("/")}>Gerar Pix</ToastAction>
                    })
                    setDisabled(false)
                break
            }
        } catch {
            toast({
                title: "Serviço fora do ar",
                description: "Tente mais tarde.",
                variant: "destructive",
            })
            setDisabled(false)
        }
    }


    useEffect(() => {
        if (statuss === 'approved') {
            toast({
                title: "Pagamento concluído!",
                variant: "success",
                action: <Countdown onFinish={() => router.push(`/payment/${id}/status`)} />
            })
        }
    } ,[statuss])
    
    return (
        <div className="border shadow-sm max-w-[577px] w-full bg-white rounded-md">
            <div className="flex items-center justify-center p-4">
                <h1 className="font-bold text-2xl">
                    Pagamento PIX
                </h1>
            </div>
            <div className="border-t" />
            <div className="flex flex-col space-y-8 px-6 py-8">
                <div className=" flex flex-col space-y-4">
                    {name_payment && (
                        <span className="text-lg font-semibold capitalize">
                            Pagador: {name_payment}
                        </span>
                    )}
                    <span className="text-lg font-semibold">
                        Pague R$ {formatNumber(transaction_amount!)} via Pix
                    </span>
                    <span className="font-light">
                        Vencimento: {formatDate(date_of_expiration!)}
                    </span>
                </div>
                {qr_code_base64 && (
                    <>
                        <span className="font-semibold">
                            Para pagar, escolha uma destas opções:
                        </span>
                        <div className="space-y-2">
                            <span className="font-light text-sm">
                                Código QR
                            </span>
                            <div className="flex items-center justify-center">
                                <Image 
                                    src={`data:image/png;base64, ${qr_code_base64}`}
                                    width={200}
                                    height={200} 
                                    alt="qrCode"
                                    className="items-center"
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <span className="font-light text-sm">
                                Código de pagamento
                            </span>
                            <div className="border px-3 py-2 rounded-sm overflow-hidden flex gap-1">
                                <span className="font-light line-clamp-1">
                                    {qr_code}
                                </span>
                                <div onClick={onCopy}>
                                    <CopyIcon width={16} className="text-sky-400 hover:text-sky-500 transition cursor-pointer active:scale-95" />
                                </div>
                            </div>
                        </div>
                    </>
                )}
                {/* <Link href={ticket_url!}>Link mercado Pago</Link> */}
                {description && (
                    <div className="space-y-1">
                        <span className="font-light text-sm">
                            Descrição:
                        </span>
                        <div className="border px-3 py-2 rounded-sm">
                            <span className="font-light">
                                {description}
                            </span>
                        </div>
                    </div>
                )}
                {/* <span>
                    Status: {statusPayment}
                </span> */}
                <span className="text-center text-black/60">
                    {statuss}
                </span>
                <Button
                    onClick={checkPayment}
                    disabled={disabled}
                >
                    Verificar pagamento
                </Button>
            </div>
        </div>
    );
}
 
export default PaymentClient;





interface CountdownProps {
    onFinish: () => void;
}

const Countdown: React.FC<CountdownProps> = ({ onFinish }) => {
    const [countdown, setCountdown] = useState<number>(3);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prevCountdown) => {
                if (prevCountdown === 0) {
                    clearInterval(timer);
                    onFinish();
                    return prevCountdown;
                }
                return prevCountdown - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [onFinish]);

    return <div className="text-white text-2xl absolute right-8" >{countdown || ""}</div>;
};