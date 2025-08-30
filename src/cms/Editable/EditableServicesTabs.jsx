import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useContent } from "../ContentProvider";
import {
    Building, Scale, Gavel, Heart, Home, FileText, Calendar,
    ArrowUp, ArrowDown, Plus, Trash2, Save,
    CheckCircle, Loader2, XCircle, ChevronDown, ChevronUp
} from "lucide-react";

/* --------- Icons --------- */
const ICONS = { Building, Scale, Gavel, Heart, Home, FileText };
const ICON_OPTIONS = Object.keys(ICONS);

/* --------- Utils --------- */
function uid() { return Math.random().toString(36).slice(2, 9); }
function asArray(stored, fallbackArr) {
    if (Array.isArray(stored)) return stored;
    if (Array.isArray(stored?.items)) return stored.items; // دعم شكل قديم {items:[]}
    return fallbackArr;
}
function slugify(s = "") {
    return (s || "")
        .toString()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w\-ء-ي]+/g, "")
        .replace(/\-\-+/g, "-")
        .replace(/^-+|-+$/g, "")
        .toLowerCase();
}

/** تطبيع الداتا: يدعم الداتا القديمة (desc) ويعمل fallbacks خفيفة */
function normalizeServices(list = []) {
    const arr = asArray(list, []);
    return arr.map((it) => {
        const id = it.id || uid();
        const title = (it.title || "").trim();
        const slug = (it.slug || slugify(title) || id).toLowerCase();
        const icon = ICONS[it.icon] ? it.icon : "Building";
        const badge = (it.badge || "خدمة").trim();
        const summary = (it.summary ?? it.desc ?? "").trim(); // دعم desc القديم
        const description = (it.description ?? summary).trim(); // لو ما في description استخدم summary/desc
        return {
            id, title, slug, icon, badge,
            summary, description,
            whenNeeded: Array.isArray(it.whenNeeded) ? it.whenNeeded : [],
            howIWork: it.howIWork || "",
            faqs: Array.isArray(it.faqs) ? it.faqs : [],
            more: (it.more || "").trim(),
        };
    });
}

export default function EditableServicesTabs({ k = "services.data" }) {
    const { get, set, editMode, isAdmin } = useContent();
    const canEdit = editMode && isAdmin;

    const navigate = useNavigate();
    const { search } = useLocation();

    // اقرأ من الـ CMS بدون أي ديفولت
    const stored = get(k, []); // <— مهم: بدون DEFAULTS

    const initial = useMemo(
        () => normalizeServices(stored?.items ? stored.items : stored || []),
        [stored]
    );

    const [items, setItems] = useState(initial);
    const [activeTab, setActiveTab] = useState(0);
    const [openFAQ, setOpenFAQ] = useState(null);
    const [saveStatus, setSaveStatus] = useState(null);

    /* مزامنة عندما تتغير الداتا في الـ CMS */
    useEffect(() => {
        setItems(normalizeServices(stored?.items ? stored.items : stored || []));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stored]);

    /* فتح تبويب معيّن عبر ?tab=slug */
    useEffect(() => {
        if (!items.length) return;
        const q = new URLSearchParams(search);
        const want = (q.get("tab") || "").trim().toLowerCase();
        if (!want) return;
        const idx = items.findIndex(s => (s.slug || slugify(s.title || "")).toLowerCase() === want);
        if (idx >= 0 && idx !== activeTab) setActiveTab(idx);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, items.length]);

    const onSelectTab = (i) => {
        if (i < 0 || i >= items.length) return;
        setActiveTab(i);
        setOpenFAQ(null);
        const s = items[i];
        const slug = s?.slug || slugify(s?.title || "");
        if (slug) navigate(`?tab=${encodeURIComponent(slug)}`, { replace: false });
    };

    /* ------- Mutations ------- */
    const addService = () =>
        setItems(prev => [
            ...prev,
            {
                id: uid(),
                title: "",
                slug: "",
                icon: "Building",
                badge: "خدمة",
                summary: "",
                description: "",
                whenNeeded: [],
                howIWork: "",
                faqs: [],
                more: ""
            }
        ]);

    const delService = (id) => setItems(prev => prev.filter(x => x.id !== id));

    const moveService = (i, d) => {
        const j = i + d; if (j < 0 || j >= items.length) return;
        const arr = [...items];[arr[i], arr[j]] = [arr[j], arr[i]];
        setItems(arr);
    };

    const updateService = (id, patch) =>
        setItems(prev => prev.map(x => x.id === id ? { ...x, ...patch } : x));

    const addWhen = (id) =>
        updateService(id, {
            whenNeeded: [...(items.find(x => x.id === id)?.whenNeeded || []), ""]
        });

    const updateWhen = (id, idx, value) =>
        updateService(id, {
            whenNeeded: (items.find(x => x.id === id)?.whenNeeded || []).map((w, i) => i === idx ? value : w)
        });

    const delWhen = (id, idx) =>
        updateService(id, {
            whenNeeded: (items.find(x => x.id === id)?.whenNeeded || []).filter((_, i) => i !== idx)
        });

    const addFAQ = (id) =>
        updateService(id, {
            faqs: [...(items.find(x => x.id === id)?.faqs || []), { q: "", a: "" }]
        });

    const updateFAQ = (id, idx, patch) =>
        updateService(id, {
            faqs: (items.find(x => x.id === id)?.faqs || []).map((f, i) => i === idx ? { ...f, ...patch } : f)
        });

    const delFAQ = (id, idx) =>
        updateService(id, {
            faqs: (items.find(x => x.id === id)?.faqs || []).filter((_, i) => i !== idx)
        });

    /* حفظ: نخزّن Array مباشرة تحت نفس المفتاح k */
    const saveAll = async () => {
        try {
            setSaveStatus("loading");

            const clean = items.map((x) => ({
                id: x.id || uid(),
                title: x.title || "",
                slug: (x.slug || slugify(x.title || "") || x.id || uid()).toLowerCase(),
                icon: ICONS[x.icon] ? x.icon : "Building",
                description: x.description || (x.summary || ""),
                whenNeeded: (x.whenNeeded || []).filter(Boolean),
                howIWork: x.howIWork || "",
                faqs: (x.faqs || []).map((f) => ({ q: f.q || "", a: f.a || "" })),
                badge: x.badge || "خدمة",
                summary: x.summary || "",
                more: x.more || "",
            }));

            const { error } = await set(k, clean); // حتى لو فاضي بنخزن []
            setSaveStatus(error ? "error" : "success");
            if (!error) setTimeout(() => setSaveStatus(null), 3000);
        } catch {
            setSaveStatus("error");
        }
    };

    const tabGradient = (i) => (i % 2 === 0 ? "from-primary to-accent-500" : "from-accent-500 to-primary");

    /* ------- View: Visitor ------- */
    if (!canEdit) {
        if (items.length === 0) {
            return (
                <section className="py-20">
                    <div className="container-pro">
                        <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center text-neutral-600">
                            لا توجد خدمات متاحة حالياً.
                        </div>
                    </div>
                </section>
            );
        }

        const active = items[activeTab] || items[0] || {};
        const ActiveIcon = ICONS[active?.icon] || Building;

        return (
            <section className="py-20">
                <div className="container-pro">
                    {/* Tabs */}
                    <div className="flex flex-wrap justify-center gap-3 mb-12">
                        {items.map((s, i) => {
                            const Icon = ICONS[s.icon] || Building;
                            const isActive = activeTab === i;
                            return (
                                <motion.button
                                    key={s.id}
                                    onClick={() => onSelectTab(i)}
                                    className={`inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold transition ${isActive
                                            ? `bg-gradient-to-r ${tabGradient(i)} text-white shadow-sm`
                                            : "bg-white text-neutral-600 border border-primary/10 hover:border-primary/30 hover:text-primary"
                                        }`}
                                    whileHover={{ scale: 1.04 }}
                                    whileTap={{ scale: 0.98 }}
                                    aria-pressed={isActive}
                                >
                                    <Icon className="w-4 h-4 ml-1" />
                                    {s.title || "—"}
                                </motion.button>
                            );
                        })}
                    </div>

                    {/* Active tab content */}
                    {active && (
                        <motion.div
                            key={activeTab}
                            className="bg-white rounded-3xl shadow-soft p-8 lg:p-12 border border-primary/10"
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.45 }}
                        >
                            <div className="grid lg:grid-cols-3 gap-12">
                                {/* Icon & Title */}
                                <div className="text-center lg:text-right">
                                    <div className={`w-20 h-20 mx-auto lg:mx-0 mb-6 rounded-2xl grid place-items-center bg-gradient-to-r ${tabGradient(activeTab)}`}>
                                        <ActiveIcon className="w-10 h-10 text-white" />
                                    </div>
                                    <h2 className="text-3xl font-extrabold text-neutral-900 mb-3">{active.title || "—"}</h2>

                                    {/* الوصف: description أو summary */}
                                    <p className="text-neutral-600">{active.description || active.summary || ""}</p>

                                    <div className="mt-8">
                                        <Link
                                            to="/booking"
                                            className={`inline-flex items-center rounded-full bg-gradient-to-r ${tabGradient(activeTab)} px-6 py-3 text-sm font-semibold text-white shadow-sm hover:shadow-md transition`}
                                        >
                                            <Calendar className="w-4 h-4 ml-2" />
                                            احجز استشارة
                                        </Link>
                                    </div>
                                </div>

                                {/* When Needed + How I Work */}
                                <div className="lg:col-span-2 space-y-8">
                                    {!!(active.whenNeeded || []).length && (
                                        <div>
                                            <h3 className="text-2xl font-extrabold text-neutral-900 mb-4">متى تحتاج هذه الخدمة؟</h3>
                                            <ul className="space-y-3">
                                                {(active.whenNeeded || []).map((item, i) => (
                                                    <li key={i} className="flex items-center gap-3">
                                                        <span className={`inline-block w-2 h-2 rounded-full bg-gradient-to-r ${tabGradient(activeTab)}`} />
                                                        <span className="text-neutral-600">{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {active.howIWork && (
                                        <div>
                                            <h3 className="text-2xl font-extrabold text-neutral-900 mb-3">كيف أعمل</h3>
                                            <p className="text-neutral-600 leading-relaxed">{active.howIWork}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* FAQ */}
                            {!!(active.faqs || []).length && (
                                <div className="mt-12 pt-8 border-t border-primary/10">
                                    <h3 className="text-2xl font-extrabold text-neutral-900 mb-6">أسئلة شائعة</h3>
                                    <div className="space-y-3">
                                        {(active.faqs || []).map((faq, i) => {
                                            const open = openFAQ === i;
                                            return (
                                                <div key={i} className="rounded-xl border border-primary/10 overflow-hidden">
                                                    <button
                                                        onClick={() => setOpenFAQ(open ? null : i)}
                                                        className="w-full px-5 py-4 text-right bg-neutral-50 hover:bg-neutral-100 transition flex items-center justify-between"
                                                        aria-expanded={open}
                                                    >
                                                        <span className="font-semibold text-neutral-900">{faq.q || "—"}</span>
                                                        {open ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
                                                    </button>
                                                    {open && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: "auto", opacity: 1 }}
                                                            transition={{ duration: 0.25 }}
                                                            className="px-5 py-4 bg-white"
                                                        >
                                                            <p className="text-neutral-600">{faq.a || ""}</p>
                                                        </motion.div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}
                </div>
            </section>
        );
    }

    /* ------- View: Admin (Editor) ------- */
    return (
        <section className="py-20">
            <div className="container-pro space-y-4">
                <div className="flex items-center gap-2">
                    <button
                        onClick={addService}
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

                {/* حالة فاضية للأدمن */}
                {items.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-8 text-center text-neutral-500">
                        لا توجد خدمات بعد. اضغط <span className="font-semibold">إضافة خدمة</span> للبدء.
                    </div>
                )}

                <div className="grid gap-6">
                    {items.map((s, idx) => {
                        const Icon = ICONS[s.icon] || Building;
                        return (
                            <div key={s.id} className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
                                {/* شريط أدوات خدمة واحدة */}
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2 text-sm text-neutral-500">
                                        <span>#{idx + 1}</span>
                                        <div className="w-8 h-8 rounded-lg grid place-items-center bg-neutral-100 border">
                                            <Icon className="w-4 h-4" />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button onClick={() => moveService(idx, -1)} className="p-1.5 rounded hover:bg-neutral-100" title="أعلى">
                                            <ArrowUp className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => moveService(idx, 1)} className="p-1.5 rounded hover:bg-neutral-100" title="أسفل">
                                            <ArrowDown className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => delService(s.id)} className="p-1.5 rounded hover:bg-red-50 text-red-600" title="حذف">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* الحقول الرئيسية */}
                                <div className="grid lg:grid-cols-3 gap-4">
                                    <div className="lg:col-span-1">
                                        <label className="text-xs text-neutral-500">الأيقونة</label>
                                        <select
                                            className="border rounded-lg px-2 py-1 text-sm w-full mb-2"
                                            value={s.icon}
                                            onChange={(e) => updateService(s.id, { icon: e.target.value })}
                                        >
                                            {ICON_OPTIONS.map(name => <option key={name} value={name}>{name}</option>)}
                                        </select>

                                        <label className="text-xs text-neutral-500">العنوان</label>
                                        <input
                                            className="border rounded-lg px-2 py-1 text-sm w-full mb-2"
                                            value={s.title}
                                            onChange={(e) => updateService(s.id, { title: e.target.value })}
                                            placeholder="عنوان الخدمة…"
                                        />

                                        <label className="text-xs text-neutral-500">Slug (اختياري)</label>
                                        <input
                                            className="border rounded-lg px-2 py-1 text-sm w-full mb-2 ltr"
                                            value={s.slug || ""}
                                            onChange={(e) => updateService(s.id, { slug: e.target.value })}
                                            placeholder="يُولَّد تلقائيًا إن تركته فارغًا"
                                        />

                                        <label className="text-xs text-neutral-500">الوصف (داخل التبويب)</label>
                                        <textarea
                                            className="border rounded-lg px-2 py-1 text-sm w-full min-h-[70px]"
                                            value={s.description}
                                            onChange={(e) => updateService(s.id, { description: e.target.value })}
                                            placeholder="وصف مطوّل يظهر داخل التبويب…"
                                        />
                                    </div>

                                    <div className="lg:col-span-2 grid md:grid-cols-2 gap-4">
                                        {/* متى تحتاج هذه الخدمة؟ */}
                                        <div className="rounded-xl border p-3">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="font-semibold">متى تحتاج هذه الخدمة؟</h4>
                                                <button
                                                    onClick={() => addWhen(s.id)}
                                                    className="text-sm px-2 py-1 rounded bg-neutral-100 hover:bg-neutral-200"
                                                >
                                                    + بند
                                                </button>
                                            </div>
                                            <ul className="space-y-2">
                                                {(s.whenNeeded || []).map((w, i) => (
                                                    <li key={i} className="flex items-center gap-2">
                                                        <input
                                                            className="border rounded-lg px-2 py-1 text-sm flex-1"
                                                            value={w}
                                                            onChange={(e) => updateWhen(s.id, i, e.target.value)}
                                                            placeholder="بند…"
                                                        />
                                                        <button
                                                            onClick={() => delWhen(s.id, i)}
                                                            className="p-1.5 rounded hover:bg-red-50 text-red-600"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* كيف أعمل */}
                                        <div className="rounded-xl border p-3">
                                            <h4 className="font-semibold mb-2">كيف أعمل</h4>
                                            <textarea
                                                className="border rounded-lg px-2 py-1 text-sm w-full min-h-[120px]"
                                                value={s.howIWork}
                                                onChange={(e) => updateService(s.id, { howIWork: e.target.value })}
                                                placeholder="وصف طريقة العمل…"
                                            />
                                        </div>

                                        {/* FAQ */}
                                        <div className="rounded-xl border p-3 md:col-span-2">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="font-semibold">الأسئلة الشائعة</h4>
                                                <button
                                                    onClick={() => addFAQ(s.id)}
                                                    className="text-sm px-2 py-1 rounded bg-neutral-100 hover:bg-neutral-200"
                                                >
                                                    + سؤال
                                                </button>
                                            </div>
                                            <div className="space-y-2">
                                                {(s.faqs || []).map((f, i) => (
                                                    <div key={i} className="rounded-lg border p-2">
                                                        <label className="text-xs text-neutral-500">السؤال</label>
                                                        <input
                                                            className="border rounded-lg px-2 py-1 text-sm w-full mb-2"
                                                            value={f.q}
                                                            onChange={(e) => updateFAQ(s.id, i, { q: e.target.value })}
                                                            placeholder="السؤال…"
                                                        />
                                                        <label className="text-xs text-neutral-500">الإجابة</label>
                                                        <textarea
                                                            className="border rounded-lg px-2 py-1 text-sm w-full min-h-[70px]"
                                                            value={f.a}
                                                            onChange={(e) => updateFAQ(s.id, i, { a: e.target.value })}
                                                            placeholder="الإجابة…"
                                                        />
                                                        <div className="flex justify-end">
                                                            <button
                                                                onClick={() => delFAQ(s.id, i)}
                                                                className="mt-2 p-1.5 rounded hover:bg-red-50 text-red-600"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
