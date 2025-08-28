import { useEffect, useRef, useState } from "react";
import { useContent } from "../ContentProvider";

function Spinner() {
    return <span className="inline-block animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />;
}

export default function EditableImage({
    k,
    fallback = "https://placehold.co/140x40?text=Logo",
    alt = "logo",
    className = "h-10 w-auto object-contain",
}) {
    const { get, set, editMode, isAdmin } = useContent();

 
    const normalize = (v) => {
        if (typeof v === "string") return v;
        if (v && typeof v === "object") {
            return v.src || v.image_url || v.url || "";
        }
        return "";
    };

    const [src, setSrc] = useState(normalize(get(k, fallback)));
    const [orig, setOrig] = useState(src);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const inputRef = useRef(null);

   
    useEffect(() => {
        const v = normalize(get(k, fallback));
        setSrc(v || fallback);
        setOrig(v || fallback);
    }, [k, get, fallback]);

    const openEdit = () => {
        if (!(editMode && isAdmin)) return;
        setEditing(true);
        setTimeout(() => inputRef.current?.focus(), 0);
    };

    const cancel = () => {
        setSrc(orig);
        setEditing(false);
    };

    const save = async () => {
        if (!(editMode && isAdmin)) return;
        if (src === orig) { setEditing(false); return; }
        setSaving(true);
        const { error } = await set(k, { src }); 
        setSaving(false);
        if (error) {
            alert("فشل الحفظ: " + error.message);
            return;
        }
        setOrig(src);
        setEditing(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 800);
    };

    const onKeyDown = (e) => {
        if (e.key === "Enter") { e.preventDefault(); save(); }
        else if (e.key === "Escape") { e.preventDefault(); cancel(); }
    };

  
    if (!(editMode && isAdmin)) {
        return <img src={src || fallback} alt={alt} className={className} />;
    }

    if (!editing) {
        return (
            <div className="relative group cursor-pointer" onClick={openEdit}>
                <img src={src || fallback} alt={alt} className={className + " pointer-events-none select-none"} />
                <div className="absolute inset-0 flex items-end justify-end bg-black/0 group-hover:bg-black/30 transition-colors">
                    <span className="m-1 bg-black/60 text-white text-[10px] px-1 py-[2px] rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        ✎ تعديل
                    </span>
                </div>
                {saved && <span className="absolute -top-2 -right-2 text-green-600 text-xs bg-white rounded px-1">✓</span>}
            </div>
        );
    }


    return (
        <div className="flex items-center gap-2">
            <input
                ref={inputRef}
                type="text"
                value={src}
                onChange={(e) => setSrc(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="ضع رابط صورة…"
                className="border border-neutral-300 focus:border-primary outline-none rounded-lg px-3 py-1.5 text-sm shadow-sm bg-white w-[280px] max-w-[60vw]"
            />
            <button
                onClick={save}
                disabled={saving}
                className="rounded-lg px-3 py-1.5 text-sm text-white bg-primary/90 hover:bg-primary disabled:opacity-60"
            >
                {saving ? <Spinner /> : "حفظ"}
            </button>
            <button
                onClick={cancel}
                disabled={saving}
                className="rounded-lg px-3 py-1.5 text-sm bg-neutral-200/70 hover:bg-neutral-300/70 text-neutral-800"
            >
                إلغاء
            </button>
        </div>
    );
}
