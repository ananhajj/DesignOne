import React, { useEffect, useMemo, useState } from "react";
import { ArrowRight, ArrowUp, ArrowDown, Plus, Save, Trash2, Loader2, CheckCircle, XCircle } from "lucide-react";
import { useContent } from "../ContentProvider";

function uid() { return Math.random().toString(36).slice(2, 9); }
function asArray(stored, fallbackArr = []) {
    if (Array.isArray(stored)) return stored;
    if (Array.isArray(stored?.items)) return stored.items; // دعم شكل قديم {items:[]}
    return fallbackArr;
}

/**
 * EditableFAQ
 * التخزين: Array تحت المفتاح k (مثلاً "faq.items")
 * العنصر: { id, q, a }
 * يدعم القراءة من الصيغة القديمة: faq.{i}.q / faq.{i}.a (حتى 20 عنصرًا)
 */
export default function EditableFAQ({
    k = "faq.items",
    limit, // اختياري: عدد العناصر للعرض في وضع الزوار
}) {
    const { get, set, editMode, isAdmin } = useContent();
    const canEdit = editMode && isAdmin;

    // اقرأ المصفوفة الحالية (بدون قيم افتراضية)
    const stored = get(k, []);
    const initial = useMemo(() => asArray(stored, []), [stored]);

    // لو ما في مصفوفة، حاول نقرأ الصيغة القديمة
    const legacy = useMemo(() => {
        if (initial.length) return [];
        const arr = [];
        for (let i = 0; i < 20; i++) {
            const q = (get(`faq.${i}.q`, "") || "").trim();
            const a = (get(`faq.${i}.a`, "") || "").trim();
            if (!q && !a) continue;
            arr.push({ id: uid(), q, a });
        }
        return arr;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stored]);

    const [items, setItems] = useState(initial.length ? initial : legacy);
    const [saveStatus, setSaveStatus] = useState(null);

    useEffect(() => {
        setItems(asArray(stored, legacy));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stored]);

    /* -------- Mutations -------- */
    const addItem = () => setItems(prev => [...prev, { id: uid(), q: "", a: "" }]);
    const delItem = (id) => setItems(prev => prev.filter(x => x.id !== id));
    const move = (i, dir) => {
        const j = i + dir;
        if (j < 0 || j >= items.length) return;
        const copy = [...items];
        [copy[i], copy[j]] = [copy[j], copy[i]];
        setItems(copy);
    };
    const update = (id, patch) => setItems(prev => prev.map(x => x.id === id ? { ...x, ...patch } : x));

    const saveAll = async () => {
        try {
            setSaveStatus("loading");
            const clean = items
                .map(({ id, q, a }) => ({ id: id || uid(), q: (q || "").trim(), a: (a || "").trim() }))
                .filter(x => x.q || x.a);
            const { error } = await set(k, clean); // خزّن كمصفوفة مباشرة
            setSaveStatus(error ? "error" : "success");
            if (!error) setTimeout(() => setSaveStatus(null), 2200);
        } catch {
            setSaveStatus("error");
        }
    };

    /* -------- Visitors view -------- */
    if (!canEdit) {
        const show = limit ? items.slice(0, limit) : items;
        if (!show.length) {
            return (
                <div className="mx-auto max-w-3xl rounded-2xl border border-neutral-200 bg-white p-6 text-center text-neutral-500">
                    لا توجد أسئلة شائعة للعرض حاليًا.
                </div>
            );
        }

        return (
            <div className="mx-auto max-w-3xl space-y-4">
                {show.map((it, i) => (
                    <details key={it.id} className="group rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
                        <summary className="flex cursor-pointer list-none items-center justify-between">
                            <span className="text-sm font-semibold text-neutral-900">{it.q || "—"}</span>
                            <ArrowRight className="w-4 h-4 text-primary transition group-open:rotate-90" />
                        </summary>
                        {it.a ? (
                            <p className="mt-3 text-sm text-neutral-600">{it.a}</p>
                        ) : null}
                    </details>
                ))}
            </div>
        );
    }

    /* -------- Admin view -------- */
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <button onClick={addItem} className="inline-flex items-center gap-2 rounded-lg bg-primary/90 text-white px-3 py-1.5 text-sm" type="button">
                    <Plus className="w-4 h-4" /> إضافة سؤال
                </button>
                <button onClick={saveAll} className="inline-flex items-center gap-2 rounded-lg bg-neutral-800 text-white px-3 py-1.5 text-sm relative" type="button">
                    {saveStatus === "loading" && <Loader2 className="w-4 h-4 animate-spin" />}
                    {saveStatus === "success" && <CheckCircle className="w-4 h-4 text-green-400" />}
                    {saveStatus === "error" && <XCircle className="w-4 h-4 text-red-400" />}
                    <Save className="w-4 h-4" /> حفظ الكل
                </button>
                {saveStatus === "success" && <span className="text-sm text-green-600">تم الحفظ بنجاح</span>}
                {saveStatus === "error" && <span className="text-sm text-red-600">فشل الحفظ</span>}
            </div>

            <div className="mx-auto max-w-3xl space-y-3">
                {items.map((it, idx) => (
                    <div key={it.id} className="rounded-2xl border border-primary/20 bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm text-neutral-500">#{idx + 1}</span>
                            <div className="flex items-center gap-1">
                                <button onClick={() => move(idx, -1)} className="p-1.5 rounded hover:bg-neutral-100" title="أعلى" type="button">
                                    <ArrowUp className="w-4 h-4" />
                                </button>
                                <button onClick={() => move(idx, +1)} className="p-1.5 rounded hover:bg-neutral-100" title="أسفل" type="button">
                                    <ArrowDown className="w-4 h-4" />
                                </button>
                                <button onClick={() => delItem(it.id)} className="p-1.5 rounded hover:bg-red-50 text-red-600" title="حذف" type="button">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <label className="text-xs text-neutral-500">السؤال</label>
                        <input
                            className="border rounded-lg px-2 py-1 text-sm w-full mb-2"
                            value={it.q}
                            onChange={(e) => update(it.id, { q: e.target.value })}
                            placeholder="اكتب السؤال…"
                        />

                        <label className="text-xs text-neutral-500">الإجابة</label>
                        <textarea
                            className="border rounded-lg px-2 py-1 text-sm w-full min-h-[90px]"
                            value={it.a}
                            onChange={(e) => update(it.id, { a: e.target.value })}
                            placeholder="اكتب الإجابة…"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
