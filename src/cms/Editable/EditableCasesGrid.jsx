import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useContent } from "../ContentProvider";
import {
    Building, FileText, Gavel, Heart, Home, Scale,
    ArrowUp, ArrowDown, Plus, Trash2, Save,
} from "lucide-react";

const ICONS = { Building, FileText, Gavel, Heart, Home, Scale };
const ICON_OPTIONS = Object.keys(ICONS);
const GRAD = (i) => (i % 2 === 0 ? "from-primary to-accent-500" : "from-accent-500 to-primary");

function uid() { return Math.random().toString(36).slice(2, 9); }

const DEFAULT_ITEMS = [
    {
        id: uid(),
        title: "نزاع عقاري معقد متعدد الأطراف",
        category: "عقاري",
        icon: "Home", // ← لاحظ: string
        background: "خلاف حول ملكية قطعة أرض كبيرة بين ورثة وشركة تطوير، استمر النزاع لأكثر من 5 سنوات دون حل.",
        approach: "دراسة مكثفة للمستندات التاريخية، تحليل قانوني للحقوق، وتطبيق استراتيجية وساطة مبتكرة لتجنب التقاضي المطول.",
        result: "تم التوصل لاتفاق شامل يحفظ حقوق جميع الأطراف خلال 8 أشهر، مع توفير أكثر من 2 مليون ريال من تكاليف التقاضي.",
        duration: "8 أشهر",
        savings: "2M+ ريال",
    },
    {
        id: uid(),
        title: "قضية تجارية دولية كبرى",
        category: "تجاري",
        icon: "Building",
        background: "نزاع تجاري بين شركة سعودية ومؤسسة أوروبية حول عقد توريد بقيمة 50 مليون ريال، مع تعقيدات قانونية دولية.",
        approach: "تكوين فريق متخصص في القانون الدولي، استخدام التحكيم التجاري الدولي، والتنسيق مع محامين في الخارج.",
        result: "استرداد 42 مليون ريال من أصل 50 مليون، مع تسوية شاملة تحافظ على العلاقات التجارية المستقبلية.",
        duration: "18 شهر",
        savings: "42M ريال",
    },
    {
        id: uid(),
        title: "قضية حضانة معقدة وحساسة",
        category: "أسري",
        icon: "Heart",
        background: "نزاع حضانة معقد يتضمن جوانب نفسية واجتماعية صعبة، مع ضرورة الحفاظ على مصلحة الأطفال الفضلى.",
        approach: "التعاون مع خبراء نفسيين واجتماعيين، تطبيق نهج تفاوضي يركز على الحلول الودية، واستخدام الوساطة الأسرية.",
        result: "الوصول لاتفاق حضانة مشتركة يلبي احتياجات الأطفال النفسية والتعليمية، مع الحفاظ على علاقة صحية مع الوالدين.",
        duration: "6 أشهر",
        savings: "حل ودي",
    },
    {
        id: uid(),
        title: "قضية جنائية معقدة - دفاع",
        category: "جنائي",
        icon: "Gavel",
        background: "قضية جنائية معقدة تتضمن اتهامات مالية جدية، مع ضرورة إثبات البراءة وحماية السمعة المهنية للموكل.",
        approach: "تحليل دقيق للأدلة الجنائية، الاستعانة بخبراء الطب الشرعي والمحاسبة، وبناء دفاع شامل يدحض الاتهامات.",
        result: "براءة كاملة من جميع التهم، مع إثبات عدم صحة الاتهامات والمحافظة على السمعة المهنية والشخصية.",
        duration: "14 شهر",
        savings: "براءة كاملة",
    },
    {
        id: uid(),
        title: "تحكيم تجاري دولي معقد",
        category: "تحكيم",
        icon: "Scale",
        background: "نزاع تحكيم دولي في مشروع إنشائي كبير بين مطور سعودي ومقاول أجنبي، بقيمة تزيد عن 100 مليون ريال.",
        approach: "تطبيق قواعد التحكيم الدولي، التنسيق مع محكمين دوليين، وإعداد دفوع تقنية وقانونية متخصصة في القانون الإنشائي.",
        result: "قرار تحكيم لصالح الموكل بقيمة 78 مليون ريال، مع تعزيز موقفه في السوق الدولي للمقاولات.",
        duration: "24 شهر",
        savings: "78M ريال",
    },
    {
        id: uid(),
        title: "قضية مدنية - تعويضات كبرى",
        category: "مدني",
        icon: "FileText",
        background: "قضية تعويض عن أضرار مهنية ونفسية نتيجة حادث عمل، مع تعقيدات في إثبات حجم الضرر والمسؤولية.",
        approach: "الاستعانة بخبراء طبيين واقتصاديين لتقدير الأضرار، وبناء ملف شامل يثبت المسؤولية ومقدار التعويض العادل.",
        result: "الحصول على تعويض قدره 5.2 مليون ريال، يغطي العلاج والأضرار المهنية والمعنوية مدى الحياة.",
        duration: "11 شهر",
        savings: "5.2M ريال",
    },
];
export default function EditableCasesGrid({
    k = "cases.items",                // مفتاح التخزين في الـ CMS
    gridCols = "grid lg:grid-cols-2 gap-8",
}) {
    const { get, set, editMode, isAdmin } = useContent();
    const canEdit = editMode && isAdmin;

    // قراءة المخزّن: قد يكون {items:[...]} أو مصفوفة مباشرة
    const stored = get(k, { items: DEFAULT_ITEMS });
    const initial = useMemo(() => {
        if (Array.isArray(stored?.items)) return stored.items;
        if (Array.isArray(stored)) return stored;
        return DEFAULT_ITEMS;
    }, [stored]);

    const [items, setItems] = useState(initial);

    // CRUD + ترتيب
    const addCase = () =>
        setItems((prev) => [
            ...prev,
            {
                id: uid(),
                title: "",
                category: "",
                icon: "FileText",
                background: "",
                approach: "",
                result: "",
                duration: "",
                savings: "",
            },
        ]);

    const delCase = (id) => setItems((prev) => prev.filter((x) => x.id !== id));

    const moveCase = (i, d) => {
        const j = i + d;
        if (j < 0 || j >= items.length) return;
        const arr = [...items];
        [arr[i], arr[j]] = [arr[j], arr[i]];
        setItems(arr);
    };

    const update = (id, patch) =>
        setItems((prev) => prev.map((x) => (x.id === id ? { ...x, ...patch } : x)));

    const saveAll = async () => {
        const clean = items.map((x) => ({
            id: x.id || uid(),
            title: x.title || "",
            category: x.category || "",
            icon: ICONS[x.icon] ? x.icon : "FileText",
            background: x.background || "",
            approach: x.approach || "",
            result: x.result || "",
            duration: x.duration || "",
            savings: x.savings || "",
        }));
        const { error } = await set(k, { items: clean });
        if (error) alert("فشل الحفظ: " + error.message);
    };

    // عرض للزوّار
    if (!canEdit) {
        return (
            <div className={gridCols}>
                {items.map((c, index) => {
                    const IconComp = ICONS[c.icon] || FileText;
                    const headerGradient = GRAD(index);
                    return (
                        <motion.div
                            key={c.id}
                            className="bg-white rounded-3xl shadow-soft hover:shadow-md transition-all duration-300 overflow-hidden border border-primary/10"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: (index % 4) * 0.1 }}
                            whileHover={{ y: -6 }}
                        >
                            {/* Header */}
                            <div className={`bg-gradient-to-r ${headerGradient} p-6 text-white`}>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <IconComp className="w-6 h-6" />
                                        <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full">
                                            {c.category || "—"}
                                        </span>
                                    </div>
                                    <div className="text-left">
                                        <div className="text-[11px] opacity-90">المدة</div>
                                        <div className="font-semibold">{c.duration || "—"}</div>
                                    </div>
                                </div>
                                <h3 className="text-xl font-extrabold leading-tight">{c.title || "—"}</h3>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <div className="space-y-6">
                                    <div>
                                        <h4 className="text-xs font-extrabold text-primary mb-2 tracking-wider">الخلفية</h4>
                                        <p className="text-neutral-600 text-sm leading-relaxed">{c.background || ""}</p>
                                    </div>

                                    <div>
                                        <h4 className="text-xs font-extrabold text-primary mb-2 tracking-wider">النهج المتّبع</h4>
                                        <p className="text-neutral-600 text-sm leading-relaxed">{c.approach || ""}</p>
                                    </div>

                                    <div className="rounded-2xl p-4 border border-primary/10 bg-primary/5">
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="text-xs font-extrabولد text-primary tracking-wider">النتيجة</h4>
                                            <div className="text-left">
                                                <div className="text-[11px] text-neutral-500">الإنجاز</div>
                                                <div className={`font-extrabold text-sm bg-gradient-to-r ${headerGradient} bg-clip-text text-transparent`}>
                                                    {c.savings || "—"}
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-neutral-900 font-medium text-sm leading-relaxed">{c.result || ""}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        );
    }

    // وضع التحرير (أدمن)
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <button
                    onClick={addCase}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary/90 text-white px-3 py-1.5 text-sm"
                >
                    <Plus className="w-4 h-4" /> إضافة قضية
                </button>
                <button
                    onClick={saveAll}
                    className="inline-flex items-center gap-2 rounded-lg bg-neutral-800 text-white px-3 py-1.5 text-sm"
                >
                    <Save className="w-4 h-4" /> حفظ الكل
                </button>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {items.map((c, idx) => {
                    const IconComp = ICONS[c.icon] || FileText;
                    return (
                        <div key={c.id} className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
                            {/* شريط أدوات */}
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2 text-sm text-neutral-500">
                                    <span>#{idx + 1}</span>
                                    <div className="w-8 h-8 rounded-lg grid place-items-center bg-neutral-100 border">
                                        <IconComp className="w-4 h-4" />
                                    </div>
                                    <span className="px-2 py-0.5 rounded bg-neutral-100 border text-[11px]">
                                        {c.category || "بدون تصنيف"}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button onClick={() => moveCase(idx, -1)} className="p-1.5 rounded hover:bg-neutral-100" title="أعلى">
                                        <ArrowUp className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => moveCase(idx, 1)} className="p-1.5 rounded hover:bg-neutral-100" title="أسفل">
                                        <ArrowDown className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => delCase(c.id)} className="p-1.5 rounded hover:bg-red-50 text-red-600" title="حذف">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* حقول التحرير */}
                            <div className="grid gap-3">
                                <div className="grid md:grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-xs text-neutral-500">الأيقونة</label>
                                        <select
                                            className="border rounded-lg px-2 py-1 text-sm w-full"
                                            value={c.icon}
                                            onChange={(e) => update(c.id, { icon: e.target.value })}
                                        >
                                            {ICON_OPTIONS.map((name) => (
                                                <option key={name} value={name}>{name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-xs text-neutral-500">التصنيف</label>
                                        <input
                                            className="border rounded-lg px-2 py-1 text-sm w-full"
                                            value={c.category}
                                            onChange={(e) => update(c.id, { category: e.target.value })}
                                            placeholder="عقاري / تجاري / أسري ..."
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs text-neutral-500">العنوان</label>
                                    <input
                                        className="border rounded-lg px-2 py-1 text-sm w-full"
                                        value={c.title}
                                        onChange={(e) => update(c.id, { title: e.target.value })}
                                        placeholder="عنوان القضية…"
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-xs text-neutral-500">المدة</label>
                                        <input
                                            className="border rounded-lg px-2 py-1 text-sm w-full"
                                            value={c.duration}
                                            onChange={(e) => update(c.id, { duration: e.target.value })}
                                            placeholder="مثلاً: 8 أشهر"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-neutral-500">الإنجاز/التوفير</label>
                                        <input
                                            className="border rounded-lg px-2 py-1 text-sm w-full"
                                            value={c.savings}
                                            onChange={(e) => update(c.id, { savings: e.target.value })}
                                            placeholder="مثلاً: 42M ريال / براءة كاملة"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs text-neutral-500">الخلفية</label>
                                    <textarea
                                        className="border rounded-lg px-2 py-1 text-sm w-full min-h-[80px]"
                                        value={c.background}
                                        onChange={(e) => update(c.id, { background: e.target.value })}
                                        placeholder="نبذة عن خلفية القضية…"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs text-neutral-500">النهج المتّبع</label>
                                    <textarea
                                        className="border rounded-lg px-2 py-1 text-sm w-full min-H-[80px]"
                                        value={c.approach}
                                        onChange={(e) => update(c.id, { approach: e.target.value })}
                                        placeholder="كيف تم التعامل مع القضية…"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs text-neutral-500">النتيجة</label>
                                    <textarea
                                        className="border rounded-lg px-2 py-1 text-sm w-full min-h-[80px]"
                                        value={c.result}
                                        onChange={(e) => update(c.id, { result: e.target.value })}
                                        placeholder="النتيجة النهائية…"
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* حفظ الكل */}
            <div className="pt-1">
                <button
                    onClick={saveAll}
                    className="inline-flex items-center gap-2 rounded-lg bg-neutral-800 text-white px-3 py-1.5 text-sm"
                >
                    <Save className="w-4 h-4" /> حفظ الكل
                </button>
            </div>
        </div>
    );
}