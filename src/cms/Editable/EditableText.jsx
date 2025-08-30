import React, { useEffect, useRef, useState, useMemo } from "react";
import { useContent } from "../ContentProvider";

function Spinner() {
    return <span className="inline-block animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />;
}

export default function EditableText({
    k,
    fallback = "",
    as: Tag = "span",
    className = "",
    inputClassName = "",
    placeholder = "اكتب النص…",
}) {
    const readVal = (x) => (x && typeof x === "object" ? (x.text ?? fallback) : (x ?? fallback));
    const { get, set, editMode, isAdmin } = useContent();

    const stored = useMemo(() => readVal(get(k, fallback)), [get, k, fallback]);

    const [val, setVal] = useState(stored);
    const [orig, setOrig] = useState(stored);
    const [hover, setHover] = useState(false);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
        if (!editing && !saving) {
            if (stored !== orig) {
                setVal(stored);
                setOrig(stored);
            }
        }
    }, [stored, editing, saving, orig]);

    const openEdit = () => {
        if (!(editMode && isAdmin)) return;
        setEditing(true);
        requestAnimationFrame(() => {
            requestAnimationFrame(() => inputRef.current?.focus({ preventScroll: true }));
        });
    };

    const cancel = () => { setVal(orig); setEditing(false); };

    const SAVE_TIMEOUT_MS = 8000;
    const save = async () => {
        if (!(editMode && isAdmin)) return;
        if (val === orig) { setEditing(false); return; }

        setSaving(true);
        const current = get(k, fallback);
        const payload =
            current && typeof current === "object" && current !== null && "text" in current
                ? { text: val }
                : { text: val }; // توحيد التخزين للنصوص

        const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error("save-timeout")), SAVE_TIMEOUT_MS));

        try {
            const result = await Promise.race([set(k, payload), timeout]);
            const error = result?.error;
            if (error) {
                alert("فشل الحفظ: " + (error.message || error));
                return;
            }
            setOrig(val);
            setEditing(false);
            setSaved(true);
            setTimeout(() => setSaved(false), 800);
        } catch (err) {
            alert(String(err?.message) === "save-timeout"
                ? "تعذّر الحفظ (انتهت المهلة)."
                : "حدث خطأ أثناء الحفظ.");
        } finally {
            setSaving(false);
        }
    };

    const onKeyDown = (e) => {
        if (e.key === "Enter") { e.preventDefault(); e.stopPropagation(); save(); }
        else if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); cancel(); }
    };

    if (!(editMode && isAdmin)) return <Tag className={className}>{val}</Tag>;

    if (!editing) {
        return (
            <span
                className="relative inline-flex items-center"
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
            >
                <Tag
                    className={`${className} ${hover ? "underline decoration-dotted underline-offset-4 cursor-pointer" : ""}`}
                    onClick={openEdit}
                >
                    {val || <span className="opacity-60">{fallback}</span>}
                </Tag>
                {hover && (
                    <button
                        type="button"
                        onClick={openEdit}
                        className="ml-2 text-xs px-2 py-0.5 rounded bg-neutral-200/70 hover:bg-neutral-300/70 text-neutral-800"
                        title="تعديل"
                    >
                        ✎
                    </button>
                )}
                {saved && <span className="ml-2 text-green-600 text-xs">✓ تم الحفظ</span>}
            </span>
        );
    }

    return (
        <span className="inline-flex items-center gap-2">
            <input
                ref={inputRef}
                value={val}
                onChange={(e) => setVal(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder={placeholder}
                className={inputClassName || "border border-neutral-300 focus:border-primary outline-none rounded-lg px-3 py-1.5 text-sm shadow-sm bg-white text-neutral-900"}
                autoComplete="off"
                spellCheck={false}
            />
            <button
                type="button"
                onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); }}
                onClick={save}
                disabled={saving}
                className="rounded-lg px-3 py-1.5 text-sm text-white bg-primary/90 hover:bg-primary disabled:opacity-60"
            >
                {saving ? <Spinner /> : "حفظ"}
            </button>
            <button
                type="button"
                onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); }}
                onClick={cancel}
                disabled={saving}
                className="rounded-lg px-3 py-1.5 text-sm bg-neutral-200/70 hover:bg-neutral-300/70 text-neutral-800"
            >
                إلغاء
            </button>
        </span>
    );
}
