import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useContent } from "../ContentProvider";
import {
    Phone, Mail, MapPin, MessageCircle,
    ArrowUp, ArrowDown, Plus, Trash2, Save
} from "lucide-react";

const ICONS = { phone: Phone, whatsapp: MessageCircle, email: Mail, address: MapPin };
const TYPES = [
    { id: "phone", label: "هاتف" },
    { id: "whatsapp", label: "واتساب" },
    { id: "email", label: "بريد" },
    { id: "address", label: "عنوان" },
];

const uid = () => Math.random().toString(36).slice(2, 9);

const DEFAULT_ITEMS = [
    { id: uid(), type: "phone", label: "هاتف المكتب", value: "+966 11 123 4567", link: "tel:+966111234567" },
    { id: uid(), type: "whatsapp", label: "واتساب", value: "+966 50 123 4567", link: "https://wa.me/966501234567" },
    { id: uid(), type: "email", label: "البريد الإلكتروني", value: "sara@alahmedlaw.com", link: "mailto:sara@alahmedlaw.com" },
    { id: uid(), type: "address", label: "عنوان المكتب", value: "الرياض، حي العليا، طريق الملك فهد", link: "#map" },
];

export default function EditableContactGrid({ k = "contact.items" }) {
    const { get, set, editMode, isAdmin } = useContent();
    const canEdit = editMode && isAdmin;

    const stored = get(k, { items: DEFAULT_ITEMS });
    const initial = useMemo(() => (Array.isArray(stored?.items) ? stored.items : DEFAULT_ITEMS), [stored]);
    const [items, setItems] = useState(initial);

    const addItem = () =>
        setItems(prev => [...prev, { id: uid(), type: "phone", label: "", value: "", link: "" }]);
    const delItem = (id) => setItems(prev => prev.filter(x => x.id !== id));
    const moveItem = (i, d) => {
        const j = i + d;
        if (j < 0 || j >= items.length) return;
        const arr = [...items];
        [arr[i], arr[j]] = [arr[j], arr[i]];
        setItems(arr);
    };
    const update = (id, patch) => setItems(prev => prev.map(x => (x.id === id ? { ...x, ...patch } : x)));

    const saveAll = async () => {
        const clean = items.map(x => ({ ...x, id: x.id || uid() }));
        const { error } = await set(k, { items: clean });
        if (error) alert("❌ فشل الحفظ: " + error.message);
        else alert("✅ تم الحفظ بنجاح");
    };

    if (!canEdit) {
        return (
            <div className="space-y-4">
                {items.map((info, i) => {
                    const Icon = ICONS[info.type] || Phone;
                    return (
                        <motion.a
                            key={info.id}
                            href={info.link}
                            className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-soft hover:shadow-md transition border border-primary/10"
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.08 }}
                        >
                            <span className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary to-accent-500 grid place-items-center">
                                <Icon className="w-6 h-6 text-white" />
                            </span>
                            <span className="text-right">
                                <span className="block text-xs font-semibold text-primary mb-0.5">{info.label}</span>
                                <span className="block text-sm text-neutral-900 hover:text-primary transition">{info.value}</span>
                            </span>
                        </motion.a>
                    );
                })}
            </div>
        );
    }

    // وضع التحرير
    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex gap-2">
                <button
                    onClick={addItem}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary/90 text-white px-3 py-1.5 text-sm"
                >
                    <Plus className="w-4 h-4" /> إضافة
                </button>
                <button
                    onClick={saveAll}
                    className="inline-flex items-center gap-2 rounded-lg bg-neutral-800 text-white px-3 py-1.5 text-sm"
                >
                    <Save className="w-4 h-4" /> حفظ الكل
                </button>
            </div>

            {/* Editable list */}
            {items.map((info, idx) => (
                <div key={info.id} className="p-4 border rounded-xl bg-white space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-neutral-500">#{idx + 1}</span>
                        <div className="flex gap-1">
                            <button onClick={() => moveItem(idx, -1)} className="p-1.5 hover:bg-neutral-100 rounded">
                                <ArrowUp className="w-4 h-4" />
                            </button>
                            <button onClick={() => moveItem(idx, 1)} className="p-1.5 hover:bg-neutral-100 rounded">
                                <ArrowDown className="w-4 h-4" />
                            </button>
                            <button onClick={() => delItem(info.id)} className="p-1.5 hover:bg-red-50 text-red-600 rounded">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs text-neutral-500">النوع</label>
                            <select
                                value={info.type}
                                onChange={(e) => update(info.id, { type: e.target.value })}
                                className="w-full border rounded-lg px-2 py-1 text-sm"
                            >
                                {TYPES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs text-neutral-500">التسمية</label>
                            <input
                                value={info.label}
                                onChange={(e) => update(info.id, { label: e.target.value })}
                                className="w-full border rounded-lg px-2 py-1 text-sm"
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs text-neutral-500">القيمة</label>
                            <input
                                value={info.value}
                                onChange={(e) => update(info.id, { value: e.target.value })}
                                className="w-full border rounded-lg px-2 py-1 text-sm"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-neutral-500">الرابط</label>
                            <input
                                value={info.link}
                                onChange={(e) => update(info.id, { link: e.target.value })}
                                className="w-full border rounded-lg px-2 py-1 text-sm"
                            />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
