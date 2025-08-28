import { motion } from "framer-motion";
import { ArrowDown, ArrowUp, CheckCircle, Loader2, Plus, Save, Trash2, XCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { useContent } from "../ContentProvider";
import EditableText from "./EditableText";

function uid() {
    return Math.random().toString(36).slice(2, 9);
}

const DEFAULT_ITEMS = [
    {
        id: uid(),
        title: "قضية عقارية معقدة",
        category: "عقاري",
        challenge: "نزاع عقاري متعدد الأطراف استمر لسنوات",
        approach: "تحليل دقيق للوثائق + وساطة فعالة",
        result: "تسوية ودية في 6 أشهر",
    },
    {
        id: uid(),
        title: "قضية تجارية دولية",
        category: "تجاري",
        challenge: "خلاف تجاري عبر الحدود بقيمة مليونية",
        approach: "استراتيجية تحكيم دولي مدروسة",
        result: "استرداد 85% من المبلغ المتنازع عليه",
    },
    {
        id: uid(),
        title: "قضية أسرية حساسة",
        category: "أسري",
        challenge: "نزاع حضانة معقد مع جوانب نفسية",
        approach: "التعامل بحساسية + خبراء نفسيين",
        result: "حل يحفظ مصلحة الأطفال",
    },
];

export default function EditableCases({
    k = "cases.items",
    gridClassName = "grid lg:grid-cols-3 gap-8",
    cardClassName = "bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-primary/10",
}) {
    const { get, set, editMode, isAdmin } = useContent();
    const canEdit = editMode && isAdmin;

    // اقرأ القائمة من الـ CMS (تكون {items:[...]} أو مصفوفة مباشرة)
    const stored = get(k, DEFAULT_ITEMS);
    const initialItems = useMemo(() => {
        // إذا كان stored مصفوفة استخدمها، وإذا كان شكل قديم فيه items استخدم stored.items
        if (Array.isArray(stored)) return stored;
        if (Array.isArray(stored?.items)) return stored.items;
        return DEFAULT_ITEMS;
    }, [stored]);

    const [items, setItems] = useState(initialItems);

    const addItem = () =>
        setItems((prev) => [
            ...prev,
            { id: uid(), title: "", category: "", challenge: "", approach: "", result: "" },
        ]);

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

    // عرض للزوّار (بدون أدوات)
    if (!canEdit) {
        return (
            <div className={gridClassName}>
                {items.map((c, index) => (
                    <motion.div
                        key={c.id}
                        className={cardClassName}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: (index % 3) * 0.15 }}
                        whileHover={{ y: -4 }}
                    >
                        <div className="flex justify-between items-start mb-6">
                            <h3 className="text-xl font-bold text-neutral-900">{c.title || "—"}</h3>
                            <span className="px-3 py-1 bg-gradient-to-r from-primary to-accent-500 text-white text-xs rounded-full">
                                {c.category || "—"}
                            </span>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h4 className="font-semibold text-neutral-900 mb-2">
                                    <EditableText k="cases.labels.challenge" fallback="التحدي:" />
                                </h4>
                                <p className="text-neutral-600 text-sm">{c.challenge || ""}</p>
                            </div>

                            <div className="flex items-center justify-center my-3">
                                {/* نفس السهم اللي عندك */}
                                <svg width="20" height="20" viewBox="0 0 24 24" className="text-primary">
                                    <path fill="currentColor" d="M10 17l5-5-5-5v10z" />
                                </svg>
                            </div>

                            <div>
                                <h4 className="font-semibold text-neutral-900 mb-2">
                                    <EditableText k="cases.labels.approach" fallback="المقاربة:" />
                                </h4>
                                <p className="text-neutral-600 text-sm">{c.approach || ""}</p>
                            </div>

                            <div className="flex items-center justify-center my-3">
                                <svg width="20" height="20" viewBox="0 0 24 24" className="text-accent-500">
                                    <path fill="currentColor" d="M10 17l5-5-5-5v10z" />
                                </svg>
                            </div>

                            <div>
                                <h4 className="font-semibold text-neutral-900 mb-2">
                                    <EditableText k="cases.labels.result" fallback="النتيجة:" />
                                </h4>
                                <p className="text-primary font-semibold text-sm">{c.result || ""}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        );
    }

    // وضع التحرير (مع أدوات الإدارة)
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <button
                    onClick={addItem}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary/90 text-white px-3 py-1.5 text-sm"
                >
                    <Plus className="w-4 h-4" /> إضافة حالة
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
                {items.map((c, idx) => (
                    <div key={c.id} className={`${cardClassName} border-primary/20`}>
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm text-neutral-500">#{idx + 1}</span>
                            <div className="flex items-center gap-1">
                                <button onClick={() => move(idx, -1)} className="p-1.5 rounded hover:bg-neutral-100" title="أعلى">
                                    <ArrowUp className="w-4 h-4" />
                                </button>
                                <button onClick={() => move(idx, +1)} className="p-1.5 rounded hover:bg-neutral-100" title="أسفل">
                                    <ArrowDown className="w-4 h-4" />
                                </button>
                                <button onClick={() => delItem(c.id)} className="p-1.5 rounded hover:bg-red-50 text-red-600" title="حذف">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <label className="text-xs text-neutral-500">العنوان</label>
                            <input
                                className="border rounded-lg px-2 py-1 text-sm"
                                value={c.title || ""}
                                onChange={(e) => update(c.id, { title: e.target.value })}
                                placeholder="قضية ..."
                            />

                            <label className="text-xs text-neutral-500">التصنيف</label>
                            <input
                                className="border rounded-lg px-2 py-1 text-sm"
                                value={c.category || ""}
                                onChange={(e) => update(c.id, { category: e.target.value })}
                                placeholder="عقاري / تجاري ..."
                            />

                            <label className="text-xs text-neutral-500">التحدّي</label>
                            <textarea
                                className="border rounded-lg px-2 py-1 text-sm min-h-[70px]"
                                value={c.challenge || ""}
                                onChange={(e) => update(c.id, { challenge: e.target.value })}
                                placeholder="وصف التحدّي"
                            />

                            <label className="text-xs text-neutral-500">المقاربة</label>
                            <textarea
                                className="border rounded-lg px-2 py-1 text-sm min-h-[70px]"
                                value={c.approach || ""}
                                onChange={(e) => update(c.id, { approach: e.target.value })}
                                placeholder="كيف تعاملت معها؟"
                            />

                            <label className="text-xs text-neutral-500">النتيجة</label>
                            <textarea
                                className="border rounded-lg px-2 py-1 text-sm min-h-[70px]"
                                value={c.result || ""}
                                onChange={(e) => update(c.id, { result: e.target.value })}
                                placeholder="ما النتيجة النهائية؟"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
