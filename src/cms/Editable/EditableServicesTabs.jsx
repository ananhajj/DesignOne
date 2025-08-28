import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useContent } from "../ContentProvider";
import {
    Building, Scale, Gavel, Heart, Home, FileText, Calendar,
    ArrowUp, ArrowDown, Plus, Trash2, Save, ChevronDown, ChevronUp,
    CheckCircle,
    Loader2,
    XCircle,
} from "lucide-react";

// أيقونات متاحة للاختيار
const ICONS = { Building, Scale, Gavel, Heart, Home, FileText };
const ICON_OPTIONS = Object.keys(ICONS);

function uid() { return Math.random().toString(36).slice(2, 9); }

// بيانات افتراضية
const DEFAULT_ITEMS = [
    {
        id: uid(),
        title: "القضايا التجارية والشركات",
        icon: "Building",
        description: "استشارات شاملة في القانون التجاري وقضايا الشركات وحل النزاعات التجارية",
        whenNeeded: ["تأسيس الشركات والمؤسسات", "النزاعات التجارية بين الشركاء", "عقود التوريد والتوزيع", "قضايا الإفلاس والتصفية", "حماية الملكية الفكرية"],
        howIWork: "أبدأ بدراسة مفصلة للوضع التجاري والقانوني، ثم أضع استراتيجية واضحة لحماية مصالحك.",
        faqs: [
            { q: "كم تستغرق إجراءات تأسيس الشركة؟", a: "عادة 2–4 أسابيع حسب النوع والمتطلبات." },
            { q: "ما تكلفة الاستشارة القانونية للشركات؟", a: "تعتمد على حجم وتعقيد العمل." },
        ],
    },
    {
        id: uid(),
        title: "القضايا المدنية",
        icon: "Scale",
        description: "تمثيل في القضايا المدنية والتعويضات ونزاعات المسؤولية المدنية",
        whenNeeded: ["قضايا التعويضات والأضرار", "النزاعات المدنية العامة", "المسؤولية التقصيرية", "تنفيذ الأحكام", "القضايا التأمينية"],
        howIWork: "تحليل الوقائع والأدلة وإعداد دفوع دقيقة للوصول لأفضل تعويض أو دفاع.",
        faqs: [
            { q: "كيف يتم تقدير قيمة التعويض؟", a: "وفق الضرر المادي والمعنوي وبمساعدة خبراء." },
            { q: "ما مدة التقادم؟", a: "تختلف بنوع القضية؛ غالبًا 3 سنوات من تاريخ العلم بالضرر." },
        ],
    },
];

export default function EditableServicesTabs({
    k = "services.tabs", // المفتاح في الـ CMS
}) {
    const { get, set, editMode, isAdmin } = useContent();
    const canEdit = editMode && isAdmin;

    // اقرأ المخزّن: قد يكون {items:[...]} أو مصفوفة مباشرة
    const stored = get(k, { items: DEFAULT_ITEMS });
    const initial = useMemo(() => {
        if (Array.isArray(stored?.items)) return stored.items;
        if (Array.isArray(stored)) return stored;
        return DEFAULT_ITEMS;
    }, [stored]);

    const [items, setItems] = useState(initial);
    const [activeTab, setActiveTab] = useState(0);
    const [openFAQ, setOpenFAQ] = useState(null);

    const addService = () =>
        setItems(prev => [...prev, {
            id: uid(), title: "", icon: "Building", description: "",
            whenNeeded: [], howIWork: "", faqs: []
        }]);

    const delService = (id) => setItems(prev => prev.filter(x => x.id !== id));

    const moveService = (i, d) => {
        const j = i + d; if (j < 0 || j >= items.length) return;
        const arr = [...items];[arr[i], arr[j]] = [arr[j], arr[i]];
        setItems(arr);
    };

    const updateService = (id, patch) =>
        setItems(prev => prev.map(x => x.id === id ? { ...x, ...patch } : x));

    const addWhen = (id) =>
        updateService(id, { whenNeeded: [...(items.find(x => x.id === id)?.whenNeeded || []), ""] });

    const updateWhen = (id, idx, value) =>
        updateService(id, {
            whenNeeded: (items.find(x => x.id === id)?.whenNeeded || []).map((w, i) => i === idx ? value : w)
        });

    const delWhen = (id, idx) =>
        updateService(id, {
            whenNeeded: (items.find(x => x.id === id)?.whenNeeded || []).filter((_, i) => i !== idx)
        });

    const addFAQ = (id) =>
        updateService(id, { faqs: [...(items.find(x => x.id === id)?.faqs || []), { q: "", a: "" }] });

    const updateFAQ = (id, idx, patch) =>
        updateService(id, {
            faqs: (items.find(x => x.id === id)?.faqs || []).map((f, i) => i === idx ? { ...f, ...patch } : f)
        });

    const delFAQ = (id, idx) =>
        updateService(id, {
            faqs: (items.find(x => x.id === id)?.faqs || []).filter((_, i) => i !== idx)
        });
    const [saveStatus, setSaveStatus] = useState(null);

    const saveAll = async () => {
        try {
            setSaveStatus("loading");
            const clean = items.map((x) => ({
                id: x.id || uid(),
                title: x.title || "",
                icon: ICONS[x.icon] ? x.icon : "Building",
                description: x.description || "",
                whenNeeded: (x.whenNeeded || []).filter(Boolean),
                howIWork: x.howIWork || "",
                faqs: (x.faqs || []).map((f) => ({ q: f.q || "", a: f.a || "" })),
            }));

            // ملاحظة: إذا بدك تخزّن مصفوفة مباشرة، استخدم set(k, clean)
            const { error } = await set(k, { items: clean });

            if (error) {
                setSaveStatus("error");
            } else {
                setSaveStatus("success");
                // اختياري: إخفاء الرسالة بعد 3 ثواني
                setTimeout(() => setSaveStatus(null), 3000);
            }
        } catch {
            setSaveStatus("error");
        }
    };

    const tabGradient = (i) => (i % 2 === 0 ? "from-primary to-accent-500" : "from-accent-500 to-primary");

    // عرض الزوار (Tabs كاملة)
    if (!canEdit) {
        const active = items[activeTab] || items[0] || {};
        const ActiveIcon = ICONS[active?.icon] || Building;

        return (
            <section className="py-20">
                <div className="container-pro">
                    {/* التبويبات */}
                    <div className="flex flex-wrap justify-center gap-3 mb-12">
                        {items.map((s, i) => {
                            const Icon = ICONS[s.icon] || Building;
                            const isActive = activeTab === i;
                            return (
                                <motion.button
                                    key={s.id}
                                    onClick={() => { setActiveTab(i); setOpenFAQ(null); }}
                                    className={`inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold transition
                    ${isActive ? `bg-gradient-to-r ${tabGradient(i)} text-white shadow-sm` :
                                            "bg-white text-neutral-600 border border-primary/10 hover:border-primary/30 hover:text-primary"}`}
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

                    {/* محتوى التبويب */}
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
                                    <p className="text-neutral-600">{active.description || ""}</p>

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

                                    <div>
                                        <h3 className="text-2xl font-extrabold text-neutral-900 mb-3">كيف أعمل</h3>
                                        <p className="text-neutral-600 leading-relaxed">{active.howIWork || ""}</p>
                                    </div>
                                </div>
                            </div>

                            {/* FAQ */}
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
                                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} transition={{ duration: 0.25 }} className="px-5 py-4 bg-white">
                                                        <p className="text-neutral-600">{faq.a || ""}</p>
                                                    </motion.div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </section>
        );
    }

    // وضع التحرير (أدمن): نموذج إدارة كامل
    return (
        <section className="py-20">
            <div className="container-pro space-y-4">
                <div className="flex items-center gap-2">
                    <button onClick={addService} className="inline-flex items-center gap-2 rounded-lg bg-primary/90 text-white px-3 py-1.5 text-sm">
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
                                        <button onClick={() => moveService(idx, -1)} className="p-1.5 rounded hover:bg-neutral-100" title="أعلى"><ArrowUp className="w-4 h-4" /></button>
                                        <button onClick={() => moveService(idx, 1)} className="p-1.5 rounded hover:bg-neutral-100" title="أسفل"><ArrowDown className="w-4 h-4" /></button>
                                        <button onClick={() => delService(s.id)} className="p-1.5 rounded hover:bg-red-50 text-red-600" title="حذف"><Trash2 className="w-4 h-4" /></button>
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

                                        <label className="text-xs text-neutral-500">الوصف</label>
                                        <textarea
                                            className="border rounded-lg px-2 py-1 text-sm w-full min-h-[70px]"
                                            value={s.description}
                                            onChange={(e) => updateService(s.id, { description: e.target.value })}
                                            placeholder="وصف مختصر…"
                                        />
                                    </div>

                                    <div className="lg:col-span-2 grid md:grid-cols-2 gap-4">
                                        {/* متى تحتاج هذه الخدمة؟ */}
                                        <div className="rounded-xl border p-3">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="font-semibold">متى تحتاج هذه الخدمة؟</h4>
                                                <button onClick={() => addWhen(s.id)} className="text-sm px-2 py-1 rounded bg-neutral-100 hover:bg-neutral-200">+ بند</button>
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
                                                        <button onClick={() => delWhen(s.id, i)} className="p-1.5 rounded hover:bg-red-50 text-red-600">
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
                                                <button onClick={() => addFAQ(s.id)} className="text-sm px-2 py-1 rounded bg-neutral-100 hover:bg-neutral-200">+ سؤال</button>
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
                                                            <button onClick={() => delFAQ(s.id, i)} className="mt-2 p-1.5 rounded hover:bg-red-50 text-red-600">
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
