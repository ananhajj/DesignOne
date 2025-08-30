import React, { useEffect, useRef, useState } from "react";
import { Pencil, Save, X } from "lucide-react";
import { useContent } from "../ContentProvider";

/**
 * EditableLongText
 * - يخزّن/يقرأ من المفتاح k كما هو (متوافق 100% مع القديم).
 * - textarea مع Auto-Resize + عدّاد اختياري.
 * - لا يضيف قيم افتراضية في التخزين؛ يعتمد فقط على fallback للعرض الأولي.
 */
export default function EditableLongText({
    k,
    fallback = "",
    className = "",
    placeholder = "اكتب هنا…",
    rows = 5,
    maxLength,              // اختياري: رقم
    showCounter = true,     // اختياري
    readOnlyClass = "whitespace-pre-line text-neutral-600", // يحافظ على السطور
}) {
    const { get, set, editMode, isAdmin } = useContent();
    const canEdit = editMode && isAdmin;

    // اقرأ القيمة المخزّنة أو استخدم fallback للعرض فقط
    const stored = get(k, fallback);
    const display = (stored ?? "").toString();

    const [editing, setEditing] = useState(false);
    const [val, setVal] = useState(display);
    const [saving, setSaving] = useState(false);
    const taRef = useRef(null);

    useEffect(() => {
        if (editing) {
            setVal(display);
            // فوكس + أوتو-ريسايز
            requestAnimationFrame(() => {
                if (taRef.current) {
                    taRef.current.focus();
                    autoResize(taRef.current);
                }
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editing]);

    const onChange = (e) => {
        const v = e.target.value;
        if (maxLength && v.length > maxLength) return;
        setVal(v);
        autoResize(e.target);
    };

    const autoResize = (el) => {
        el.style.height = "auto";
        el.style.height = `${el.scrollHeight}px`;
    };

    const save = async () => {
        setSaving(true);
        const clean = (val || "").trim();
        const { error } = await set(k, clean);
        setSaving(false);
        if (!error) setEditing(false);
        // ملاحظة: لا نخزّن fallback إطلاقًا؛ فقط ما يكتبه الأدمن.
    };

    // عرض الزوّار أو عند عدم التحرير
    if (!canEdit || !editing) {
        return (
            <div className={className}>
                <div className={readOnlyClass}>
                    {display || fallback}
                </div>

                {canEdit && (
                    <button
                        type="button"
                        onClick={() => setEditing(true)}
                        className="mt-2 inline-flex items-center gap-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900"
                        title="تعديل"
                    >
                        <Pencil className="w-4 h-4" />
                        تعديل
                    </button>
                )}
            </div>
        );
    }

    // وضع التحرير (أدمن)
    return (
        <div className={className}>
            <textarea
                ref={taRef}
                value={val}
                onChange={onChange}
                rows={rows}
                placeholder={placeholder}
                className="w-full border rounded-lg px-3 py-2 text-sm leading-7 focus:outline-none focus:ring-2 focus:ring-primary/40"
                dir="rtl"
            />
            <div className="mt-2 flex items-center gap-2">
                <button
                    type="button"
                    onClick={save}
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-lg bg-neutral-900 text-white px-3 py-1.5 text-xs disabled:opacity-60"
                >
                    <Save className="w-4 h-4" />
                    {saving ? "جارٍ الحفظ…" : "حفظ"}
                </button>
                <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="inline-flex items-center gap-2 rounded-lg bg-neutral-200 px-3 py-1.5 text-xs"
                >
                    <X className="w-4 h-4" />
                    إلغاء
                </button>

                {showCounter && typeof maxLength === "number" && (
                    <span className="ml-auto text-[11px] text-neutral-500">
                        {val.length}/{maxLength}
                    </span>
                )}
            </div>
        </div>
    );
}
