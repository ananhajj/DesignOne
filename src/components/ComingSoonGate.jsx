// src/components/ComingSoonGate.jsx
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useContent } from "../cms/ContentProvider";

/**
 * يبدّل بين المحتوى الحقيقي وواجهة "قريبًا" للزوّار فقط.
 * الأدمِن دائمًا يرى children + شريط تحكّم عائم للتبديل.
 *
 * التخزين في CMS تحت المفتاح k: { enabled: boolean }
 */
export default function ComingSoonGate({
    k = "media.comingSoon",
    children,
    fallback,            // JSX يظهر للزوّار عند التفعيل
    className = "",
}) {
    const { get, set, editMode, isAdmin } = useContent();
    const canEdit = editMode && isAdmin;

    const stored = get(k, { enabled: false });
    const [enabled, setEnabled] = useState(!!stored?.enabled);
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState("");

    const toggle = async () => {
        try {
            setSaving(true);
            const next = !enabled;
            setEnabled(next);
            const { error } = await set(k, { enabled: next });
            if (error) {
                setEnabled(!next);
                setMsg("فشل الحفظ");
            } else {
                setMsg(next ? "مفعل: الزوّار سيرون «قريبًا»" : "تم الإلغاء: الزوّار سيرون المحتوى");
                setTimeout(() => setMsg(""), 1400);
            }
        } finally {
            setSaving(false);
        }
    };

    // للزوّار: لو مفعّل => نعرض النسخة البديلة
    if (!canEdit && enabled) {
        return (
            <section className={className}>
                {fallback}
            </section>
        );
    }

    return (
        <section className={`relative ${className}`}>
            {/* شريط تحكم عائم للأدمِن فقط */}
            {canEdit && (
                <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 -top-3 z-40">
                    <div className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-neutral-900/85 text-white px-3 py-1.5 text-xs shadow-lg ring-1 ring-white/10 backdrop-blur-md">
                        <button
                            type="button"
                            onClick={toggle}
                            disabled={saving}
                            className="inline-flex items-center gap-1.5 font-semibold"
                            title={enabled ? "إلغاء وضع قريبًا" : "تفعيل وضع قريبًا"}
                        >
                            {enabled ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            {enabled ? "الزوّار يرون: قريبًا" : "الزوّار يرون: المحتوى"}
                        </button>
                        <span className="opacity-80">{msg}</span>
                    </div>
                </div>
            )}

            {children}
        </section>
    );
}
