import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useContent } from "../ContentProvider";

export default function EditableLink({
    k,
    fallbackText = "الرابط",
    fallbackUrl = "/",
    className = "",
    children,
}) {
    const { get, set, editMode, isAdmin } = useContent();

    // نجلب القيم المخزنة أو الافتراضية
    const stored = get(k, { text: fallbackText, url: fallbackUrl });
    const [text, setText] = useState(stored.text || fallbackText);
    const [url, setUrl] = useState(stored.url || fallbackUrl);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const ref = useRef(null);

    const save = async () => {
        setSaving(true);
        const { error } = await set(k, { text, url });
        setSaving(false);
        if (!error) setEditing(false);
    };

    if (!(editMode && isAdmin)) {
        return (
            <Link to={url} className={className}>
                {children}
                {text}
            </Link>
        );
    }

    if (!editing) {
        return (
            <button
                type="button"
                onClick={() => setEditing(true)}
                className={className}
                style={{ position: "relative" }}
            >
                {children}
                {text}
                <span className="ml-2 text-xs text-neutral-500">(✎)</span>
            </button>
        );
    }

    return (
        <div className="flex flex-col gap-2">
            <input
                ref={ref}
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
                placeholder="الرابط"
                className="border rounded px-2 py-1"
            />
            <div className="flex gap-2">
                <button
                    onClick={save}
                    disabled={saving}
                    className="bg-primary text-white rounded px-3 py-1 text-sm"
                >
                    حفظ
                </button>
                <button
                    onClick={() => setEditing(false)}
                    className="bg-neutral-200 rounded px-3 py-1 text-sm"
                >
                    إلغاء
                </button>
            </div>
        </div>
    );
}
