"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Header() {
    return (
        <header className="relative sm:bottom-7 w-full flex justify-between items-center border-b-3 border-gray-300 pb-3">
            <img src="/logo.png" alt="Logo" width={85} className="rounded-full" />
            <ConnectButton />
        </header>
    );
}
