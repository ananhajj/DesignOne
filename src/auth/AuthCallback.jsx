// src/pages/AuthCallback.jsx
import { useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function AuthCallback() {
    const navigate = useNavigate();

    useEffect(() => {
        const finalize = async () => {
            try {
                // استبدال الكود بجلسة مستخدم
                const { data, error } = await supabase.auth.exchangeCodeForSession(window.location.href);

                if (error) {
                    console.error("Auth error:", error.message);
                } else {
                    console.log("Auth success:", data);
                }
            } catch (e) {
                console.error("Unexpected error:", e);
            } finally {
                navigate("/", { replace: true });
            }
        };

        finalize();
    }, [navigate]);

    return <p style={{ padding: 16 }}>جاري تسجيل الدخول…</p>;
}
