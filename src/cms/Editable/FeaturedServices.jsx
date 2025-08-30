import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
    Building, Scale, Gavel, Heart, Home, FileText,
    ArrowUp, ArrowDown, Save, CheckCircle, Loader2, XCircle
} from "lucide-react";
import { useContent } from "../ContentProvider";

/* أيقونات */
const ICONS = { Building, Scale, Gavel, Heart, Home, FileText };

/* Utils */
function uid() { return Math.random().toString(36).slice(2, 9); }
function slugify(s = "") {
    return (s || "").toString().trim()
        .replace(/\s+/g, "-").replace(/[^\w\-ء-ي]+/g, "")
        .replace(/\-\-+/g, "-").replace(/^-+|-+$/g, "").toLowerCase();
}
function normalizeServices(list = []) {
    const arr = Array.isArray(list?.items) ? list.items : (Array.isArray(list) ? list : []);
    return arr.map((it) => {
        const id = it.id || uid();
        const title = (it.title || "").trim();
        const slug = (it.slug || slugify(title) || id).toLowerCase();
        const icon = ICONS[it.icon] ? it.icon : "Building";
        // ✅ هنا التعديل: نأخذ description أولاً
        const summary = (it.description || it.summary || it.desc || "").trim();
        const badge = (it.badge || "خدمة").trim();
        return {
            id, slug, title, icon, summary, badge,
            // نترك باقي الحقول زي ما هي لو موجودة
        };
    });
}
function toIdList(raw, all) {
    const bySlug = new Map(all.map(s => [s.slug, s.id]));
    const byId = new Set(all.map(s => s.id));
    const rawArr = Array.isArray(raw?.items) ? raw.items : (Array.isArray(raw) ? raw : []);
    const ids = [];
    for (const v of rawArr) {
        if (typeof v === "string") {
            ids.push(byId.has(v) ? v : (bySlug.get(v) || null));
        } else if (v && typeof v === "object") {
            ids.push(v.id || bySlug.get(v.slug || "") || null);
        }
    }
    return ids.filter(Boolean);
}

export default function FeaturedServices({
    k = "services.data",
    featuredKey = "home.services.featured",
    maxItems = 6,
    linkTo = "/services",
    gridClassName = "grid lg:grid-cols-3 gap-8",
    cardClassName = "bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-primary/10",
}) {
    const { get, set, editMode, isAdmin } = useContent();
    const canEdit = editMode && isAdmin;

    // اقرأ كل الخدمات
    const allServices = useMemo(() => normalizeServices(get(k, [])), [get, k]);

    // المختارات
    const featuredRaw = get(featuredKey, []);
    const initialSelectedIds = useMemo(
        () => toIdList(featuredRaw, allServices),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [JSON.stringify(allServices), JSON.stringify(featuredRaw)]
    );

    const [selectedIds, setSelectedIds] = useState(initialSelectedIds);
    const [saveStatus, setSaveStatus] = useState(null);

    useEffect(() => { setSelectedIds(initialSelectedIds); }, [initialSelectedIds]);

    const selectedServices = useMemo(() => {
        const map = new Map(allServices.map(s => [s.id, s]));
        const list = selectedIds.map(id => map.get(id)).filter(Boolean);
        return list.slice(0, maxItems);
    }, [allServices, selectedIds, maxItems]);

    const notSelected = useMemo(() => {
        const sel = new Set(selectedIds);
        return allServices.filter(s => !sel.has(s.id));
    }, [allServices, selectedIds]);

    const add = (id) => setSelectedIds(prev => prev.includes(id) ? prev : [...prev, id]);
    const remove = (id) => setSelectedIds(prev => prev.filter(x => x !== id));
    const move = (i, d) => {
        const j = i + d; if (j < 0 || j >= selectedIds.length) return;
        const arr = [...selectedIds];[arr[i], arr[j]] = [arr[j], arr[i]];
        setSelectedIds(arr);
    };

    const save = async () => {
        try {
            setSaveStatus("loading");
            const { error } = await set(featuredKey, selectedIds);
            setSaveStatus(error ? "error" : "success");
            if (!error) setTimeout(() => setSaveStatus(null), 2000);
        } catch {
            setSaveStatus("error");
        }
    };

    /* ==== عرض للزائر ==== */
    if (!canEdit) {
        return (
            <div>
                <div className={gridClassName}>
                    {selectedServices.map((s, index) => {
                        const Icon = ICONS[s.icon] || Building;
                        return (
                            <motion.div
                                key={s.id}
                                className={cardClassName}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: (index % 3) * 0.15 }}
                                whileHover={{ y: -4 }}
                            >
                                <div className="flex justify-between items-center mb-6">
                                    {/* أيقونة + عنوان */}
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl grid place-items-center bg-gradient-to-r from-primary to-accent-500">
                                            <Icon className="w-5 h-5 text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold text-neutral-900">
                                            {s.title || "—"}
                                        </h3>
                                    </div>

                                    {/* البادج */}
                                    <span className="px-3 py-1 bg-gradient-to-r from-primary to-accent-500 text-white text-xs rounded-full">
                                        {s.badge || "خدمة"}
                                    </span>
                                </div>

                                <div className="flex items-start gap-3">
                                   
                                    {/* ✅ هون الوصف رح يبين */}
                                    <p className="text-neutral-600 text-sm leading-7">{s.summary || ""}</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {linkTo && (
                    <div className="text-center mt-8">
                        <Link
                            to={linkTo}
                            className="inline-flex items-center rounded-full bg-gradient-to-r from-primary to-accent-500 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:shadow-md transition"
                        >
                            عرض كل الخدمات
                        </Link>
                    </div>
                )}
            </div>
        );
    }

    /* ==== وضع الأدمن ==== */
    return (
        <div className="space-y-6">
            {/* شريط الأدوات */}
            <div className="flex items-center gap-2">
                <button
                    onClick={save}
                    className="inline-flex items-center gap-2 rounded-lg bg-neutral-800 text-white px-3 py-1.5 text-sm"
                >
                    {saveStatus === "loading" && <Loader2 className="w-4 h-4 animate-spin" />}
                    {saveStatus === "success" && <CheckCircle className="w-4 h-4 text-green-400" />}
                    {saveStatus === "error" && <XCircle className="w-4 h-4 text-red-400" />}
                    <Save className="w-4 h-4" /> حفظ الاختيارات
                </button>
                <span className="text-xs text-neutral-500">
                    {`المعروض في الهوم: ${Math.min(selectedIds.length, maxItems)} / ${maxItems}`}
                </span>
            </div>

            {/* قائمة المختارات */}
            <div className="rounded-xl border border-neutral-200 bg-white p-4">
                <h4 className="font-semibold mb-3">المعروضة في الهوم (رتّب):</h4>
                {selectedIds.length === 0 ? (
                    <p className="text-sm text-neutral-500">لا توجد خدمات محددة.</p>
                ) : (
                    <ul className="space-y-2">
                        {selectedIds.map((id, idx) => {
                            const s = allServices.find(x => x.id === id);
                            if (!s) return null;
                            const Icon = ICONS[s.icon] || Building;
                            return (
                                <li key={id} className="flex items-center justify-between gap-3 border rounded-lg px-3 py-2">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-8 h-8 rounded-lg grid place-items-center bg-neutral-100 border">
                                            <Icon className="w-4 h-4" />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="text-sm font-semibold truncate">{s.title}</div>
                                            <div className="text-xs text-neutral-500 truncate">{s.summary}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button onClick={() => move(idx, -1)} className="p-1.5 rounded hover:bg-neutral-100"><ArrowUp className="w-4 h-4" /></button>
                                        <button onClick={() => move(idx, +1)} className="p-1.5 rounded hover:bg-neutral-100"><ArrowDown className="w-4 h-4" /></button>
                                        <button onClick={() => remove(id)} className="p-1.5 rounded hover:bg-neutral-100">✕</button>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>

            {/* كل الخدمات */}
            <div className="rounded-xl border border-neutral-200 bg-white p-4">
                <h4 className="font-semibold mb-3">كل الخدمات:</h4>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {notSelected.map((s) => {
                        const Icon = ICONS[s.icon] || Building;
                        return (
                            <button
                                key={s.id}
                                onClick={() => add(s.id)}
                                className="text-right border rounded-lg px-3 py-2 hover:bg-neutral-50 transition"
                                type="button"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg grid place-items-center bg-neutral-100 border">
                                        <Icon className="w-4 h-4" />
                                    </div>
                                    <div className="min-w-0">
                                        <div className="text-sm font-semibold truncate">{s.title}</div>
                                        <div className="text-xs text-neutral-500 truncate">{s.summary}</div>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
