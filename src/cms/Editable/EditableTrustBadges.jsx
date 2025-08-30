import React, { useEffect, useMemo, useState } from "react";
import { Scale, Plus, Trash2, ArrowUp, ArrowDown, Save } from "lucide-react";
import { useContent } from "../ContentProvider";

function uid() {
    return Math.random().toString(36).slice(2, 9);
}

// حوّل أي عنصر قديم (string أو object) لشكل موحّد {id, label}
function normalizeItems(list = []) {
    return (Array.isArray(list) ? list : [])
        .map((x) => {
            if (typeof x === "string") return { id: uid(), label: x.trim() };
            return { id: x.id || uid(), label: (x.label ?? x.text ?? "").trim() };
        })
        .filter((x) => x.label);
}

export default function EditableTrustBadges({
    k = "trust",                    // مفتاح التخزين
    fallback = ["وزارة العدل", "نقابة المحامين", "غرفة التجارة", "مركز التحكيم"],
    gridClassName = "mt-8 grid grid-cols-2 sm:grid-cols-4 gap-6 opacity-80",
    cardClassName = "flex items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-3 shadow-sm",
}) {
    const { get, set, editMode, isAdmin } = useContent();
    const canEdit = editMode && isAdmin;

    // اقرأ المخزون (لو كان undefined يرجّع fallback)
    const stored = get(k, fallback);
    const initial = useMemo(() => normalizeItems(stored) || normalizeItems(fallback), [stored, fallback]);

    const [items, setItems] = useState(initial);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState("");

    // لما تتغيّر الداتا بالمخزن (بعد fetch أو حفظ من مكان آخر) نزامن
    useEffect(() => {
        setItems(normalizeItems(stored) || normalizeItems(fallback));
    }, [stored, fallback]);

    const add = () => setItems((prev) => [...prev, { id: uid(), label: "" }]);
    const del = (id) => setItems((prev) => prev.filter((x) => x.id !== id));
    const move = (i, d) => {
        const j = i + d;
        if (j < 0 || j >= items.length) return;
        const arr = [...items];
        [arr[i], arr[j]] = [arr[j], arr[i]];
        setItems(arr);
    };
    const update = (id, patch) =>
        setItems((prev) => prev.map((x) => (x.id === id ? { ...x, ...patch } : x)));

    const saveAll = async () => {
        setSaving(true);
        setStatus("جارٍ الحفظ...");
        const clean = normalizeItems(items);
        // 👈 خزّن Array مباشرة بنفس المفتاح k
        const { error } = await set(k, clean);
        if (error) setStatus("فشل الحفظ: " + error.message);
        else {
            setStatus("تم الحفظ");
            setItems(clean);
            setTimeout(() => setStatus(""), 2000);
        }
        setSaving(false);
    };

    // عرض للزوّار
    if (!canEdit) {
        return (
            <div className={gridClassName}>
                {items.map((b, i) => (
                    <div key={b.id || i} className={cardClassName}>
                        <Scale className="w-4 h-4 text-primary" />
                        <span className="text-xs font-semibold text-neutral-700">{b.label || "—"}</span>
                    </div>
                ))}
            </div>
        );
    }

    // وضع التحرير
    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2">
                <button
                    onClick={add}
                    type="button"
                    className="inline-flex items-center gap-2 rounded-lg bg-primary/90 text-white px-3 py-2 text-xs"
                    disabled={saving}
                >
                    <Plus className="w-4 h-4" /> إضافة جهة
                </button>
                <button
                    onClick={saveAll}
                    type="button"
                    className="inline-flex items-center gap-2 rounded-lg bg-neutral-800 text-white px-3 py-1.5 text-xs"
                    disabled={saving}
                >
                    {saving ? <Save className="w-4 h-4 animate-pulse" /> : <Save className="w-4 h-4" />} حفظ الكل
                </button>
                {status && (
                    <span className={`text-xs ${status.startsWith("تم") ? "text-green-600" : status.startsWith("فشل") ? "text-red-600" : "text-neutral-600"}`}>
                        {status}
                    </span>
                )}
            </div>

            <div className={gridClassName}>
                {items.map((b, idx) => (
                    <div key={b.id} className={`${cardClassName} border-primary/20`}>
                        <Scale className="w-4 h-4 text-primary" />
                        <input
                            className="text-xs font-semibold text-neutral-900 border rounded px-2 py-1 min-w-[8rem]"
                            placeholder="اسم الجهة…"
                            value={b.label}
                            onChange={(e) => update(b.id, { label: e.target.value })}
                        />
                        <div className="flex items-center gap-1 ml-1">
                            <button onClick={() => move(idx, -1)} title="أعلى" className="p-1.5 rounded hover:bg-neutral-100" type="button">
                                <ArrowUp className="w-4 h-4" />
                            </button>
                            <button onClick={() => move(idx, +1)} title="أسفل" className="p-1.5 rounded hover:bg-neutral-100" type="button">
                                <ArrowDown className="w-4 h-4" />
                            </button>
                            <button onClick={() => del(b.id)} title="حذف" className="p-1.5 rounded hover:bg-red-50 text-red-600" type="button">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
