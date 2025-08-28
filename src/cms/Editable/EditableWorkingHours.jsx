// src/cms/Editable/EditableWorkingHours.jsx
import React, { useMemo, useState } from "react";
import { useContent } from "../ContentProvider";
import { ArrowUp, ArrowDown, Plus, Trash2, Save, CheckCircle, XCircle, Loader2, Clock } from "lucide-react";

const uid = () => Math.random().toString(36).slice(2, 9);

const DEFAULT_ITEMS = [
    { id: uid(), day: "الأحد - الخميس", hours: "9:00 ص - 5:00 م" },
    { id: uid(), day: "الجمعة", hours: "1:00 م - 5:00 م" },
    { id: uid(), day: "السبت", hours: "مغلق" },
];

export default function EditableWorkingHours({ k = "contact.hours" }) {
    const { get, set, editMode, isAdmin } = useContent();
    const canEdit = editMode && isAdmin;

    const stored = get(k, { items: DEFAULT_ITEMS });
    const initial = useMemo(() => (Array.isArray(stored?.items) ? stored.items : DEFAULT_ITEMS), [stored]);
    const [items, setItems] = useState(initial);
    const [status, setStatus] = useState(null); // null | 'loading' | 'success' | 'error'

    const addItem = () => setItems((p) => [...p, { id: uid(), day: "", hours: "" }]);
    const delItem = (id) => setItems((p) => p.filter((x) => x.id !== id));
    const move = (i, d) => {
        const j = i + d;
        if (j < 0 || j >= items.length) return;
        const a = [...items];
        [a[i], a[j]] = [a[j], a[i]];
        setItems(a);
    };
    const update = (id, patch) => setItems((p) => p.map((x) => (x.id === id ? { ...x, ...patch } : x)));

    const saveAll = async () => {
        try {
            setStatus("loading");
            const clean = items.map((x) => ({ id: x.id || uid(), day: x.day || "", hours: x.hours || "" }));
            const { error } = await set(k, { items: clean });
            if (error) setStatus("error");
            else {
                setStatus("success");
                setTimeout(() => setStatus(null), 2000);
            }
        } catch {
            setStatus("error");
        }
    };

    if (!canEdit) {
        return (
            <div className="bg-white rounded-2xl shadow-soft p-6 border border-primary/10">
                <div className="space-y-3">
                    {items.map((s) => (
                        <div key={s.id} className="flex items-center justify-between py-2">
                            <span className="text-neutral-600">{s.hours}</span>
                            <span className="font-semibold text-neutral-900">{s.day}</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2">
                <button onClick={addItem} className="inline-flex items-center gap-2 rounded-lg bg-primary/90 text-white px-3 py-1.5 text-sm">
                    <Plus className="w-4 h-4" /> إضافة سطر
                </button>
                <button
                    onClick={saveAll}
                    className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-white bg-neutral-800 disabled:bg-neutral-600 disabled:cursor-not-allowed"
                    disabled={status === "loading"}
                >
                    {status === "loading" && <Loader2 className="w-4 h-4 animate-spin" />}
                    {status === "success" && <CheckCircle className="w-4 h-4 text-green-400" />}
                    {status === "error" && <XCircle className="w-4 h-4 text-red-400" />}
                    <Save className="w-4 h-4" />
                    حفظ الكل
                </button>
                {status === "success" && <span className="text-sm text-green-600">تم الحفظ</span>}
                {status === "error" && <span className="text-sm text-red-600">فشل الحفظ</span>}
            </div>

            <div className="bg-white rounded-2xl shadow-soft p-6 border border-primary/10">
                <div className="space-y-3">
                    {items.map((s, idx) => (
                        <div key={s.id} className="grid md:grid-cols-[1fr,1fr,auto] gap-2 items-center">
                            <input
                                className="border rounded-lg px-2 py-1 text-sm"
                                value={s.day}
                                onChange={(e) => update(s.id, { day: e.target.value })}
                                placeholder="اليوم"
                            />
                            <input
                                className="border rounded-lg px-2 py-1 text-sm"
                                value={s.hours}
                                onChange={(e) => update(s.id, { hours: e.target.value })}
                                placeholder="9:00 ص - 5:00 م"
                            />
                            <div className="flex gap-1 justify-end">
                                <button onClick={() => move(idx, -1)} className="p-1.5 rounded hover:bg-neutral-100" title="أعلى">
                                    <ArrowUp className="w-4 h-4" />
                                </button>
                                <button onClick={() => move(idx, +1)} className="p-1.5 rounded hover:bg-neutral-100" title="أسفل">
                                    <ArrowDown className="w-4 h-4" />
                                </button>
                                <button onClick={() => delItem(s.id)} className="p-1.5 rounded hover:bg-red-50 text-red-600" title="حذف">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
