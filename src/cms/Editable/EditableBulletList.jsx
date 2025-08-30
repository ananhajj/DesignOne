import React, { useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, CheckCircle, Loader2, Plus, Save, Trash2, XCircle } from "lucide-react";
import { useContent } from "../ContentProvider";

function uid() { return Math.random().toString(36).slice(2, 9); }
const asArray = (x) => (Array.isArray(x) ? x : []);

function readIndexed(get, kBase, fallbackLenGuess = 10) {
    // يقرأ about.qualifications.0, 1, 2 ... لغاية أول فراغ
    const out = [];
    for (let i = 0; i < Math.max(fallbackLenGuess, 10); i++) {
        const v = get(`${kBase}.${i}`, null);
        if (typeof v !== "string" || !v.trim()) continue;
        out.push(v.trim());
    }
    return out;
}

/**
 * الاستخدام:
 * <EditableBulletList
 *   kBase="about.qualifications"
 *   fallbackItems={["بند1", "بند2", ...]}
 *   iconClass="text-primary"
 * />
 *
 * التخزين:
 * - يقرأ أولاً من about.qualifications.items (Array)
 * - إن مافي، يحاول يقرأ المفاتيح القديمة about.qualifications.0..N
 * - عند الحفظ: يخزّن Array في about.qualifications.items
 */
export default function EditableBulletList({
    kBase,
    itemsKey = "items",
    fallbackItems = [],
    iconClass = "text-primary",
    liClass = "flex items-start gap-3",
    textClass = "text-neutral-600",
    emptyVisitorFallback = null, // ماذا نعرض للزوّار لو القائمة فاضية (null = لا شيء)
}) {
    const { get, set, editMode, isAdmin } = useContent();
    const canEdit = editMode && isAdmin;

    // اقرأ من Array جديدة، وإلا من المفاتيح القديمة، وإلا من fallback
    const storedArray = get(`${kBase}.${itemsKey}`, null);
    const initial = useMemo(() => {
        if (Array.isArray(storedArray)) return storedArray;
        const legacy = readIndexed(get, kBase, Math.max(fallbackItems.length, 10));
        if (legacy.length) return legacy;
        return asArray(fallbackItems);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [storedArray, kBase, JSON.stringify(fallbackItems)]);

    const [items, setItems] = useState(initial.map((t) => ({ id: uid(), text: t })));
    const [status, setStatus] = useState(null); // null | "loading" | "success" | "error"

    useEffect(() => {
        // مزامنة عند تغيّر الـ CMS خارجيًا
        if (Array.isArray(storedArray)) {
            setItems(storedArray.map((t) => ({ id: uid(), text: t })));
        } else {
            const legacy = readIndexed(get, kBase, Math.max(fallbackItems.length, 10));
            if (legacy.length) setItems(legacy.map((t) => ({ id: uid(), text: t })));
            else setItems(asArray(fallbackItems).map((t) => ({ id: uid(), text: t })));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [storedArray]);

    const addItem = () => setItems((prev) => [...prev, { id: uid(), text: "" }]);
    const delItem = (id) => setItems((prev) => prev.filter((x) => x.id !== id));
    const moveItem = (i, dir) => {
        const j = i + dir;
        if (j < 0 || j >= items.length) return;
        const arr = [...items];
        [arr[i], arr[j]] = [arr[j], arr[i]];
        setItems(arr);
    };
    const updateItem = (id, text) => setItems((prev) => prev.map((x) => (x.id === id ? { ...x, text } : x)));

    const saveAll = async () => {
        try {
            setStatus("loading");
            const clean = items.map((x) => (x.text || "").trim()).filter(Boolean);
            const { error } = await set(`${kBase}.${itemsKey}`, clean);
            setStatus(error ? "error" : "success");
            if (!error) setTimeout(() => setStatus(null), 1500);
        } catch {
            setStatus("error");
        }
    };

    // عرض الزوّار
    if (!canEdit) {
        const clean = items.map((x) => x.text).filter(Boolean);
        if (clean.length === 0) return emptyVisitorFallback;
        return (
            <ul className="space-y-4">
                {clean.map((txt, i) => (
                    <li key={i} className={liClass}>
                        <CheckCircle className={`w-5 h-5 ${iconClass} mt-0.5 flex-shrink-0`} />
                        <p className={textClass}>{txt}</p>
                    </li>
                ))}
            </ul>
        );
    }

    // وضع التحرير (أدمن)
    return (
        <div className="space-y-3">
            {/* شريط أدوات */}
            <div className="flex items-center gap-2 pb-1">
                <button
                    type="button"
                    onClick={addItem}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary/90 text-white px-3 py-1.5 text-xs"
                >
                    <Plus className="w-4 h-4" /> إضافة بند
                </button>
                <button
                    type="button"
                    onClick={saveAll}
                    className="inline-flex items-center gap-2 rounded-lg bg-neutral-800 text-white px-3 py-1.5 text-xs"
                >
                    {status === "loading" && <Loader2 className="w-4 h-4 animate-spin" />}
                    {status === "success" && <CheckCircle className="w-4 h-4 text-green-400" />}
                    {status === "error" && <XCircle className="w-4 h-4 text-red-400" />}
                    <Save className="w-4 h-4" /> حفظ الكل
                </button>
            </div>

            {/* العناصر */}
            <div className="space-y-2">
                {items.map((it, idx) => (
                    <div key={it.id} className="rounded-xl border border-neutral-200 bg-white p-3 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-neutral-500">#{idx + 1}</span>
                            <div className="flex items-center gap-1">
                                <button onClick={() => moveItem(idx, -1)} className="p-1.5 rounded hover:bg-neutral-100" title="أعلى">
                                    <ArrowUp className="w-4 h-4" />
                                </button>
                                <button onClick={() => moveItem(idx, 1)} className="p-1.5 rounded hover:bg-neutral-100" title="أسفل">
                                    <ArrowDown className="w-4 h-4" />
                                </button>
                                <button onClick={() => delItem(it.id)} className="p-1.5 rounded hover:bg-red-50 text-red-600" title="حذف">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <input
                            dir="rtl"
                            type="text"
                            value={it.text}
                            onChange={(e) => updateItem(it.id, e.target.value)}
                            placeholder="نص البند…"
                            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                    </div>
                ))}
                {items.length === 0 && (
                    <div className="rounded-lg border border-dashed border-neutral-300 p-4 text-center text-sm text-neutral-500">
                        القائمة فارغة — أضف أول بند.
                    </div>
                )}
            </div>
        </div>
    );
}
