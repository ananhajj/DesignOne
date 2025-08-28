import React, { useEffect, useMemo, useState } from "react";
import { useContent } from "../ContentProvider";
import { ArrowUp, ArrowDown, Plus, Trash2, Save } from "lucide-react";

function uid() {
    return Math.random().toString(36).slice(2, 9);
}

const DEFAULT_MEMBERS = [
    {
        id: uid(),
        name: "سارة الأحمد",
        role: "شريك مؤسس",
        photo: "/assets/team-default.png",
        links: { linkedin: "#", twitter: "#", facebook: "#" },
    },
    {
        id: uid(),
        name: "أحمد العلي",
        role: "محامي تجاري",
        photo: "/assets/team-default.png",
        links: { linkedin: "#", twitter: "#", facebook: "#" },
    },
    {
        id: uid(),
        name: "ليلى الخطيب",
        role: "خبيرة عقود",
        photo: "/assets/team-default.png",
        links: { linkedin: "#", twitter: "#", facebook: "#" },
    },
];

export default function EditableTeamGrid({
    k = "team.items",
    gridClass = "grid md:grid-cols-3 gap-8",
    cardClass = "bg-white rounded-2xl shadow-lg p-6 text-center border border-neutral-200",
}) {
    const { get, set, editMode, isAdmin } = useContent();
    const canEdit = editMode && isAdmin;

    // نقرأ من الـ CMS: قد يجي {items:[...]} أو مصفوفة مباشرة
    const stored = get(k, { items: DEFAULT_MEMBERS });
    const initial = useMemo(() => {
        if (Array.isArray(stored?.items)) return stored.items;
        if (Array.isArray(stored)) return stored;
        return DEFAULT_MEMBERS;
    }, [stored]);

    const [items, setItems] = useState(initial);

    const add = () =>
        setItems((prev) => [
            ...prev,
            {
                id: uid(),
                name: "",
                role: "",
                photo: "/assets/team-default.png",
                links: { linkedin: "", twitter: "", facebook: "" },
            },
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
        setItems((prev) =>
            prev.map((x) => (x.id === id ? { ...x, ...patch } : x))
        );

    const updateLink = (id, which, value) =>
        setItems((prev) =>
            prev.map((x) =>
                x.id === id ? { ...x, links: { ...x.links, [which]: value } } : x
            )
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
                twitter: m.links?.twitter || "",
                facebook: m.links?.facebook || "",
            },
        }));

        // مهلة قصوى (احتياط)
        const timeout = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("save-timeout")), SAVE_TIMEOUT_MS)
        );

        try {
            console.groupCollapsed(`[EditableTeamGrid] save ${k}`);
            console.log("payload:", { items: clean });

            const result = await Promise.race([set(k, { items: clean }), timeout]);
            console.log("set() result:", result);

            const error = result?.error;
            if (error) {
                console.error("save error:", error);
                alert("فشل الحفظ: " + (error.message || error));
                return;
            }

            // إعادة القراءة من الـ CMS فورًا وتحديث الحالة المحلية
            const fresh = get(k, { items: DEFAULT_MEMBERS });
            const next = Array.isArray(fresh?.items) ? fresh.items : Array.isArray(fresh) ? fresh : DEFAULT_MEMBERS;
            setItems(next);

            console.log("reloaded:", next);
            alert("تم الحفظ ✅");
        } catch (err) {
            console.error("save threw:", err);
            if (String(err?.message) === "save-timeout") {
                alert("تعذر الحفظ (انتهت المهلة). افحص الاتصال أو RLS.");
            } else {
                alert("حدث خطأ أثناء الحفظ. راجع الـ Console.");
            }
        } finally {
            console.groupEnd();
        }
    };
    useEffect(() => {
        const fresh = Array.isArray(stored?.items) ? stored.items : Array.isArray(stored) ? stored : DEFAULT_MEMBERS;
        setItems(fresh);
    }, [stored]);

    // عرض للزوّار
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
                        <h3 className="mt-4 text-xl font-bold text-neutral-900">
                            {m.name || "—"}
                        </h3>
                        <p className="text-sm text-neutral-600 mb-4">
                            {m.role || "—"}
                        </p>
                        <div className="flex justify-center gap-4 mt-4">
                            {m.links?.linkedin ? (
                                <a
                                    href={m.links.linkedin}
                                    className="text-neutral-500 hover:text-primary transition"
                                    aria-label="LinkedIn"
                                >
                                    <i className="fab fa-linkedin text-xl" />
                                </a>
                            ) : null}
                            {m.links?.twitter ? (
                                <a
                                    href={m.links.twitter}
                                    className="text-neutral-500 hover:text-primary transition"
                                    aria-label="Twitter / X"
                                >
                                    <i className="fab fa-twitter text-xl" />
                                </a>
                            ) : null}
                            {m.links?.facebook ? (
                                <a
                                    href={m.links.facebook}
                                    className="text-neutral-500 hover:text-primary transition"
                                    aria-label="Facebook"
                                >
                                    <i className="fab fa-facebook text-xl" />
                                </a>
                            ) : null}
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    // وضع التحرير (لوحة إدارة)
    return (
        <div className="space-y-4">
            {/* شريط أدوات */}
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
                        {/* صورة + أدوات */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <img
                                    src={m.photo || "/assets/team-default.png"}
                                    alt=""
                                    className="w-14 h-14 rounded-full object-cover border"
                                />
                                <div className="text-xs text-neutral-500">#{idx + 1}</div>
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => move(idx, -1)}
                                    className="p-1.5 rounded hover:bg-neutral-100"
                                    title="أعلى"
                                >
                                    <ArrowUp className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => move(idx, +1)}
                                    className="p-1.5 rounded hover:bg-neutral-100"
                                    title="أسفل"
                                >
                                    <ArrowDown className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => del(m.id)}
                                    className="p-1.5 rounded hover:bg-red-50 text-red-600"
                                    title="حذف"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* حقول */}
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

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                <div>
                                    <label className="text-xs text-neutral-500">LinkedIn</label>
                                    <input
                                        className="w-full rounded-lg border px-2 py-1 text-sm ltr"
                                        value={m.links?.linkedin || ""}
                                        onChange={(e) => updateLink(m.id, "linkedin", e.target.value)}
                                        placeholder="https://linkedin.com/..."
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-neutral-500">Twitter / X</label>
                                    <input
                                        className="w-full rounded-lg border px-2 py-1 text-sm ltr"
                                        value={m.links?.twitter || ""}
                                        onChange={(e) => updateLink(m.id, "twitter", e.target.value)}
                                        placeholder="https://x.com/..."
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
