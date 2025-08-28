import React, { useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";
 
import LoginModal from "./LoginModal";
import { useContent } from "../cms/ContentProvider";

export default function AdminLoginButton() {
    const { user } = useAuth();
    const { isAdmin } = useContent(); // AdminBar يظهر تلقائيًا لما تكون cms_admin
    const [open, setOpen] = useState(false);
    const [visible, setVisible] = useState(false);


    // اختصار لوحة مفاتيح لإظهار الزر/المودال بدون ما يبين للكل
    useEffect(() => {
        const onKey = (e) => {
            if (e.shiftKey && e.code === "KeyA") {
                setVisible((v) => !v);
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    if (user || isAdmin) return null; // مسجل دخول أو أدمن؟ لا تعرض الزر

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
