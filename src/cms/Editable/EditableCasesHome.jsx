// src/cms/Editable/EditableCasesHome.jsx
import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useContent } from "../ContentProvider";
import { ArrowDown, ArrowUp, Save, RotateCcw } from "lucide-react";

const uid = () => Math.random().toString(36).slice(2, 9);
function asArray(v) { if (Array.isArray(v)) return v; if (Array.isArray(v?.items)) return v.items; return []; }
function eqArr(a, b) { if (a === b) return true; if (a.length !== b.length) return false; for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false; return true; }
function normalizeCases(list) {
    return asArray(list).map((c) => ({
        id: c.id || uid(),
        title: (c.title || "").trim(),
        category: (c.category || "").trim(),
        background: (c.background ?? c.challenge ?? "").trim(),
        duration: (c.duration || "").trim(),
        result: (c.result || "").trim(),
    }));
}
function normalizeIds(sel) {
    if (Array.isArray(sel?.ids)) return sel.ids.map(String);
    if (Array.isArray(sel)) return sel.map(String);
    return [];
}
function excerpt(s = "", n = 160) {
    const t = s.trim();
    if (t.length <= n) return t;
    return t.slice(0, n).replace(/\s+\S*$/, "") + "…";
}
const GRAD = (i) => (i % 2 === 0 ? "from-primary to-accent-500" : "from-accent-500 to-primary");

export default function EditableCasesHome({
    kData = "cases.data",     // مصدر كل القضايا (كائنات)
    kSelect = "cases.home",   // مكان IDs المختارة
    limit = 6,
    gridCols = "grid md:grid-cols-2 lg:grid-cols-3 gap-6",
}) {
    const { getRaw, set, editMode, isAdmin } = useContent();
    const canEdit = editMode && isAdmin;

    // 1) اقرأ الداتا من الـ CMS بصورة مستقرة
    const rawCases = getRaw(kData, []);
    const all = useMemo(() => normalizeCases(rawCases), [JSON.stringify(rawCases)]);
    const byId = useMemo(() => new Map(all.map((c) => [c.id, c])), [all]);
    const allIdsKey = useMemo(() => all.map((c) => c.id).join("|"), [all]);

    // 2) اقرأ المختارة (IDs) بصورة مستقرة
    const rawSel = getRaw(kSelect, []);
    const storedIds = useMemo(() => normalizeIds(rawSel), [JSON.stringify(rawSel)]);

    // 3) ستايت محلي (لا نعمل set إلا لو المحتوى تغيّر فعلًا)
    const [ids, setIds] = useState(storedIds);

    // تزامُن مع المخزَّن: حدّث فقط لو اختلفت القيم
    useEffect(() => {
        if (!eqArr(ids, storedIds)) setIds(storedIds);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [storedIds.join("|")]); // مفتاح مستقر

    // نظّف IDs غير الموجودة بعد أي تغيير على قائمة كل القضايا
    useEffect(() => {
        const filtered = ids.filter((id) => byId.has(id));
        if (!eqArr(filtered, ids)) setIds(filtered);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allIdsKey]);

    // العناصر المختارة لعرض الزوّار (ترتيبًا وفق ids) + قصّ limit
    const selected = useMemo(
        () => ids.map((id) => byId.get(id)).filter(Boolean).slice(0, limit),
        [ids, byId, limit]
    );

    /* -------- زوّار -------- */
    if (!canEdit) {
        if (selected.length === 0) {
            return (
                <div className="rounded-2xl border bg-white p-8 text-center text-neutral-600">
                    لا توجد أعمال مختارة للعرض حالياً.
                </div>
            );
        }
        return (
            <div className={gridCols}>
                {selected.map((c, i) => (
                    <motion.article
                        key={c.id}
                        className="bg-white rounded-3xl shadow-soft hover:shadow-md transition-all duration-300 overflow-hidden border border-primary/10"
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
                        whileHover={{ y: -4 }}
                    >
                        <div className={`bg-gradient-to-r ${GRAD(i)} p-6 text-white`}>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full">
                                    {c.category || "—"}
                                </span>
                                <span className="text-[11px] opacity-90">{c.duration || "—"}</span>
                            </div>
                            <h3 className="text-xl font-extrabold leading-tight">{c.title || "—"}</h3>
                        </div>
                        <div className="p-6 space-y-4">
                            {c.background ? (
                                <p className="text-neutral-600 text-sm leading-relaxed">{excerpt(c.background, 160)}</p>
                            ) : null}
                            {c.result ? (
                                <div className="rounded-2xl p-4 border border-primary/10 bg-primary/5">
                                    <div className="text-neutral-900 font-medium text-sm leading-relaxed">{c.result}</div>
                                </div>
                            ) : null}
                            <div className="pt-1">
                                <Link
                                    to={`/cases?focus=${encodeURIComponent(c.id)}`}
                                    className="text-primary font-semibold hover:text-accent-600 transition text-sm"
                                >
                                    اقرأ التفاصيل →
                                </Link>
                            </div>
                        </div>
                    </motion.article>
                ))}
            </div>
        );
    }

    /* -------- أدمن: اختيار وترتيب -------- */
    const [saving, setSaving] = useState(false);

    const available = useMemo(() => all.filter((a) => !ids.includes(a.id)), [all, ids]);

    const move = (i, d) => {
        const j = i + d;
        if (j < 0 || j >= ids.length) return;
        const arr = [...ids];
        [arr[i], arr[j]] = [arr[j], arr[i]];
        setIds(arr);
    };
    const removeAt = (i) => setIds((prev) => prev.filter((_, idx) => idx !== i));
    const addId = (id) => setIds((prev) => (prev.includes(id) || prev.length >= limit ? prev : [...prev, id]));
    const resetFromStore = () => setIds(storedIds.slice(0, limit));

    const save = async () => {
        try {
            setSaving(true);
            const clean = ids.filter((id) => byId.has(id)).slice(0, limit);
            const { error } = await set(kSelect, { ids: clean });
            if (error) alert("فشل الحفظ: " + (error.message || ""));
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* أدوات */}
            <div className="flex flex-wrap items-center gap-2">
                <button
                    onClick={save}
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-lg bg-neutral-800 text-white px-3 py-1.5 text-sm disabled:opacity-60"
                    type="button"
                >
                    <Save className="w-4 h-4" />
                    {saving ? "جارٍ الحفظ..." : "حفظ المختارات"}
                </button>
                <button
                    onClick={resetFromStore}
                    className="inline-flex items-center gap-2 rounded-lg bg-neutral-100 text-neutral-800 px-3 py-1.5 text-sm"
                    type="button"
                    title="إعادة تحميل من المخزَّن"
                >
                    <RotateCcw className="w-4 h-4" />
                    إعادة تحميل
                </button>
                <span className="text-xs text-neutral-500">المختار: {ids.length}/{limit}</span>
            </div>

            {/* المختارات الحالية */}
            <div className="rounded-2xl border bg-white p-4">
                <div className="font-semibold mb-3">العناصر المختارة (تُعرض في الصفحة الرئيسية)</div>
                {ids.length === 0 ? (
                    <div className="text-sm text-neutral-500">لا يوجد عناصر مختارة بعد. اختر من القائمة بالأسفل.</div>
                ) : (
                    <ul className="divide-y">
                        {ids.map((id, idx) => {
                            const c = byId.get(id);
                            if (!c) return null;
                            return (
                                <li key={id} className="flex items-center justify-between py-2">
                                    <div className="min-w-0">
                                        <div className="font-semibold truncate">{c.title || "—"}</div>
                                        <div className="text-xs text-neutral-500 truncate">{c.category || ""}</div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button onClick={() => move(idx, -1)} className="p-1.5 rounded hover:bg-neutral-100" title="أعلى">
                                            <ArrowUp className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => move(idx, +1)} className="p-1.5 rounded hover:bg-neutral-100" title="أسفل">
                                            <ArrowDown className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => removeAt(idx)}
                                            className="px-2 py-1 text-xs rounded bg-red-50 text-red-600 hover:bg-red-100"
                                        >
                                            إزالة
                                        </button>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>

            {/* المرشّحين */}
            <div className="rounded-2xl border bg-white p-4">
                <div className="font-semibold mb-3">كل القضايا (مصدر: {kData})</div>
                {all.length === 0 ? (
                    <div className="text-sm text-neutral-500">لا توجد قضايا بعد.</div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-3">
                        {available.map((c) => (
                            <div key={c.id} className="flex items-center justify-between rounded border p-2">
                                <div className="min-w-0">
                                    <div className="text-sm font-semibold truncate">{c.title || "—"}</div>
                                    <div className="text-xs text-neutral-500 truncate">{c.category || ""}</div>
                                </div>
                                <button
                                    onClick={() => addId(c.id)}
                                    disabled={ids.length >= limit}
                                    className="px-2 py-1 text-xs rounded bg-neutral-900 text-white disabled:opacity-50"
                                >
                                    إضافة
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* المعاينة */}
            <div>
                <div className="font-semibold mb-3">معاينة (يعرض أول {limit})</div>
                <div className={gridCols}>
                    {selected.length ? (
                        selected.map((c, i) => (
                            <div key={c.id} className="bg-white rounded-2xl p-6 border shadow-sm">
                                <div className="flex items-start justify-between gap-3 mb-4">
                                    <h3 className="text-lg font-extrabold text-neutral-900 truncate">{c.title || "—"}</h3>
                                    <span className="px-3 py-1 bg-gradient-to-r from-primary to-accent-500 text-white text-[11px] rounded-full">
                                        {c.category || "—"}
                                    </span>
                                </div>
                                {c.background && <p className="text-neutral-600 text-sm">{excerpt(c.background, 160)}</p>}
                                <div className="mt-5 text-right">
                                    <Link to={`/cases?focus=${encodeURIComponent(c.id)}`} className="text-primary font-semibold text-sm">
                                        اقرأ التفاصيل →
                                    </Link>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="rounded-2xl border bg-white p-8 text-center text-neutral-500">
                            لم يتم اختيار عناصر بعد.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
