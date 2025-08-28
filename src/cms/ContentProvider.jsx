import React, { createContext, useContext, useMemo, useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";


const ContentCtx = createContext(null);

export function ContentProvider({ children, initialLocale = "ar" }) {
    const [content, setContent] = useState({});
    const [locale, setLocale] = useState(initialLocale);
    const [isAdmin, setIsAdmin] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setErr] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const { data: { user } } = await supabase.auth.getUser();
                const role = user?.user_metadata?.role || "";
                setIsAdmin(role === "cms_admin");

                const { data, error } = await supabase
                    .from("cms_content")
                    .select("key, value")
                    .eq("locale", locale);

                if (error) throw error;

                const map = {};
                (data || []).forEach((row) => (map[row.key] = row.value));
                setContent(map);
                setErr(null);
            } catch (e) {
                setErr(e.message || "Failed to load content");
            } finally {
                setLoading(false);
            }
        })();
    }, [locale]);

    const get = (key, fallback) => {
        const v = content?.[key];
        if (v == null) return fallback ?? "";
        // value ممكن يكون {text,url,image_url,html...}
        return v.text ?? v.url ?? v.image_url ?? v.html ?? v;
    };

    const set = async (key, value) => {
        if (!isAdmin) return { error: new Error("Not admin") };

        const { data: { user } } = await supabase.auth.getUser();
        const payload = { key, locale, value, updated_by: user?.id };

        const { error } = await supabase
            .from("cms_content")
            .upsert(payload, { onConflict: "key,locale" });

        if (!error) setContent((prev) => ({ ...prev, [key]: value }));
        return { error };
    };


    const reload = async () => {
        const { data } = await supabase
            .from("cms_content")
            .select("key, value")
            .eq("locale", locale);
        const map = {};
        (data || []).forEach((row) => (map[row.key] = row.value));
        setContent(map);
    };

    const ctx = useMemo(
        () => ({
            content, locale, setLocale,
            isAdmin, editMode, setEditMode,
            get, set, reload, loading, error,
        }),
        [content, locale, isAdmin, editMode, loading, error]
    );

    return <ContentCtx.Provider value={ctx}>{children}</ContentCtx.Provider>;
}

export function useContent() {
    const ctx = useContext(ContentCtx);
    if (!ctx) throw new Error("useContent must be used within ContentProvider");
    return ctx;
}
