
interface PaymentLayoutProps {
    children: React.ReactNode;
}

const PaymentLayout = ({
    children
}: PaymentLayoutProps) => {
    return (
        <main className="min-h-full flex flex-col justify-center items-center space-y-4 bg-slate-100 py-10 px-4">
            {children}
        </main>
    );
}
 
export default PaymentLayout;