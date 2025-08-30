import React, { useEffect, useMemo, useState } from "react";
import { useContent } from "../ContentProvider";
import { ArrowUp, ArrowDown, Plus, Trash2, Save } from "lucide-react";

function uid() { return Math.random().toString(36).slice(2, 9); }

const DEFAULT_MEMBERS = [
    {
        id: uid(),
        name: "غفران عدنان الصيفي",
        role: "", // ما وصلنا مسمى وظيفي؛ عدّله من اللوحة لو حبيت
        photo: "https://res.cloudinary.com/dgbdudxqm/image/upload/v1756396600/1754341943041_ida7h1.jpg",
        links: {
            linkedin: "https://www.linkedin.com/in/ghofran-al-saifi-98449218b/",
            email: "ghofransaifi@outlook.com",
            facebook: "https://www.facebook.com/share/15sLz8nWaT/?mibextid=wwXIfr",
        },
    },
    {
        id: uid(),
        name: "أحمد محمود قاسم",
        role:
            "محامي و مستشار قانوني لديه خبرة عملية اكثر من 20 سنة في كافة القضايا الحقوقية و الجزائية و الشرعية و مختص في تأسيس الجمعيات و المنظمات الاهلية المحلية و الدولية و وكيل قانوني لمجموعة من الشركات التجارية",
        photo: "/assets/team-default.png",
        links: {
            linkedin: "",
            email: "qasem_law@yahoo.com",
            facebook: "",
        },
    },
];

// 🔧 تطبيع: ننقل links.twitter القديمة إلى links.email لو ما في إيميل
function normalizeMembers(stored) {
    const arr = Array.isArray(stored) ? stored : DEFAULT_MEMBERS;
    return arr.map((m) => ({
        id: m.id || uid(),
        name: m.name || "",
        role: m.role || "",
        photo: m.photo || "/assets/team-default.png",
        links: {
            linkedin: m.links?.linkedin || "",
            email: (m.links?.email || m.links?.twitter || "").trim(), // ← دعم قديم
            facebook: m.links?.facebook || "",
        },
    }));
}

function toMailHref(v = "") {
    const s = (v || "").trim();
    if (!s) return "";
    return s.startsWith("mailto:") ? s : `mailto:${s}`;
}

export default function EditableTeamGrid({
    k = "team.items",
    gridClass = "grid md:grid-cols-3 gap-8",
    cardClass = "bg-white rounded-2xl shadow-lg p-6 text-center border border-neutral-200",
}) {
    const { get, set, editMode, isAdmin } = useContent();
    const canEdit = editMode && isAdmin;

    const stored = get(k, DEFAULT_MEMBERS);

    // نقرأ ونطبع الداتا بشكل متناسق (مع تحويل twitter -> email)
    const initial = useMemo(() => normalizeMembers(stored), [JSON.stringify(stored)]);
    const [items, setItems] = useState(initial);

    useEffect(() => {
        setItems(normalizeMembers(stored));
    }, [JSON.stringify(stored)]);

    const add = () =>
        setItems((prev) => [
            ...prev,
            { id: uid(), name: "", role: "", photo: "/assets/team-default.png", links: { linkedin: "", email: "", facebook: "" } },
        ]);

    const del = (id) => setItems((prev) => prev.filter((x) => x.id !== id));

    const move = (i, d) => {
        const j = i + d;
        if (j < 0 || j >= items.length) return;
        const copy = [...items];
        [copy[i], copy[j]] = [copy[j], copy[i]];
        setItems(copy);
    };

    const update = (id, patch) =>
        setItems((prev) => prev.map((x) => (x.id === id ? { ...x, ...patch } : x)));

    const updateLink = (id, which, value) =>
        setItems((prev) =>
            prev.map((x) => (x.id === id ? { ...x, links: { ...x.links, [which]: value } } : x))
        );

    const SAVE_TIMEOUT_MS = 8000;
    const saveAll = async () => {
        const clean = items.map((m) => ({
            id: m.id || uid(),
            name: m.name || "",
            role: m.role || "",
            photo: m.photo || "/assets/team-default.png",
            links: {
                linkedin: m.links?.linkedin || "",
                email: m.links?.email || "",     // ✅ حفظ الإيميل
                facebook: m.links?.facebook || "",
            },
        }));

        const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error("save-timeout")), SAVE_TIMEOUT_MS));
        try {
            const result = await Promise.race([set(k, clean), timeout]);
            const error = result?.error;
            if (error) { alert("فشل الحفظ: " + (error.message || error)); return; }
            alert("تم الحفظ ✅");
        } catch (err) {
            if (String(err?.message) === "save-timeout") alert("تعذر الحفظ (انتهت المهلة).");
            else alert("حدث خطأ أثناء الحفظ.");
        }
    };

    // عرض الزوار
    if (!canEdit) {
        return (
            <div className={gridClass}>
                {items.map((m) => (
                    <div key={m.id} className={cardClass}>
                        <img
                            src={m.photo || "/assets/team-default.png"}
                            alt={m.name || "عضو فريق"}
                            className="w-32 h-32 rounded-full mx-auto object-cover"
                        />
                        <h3 className="mt-4 text-xl font-bold text-neutral-900">{m.name || "—"}</h3>
                        <p className="text-sm text-neutral-600 mb-4">{m.role || "—"}</p>

                        <div className="flex justify-center gap-4 mt-4">
                            {m.links?.linkedin ? (
                                <a href={m.links.linkedin} className="text-neutral-500 hover:text-primary transition" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
                                    <i className="fab fa-linkedin text-xl" />
                                </a>
                            ) : null}

                            {m.links?.email ? (
                                <a href={toMailHref(m.links.email)} className="text-neutral-500 hover:text-primary transition" aria-label="Email">
                                    <i className="fas fa-envelope text-xl" />
                                </a>
                            ) : null}

                            {m.links?.facebook ? (
                                <a href={m.links.facebook} className="text-neutral-500 hover:text-primary transition" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                                    <i className="fab fa-facebook text-xl" />
                                </a>
                            ) : null}
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    // وضع التحرير
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <button
                    onClick={add}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary/90 text-white px-3 py-1.5 text-sm"
                >
                    <Plus className="w-4 h-4" /> إضافة عضو
                </button>
                <button
                    onClick={saveAll}
                    className="inline-flex items-center gap-2 rounded-lg bg-neutral-800 text-white px-3 py-1.5 text-sm"
                >
                    <Save className="w-4 h-4" /> حفظ الكل
                </button>
            </div>

            <div className={gridClass}>
                {items.map((m, idx) => (
                    <div key={m.id} className={`${cardClass} text-right`}>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <img src={m.photo || "/assets/team-default.png"} alt="" className="w-14 h-14 rounded-full object-cover border" />
                                <div className="text-xs text-neutral-500">#{idx + 1}</div>
                            </div>
                            <div className="flex items-center gap-1">
                                <button onClick={() => move(idx, -1)} className="p-1.5 rounded hover:bg-neutral-100" title="أعلى"><ArrowUp className="w-4 h-4" /></button>
                                <button onClick={() => move(idx, +1)} className="p-1.5 rounded hover:bg-neutral-100" title="أسفل"><ArrowDown className="w-4 h-4" /></button>
                                <button onClick={() => del(m.id)} className="p-1.5 rounded hover:bg-red-50 text-red-600" title="حذف"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        </div>

                        <div className="grid gap-3">
                            <div>
                                <label className="text-xs text-neutral-500">الاسم</label>
                                <input
                                    className="w-full rounded-lg border px-2 py-1 text-sm"
                                    value={m.name}
                                    onChange={(e) => update(m.id, { name: e.target.value })}
                                    placeholder="اسم العضو"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-neutral-500">الدور</label>
                                <input
                                    className="w-full rounded-lg border px-2 py-1 text-sm"
                                    value={m.role}
                                    onChange={(e) => update(m.id, { role: e.target.value })}
                                    placeholder="المسمى/الدور"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-neutral-500">رابط الصورة (URL)</label>
                                <input
                                    className="w-full rounded-lg border px-2 py-1 text-sm ltr"
                                    value={m.photo}
                                    onChange={(e) => update(m.id, { photo: e.target.value })}
                                    placeholder="https://..."
                                />
                            </div>

                            {/* روابط السوشال (مع إيميل بدل تويتر) */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                <div>
                                    <label className="text-xs text-neutral-500">LinkedIn</label>
                                    <input
                                        className="w-full rounded-lg border px-2 py-1 text-sm ltr"
                                        value={m.links?.linkedin || ""}
                                        onChange={(e) => updateLink(m.id, "linkedin", e.target.value)}
                                        placeholder="https://linkedin.com/in/..."
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-neutral-500">Email</label>
                                    <input
                                        className="w-full rounded-lg border px-2 py-1 text-sm ltr"
                                        value={m.links?.email || ""}
                                        onChange={(e) => updateLink(m.id, "email", e.target.value)}
                                        placeholder="name@example.com"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-neutral-500">Facebook</label>
                                    <input
                                        className="w-full rounded-lg border px-2 py-1 text-sm ltr"
                                        value={m.links?.facebook || ""}
                                        onChange={(e) => updateLink(m.id, "facebook", e.target.value)}
                                        placeholder="https://facebook.com/..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
