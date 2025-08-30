import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Quote, ArrowUp, ArrowDown, Plus, Save, Trash2, Loader2, CheckCircle, XCircle } from "lucide-react";
import { useContent } from "../ContentProvider";

/* Helpers */
function uid() { return Math.random().toString(36).slice(2, 9); }
function asArray(stored, fallbackArr = []) {
    if (Array.isArray(stored)) return stored;
    if (Array.isArray(stored?.items)) return stored.items;
    return fallbackArr;
}

/**
 * EditableTestimonials
 * - التخزين: Array تحت المفتاح k (مثل "testimonials.items")
 * - العنصر: { id, text, name, role }
 * - يقرأ تلقائيًا الصيغة القديمة testimonials.{i}.(text|name|role) عند عدم وجود مصفوفة
 */
export default function EditableTestimonials({
    k = "testimonials.items",
    limit,                         // اختياري: عدد أقصى للعرض للزوّار
    gridClassName = "grid md:grid-cols-3 gap-6",
    cardClassName = "bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-primary/10"
}) {
    const { get, set, editMode, isAdmin } = useContent();
    const canEdit = editMode && isAdmin;

    // اقرأ المصفوفة (بدون قيَم افتراضية)
    const stored = get(k, []);
    const initial = useMemo(() => asArray(stored, []), [stored]);

    // إن لم توجد مصفوفة، حاول نجلب البيانات القديمة (حتى 10 عناصر)
    const legacy = useMemo(() => {
        if (initial.length) return [];
        const arr = [];
        for (let i = 0; i < 10; i++) {
            const text = (get(`testimonials.${i}.text`, "") || "").trim();
            const name = (get(`testimonials.${i}.name`, "") || "").trim();
            const role = (get(`testimonials.${i}.role`, "") || "").trim();
            if (!text && !name && !role) continue;
            arr.push({ id: uid(), text, name, role });
        }
        return arr;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stored]); // تعمّدنا الاعتماد على stored فقط

    const [items, setItems] = useState(initial.length ? initial : legacy);
    const [saveStatus, setSaveStatus] = useState(null);

    useEffect(() => {
        setItems(asArray(stored, legacy));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stored]);

    /* Mutations */
    const addItem = () =>
        setItems(prev => [...prev, { id: uid(), text: "", name: "", role: "" }]);

    const delItem = (id) =>
        setItems(prev => prev.filter(x => x.id !== id));

    const move = (i, dir) => {
        const j = i + dir;
        if (j < 0 || j >= items.length) return;
        const copy = [...items];
        [copy[i], copy[j]] = [copy[j], copy[i]];
        setItems(copy);
    };

    const update = (id, patch) =>
        setItems(prev => prev.map(x => x.id === id ? { ...x, ...patch } : x));

    const saveAll = async () => {
        try {
            setSaveStatus("loading");
            const clean = items
                .map(({ id, text, name, role }) => ({
                    id: id || uid(),
                    text: (text || "").trim(),
                    name: (name || "").trim(),
                    role: (role || "").trim(),
                }))
                .filter(x => x.text || x.name || x.role);

            const { error } = await set(k, clean);   // نخزّن كمصفوفة مباشرة
            setSaveStatus(error ? "error" : "success");
            if (!error) setTimeout(() => setSaveStatus(null), 2500);
        } catch {
            setSaveStatus("error");
        }
    };

    /* View: Visitors */
    if (!canEdit) {
        const show = limit ? items.slice(0, limit) : items;
        if (!show.length) {
            return (
                <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center text-neutral-500">
                    لا توجد شهادات للعرض حاليًا.
                </div>
            );
        }

        return (
            <div className={gridClassName}>
                {show.map((t, index) => (
                    <motion.figure
                        key={t.id}
                        className={cardClassName}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: (index % 3) * 0.15 }}
                        whileHover={{ y: -4 }}
                    >
                        <Quote className="w-5 h-5 text-accent-500" />
                        <blockquote className="mt-3 text-neutral-700">“{t.text || ""}”</blockquote>
                        <figcaption className="mt-4 text-xs text-neutral-500">
                            {(t.name || "—")} • {t.role || "—"}
                        </figcaption>
                    </motion.figure>
                ))}
            </div>
        );
    }

    /* View: Admin */
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <button onClick={addItem} className="inline-flex items-center gap-2 rounded-lg bg-primary/90 text-white px-3 py-1.5 text-sm" type="button">
                    <Plus className="w-4 h-4" /> إضافة شهادة
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

            <div className="grid md:grid-cols-3 gap-6">
                {items.map((t, idx) => (
                    <div key={t.id} className={`${cardClassName} border-primary/20`}>
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm text-neutral-500">#{idx + 1}</span>
                            <div className="flex items-center gap-1">
                                <button onClick={() => move(idx, -1)} className="p-1.5 rounded hover:bg-neutral-100" title="أعلى" type="button">
                                    <ArrowUp className="w-4 h-4" />
                                </button>
                                <button onClick={() => move(idx, +1)} className="p-1.5 rounded hover:bg-neutral-100" title="أسفل" type="button">
                                    <ArrowDown className="w-4 h-4" />
                                </button>
                                <button onClick={() => delItem(t.id)} className="p-1.5 rounded hover:bg-red-50 text-red-600" title="حذف" type="button">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <label className="text-xs text-neutral-500">النص</label>
                            <textarea
                                className="border rounded-lg px-2 py-1 text-sm min-h-[80px]"
                                value={t.text}
                                onChange={(e) => update(t.id, { text: e.target.value })}
                                placeholder="النص الكامل للشهادة…"
                            />

                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="text-xs text-neutral-500">الاسم</label>
                                    <input
                                        className="border rounded-lg px-2 py-1 text-sm w-full"
                                        value={t.name}
                                        onChange={(e) => update(t.id, { name: e.target.value })}
                                        placeholder="اسم صاحب الشهادة…"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-neutral-500">الصفة/الدور</label>
                                    <input
                                        className="border rounded-lg px-2 py-1 text-sm w-full"
                                        value={t.role}
                                        onChange={(e) => update(t.id, { role: e.target.value })}
                                        placeholder="مثلاً: رائدة أعمال"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
