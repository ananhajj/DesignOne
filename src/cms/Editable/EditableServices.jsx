import React, { useMemo, useState } from "react";
import { useContent } from "../ContentProvider";
import { ArrowUp, ArrowDown, Plus, Trash2, Save, XCircle, CheckCircle, Loader2 } from "lucide-react";

function uid() {
    return Math.random().toString(36).slice(2, 9);
}

const DEFAULT_ITEMS = [
    { id: uid(), badge: "خدمة", title: "القانون التجاري", desc: "تأسيس الشركات، العقود، المنازعات", more: "تفاصيل أكثر →" },
    { id: uid(), badge: "خدمة", title: "القانون المدني", desc: "التعويضات، الالتزامات، النزاعات", more: "تفاصيل أكثر →" },
    { id: uid(), badge: "خدمة", title: "العمل والعمّال", desc: "عقود، فصل تعسفي، مستحقات", more: "تفاصيل أكثر →" },
];

export default function EditableServices({
    k = "services.items", // المفتاح الذي نخزن تحته القائمة كلها
    gridClassName = "grid gap-6 sm:grid-cols-2 lg:grid-cols-3",
    cardClassName = "card card-hover",
}) {
    const { get, set, editMode, isAdmin } = useContent();

    // نقرأ القائمة (مصفوفة) من الـ CMS؛ لو مش موجودة نستخدم الافتراضي
    const stored = get(k, DEFAULT_ITEMS);
    const initialItems = useMemo(() => {
        // إذا كان stored مصفوفة استخدمها، وإذا كان شكل قديم فيه items استخدم stored.items
        if (Array.isArray(stored)) return stored;
        if (Array.isArray(stored?.items)) return stored.items;
        return DEFAULT_ITEMS;
    }, [stored]);
 

    const [items, setItems] = useState(initialItems);
    const canEdit = editMode && isAdmin;

    // حفظ كامل المصفوفة مرة واحدة
    const [saveStatus, setSaveStatus] = useState(null);
    const saveAll = async () => {
        setSaveStatus("loading");
        const clean = items.map(({ id, badge, title, desc, more }) => ({
            id: id || uid(),
            badge,
            title,
            desc,
            more,
        }));

        const { error } = await set(k, clean);

        if (error) {
            setSaveStatus("error");
        } else {
            setSaveStatus("success");
            setTimeout(() => setSaveStatus(null), 3000); // يرجع يختفي بعد 3 ثواني
        }
    };
    // إجراءات الإدارة
    const addItem = () => setItems(prev => [...prev, { id: uid(), badge: "خدمة", title: "", desc: "", more: "تفاصيل أكثر →" }]);
    const deleteItem = (id) => setItems(prev => prev.filter(it => it.id !== id));
    const move = (index, dir) => {
        const to = index + dir;
        if (to < 0 || to >= items.length) return;
        const copy = [...items];
        const tmp = copy[index];
        copy[index] = copy[to];
        copy[to] = tmp;
        setItems(copy);
    };
    const update = (id, patch) => {
        setItems(prev => prev.map(it => (it.id === id ? { ...it, ...patch } : it)));
    };

    // عرض عادي للزوار
    if (!canEdit) {
        return (
            <div className={gridClassName}>
                {items.map((s) => (
                    <div key={s.id} className={cardClassName}>
                        <div className="badge badge-primary">{s.badge || "خدمة"}</div>
                        <h3 className="mt-3 text-lg font-extrabold text-primary">{s.title || "—"}</h3>
                        <p className="mt-2 text-sm text-neutral-600">{s.desc || ""}</p>
                        {s.more && <div className="mt-4 text-sm font-semibold text-primary opacity-70">{s.more}</div>}
                    </div>
                ))}
            </div>
        );
    }

    // وضع التحرير (أدمن)
    return (
        <div className="space-y-4">
            {/* شريط أدوات */}
            <div className="flex items-center gap-2">
                <button onClick={addItem} className="inline-flex items-center gap-2 rounded-lg bg-primary/90 text-white px-3 py-1.5 text-sm">
                    <Plus className="w-4 h-4" /> إضافة خدمة
                </button>
                <button
                    onClick={saveAll}
                    className="inline-flex items-center gap-2 rounded-lg bg-neutral-800 text-white px-3 py-1.5 text-sm relative"
                >
                    {saveStatus === "loading" && (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    )}
                    {saveStatus === "success" && (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                    )}
                    {saveStatus === "error" && (
                        <XCircle className="w-4 h-4 text-red-400" />
                    )}
                    <Save className="w-4 h-4" /> حفظ الكل
                </button>
                {saveStatus === "success" && (
                    <span className="text-sm text-green-600">تم الحفظ بنجاح</span>
                )}
                {saveStatus === "error" && (
                    <span className="text-sm text-red-600">فشل الحفظ</span>
                )}
            </div>

            <div className={gridClassName}>
                {items.map((s, idx) => (
                    <div key={s.id} className={`${cardClassName} border border-primary/10`}>
                        <div className="flex items-center justify-between">
                            <div className="badge badge-primary">{s.badge || "خدمة"}</div>
                            <div className="flex items-center gap-1">
                                <button onClick={() => move(idx, -1)} title="أعلى" className="p-1.5 rounded hover:bg-neutral-100"><ArrowUp className="w-4 h-4" /></button>
                                <button onClick={() => move(idx, +1)} title="أسفل" className="p-1.5 rounded hover:bg-neutral-100"><ArrowDown className="w-4 h-4" /></button>
                                <button onClick={() => deleteItem(s.id)} title="حذف" className="p-1.5 rounded hover:bg-red-50 text-red-600"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        </div>

                        <div className="mt-3 grid gap-2">
                            <label className="text-xs text-neutral-500">الشارة (badge)</label>
                            <input
                                className="border rounded-lg px-2 py-1 text-sm"
                                value={s.badge || ""}
                                onChange={(e) => update(s.id, { badge: e.target.value })}
                                placeholder="خدمة"
                            />

                            <label className="text-xs text-neutral-500">العنوان</label>
                            <input
                                className="border rounded-lg px-2 py-1 text-sm"
                                value={s.title || ""}
                                onChange={(e) => update(s.id, { title: e.target.value })}
                                placeholder="القانون التجاري"
                            />

                            <label className="text-xs text-neutral-500">الوصف</label>
                            <textarea
                                className="border rounded-lg px-2 py-1 text-sm min-h-[70px]"
                                value={s.desc || ""}
                                onChange={(e) => update(s.id, { desc: e.target.value })}
                                placeholder="نبذة مختصرة…"
                            />

                            <label className="text-xs text-neutral-500">نص الرابط (اختياري)</label>
                            <input
                                className="border rounded-lg px-2 py-1 text-sm"
                                value={s.more || ""}
                                onChange={(e) => update(s.id, { more: e.target.value })}
                                placeholder="تفاصيل أكثر →"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
