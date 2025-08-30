// src/components/AdminLoginButton.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthProvider";
import { useContent } from "../cms/ContentProvider";
import LoginModal from "./LoginModal";

export default function AdminLoginButton() {
    const { user } = useAuth();
    const { isAdmin } = useContent();
    const [open, setOpen] = useState(false);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const onKey = (e) => {
            if (e.shiftKey && e.code === "KeyA") setVisible((v) => !v);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    if (user || isAdmin) return null;

    return (
        <>
            {visible && (
                <button
                    onClick={() => setOpen(true)}
                    className="fixed bottom-4 right-4 z-[9997] rounded-full bg-[#7c533a] px-4 py-2 text-white shadow-lg"
                >
                    Admin
                </button>
            )}
            <LoginModal open={open} onClose={() => setOpen(false)} />
        </>
    );
}
