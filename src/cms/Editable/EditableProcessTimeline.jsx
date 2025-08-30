import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useContent } from "../ContentProvider";
import { ArrowUp, ArrowDown, Plus, Save, Trash2, Loader2, CheckCircle, XCircle } from "lucide-react";

/* -------- Utils -------- */
function uid() { return Math.random().toString(36).slice(2, 9); }
function asArray(stored, fallbackArr = []) {
    if (Array.isArray(stored)) return stored;
    if (Array.isArray(stored?.items)) return stored.items;
    return fallbackArr;
}
const pad2 = (n) => String(n).padStart(2, "0");

/**
 * EditableProcessTimeline
 * - يخزّن مصفوفة خطوات مباشرة تحت المفتاح k (مثلاً "process.steps")
 * - كل عنصر: { id, title, duration, desc }
 * - لا يضع قيم افتراضية: إن لم توجد بيانات → يظهر تنبيه للزوّار، ونموذج فارغ للأدمن
 */
export default function EditableProcessTimeline({ k = "process.steps" }) {
    const { get, set, editMode, isAdmin } = useContent();
    const canEdit = editMode && isAdmin;

    // اقرأ
    const stored = get(k, []); // لا افتراضات
    const initial = useMemo(() => asArray(stored, []), [stored]);
    const [items, setItems] = useState(initial);
    const [saveStatus, setSaveStatus] = useState(null);

    // مزامنة إذا تغيّرت الداتا
    useEffect(() => {
        setItems(asArray(stored, []));
    }, [stored]);

    /* ----- Mutations ----- */
    const addStep = () =>
        setItems((prev) => [
            ...prev,
            { id: uid(), title: "", duration: "", desc: "" },
        ]);

    const delStep = (id) => setItems((prev) => prev.filter((x) => x.id !== id));

    const moveStep = (i, d) => {
        const j = i + d;
        if (j < 0 || j >= items.length) return;
        const arr = [...items];
        [arr[i], arr[j]] = [arr[j], arr[i]];
        setItems(arr);
    };

    const updateStep = (id, patch) =>
        setItems((prev) => prev.map((x) => (x.id === id ? { ...x, ...patch } : x)));

    const saveAll = async () => {
        try {
            setSaveStatus("loading");
            const clean = items
                .map((x) => ({
                    id: x.id || uid(),
                    title: (x.title || "").trim(),
                    duration: (x.duration || "").trim(),
                    desc: (x.desc || "").trim(),
                }))
                .filter((x) => x.title || x.duration || x.desc);

            // نخزّن Array مباشرة (بسيط وواضح)
            const { error } = await set(k, clean);
            setSaveStatus(error ? "error" : "success");
            if (!error) setTimeout(() => setSaveStatus(null), 2500);
        } catch {
            setSaveStatus("error");
        }
    };

    /* ----- View: Visitors ----- */
    if (!canEdit) {
        if (!items.length) {
            return (
                <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center text-neutral-500">
                    لا توجد خطوات للعرض حاليًا.
                </div>
            );
        }

        return (
            <div className="relative">
                <div className="absolute right-1/2 translate-x-1/2 w-1 h-full bg-gradient-to-b from-primary to-accent-500 rounded-full" />
                <div className="space-y-12">
                    {items.map((step, i) => (
                        <motion.div
                            key={step.id || i}
                            className={`flex items-center ${i % 2 === 0 ? "flex-row-reverse" : ""}`}
                            initial={{ opacity: 0, x: i % 2 === 0 ? 50 : -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: (i % 4) * 0.1 }}
                        >
                            <div className={`flex-1 ${i % 2 === 0 ? "text-left pr-12" : "text-right pl-12"}`}>
                                <div className="bg-white rounded-2xl p-6 shadow-lg border border-primary/10">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-xl font-bold text-neutral-900">
                                            {step.title || "—"}
                                        </h3>
                                        <span className="text-sm text-neutral-500 bg-neutral-50 px-3 py-1 rounded-full">
                                            {step.duration || "—"}
                                        </span>
                                    </div>
                                    <p className="text-neutral-600">{step.desc || ""}</p>
                                </div>
                            </div>

                            <div className="relative z-10 w-12 h-12 bg-gradient-to-br from-primary to-accent-500 rounded-full grid place-items-center mx-6">
                                <span className="text-white font-bold">{pad2(i + 1)}</span>
                            </div>

                            <div className="flex-1" />
                        </motion.div>
                    ))}
                </div>
            </div>
        );
    }

    /* ----- View: Admin ----- */
    return (
        <div className="space-y-4">
            {/* شريط علوي */}
            <div className="flex items-center gap-2">
                <button
                    onClick={addStep}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary/90 text-white px-3 py-1.5 text-sm"
                    type="button"
                >
                    <Plus className="w-4 h-4" /> إضافة خطوة
                </button>

                <button
                    onClick={saveAll}
                    className="inline-flex items-center gap-2 rounded-lg bg-neutral-800 text-white px-3 py-1.5 text-sm relative"
                    type="button"
                >
                    {saveStatus === "loading" && <Loader2 className="w-4 h-4 animate-spin" />}
                    {saveStatus === "success" && <CheckCircle className="w-4 h-4 text-green-400" />}
                    {saveStatus === "error" && <XCircle className="w-4 h-4 text-red-400" />}
                    <Save className="w-4 h-4" /> حفظ الكل
                </button>

                {saveStatus === "success" && (
                    <span className="text-sm text-green-600">تم الحفظ بنجاح</span>
                )}
                {saveStatus === "error" && (
                    <span className="text-sm text-red-600">فشل الحفظ</span>
                )}
            </div>

            {/* خط الزمن + بطاقات التحرير */}
            <div className="relative">
                <div className="absolute right-1/2 translate-x-1/2 w-1 h-full bg-gradient-to-b from-primary to-accent-500 rounded-full" />

                <div className="space-y-6">
                    {items.map((step, i) => (
                        <div
                            key={step.id}
                            className={`flex items-stretch ${i % 2 === 0 ? "flex-row-reverse" : ""}`}
                        >
                            <div className={`flex-1 ${i % 2 === 0 ? "text-left pr-12" : "text-right pl-12"}`}>
                                <div className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-200">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="text-sm text-neutral-500">#{pad2(i + 1)}</div>
                                        <div className="flex items-center gap-1">
                                            <button onClick={() => moveStep(i, -1)} className="p-1.5 rounded hover:bg-neutral-100" title="أعلى" type="button">
                                                <ArrowUp className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => moveStep(i, +1)} className="p-1.5 rounded hover:bg-neutral-100" title="أسفل" type="button">
                                                <ArrowDown className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => delStep(step.id)} className="p-1.5 rounded hover:bg-red-50 text-red-600" title="حذف" type="button">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-xs text-neutral-500">العنوان</label>
                                            <input
                                                className="border rounded-lg px-2 py-1 text-sm w-full"
                                                value={step.title}
                                                onChange={(e) => updateStep(step.id, { title: e.target.value })}
                                                placeholder="مثلاً: الاستشارة الأولية"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-neutral-500">المدة</label>
                                            <input
                                                className="border rounded-lg px-2 py-1 text-sm w-full ltr"
                                                value={step.duration}
                                                onChange={(e) => updateStep(step.id, { duration: e.target.value })}
                                                placeholder="مثلاً: 60 دقيقة / 3–5 أيام"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="text-xs text-neutral-500">الوصف</label>
                                            <textarea
                                                className="border rounded-lg px-2 py-1 text-sm w-full min-h-[80px]"
                                                value={step.desc}
                                                onChange={(e) => updateStep(step.id, { desc: e.target.value })}
                                                placeholder="وصف مختصر للخطوة…"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* الدائرة مع رقم الخطوة */}
                            <div className="relative z-10 w-12 h-12 bg-gradient-to-br from-primary to-accent-500 rounded-full grid place-items-center mx-6">
                                <span className="text-white font-bold">{pad2(i + 1)}</span>
                            </div>

                            <div className="flex-1" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
