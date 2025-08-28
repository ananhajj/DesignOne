// src/cms/Editable/EditableMediaGrid.jsx
import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useContent } from "../ContentProvider";
import {
    Calendar, Clock, Eye, FileText, Mic, Play, ArrowRight,
    ArrowUp, ArrowDown, Plus, Trash2, Save, CheckCircle, XCircle, Loader2
} from "lucide-react";

const TYPE_ICONS = { article: FileText, video: Play, podcast: Mic, interview: Mic };
const TYPE_LABELS = { article: "مقال", video: "فيديو", podcast: "بودكاست", interview: "تصريح" };

const uid = () => (crypto?.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2, 9));

const DEFAULT_ITEMS = [
    {
        id: uid(),
        type: "article",
        title: "التطورات الجديدة في قانون الشركات السعودي 2024",
        excerpt: "تحليل شامل للتعديلات الجديدة على نظام الشركات وتأثيرها على القطاع الخاص...",
        date: "2024-01-15",
        readTime: "8 دقائق",
        image: "article",
        category: "قانون تجاري",
        url: ""
    },
    {
        id: uid(),
        type: "video",
        title: "حقوق المستأجر في النظام السعودي - برنامج القانون والحياة",
        excerpt: "مقابلة تلفزيونية مع قناة الإخبارية حول التطورات في قانون الإيجار...",
        date: "2024-01-10",
        duration: "25 دقيقة",
        image: "video",
        category: "قانون عقاري",
        url: ""
    },
    {
        id: uid(),
        type: "podcast",
        title: "بودكاست: الذكاء الاصطناعي والقانون - التحديات والفرص",
        excerpt: "حلقة نقاشية حول تأثير التقنيات الحديثة على الممارسة القانونية...",
        date: "2024-01-05",
        duration: "45 دقيقة",
        image: "podcast",
        category: "تقنية قانونية",
        url: ""
    },
    {
        id: uid(),
        type: "interview",
        title: "تصريح صحفي: نتائج دراسة النزاعات العقارية في السعودية",
        excerpt: "تصريح لصحيفة الاقتصادية حول ارتفاع النزاعات العقارية وحلولها...",
        date: "2024-01-03",
        readTime: "5 دقائق",
        image: "interview",
        category: "قانون عقاري",
        url: ""
    },
    {
        id: uid(),
        type: "article",
        title: "دليل المحامي للتحكيم الإلكتروني في عصر الرقمنة",
        excerpt: "مقال متخصص حول آليات التحكيم الإلكتروني وأفضل الممارسات...",
        date: "2023-12-20",
        readTime: "12 دقيقة",
        image: "article",
        category: "تحكيم",
        url: ""
    },
    {
        id: uid(),
        type: "video",
        title: "ورشة عمل: إدارة المخاطر القانونية للشركات الناشئة",
        excerpt: "ورشة تدريبية شاملة حول الحماية القانونية للشركات الناشئة...",
        date: "2023-12-15",
        duration: "2 ساعة",
        image: "workshop",
        category: "قانون تجاري",
        url: ""
    },
];

function formatDate(dateString) {
    try {
        return new Date(dateString).toLocaleDateString("ar-SA", { year: "numeric", month: "long", day: "numeric" });
    } catch {
        return dateString || "—";
    }
}

export default function EditableMediaGrid({
    k = "media.items",          
    gridCols = "grid md:grid-cols-2 lg:grid-cols-3 gap-8",
}) {
    const { get, set, editMode, isAdmin } = useContent();
    const canEdit = editMode && isAdmin;

    // قراءة: قد تكون {items:[...]} أو مصفوفة مباشرة
    const stored = get(k, { items: DEFAULT_ITEMS });
    const initial = useMemo(() => {
        if (Array.isArray(stored?.items)) return stored.items;
        if (Array.isArray(stored)) return stored;
        return DEFAULT_ITEMS;
    }, [stored]);

    const [items, setItems] = useState(initial);
    const [activeFilter, setActiveFilter] = useState("all");
    const [saveStatus, setSaveStatus] = useState(null); // null|"loading"|"success"|"error"
    const [dirty, setDirty] = useState(false);

    // مزامنة إذا تغيّر المخزّن خارجيًا
    useEffect(() => { setItems(initial); setDirty(false); }, [initial]);

    // CRUD + ترتيب
    const addItem = () => {
        setItems(prev => [
            ...prev,
            {
                id: uid(),
                type: "article",
                title: "",
                excerpt: "",
                date: "",
                readTime: "",
                duration: "",
                image: "article",
                category: "",
                url: ""
            }
        ]);
        setDirty(true);
    };

    const delItem = (id) => { setItems(prev => prev.filter(x => x.id !== id)); setDirty(true); };

    const moveItem = (i, d) => {
        const j = i + d;
        if (j < 0 || j >= items.length) return;
        const arr = [...items];
        [arr[i], arr[j]] = [arr[j], arr[i]];
        setItems(arr);
        setDirty(true);
    };

    const update = (id, patch) => {
        setItems(prev => prev.map(x => (x.id === id ? { ...x, ...patch } : x)));
        setDirty(true);
    };

    // حفظ
    const saveAll = async () => {
        try {
            setSaveStatus("loading");
            const clean = items.map(x => ({
                id: x.id || uid(),
                type: ["article", "video", "podcast", "interview"].includes(x.type) ? x.type : "article",
                title: x.title || "",
                excerpt: x.excerpt || "",
                date: x.date || "",
                readTime: x.readTime || "",
                duration: x.duration || "",
                image: x.image || "",
                category: x.category || "",
                url: x.url || "",
            }));
            const { error } = await set(k, { items: clean }); // موحّد مع بقية مكوّناتك
            if (error) return setSaveStatus("error");
            setSaveStatus("success");
            setDirty(false);
            setTimeout(() => setSaveStatus(null), 2500);
        } catch {
            setSaveStatus("error");
        }
    };

    // فلاتر ديناميكية من العناصر الحالية
    const filters = useMemo(() => {
        const counts = { all: items.length, article: 0, video: 0, podcast: 0, interview: 0 };
        items.forEach(i => { counts[i.type] = (counts[i.type] || 0) + 1; });
        return [
            { id: "all", label: "الكل", count: counts.all },
            { id: "article", label: "مقالات", count: counts.article || 0 },
            { id: "video", label: "فيديو", count: counts.video || 0 },
            { id: "podcast", label: "بودكاست", count: counts.podcast || 0 },
            { id: "interview", label: "تصريحات", count: counts.interview || 0 },
        ];
    }, [items]);

    const filteredItems = activeFilter === "all" ? items : items.filter(i => i.type === activeFilter);

    // عرض للزوّار
    if (!canEdit) {
        return (
            <>
                {/* Filters */}
                <section className="py-8 bg-white/50">
                    <div className="container-pro">
                        <div className="flex flex-wrap justify-center gap-3">
                            {filters.map(f => {
                                const active = activeFilter === f.id;
                                return (
                                    <motion.button
                                        key={f.id}
                                        onClick={() => setActiveFilter(f.id)}
                                        className={`flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold transition
                    ${active
                                                ? "bg-gradient-to-r from-primary to-accent-500 text-white shadow-sm"
                                                : "bg-white text-neutral-600 border border-primary/10 hover:border-primary/30 hover:text-primary"}`}
                                        whileHover={{ scale: 1.04 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        {f.label}
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${active ? "bg-white/20" : "bg-primary/10 text-neutral-700"}`}>
                                            {f.count}
                                        </span>
                                    </motion.button>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Grid */}
                <section className="py-20">
                    <div className="container-pro">
                        <div className={gridCols}>
                            {filteredItems.map((item, index) => {
                                const TypeIcon = TYPE_ICONS[item.type] || FileText;
                                const headerGradient = index % 2 === 0 ? "from-primary to-accent-500" : "from-accent-500 to-primary";
                                return (
                                    <motion.article
                                        key={item.id}
                                        className="bg-white rounded-2xl shadow-soft hover:shadow-md transition-all duration-300 overflow-hidden border border-primary/10 group"
                                        initial={{ opacity: 0, y: 50 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.6, delay: index * 0.08 }}
                                        whileHover={{ y: -6 }}
                                    >
                                        {/* Thumbnail */}
                                        <div className={`relative h-48 bg-gradient-to-br ${headerGradient}`}>
                                            <div className="absolute inset-0 grid place-items-center">
                                                <TypeIcon className="w-12 h-12 text-white/80" />
                                            </div>
                                            <div className="absolute top-4 left-4">
                                                <span className="px-3 py-1 rounded-full bg-white/90 text-primary text-xs font-semibold">
                                                    {TYPE_LABELS[item.type] || item.type}
                                                </span>
                                            </div>
                                            {item.duration && (
                                                <div className="absolute top-4 right-4">
                                                    <span className="px-2 py-1 rounded bg-black/70 text-white text-xs inline-flex items-center">
                                                        <Clock className="w-3 h-3 ml-1" />
                                                        {item.duration}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="p-6">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-xs text-primary bg-primary/5 px-3 py-1 rounded-full">{item.category}</span>
                                                <span className="flex items-center text-xs text-neutral-500">
                                                    <Calendar className="w-3 h-3 ml-1" />
                                                    {formatDate(item.date)}
                                                </span>
                                            </div>

                                            <h3 className="text-lg font-extrabold text-neutral-900 mb-2 leading-tight group-hover:text-primary transition">
                                                {item.title}
                                            </h3>

                                            <p className="text-neutral-600 text-sm mb-4 leading-relaxed">{item.excerpt}</p>

                                            <div className="flex items-center justify-between">
                                                <a
                                                    href={item.url || "#"}
                                                    className="inline-flex items-center gap-1 text-primary hover:text-accent-600 font-semibold text-sm transition"
                                                    target={item.url ? "_blank" : undefined}
                                                    rel={item.url ? "noopener noreferrer" : undefined}
                                                >
                                                    {item.type === "video" ? "مشاهدة" : item.type === "podcast" ? "استماع" : "قراءة المزيد"}
                                                    <ArrowRight className="w-4 h-4" />
                                                </a>

                                                {item.readTime && (
                                                    <span className="flex items-center text-xs text-neutral-500">
                                                        <Eye className="w-3 h-3 ml-1" />
                                                        {item.readTime}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </motion.article>
                                );
                            })}
                        </div>
                    </div>
                </section>
            </>
        );
    }

    // وضع التحرير (أدمن)
    return (
        <div className="space-y-6">
            {/* شريط أدوات */}
            <div className="flex items-center gap-2">
                <button
                    onClick={addItem}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary/90 text-white px-3 py-1.5 text-sm"
                >
                    <Plus className="w-4 h-4" /> إضافة عنصر
                </button>

                <button
                    onClick={saveAll}
                    disabled={saveStatus === "loading" || !dirty}
                    className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-white
            ${saveStatus === "loading" || !dirty ? "bg-neutral-600 cursor-not-allowed" : "bg-neutral-800"}`}
                >
                    {saveStatus === "loading" && <Loader2 className="w-4 h-4 animate-spin" />}
                    {saveStatus === "success" && <CheckCircle className="w-4 h-4 text-green-400" />}
                    {saveStatus === "error" && <XCircle className="w-4 h-4 text-red-400" />}
                    <Save className="w-4 h-4" />
                    حفظ الكل
                </button>

                {saveStatus === "success" && <span className="text-sm text-green-600">تم الحفظ بنجاح</span>}
                {saveStatus === "error" && <span className="text-sm text-red-600">فشل الحفظ</span>}
            </div>

            {/* الفلاتر في وضع التحرير (تجربة مباشرة) */}
            <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm text-neutral-500">تجربة الفلترة:</span>
                {filters.map(f => {
                    const active = activeFilter === f.id;
                    return (
                        <button
                            key={f.id}
                            onClick={() => setActiveFilter(f.id)}
                            className={`text-xs px-3 py-1.5 rounded-full border
                ${active ? "bg-primary text-white border-primary" : "bg-white text-neutral-700 border-neutral-200"}`}
                        >
                            {f.label} <span className="opacity-70">({f.count})</span>
                        </button>
                    );
                })}
            </div>

            {/* شبكة التحرير */}
            <div className={gridCols}>
                {filteredItems.map((item, idx) => {
                    const Icon = TYPE_ICONS[item.type] || FileText;
                    return (
                        <div key={item.id} className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
                            {/* شريط أدوات لكل بطاقة */}
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2 text-sm text-neutral-500">
                                    <span>#{idx + 1}</span>
                                    <div className="w-8 h-8 rounded-lg grid place-items-center bg-neutral-100 border">
                                        <Icon className="w-4 h-4" />
                                    </div>
                                    <span className="px-2 py-0.5 rounded bg-neutral-100 border text-[11px]">
                                        {TYPE_LABELS[item.type] || item.type}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button onClick={() => moveItem(items.indexOf(item), -1)} className="p-1.5 rounded hover:bg-neutral-100" title="أعلى">
                                        <ArrowUp className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => moveItem(items.indexOf(item), 1)} className="p-1.5 rounded hover:bg-neutral-100" title="أسفل">
                                        <ArrowDown className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => delItem(item.id)} className="p-1.5 rounded hover:bg-red-50 text-red-600" title="حذف">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* حقول التحرير */}
                            <div className="grid gap-3">
                                <div className="grid md:grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-xs text-neutral-500">النوع</label>
                                        <select
                                            className="border rounded-lg px-2 py-1 text-sm w-full"
                                            value={item.type}
                                            onChange={(e) => update(item.id, { type: e.target.value })}
                                        >
                                            <option value="article">مقال</option>
                                            <option value="video">فيديو</option>
                                            <option value="podcast">بودكاست</option>
                                            <option value="interview">تصريح</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs text-neutral-500">التصنيف</label>
                                        <input
                                            className="border rounded-lg px-2 py-1 text-sm w-full"
                                            value={item.category}
                                            onChange={(e) => update(item.id, { category: e.target.value })}
                                            placeholder="مثلاً: قانون تجاري"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs text-neutral-500">العنوان</label>
                                    <input
                                        className="border rounded-lg px-2 py-1 text-sm w-full"
                                        value={item.title}
                                        onChange={(e) => update(item.id, { title: e.target.value })}
                                        placeholder="عنوان المحتوى…"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs text-neutral-500">الوصف المختصر</label>
                                    <textarea
                                        className="border rounded-lg px-2 py-1 text-sm w-full min-h-[70px]"
                                        value={item.excerpt}
                                        onChange={(e) => update(item.id, { excerpt: e.target.value })}
                                        placeholder="نبذة مختصرة…"
                                    />
                                </div>

                                <div className="grid md:grid-cols-3 gap-3">
                                    <div>
                                        <label className="text-xs text-neutral-500">التاريخ</label>
                                        <input
                                            type="date"
                                            className="border rounded-lg px-2 py-1 text-sm w-full"
                                            value={item.date || ""}
                                            onChange={(e) => update(item.id, { date: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-neutral-500">مدة القراءة</label>
                                        <input
                                            className="border rounded-lg px-2 py-1 text-sm w-full"
                                            value={item.readTime || ""}
                                            onChange={(e) => update(item.id, { readTime: e.target.value })}
                                            placeholder="مثلاً: 8 دقائق"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-neutral-500">مدة الفيديو/البودكاست</label>
                                        <input
                                            className="border rounded-lg px-2 py-1 text-sm w-full"
                                            value={item.duration || ""}
                                            onChange={(e) => update(item.id, { duration: e.target.value })}
                                            placeholder="مثلاً: 25 دقيقة"
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-xs text-neutral-500">الصورة/المعرّف</label>
                                        <input
                                            className="border rounded-lg px-2 py-1 text-sm w-full"
                                            value={item.image || ""}
                                            onChange={(e) => update(item.id, { image: e.target.value })}
                                            placeholder="article / video / podcast / interview / workshop …"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-neutral-500">الرابط (اختياري)</label>
                                        <input
                                            className="border rounded-lg px-2 py-1 text-sm w-full"
                                            value={item.url || ""}
                                            onChange={(e) => update(item.id, { url: e.target.value })}
                                            placeholder="https://…"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* شريط حفظ */}
            <div className="pt-1">
                <button
                    onClick={saveAll}
                    disabled={saveStatus === "loading" || !dirty}
                    className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-white
            ${saveStatus === "loading" || !dirty ? "bg-neutral-600 cursor-not-allowed" : "bg-neutral-800"}`}
                >
                    {saveStatus === "loading" && <Loader2 className="w-4 h-4 animate-spin" />}
                    {saveStatus === "success" && <CheckCircle className="w-4 h-4 text-green-400" />}
                    {saveStatus === "error" && <XCircle className="w-4 h-4 text-red-400" />}
                    <Save className="w-4 h-4" />
                    حفظ الكل
                </button>
                {saveStatus === "success" && <span className="ml-2 text-sm text-green-600">تم الحفظ بنجاح</span>}
                {saveStatus === "error" && <span className="ml-2 text-sm text-red-600">فشل الحفظ</span>}
            </div>
        </div>
    );
}
