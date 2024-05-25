import PaymentForm from "@/components/forms/payment-form";

export default function Home() {

  return (
    <main className="min-h-full flex flex-col justify-center items-center space-y-2 bg-slate-100 py-10 px-4">
      <div>
        <h1 className="font-semibold text-4xl">Live PIX</h1>
      </div>
      <div className="border shadow-sm max-w-[577px] w-full bg-white rounded-md p-4" >
        <PaymentForm />
      </div>
    </main>
  );
}
