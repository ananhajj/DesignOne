// src/cms/Editable/EditableSocialLinks.jsx
import React, { useMemo, useState } from "react";
import { useContent } from "../ContentProvider";
import { Plus, Trash2, Save, CheckCircle, XCircle, Loader2 } from "lucide-react";

const uid = () => Math.random().toString(36).slice(2, 9);

const DEFAULT_ITEMS = [
    { id: uid(), name: "LinkedIn", url: "#" },
    { id: uid(), name: "X", url: "#" },
    { id: uid(), name: "Instagram", url: "#" },
];

export default function EditableSocialLinks({ k = "contact.social" }) {
    const { get, set, editMode, isAdmin } = useContent();
    const canEdit = editMode && isAdmin;

    const stored = get(k, { items: DEFAULT_ITEMS });
    const initial = useMemo(() => (Array.isArray(stored?.items) ? stored.items : DEFAULT_ITEMS), [stored]);
    const [items, setItems] = useState(initial);
    const [status, setStatus] = useState(null);

    const addItem = () => setItems((p) => [...p, { id: uid(), name: "", url: "" }]);
    const delItem = (id) => setItems((p) => p.filter((x) => x.id !== id));
    const update = (id, patch) => setItems((p) => p.map((x) => (x.id === id ? { ...x, ...patch } : x)));

    const saveAll = async () => {
        try {
            setStatus("loading");
            const clean = items.map((x) => ({ id: x.id || uid(), name: x.name || "", url: x.url || "" }));
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
            <div className="flex gap-3 flex-wrap">
                {items.map((s) => (
                    <a
                        key={s.id}
                        href={s.url || "#"}
                        className="inline-flex items-center justify-center rounded-xl border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-800 hover:border-primary hover:text-primary transition"
                        target={s.url ? "_blank" : undefined}
                        rel={s.url ? "noopener noreferrer" : undefined}
                    >
                        {s.name || "—"}
                    </a>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2">
                <button onClick={addItem} className="inline-flex items-center gap-2 rounded-lg bg-primary/90 text-white px-3 py-1.5 text-sm">
                    <Plus className="w-4 h-4" /> إضافة
                </button>
                <button
                    onClick={saveAll}
                    className="inline-flex items-center gap-2 rounded-lg bg-neutral-800 text-white px-3 py-1.5 text-sm disabled:bg-neutral-600 disabled:cursor-not-allowed"
                    disabled={status === "loading"}
                >
                    {status === "loading" && <Loader2 className="w-4 h-4 animate-spin" />}
                    {status === "success" && <CheckCircle className="w-4 h-4 text-green-400" />}
                    {status === "error" && <XCircle className="w-4 h-4 text-red-400" />}
                    <Save className="w-4 h-4" /> حفظ الكل
                </button>
                {status === "success" && <span className="text-sm text-green-600">تم الحفظ</span>}
                {status === "error" && <span className="text-sm text-red-600">فشل الحفظ</span>}
            </div>

            <div className="grid gap-3">
                {items.map((s) => (
                    <div key={s.id} className="grid md:grid-cols-[1fr,2fr,auto] gap-3 items-center border rounded-xl p-3 bg-white">
                        <input
                            className="border rounded-lg px-2 py-1 text-sm"
                            value={s.name}
                            onChange={(e) => update(s.id, { name: e.target.value })}
                            placeholder="LinkedIn / X / Instagram …"
                        />
                        <input
                            className="border rounded-lg px-2 py-1 text-sm"
                            value={s.url}
                            onChange={(e) => update(s.id, { url: e.target.value })}
                            placeholder="https://…"
                        />
                        <button onClick={() => delItem(s.id)} className="p-1.5 rounded hover:bg-red-50 text-red-600">
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
