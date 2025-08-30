import React, { useEffect, useState } from "react";
import { EyeOff, Eye } from "lucide-react";
import { useContent } from "../cms/ContentProvider";

/**
 * الاستخدام الموصى به (ما تحط <section> جواته):
 * <HideableSection k="home.services" className="section bg-neutral-50">
 *   <div className="container-pro"> ... </div>
 * </HideableSection>
 */
export default function HideableSection({
    k,
    className = "",
    children,
    defaultVisible = true,
}) {
    const { get, set, editMode, isAdmin } = useContent();
    const canEdit = editMode && isAdmin;

    // لا نمرّر fallback لـ get عشان ما يصير فلاش افتراضي، بنعتمد defaultVisible محليًا أول مرة
    const stored = get(`vis.${k}`);
    const [visible, setVisible] = useState(
        stored?.visible !== undefined ? !!stored.visible : !!defaultVisible
    );
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState("");

    // تزامُن مع الـCMS دائمًا
    useEffect(() => {
        if (stored && typeof stored.visible === "boolean") {
            setVisible(stored.visible);
        }
    }, [stored?.visible]);

    const toggle = async () => {
        try {
            setSaving(true);
            const next = !visible;
            setVisible(next); // optimistic
            const { error } = await set(`vis.${k}`, { visible: next });
            if (error) {
                setVisible(!next);
                setStatus("فشل الحفظ");
            } else {
                setStatus(next ? "مُظهَر للزوّار" : "مخفي عن الزوّار");
                setTimeout(() => setStatus(""), 1500);
            }
        } finally {
            setSaving(false);
        }
    };

    // للزوّار: لو مخفي → لا شي (ما في أي حجز مساحة)
    if (!canEdit) {
        if (!visible) return null;
        // لو بدك تبقى الكلاسات على السيكشن، خلّيها على HideableSection ولاتحط <section> داخله
        return <section className={className}>{children}</section>;
    }

    // للأدمن: نظهر دائمًا مع شارة عائمة (بدون حجز مساحة إضافية للمحتوى)
    return (
        <section
            className={`relative ${className}`}
            data-hidden={!visible ? "preview-hidden" : undefined}
        >
            {/* شارة عائمة في الأعلى ومتمركزة */}
            <div
                className="pointer-events-none absolute left-1/2 -translate-x-1/2 -top-4 z-30"
                aria-live="polite"
            >
                <div className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-neutral-900/85 text-white px-3 py-1.5 text-xs shadow-lg ring-1 ring-white/10 backdrop-blur-md">
                    <button
                        type="button"
                        onClick={toggle}
                        disabled={saving}
                        className="inline-flex items-center gap-2 font-semibold"
                        title={visible ? "إخفاء هذا السيكشن عن الزوّار" : "إظهار السيكشن للزوّار"}
                    >
                        {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        {visible ? "إخفاء عن الزوّار" : "إظهار للزوّار"}
                    </button>

                    {status ? (
                        <span className="text-[11px] text-neutral-200/90">{status}</span>
                    ) : null}

                    {!visible && !status ? (
                        <span className="text-[11px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-200 border border-amber-400/30">
                            مخفي عن الزوّار
                        </span>
                    ) : null}
                </div>
            </div>

            {/* المحتوى نفسه */}
            {children}
        </section>
    );
}
