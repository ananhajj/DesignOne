// src/pages/AuthCallback.jsx
import { useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function AuthCallback() {
    const navigate = useNavigate();
    useEffect(() => {
        const finalize = async () => {
            await supabase.auth.getSession();  
            navigate("/", { replace: true });
        };
        finalize();
    }, [navigate]);
    return <p style={{ padding: 16 }}>جاري تسجيل الدخول…</p>;
}
