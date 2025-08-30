// src/auth/AuthProvider.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
    const [session, setSession] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {               // 👈 كان ناقص
        (async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session || null);
            setUser(session?.user || null);
            setLoading(false);
        })();

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session || null);
            setUser(session?.user || null);
        });
        return () => listener?.subscription?.unsubscribe?.();
    }, []);                         // 👈 كان ناقص

    const signIn = (email, password) =>
        supabase.auth.signInWithPassword({ email, password });

    const signUpAdmin = (email, password) =>
        supabase.auth.signUp({
            email,
            password,
            options: { data: { role: "cms_admin" } },
        });

    const signOut = () => supabase.auth.signOut();

    const value = useMemo(() => ({ session, user, loading, signIn, signUpAdmin, signOut }), [session, user, loading]);

    return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthCtx);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
