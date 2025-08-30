// src/cms/Editable/EditableMap.jsx
import React, { useMemo, useState } from "react";
import { useContent } from "../ContentProvider";
import { Save, MapPin, Link as LinkIcon, Target } from "lucide-react";

const buildEmbedFromCoords = ({ lat, lng, zoom = 14, placeQuery = "" }) => {
    const hasCoords = Number.isFinite(lat) && Number.isFinite(lng);
    const q = (placeQuery || "").trim();
    const query = q ? encodeURIComponent(q) : (hasCoords ? `${lat},${lng}` : "");
    return query
        ? `https://www.google.com/maps?q=${query}&hl=ar&z=${zoom}&output=embed`
        : "";
};

const toNum = (v, def) => {
    const n = typeof v === "string" ? parseFloat(v) : v;
    return Number.isFinite(n) ? n : def;
};

export default function EditableMap({
    k = "contact.map",
    className = "h-[22rem] md:h-[28rem]",
    fallback = {
        mode: "url",
        embedSrc:
            "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3383.904423668541!2d35.86918609999999!3d31.9906063!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151ca182a485c5e9%3A0x4538604559d1ade1!2z2YXYrNmF2Lkg2KfZhNiu2YHYrNmKINiv2YjYp9ixINin2YTZiNin2K3YqQ!5e0!3m2!1sen!2sjo!4v1756407956111!5m2!1sen!2sjo",
        address: "عمان - دوار الواحة شارع وصفي التل",
     
        lat: 31.9906063,
        lng: 35.8691861,
        zoom: 14,
        placeQuery: "عمان - دوار الواحة شارع وصفي التل",
    },
}) {
    const { get, set, editMode, isAdmin } = useContent();
    const canEdit = editMode && isAdmin;

    const stored = get(k, fallback);

    const initial = useMemo(() => {
        const mode = stored?.mode === "coords" ? "coords" : "url";
        return {
            mode,
            embedSrc: stored?.embedSrc || fallback.embedSrc,
            address: stored?.address ?? fallback.address,
            lat: toNum(stored?.lat, fallback.lat),
            lng: toNum(stored?.lng, fallback.lng),
            zoom: toNum(stored?.zoom, fallback.zoom),
            placeQuery: stored?.placeQuery ?? fallback.placeQuery,
        };
    }, [stored]);

    const [mode, setMode] = useState(initial.mode);
    const [embedSrc, setEmbedSrc] = useState(initial.embedSrc);
    const [address, setAddress] = useState(initial.address);
    const [lat, setLat] = useState(initial.lat);
    const [lng, setLng] = useState(initial.lng);
    const [zoom, setZoom] = useState(initial.zoom);
    const [placeQuery, setPlaceQuery] = useState(initial.placeQuery);
    const [saving, setSaving] = useState(false);

    const coordsSrc = buildEmbedFromCoords({ lat, lng, zoom, placeQuery });
    const previewSrc =
        mode === "coords"
            ? (coordsSrc || fallback.embedSrc)
            : (embedSrc || fallback.embedSrc);

    const onSave = async () => {
        setSaving(true);
        const payload =
            mode === "coords"
                ? { mode, address, lat: toNum(lat, fallback.lat), lng: toNum(lng, fallback.lng), zoom: toNum(zoom, fallback.zoom), placeQuery }
                : { mode, address, embedSrc: embedSrc || fallback.embedSrc };
        const { error } = await set(k, payload);
        setSaving(false);
        if (error) alert("فشل الحفظ: " + error.message);
    };

    // عرض الزوّار
    if (!canEdit) {
        return (
            <div className={className}>
                <iframe
                    src={previewSrc}
                    className="block w-full h-full [transform:translateZ(0)]"
                    style={{
                        border: 0,
                        WebkitMaskImage: "-webkit-radial-gradient(white, black)", // يخفف مشاكل iOS مع القص
                    }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="خريطة الموقع"
                />
            </div>
        );
    }

    // وضع التحرير (أدمن)
    return (
        <div className={`${className} bg-white rounded-3xl overflow-hidden border border-neutral-200`}>
            {/* شريط علوي للتحكم */}
            <div className="p-3 bg-white/90 border-b border-neutral-200">
                <div className="flex flex-wrap items-center gap-2 text-sm">
                    <button
                        type="button"
                        onClick={() => setMode("url")}
                        className={`inline-flex items-center gap-1 rounded px-2 py-1 border ${mode === "url" ? "bg-primary/10 border-primary text-primary" : "border-neutral-300"}`}
                        title="وضع رابط تضمين"
                    >
                        <LinkIcon className="w-4 h-4" /> رابط تضمين
                    </button>
                    <button
                        type="button"
                        onClick={() => setMode("coords")}
                        className={`inline-flex items-center gap-1 rounded px-2 py-1 border ${mode === "coords" ? "bg-primary/10 border-primary text-primary" : "border-neutral-300"}`}
                        title="وضع إحداثيات"
                    >
                        <Target className="w-4 h-4" /> إحداثيات
                    </button>

                    <div className="ml-auto flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        <input
                            className="rounded border border-neutral-300 px-2 py-1 text-sm min-w-[14rem]"
                            placeholder="عنوان مختصر للعرض (اختياري)"
                            value={address || ""}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                        <button
                            onClick={onSave}
                            disabled={saving}
                            className="inline-flex items-center gap-2 rounded-lg bg-primary/90 text-white px-3 py-1.5 text-sm"
                        >
                            <Save className="w-4 h-4" />
                            {saving ? "جارٍ الحفظ..." : "حفظ"}
                        </button>
                    </div>
                </div>
            </div>

            {/* الحقول */}
            <div className="p-3 grid gap-3 bg-white">
                {mode === "url" ? (
                    <div className="grid gap-2">
                        <label className="text-xs text-neutral-500">Google Maps Embed URL</label>
                        <input
                            className="w-full rounded border border-neutral-300 px-2 py-1 text-sm ltr"
                            placeholder="ألصق رابط التضمين من خرائط جوجل"
                            value={embedSrc}
                            onChange={(e) => setEmbedSrc(e.target.value)}
                        />
                        <div className="text-xs text-neutral-500">
                            من Google Maps → Share → Embed a map → انسخ src من iframe.
                        </div>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-4 gap-2">
                        <div>
                            <label className="text-xs text-neutral-500">Latitude</label>
                            <input
                                type="number"
                                step="0.0000001"
                                className="w-full rounded border border-neutral-300 px-2 py-1 text-sm ltr"
                                value={lat}
                                onChange={(e) => setLat(toNum(e.target.value, lat))}
                            />
                        </div>
                        <div>
                            <label className="text-xs text-neutral-500">Longitude</label>
                            <input
                                type="number"
                                step="0.0000001"
                                className="w-full rounded border border-neutral-300 px-2 py-1 text-sm ltr"
                                value={lng}
                                onChange={(e) => setLng(toNum(e.target.value, lng))}
                            />
                        </div>
                        <div>
                            <label className="text-xs text-neutral-500">Zoom</label>
                            <input
                                type="number"
                                min={1}
                                max={21}
                                className="w-full rounded border border-neutral-300 px-2 py-1 text-sm ltr"
                                value={zoom}
                                onChange={(e) => setZoom(toNum(e.target.value, zoom) || 14)}
                            />
                        </div>
                        <div>
                            <label className="text-xs text-neutral-500">Place / Query (اختياري)</label>
                            <input
                                className="w-full rounded border border-neutral-300 px-2 py-1 text-sm"
                                placeholder="مثال: Riyadh Olaya"
                                value={placeQuery}
                                onChange={(e) => setPlaceQuery(e.target.value)}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* المعاينة */}
            <div className="h-[22rem] md:h-[24rem]">
                <iframe
                    src={previewSrc}
                    className="block w-full h-full [transform:translateZ(0)]"
                    style={{
                        border: 0,
                        WebkitMaskImage: "-webkit-radial-gradient(white, black)",
                    }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="خريطة (معاينة)"
                />
            </div>

            {address ? (
                <div className="px-4 py-2 text-sm text-neutral-700 bg-white/90 border-t border-neutral-200">
                    {address}
                </div>
            ) : null}
        </div>
    );
}
