// src/cms/ContentProvider.jsx
import React, {
    createContext,
    useContext,
    useMemo,
    useState,
    useEffect,
    useRef,
} from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../auth/AuthProvider"; // نستخدم user من AuthProvider

const ContentCtx = createContext(null);

export function ContentProvider({ children, initialLocale = "ar" }) {
    const { user } = useAuth();
    const [content, setContent] = useState({});
    const [locale, setLocale] = useState(initialLocale);
    const [isAdmin, setIsAdmin] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setErr] = useState(null);

    const loadReqId = useRef(0);

    // 1) حدّث isAdmin بمجرد تغيّر user
    useEffect(() => {
        const role = user?.user_metadata?.role || "";
       

        setIsAdmin(role === "cms_admin");
    }, [user]);

    // 2) فعّل وضع التعديل تلقائيًا إذا المستخدم أدمن
    useEffect(() => {
        if (user && isAdmin) setEditMode(true);
    }, [user, isAdmin]);

    // 3) تحميل المحتوى من Supabase
    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                setLoading(true);
                const myId = ++loadReqId.current;

                const { data, error } = await supabase
                    .from("cms_content")
                    .select("key, value")
                    .eq("locale", locale);

                if (cancelled || myId !== loadReqId.current) return;
                if (error) throw error;

                const map = {};
                (data || []).forEach((row) => (map[row.key] = row.value));
                setContent(map);
                setErr(null);
            } catch (e) {
                if (!cancelled) setErr(e.message || "Failed to load content");
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [locale]);

    // 4) دوال مساعدة
    const get = (key, fallback) => {
        const v = content?.[key];
        if (v == null) return fallback ?? "";
        return v.text ?? v.url ?? v.image_url ?? v.html ?? v;
    };
    const getRaw = (key, fallback) => {
           const v = content?.[key];
           return v == null ? (fallback ?? null) : v;
         };

    const fetchKey = async (key) => {
        const { data, error } = await supabase
            .from("cms_content")
            .select("value")
            .eq("locale", locale)
            .eq("key", key)
            .maybeSingle();
        if (error) throw error;
        return data?.value;
    };

    const setVal = async (key, value) => {
        if (!isAdmin) return { error: new Error("Not admin") };

        const payload = { key, locale, value, updated_by: user?.id };
        const prev = content[key];

        // Optimistic update
        setContent((p) => ({ ...p, [key]: value }));

        const { data, error } = await supabase
            .from("cms_content")
            .upsert(payload, { onConflict: "key,locale" })
            .select("key, value")
            .single();

        if (error) {
            // rollback
            setContent((p) => ({ ...p, [key]: prev }));
            return { error };
        }
        setContent((p) => ({ ...p, [key]: data?.value ?? value }));
        return { error: null };
    };

    const reload = async () => {
        const { data, error } = await supabase
            .from("cms_content")
            .select("key, value")
            .eq("locale", locale);
        if (error) throw error;
        const map = {};
        (data || []).forEach((row) => (map[row.key] = row.value));
        setContent(map);
    };

    // 5) Realtime updates
    useEffect(() => {
        const ch = supabase
            .channel(`cms_content_changes_${locale}`)
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "cms_content",
                    filter: `locale=eq.${locale}`,
                },
                (payload) => {
                    const row = payload.new || payload.old;
                    if (!row?.key) return;

                    if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
                        setContent((p) => ({ ...p, [row.key]: payload.new.value }));
                    } else if (payload.eventType === "DELETE") {
                        setContent((p) => {
                            const { [row.key]: _, ...rest } = p;
                            return rest;
                        });
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(ch);
        };
    }, [locale]);

    // 6) القيمة المصدرة في الكونتكست
 const ctx = useMemo(
    () => ({
      content, locale, setLocale,
      isAdmin, editMode, setEditMode,
       get, getRaw, set: setVal, reload, fetchKey, loading, error,
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
