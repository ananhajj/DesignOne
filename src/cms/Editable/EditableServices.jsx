import { motion } from "framer-motion";
import { ArrowDown, ArrowUp, CheckCircle, Loader2, Plus, Save, Trash2, XCircle } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useContent } from "../ContentProvider";
import EditableText from "./EditableText";

function uid() {
    return Math.random().toString(36).slice(2, 9);
}

const DEFAULT_SERVICES = [
    { id: uid(), badge: "خدمة", title: "القانون التجاري", desc: "تأسيس الشركات…", more: "تفاصيل أكثر →" },
    { id: uid(), badge: "خدمة", title: "القانون المدني", desc: "التعويضات والالتزامات…", more: "تفاصيل أكثر →" },
    { id: uid(), badge: "خدمة", title: "العمل والعمّال", desc: "عقود العمل والنزاعات…", more: "تفاصيل أكثر →" },
];

export default function EditableServices({
    k = "services.items",
    gridClassName = "grid lg:grid-cols-3 gap-8",
    cardClassName = "bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-primary/10",
}) {
    const { get, set, editMode, isAdmin } = useContent();
    const canEdit = editMode && isAdmin;

    // اقرأ المخزون: قد يكون Array مباشرة أو {items:[...]}
    const stored = get(k, DEFAULT_SERVICES);
    const initialItems = useMemo(() => {
        if (Array.isArray(stored)) return stored;
        if (Array.isArray(stored?.items)) return stored.items;
        return DEFAULT_SERVICES;
    }, [stored]);

    const [items, setItems] = useState(initialItems);
    const [saveStatus, setSaveStatus] = useState(null);

    // تزامن عند تغيّر المخزون (مثلاً بعد fetch)
    useEffect(() => {
        if (Array.isArray(stored)) setItems(stored);
        else if (Array.isArray(stored?.items)) setItems(stored.items);
    }, [stored]);

    const addItem = () =>
        setItems((prev) => [...prev, { id: uid(), badge: "خدمة", title: "", desc: "", more: "" }]);

    const delItem = (id) => setItems((prev) => prev.filter((x) => x.id !== id));

    const move = (i, dir) => {
        const j = i + dir;
        if (j < 0 || j >= items.length) return;
        const copy = [...items];
        [copy[i], copy[j]] = [copy[j], copy[i]];
        setItems(copy);
    };

    const update = (id, patch) =>
        setItems((prev) => prev.map((x) => (x.id === id ? { ...x, ...patch } : x)));

    const saveAll = async () => {
        setSaveStatus("loading");
        const clean = items
            .map(({ id, title, desc, more, badge }) => ({
                id: id || uid(),
                title: (title || "").trim(),
                desc: (desc || "").trim(),
                more: (more || "").trim(),
                badge: (badge || "").trim(),
            }))
            .filter(x => x.title || x.desc); // تجاهل الفارغ تماماً

        // خزنها كمصفوفة مباشرة (نفس شكل بياناتك الحالية)
        const { error } = await set(k, clean);

        if (error) setSaveStatus("error");
        else {
            setSaveStatus("success");
            setTimeout(() => setSaveStatus(null), 3000);
        }
    };

    // عرض للزائر
    if (!canEdit) {
        return (
            <div className={gridClassName}>
                {items.map((s, index) => {
                    // more: رابط أو نص؛ إذا بدأ بـ http/https أو "/" نعامله كرابط
                    const isLink = typeof s.more === "string" && /^(https?:\/\/|\/)/i.test(s.more);
                    const MoreEl = isLink
                        ? (s.more.startsWith("http")
                            ? <a href={s.more} className="inline-block text-primary hover:text-accent-500 transition text-sm mt-4">{s.more}</a>
                            : <Link to={s.more} className="inline-block text-primary hover:text-accent-500 transition text-sm mt-4">{s.more}</Link>)
                        : (s.more ? <span className="inline-block text-primary text-sm mt-4">{s.more}</span> : null);

                    return (
                        <motion.div
                            key={s.id}
                            className={cardClassName}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: (index % 3) * 0.15 }}
                            whileHover={{ y: -4 }}
                        >
                            <div className="flex justify-between items-start mb-6">
                                <h3 className="text-xl font-bold text-neutral-900">{s.title || "—"}</h3>
                                <span className="px-3 py-1 bg-gradient-to-r from-primary to-accent-500 text-white text-xs rounded-full">
                                    {s.badge || "خدمة"}
                                </span>
                            </div>

                            <p className="text-neutral-600 text-sm leading-7">{s.desc || ""}</p>
                            {MoreEl}
                        </motion.div>
                    );
                })}
            </div>
        );
    }

    // وضع التحرير
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <button
                    onClick={addItem}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary/90 text-white px-3 py-1.5 text-sm"
                >
                    <Plus className="w-4 h-4" /> إضافة خدمة
                </button>
                <button
                    onClick={saveAll}
                    className="inline-flex items-center gap-2 rounded-lg bg-neutral-800 text-white px-3 py-1.5 text-sm relative"
                >
                    {saveStatus === "loading" && <Loader2 className="w-4 h-4 animate-spin" />}
                    {saveStatus === "success" && <CheckCircle className="w-4 h-4 text-green-400" />}
                    {saveStatus === "error" && <XCircle className="w-4 h-4 text-red-400" />}
                    <Save className="w-4 h-4" /> حفظ الكل
                </button>
                {saveStatus === "success" && <span className="text-sm text-green-600">تم الحفظ بنجاح</span>}
                {saveStatus === "error" && <span className="text-sm text-red-600">فشل الحفظ</span>}
            </div>

            <div className={gridClassName}>
                {items.map((s, idx) => (
                    <div key={s.id} className={`${cardClassName} border-primary/20`}>
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-xs text-neutral-500">#{idx + 1}</span>
                            <div className="flex items-center gap-1">
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

                        <div className="grid gap-2">
                            <label className="text-xs text-neutral-500">الشارة (badge)</label>
                            <input
                                className="border rounded-lg px-2 py-1 text-sm"
                                value={s.badge || ""}
                                onChange={(e) => update(s.id, { badge: e.target.value })}
                                placeholder="خدمة / اختصاص…"
                            />

                            <label className="text-xs text-neutral-500">العنوان</label>
                            <input
                                className="border rounded-lg px-2 py-1 text-sm"
                                value={s.title || ""}
                                onChange={(e) => update(s.id, { title: e.target.value })}
                                placeholder="مثال: القانون التجاري"
                            />

                            <label className="text-xs text-neutral-500">الوصف</label>
                            <textarea
                                className="border rounded-lg px-2 py-1 text-sm min-h-[80px]"
                                value={s.desc || ""}
                                onChange={(e) => update(s.id, { desc: e.target.value })}
                                placeholder="وصف مختصر للخدمة…"
                            />

                            <label className="text-xs text-neutral-500">المزيد (رابط أو نص)</label>
                            <input
                                className="border rounded-lg px-2 py-1 text-sm"
                                value={s.more || ""}
                                onChange={(e) => update(s.id, { more: e.target.value })}
                                placeholder="https://example.com أو /services/commercial أو اتركه فارغًا"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
