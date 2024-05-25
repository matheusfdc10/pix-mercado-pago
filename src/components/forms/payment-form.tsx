"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import axios from "axios"
import { PaymentResponse } from "@/types"
import { Textarea } from "@/components/ui/textarea"

const formSchema = z.object({
    first_name: z.string().optional(),
    email: z.string().email({
        message: "Email inválido"
    }),
    transaction_amount: z.coerce.number().min(0.01, {
        message: "Preencha o valor"
    }),
    description: z.string().optional(),
})

const PaymentForm = () => {
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          first_name: "",
          email: "",
          transaction_amount: 0,
          description: undefined,
        },
    })

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await axios.post(`api/payment`, values)
            if (response.status === 200 || response.status === 201) {
                const data = response.data as PaymentResponse;
                router.push(`/payment/${data.id}`);
            }
            // toast({
            //     description: toastMessage,
            // });
            // router.back();

        } catch(error) {
            console.log(error)
            // toast({
            //     variant: "destructive",
            //     description: "Algo deu errado.",
            // });
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-6">
                <div className="flex flex-col space-y-2">
                    <FormField 
                        control={form.control}
                        name="first_name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nome (opcional)</FormLabel>
                                <FormControl>
                                    <Input
                                        // error={form.formState.errors.first_name}
                                        disabled={isLoading}
                                        placeholder="João"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField 
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email*</FormLabel>
                                <FormControl>
                                    <Input
                                        // error={form.formState.errors.email}
                                        disabled={isLoading}
                                        placeholder="joao@gmail.com"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField 
                        control={form.control}
                        name="transaction_amount"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Valor (R$)*</FormLabel>
                                <FormControl>
                                    <Input
                                        // error={form.formState.errors.transaction_amount}
                                        disabled={isLoading}
                                        type="number"
                                        placeholder="10"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField 
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Descrição (opcional)</FormLabel>
                                <FormControl>
                                    <Textarea
                                        // error={form.formState.errors.description}
                                        disabled={isLoading}
                                        placeholder=""
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <Button 
                    type="submit"
                    disabled={isLoading}
                >
                    Continuar
                </Button>
            </form>
        </Form>
    )
}

export default PaymentForm