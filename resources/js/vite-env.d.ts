/// <reference types="vite/client" />

declare global {
    interface Window {
        $RefreshReg$?: (type: any, id?: string) => void;
        $RefreshSig$?: () => (type: any) => any;
    }
}
