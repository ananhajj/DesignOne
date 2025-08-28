// src/pages/AuthCallback.jsx
import { useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function AuthCallback() {
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            try {
                const url = new URL(window.location.href);
                const hasCode = url.searchParams.get("code");
                if (hasCode) {
                    const { error } = await supabase.auth.exchangeCodeForSession(url.toString());
                    if (error) console.error("Auth error:", error.message);
                }
                // نظّف الباراميترات من العنوان
                window.history.replaceState({}, document.title, "/auth/callback");
            } catch (e) {
                console.error("Unexpected auth error:", e);
            } finally {
                navigate("/", { replace: true });
            }
        })();
    }, [navigate]);

    return <p style={{ padding: 16 }}>جاري تسجيل الدخول…</p>;
}
