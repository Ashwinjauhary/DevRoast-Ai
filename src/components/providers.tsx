import { SessionProvider } from "next-auth/react"
import { Toaster } from "react-hot-toast"

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            {children}
            <Toaster 
                position="bottom-right"
                toastOptions={{
                    className: 'glass-darker border border-white/10 text-white font-sans text-sm rounded-2xl p-4',
                    style: {
                        background: 'rgba(0, 0, 0, 0.8)',
                        backdropFilter: 'blur(16px)',
                    },
                    success: {
                        iconTheme: {
                            primary: '#10b981',
                            secondary: '#fff',
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: '#f43f5e',
                            secondary: '#fff',
                        },
                    },
                }}
            />
        </SessionProvider>
    )
}
