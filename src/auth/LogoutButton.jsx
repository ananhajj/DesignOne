import React from "react";
import { useAuth } from "./AuthProvider";

export default function LogoutButton({ className = "" }) {
    const { signOut } = useAuth();

    return (
        <button
            onClick={async () => { try { await signOut(); } catch { } }}
            className={`rounded-lg px-3 py-1.5 text-sm bg-neutral-200/60 hover:bg-neutral-300/70 text-neutral-800 ${className}`}
            title="تسجيل الخروج"
        >
            خروج
        </button>
    );
}
