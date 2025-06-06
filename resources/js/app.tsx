
import "./../css/app.css"
import { createRoot } from 'react-dom/client'
import { createInertiaApp } from '@inertiajs/react'

declare global {
    interface Window {
        $RefreshReg$?: (type: any, id?: string) => void;
        $RefreshSig$?: () => (type: any) => any;
    }
}

if (import.meta.hot) {
    import('react-refresh/runtime').then((runtime) => {
        runtime.injectIntoGlobalHook(window)
        if (typeof window !== 'undefined') {
            window.$RefreshReg$ ||= () => { }
            window.$RefreshSig$ ||= () => (type: unknown) => type
        }
    })
}
createInertiaApp({
    resolve: name => import(`./Pages/${name}.tsx`),
    setup({ el, App, props }) {

        (async () => {
            const { WebSocketProvider } = await import("@/context/websocket")

            const { Toaster } = await import("@/components/ui/sonner")
            const { hostname, port, protocol } = window.location
            const proto = protocol == "https:" ? "wss" : "ws"
            const url = `${proto}://${hostname}:${port}`
            createRoot(el).render(
                <WebSocketProvider url={url}>
                    <App {...props} />
                    <Toaster />
                </WebSocketProvider>

            );
        })()

    },
})


