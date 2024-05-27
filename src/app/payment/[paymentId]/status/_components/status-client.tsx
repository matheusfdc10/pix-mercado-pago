"use client"

import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface StatusClientProps {
    id?: number;
    date_approved?: string;
    date_of_expiration?: string;
    status?: string;
}

const StatusClient = ({
    id,
    date_approved,
    date_of_expiration,
    status
}: StatusClientProps) => {
    const router = useRouter()

    return ( 
        <div className="border shadow-sm max-w-[577px] w-full bg-white rounded-md">
            <div className="flex flex-col items-center justify-center space-y-4 px-4 py-6 text-center">
                {status === "approved" ? (
                    <CheckCircle width={60} height={60} className="text-green-400" />
                ) : (
                    <XCircle width={60} height={60} className="text-red-500" />
                )}
                <span className="text-3xl font-medium">
                    {status === "approved" ?
                        "Pagamento realizado com sucesso!" 
                    : 
                        "Pagamento indisponível"
                    }
                </span>
                <span className="text-muted-foreground">
                    {status === "approved" ? 
                        `Pago em ${formatDate(date_approved!)}`
                        :
                        `Expirado em ${formatDate(date_of_expiration!)}`
                    }
                </span>
            </div>
            <div className="border-t" />
            <div className="items-center px-4 py-6 text-center">
                <Button onClick={() => router.push('/')}>
                    Novo pagamento
                </Button>
            </div>
        </div>
    );
}
 
export default StatusClient;