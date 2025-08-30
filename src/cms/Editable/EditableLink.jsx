import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useContent } from "../ContentProvider";

function normalizeUrl(u = "") {
    const v = (u || "").trim();
    if (!v) return "";
    if (v.startsWith("/")) return v;
    if (/^(mailto:|tel:|https?:\/\/|wa\.me|https?:\/\/wa\.me)/i.test(v)) return v;
    if (/^[\w-]+\.[\w.-]+(\/.*)?$/i.test(v)) return `https://${v}`;
    return v;
}

export default function EditableLink({
    k,
    fallbackText = "الرابط",
    fallbackUrl = "/",
    className = "",
    children,
}) {
    // 👇 استخدم getRaw بدل get
    const { getRaw, set, editMode, isAdmin } = useContent();
    const canEdit = editMode && isAdmin;

    // اقرأ القيمة الخام كما حُفظت في DB
    const raw = getRaw(k, { text: fallbackText, url: fallbackUrl });

    // استوعب القيم القديمة لو كانت مجرد string
    const obj = typeof raw === "string" ? { text: raw, url: fallbackUrl } : (raw || {});
    const displayText = obj.text ?? fallbackText;
    const displayUrl = obj.url ?? fallbackUrl;

    const [editing, setEditing] = useState(false);
    const [text, setText] = useState(displayText);
    const [url, setUrl] = useState(displayUrl);
    const [saving, setSaving] = useState(false);
    const inputRef = useRef(null);

    // لما نفتح التحرير، ناخذ آخر قيم معروضة
    useEffect(() => {
        if (editing) {
            setText(displayText || "");
            setUrl(displayUrl || "");
            setTimeout(() => inputRef.current?.focus(), 0);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editing]);

    const save = async () => {
        setSaving(true);
        const clean = { text: (text || "").trim(), url: normalizeUrl(url) };
        const { error } = await set(k, clean); // 👈 يتخزّن كائن {text,url}
        setSaving(false);
        if (!error) setEditing(false);
    };

    // وضع العرض
    if (!canEdit || !editing) {
        const normalized = normalizeUrl(displayUrl);
        const isInternal = normalized.startsWith("/");

        if (canEdit && !editing) {
            return (
                <button
                    type="button"
                    onClick={() => setEditing(true)}
                    className={className}
                    style={{ position: "relative" }}
                    title="تعديل الرابط"
                >
                    {children}
                    {displayText}
                    <span className="ml-2 text-xs text-neutral-500">(✎)</span>
                </button>
            );
        }

        return isInternal ? (
            <Link to={normalized || "/"} className={className}>
                {children}
                {displayText}
            </Link>
        ) : (
            <a
                href={normalized || "#"}
                target={normalized ? "_blank" : undefined}
                rel={normalized ? "noopener noreferrer" : undefined}
                className={className}
            >
                {children}
                {displayText}
            </a>
        );
    }

    // وضع التحرير
    return (
        <div className={`flex flex-col gap-2 ${className}`}>
            <input
                ref={inputRef}
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="النص"
                className="border rounded px-2 py-1"
            />
            <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="الرابط (مثلاً /booking أو https://example.com)"
                className="border rounded px-2 py-1"
            />
            <div className="flex gap-2">
                <button
                    onClick={save}
                    disabled={saving}
                    className="bg-primary text-white rounded px-3 py-1 text-sm disabled:opacity-60"
                    type="button"
                >
                    {saving ? "جارٍ الحفظ..." : "حفظ"}
                </button>
                <button
                    onClick={() => setEditing(false)}
                    className="bg-neutral-200 rounded px-3 py-1 text-sm"
                    type="button"
                >
                    إلغاء
                </button>
            </div>
        </div>
    );
}
