import React, { useMemo, useState } from "react";
import { useContent } from "../ContentProvider";
import {
    Eye, Shield, Zap, CheckCircle, Users, Award, Scale,
    ArrowUp, ArrowDown, Plus, Trash2, Save,
    Loader2,
    XCircle
} from "lucide-react";

function uid() { return Math.random().toString(36).slice(2, 9); }

// خريطة الأيقونات المتاحة للاختيار
const ICONS = { Eye, Shield, Zap, CheckCircle, Users, Award, Scale };
const ICON_OPTIONS = Object.keys(ICONS); // ["Eye","Shield","Zap","CheckCircle","Users","Award","Scale"]

const DEFAULT_ITEMS = [
    { id: uid(), icon: "Eye", title: "الوضوح", desc: "شفافية كاملة في التواصل وتوضيح جميع الخيارات القانونية المتاحة" },
    { id: uid(), icon: "Shield", title: "السرية", desc: "حماية مطلقة لمعلومات العملاء وضمان أقصى درجات الخصوصية" },
    { id: uid(), icon: "Zap", title: "الاستجابة", desc: "رد سريع على الاستفسارات ومتابعة دورية لتطورات القضايا" },
    { id: uid(), icon: "CheckCircle", title: "الحسم", desc: "قرارات حاسمة مبنية على دراسة علمية ومعرفة عميقة بالقانون" },
];

export default function EditableValuesIcons({
    k = "about.values.items",
    gridClassName = "grid md:grid-cols-2 lg:grid-cols-4 gap-8",
}) {
    const { get, set, editMode, isAdmin } = useContent();
    const canEdit = editMode && isAdmin;

    // نقرأ المخزن: قد يكون {items:[...]} أو مصفوفة
    const stored = get(k, { items: DEFAULT_ITEMS });
    const initial = useMemo(() => {
        if (Array.isArray(stored?.items)) return stored.items;
        if (Array.isArray(stored)) return stored;
        return DEFAULT_ITEMS;
    }, [stored]);

    const [items, setItems] = useState(initial);

    const addItem = () =>
        setItems(prev => [...prev, { id: uid(), icon: "Eye", title: "", desc: "" }]);

    const delItem = (id) =>
        setItems(prev => prev.filter(x => x.id !== id));

    const move = (i, d) => {
        const j = i + d; if (j < 0 || j >= items.length) return;
        const arr = [...items];[arr[i], arr[j]] = [arr[j], arr[i]]; setItems(arr);
    };

    const update = (id, patch) =>
        setItems(prev => prev.map(x => x.id === id ? { ...x, ...patch } : x));

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

    // عرض للزوّار
    if (!canEdit) {
        return (
            <div className={gridClassName}>
                {items.map((v) => {
                    const Icon = ICONS[v.icon] || Eye;
                    return (
                        <div key={v.id} className="text-center">
                            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary to-accent-500 rounded-2xl grid place-items-center shadow-soft">
                                <Icon className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-xl font-extrabold text-neutral-900 mb-3">{v.title || "—"}</h3>
                            <p className="text-neutral-600 leading-relaxed">{v.desc || ""}</p>
                        </div>
                    );
                })}
            </div>
        );
    }

    // وضع التحرير (إضافة/اختيار أيقونة/حذف/ترتيب/حفظ الكل)
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <button onClick={addItem} className="inline-flex items-center gap-2 rounded-lg bg-primary/90 text-white px-3 py-1.5 text-sm">
                    <Plus className="w-4 h-4" /> إضافة كرت
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
                {items.map((v, idx) => {
                    const Icon = ICONS[v.icon] || Eye;
                    return (
                        <div key={v.id} className="text-center rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
                            {/* أدوات الترتيب والحذف */}
                            <div className="flex items-center justify-end gap-1 mb-2">
                                <button onClick={() => move(idx, -1)} className="p-1.5 rounded hover:bg-neutral-100" title="أعلى"><ArrowUp className="w-4 h-4" /></button>
                                <button onClick={() => move(idx, 1)} className="p-1.5 rounded hover:bg-neutral-100" title="أسفل"><ArrowDown className="w-4 h-4" /></button>
                                <button onClick={() => delItem(v.id)} className="p-1.5 rounded hover:bg-red-50 text-red-600" title="حذف"><Trash2 className="w-4 h-4" /></button>
                            </div>

                            {/* عرض الأيقونة الحالية */}
                            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-primary to-accent-500 rounded-2xl grid place-items-center shadow-soft">
                                <Icon className="w-10 h-10 text-white" />
                            </div>

                            {/* اختيار الأيقونة */}
                            <label className="text-xs text-neutral-500">الأيقونة</label>
                            <select
                                className="border rounded-lg px-2 py-1 text-sm w-full mb-3"
                                value={v.icon}
                                onChange={(e) => update(v.id, { icon: e.target.value })}
                            >
                                {ICON_OPTIONS.map(name => (
                                    <option key={name} value={name}>{name}</option>
                                ))}
                            </select>

                            {/* العنوان والوصف */}
                            <label className="text-xs text-neutral-500">العنوان</label>
                            <input
                                className="border rounded-lg px-2 py-1 text-sm w-full mb-2"
                                value={v.title}
                                onChange={(e) => update(v.id, { title: e.target.value })}
                                placeholder="عنوان الكرت…"
                            />
                            <label className="text-xs text-neutral-500">الوصف</label>
                            <textarea
                                className="border rounded-lg px-2 py-1 text-sm w-full min-h-[64px]"
                                value={v.desc}
                                onChange={(e) => update(v.id, { desc: e.target.value })}
                                placeholder="وصف مختصر…"
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
