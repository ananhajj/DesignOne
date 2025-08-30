import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useContent } from "../ContentProvider";
import { ArrowDown, ArrowUp, Save } from "lucide-react";

const uid = () => Math.random().toString(36).slice(2, 9);
const ICONS = { Building: null, FileText: null, Gavel: null, Heart: null, Home: null, Scale: null };
function asArray(stored) { if (Array.isArray(stored)) return stored; if (Array.isArray(stored?.items)) return stored.items; return []; }

function normalizeCases(list) {
    return asArray(list).map((c) => ({
        id: c.id || uid(),
        title: (c.title || "").trim(),
        category: (c.category || "").trim(),
        background: (c.background ?? c.challenge ?? "").trim(),
    }));
}

function excerpt(s = "", n = 140) {
    const t = s.trim();
    if (t.length <= n) return t;
    return t.slice(0, n).replace(/\s+\S*$/, "") + "…";
}

export default function EditableCasesHome({
    kData = "cases.data",     // مصدر البيانات الكامل
    kSelect = "cases.home",   // مكان تخزين IDs المختارة
    limit = 6,                // كم عنصر نعرض (أقصى)
    gridCols = "grid lg:grid-cols-3 gap-8",
}) {
    const { get, set, editMode, isAdmin } = useContent();
    const canEdit = editMode && isAdmin;

    // كل القضايا المتاحة
    const allRaw = get(kData, []);
    const all = useMemo(() => normalizeCases(allRaw), [allRaw]);

    // ids المختارة للهوم
    const selStored = get(kSelect, { ids: [] });
    const [ids, setIds] = useState(() => (Array.isArray(selStored?.ids) ? selStored.ids : (Array.isArray(selStored) ? selStored : [])));

    // keep in sync
    useEffect(() => {
        const next = Array.isArray(selStored?.ids) ? selStored.ids : (Array.isArray(selStored) ? selStored : []);
        setIds(next.filter((id) => all.find(a => a.id === id))); // نظّف IDs التي لم تعد موجودة
    }, [selStored, all.length]);

    // العناصر المختارة (حسب الترتيب) + قص للعرض
    const selected = ids
        .map((id) => all.find((a) => a.id === id))
        .filter(Boolean)
        .slice(0, limit);

    /* ------- زوّار ------- */
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
                    <motion.div
                        key={c.id}
                        className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-primary/10"
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: (i % 3) * 0.12 }}
                    >
                        <div className="flex items-start justify-between gap-3 mb-4">
                            <h3 className="text-lg font-extrabold text-neutral-900">{c.title || "—"}</h3>
                            <span className="px-3 py-1 bg-gradient-to-r from-primary to-accent-500 text-white text-[11px] rounded-full">
                                {c.category || "—"}
                            </span>
                        </div>
                        {c.background && <p className="text-neutral-600 text-sm">{excerpt(c.background, 160)}</p>}

                        <div className="mt-5">
                            <Link
                                to={`/cases?focus=${encodeURIComponent(c.id)}`}
                                className="text-primary font-semibold hover:text-accent-600 transition text-sm"
                            >
                                اقرأ التفاصيل →
                            </Link>
                        </div>
                    </motion.div>
                ))}
            </div>
        );
    }

    /* ------- أدمن: اختيار وترتيب فقط ------- */
    // المرشّحات: “غير مختارة” + “مختارة”
    const available = all.filter((a) => !ids.includes(a.id));

    const move = (i, d) => {
        const j = i + d; if (j < 0 || j >= ids.length) return;
        const arr = [...ids];[arr[i], arr[j]] = [arr[j], arr[i]];
        setIds(arr);
    };

    const toggle = (id) => {
        setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    };

    const save = async () => {
        const clean = ids.filter((id) => all.find(a => a.id === id));
        const { error } = await set(kSelect, { ids: clean });
        if (error) alert("فشل الحفظ: " + error.message);
    };

    return (
        <div className="space-y-6">
            {/* المختارة وترتيبها */}
            <div className="rounded-2xl border bg-white p-4">
                <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold">العناصر المختارة (تُعرض في الصفحة الرئيسية)</h4>
                    <button
                        onClick={save}
                        className="inline-flex items-center gap-2 rounded-lg bg-neutral-800 text-white px-3 py-1.5 text-sm"
                    >
                        <Save className="w-4 h-4" /> حفظ الاختيارات
                    </button>
                </div>

                {ids.length === 0 ? (
                    <div className="text-sm text-neutral-500">لا يوجد عناصر مختارة بعد. اختر من القائمة بالأسفل.</div>
                ) : (
                    <ul className="divide-y">
                        {ids.map((id, idx) => {
                            const c = all.find((x) => x.id === id);
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
                                        <button onClick={() => move(idx, 1)} className="p-1.5 rounded hover:bg-neutral-100" title="أسفل">
                                            <ArrowDown className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => toggle(id)}
                                            className="px-2 py-1 text-xs rounded bg-red-50 text-red-600 hover:bg-red-100"
                                            title="إزالة من المختارة"
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

            {/* قائمة كل القضايا للاختيار منها */}
            <div className="rounded-2xl border bg-white p-4">
                <h4 className="font-semibold mb-3">كل القضايا (مصدر: {kData})</h4>
                {all.length === 0 ? (
                    <div className="text-sm text-neutral-500">
                        لا توجد قضايا بعد. أضف القضايا من صفحة “أعمال مختارة”، ثم ارجع واختر ما تريد عرضه هنا.
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-3">
                        {available.map((c) => (
                            <div key={c.id} className="flex items-center justify-between rounded border p-2">
                                <div className="min-w-0">
                                    <div className="text-sm font-semibold truncate">{c.title || "—"}</div>
                                    <div className="text-xs text-neutral-500 truncate">{c.category || ""}</div>
                                </div>
                                <button
                                    onClick={() => toggle(c.id)}
                                    className="px-2 py-1 text-xs rounded bg-neutral-900 text-white hover:bg-neutral-800"
                                >
                                    إضافة
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* المعاينة كما ستظهر للزوّار */}
            <div>
                <h4 className="font-semibold mb-3">معاينة (يعرض أول {limit})</h4>
                <div className={gridCols}>
                    {selected.map((c, i) => (
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
                    ))}
                    {selected.length === 0 && (
                        <div className="rounded-2xl border bg-white p-8 text-center text-neutral-500">
                            لم يتم اختيار عناصر بعد.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
