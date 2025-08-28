import React, { useMemo, useState } from "react";
import { useContent } from "../ContentProvider";
import { Save, MapPin, Link as LinkIcon, Target } from "lucide-react";

/**
 * يدعم طريقتين للتخزين:
 * 1) وضع "url": نخزن embedSrc كما هو (أسهل وأسرع).
 * 2) وضع "coords": نخزن lat/lng/zoom/placeQuery ونبني الـ URL تلقائياً.
 */
const buildEmbedFromCoords = ({ lat, lng, zoom = 14, placeQuery = "" }) => {
    // أبسط تضمين يعتمد على query أو lat,lng
    // ملاحظة: هذا ليس Google Maps Embed API الرسمي بمفتاح، لكنه يعمل للعرض البسيط
    const q = placeQuery?.trim()
        ? encodeURIComponent(placeQuery.trim())
        : `${lat},${lng}`;
    return `https://www.google.com/maps?q=${q}&hl=ar&z=${zoom}&output=embed`;
};

export default function EditableMap({
    k = "contact.map",
    className = "relative h-96 rounded-3xl overflow-hidden shadow-soft border border-primary/10",
    // قيمة افتراضية (مطابقة اللي عندك حالياً)
    fallback = {
        mode: "url", // "url" | "coords"
        embedSrc:
            "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3384.3875999765137!2d35.84070507638613!3d31.977506674007937!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151ca19bc3e1d1ed%3A0xc7b138ad3619f9b8!2sMecca%20Mall!5e0!3m2!1sen!2sjo!4v1756390992046!5m2!1sen!2sjo",
        address: "حي العليا، طريق الملك فهد، الرياض",
        // لو اخترت وضع coords
        lat: 31.9775067,
        lng: 35.8407050,
        zoom: 14,
        placeQuery: "Mecca Mall Amman",
    },
}) {
    const { get, set, editMode, isAdmin } = useContent();
    const canEdit = editMode && isAdmin;

    const stored = get(k, fallback);

    const initial = useMemo(() => {
        // قبول أشكال قديمة أو ناقصة
        const mode = stored?.mode === "coords" ? "coords" : "url";
        return {
            mode,
            embedSrc: stored?.embedSrc || fallback.embedSrc,
            address: stored?.address ?? fallback.address,
            lat: typeof stored?.lat === "number" ? stored.lat : fallback.lat,
            lng: typeof stored?.lng === "number" ? stored.lng : fallback.lng,
            zoom: typeof stored?.zoom === "number" ? stored.zoom : fallback.zoom,
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

    const previewSrc =
        mode === "coords"
            ? buildEmbedFromCoords({ lat, lng, zoom, placeQuery })
            : embedSrc;

    const onSave = async () => {
        setSaving(true);
        const payload =
            mode === "coords"
                ? { mode, address, lat: Number(lat), lng: Number(lng), zoom: Number(zoom), placeQuery }
                : { mode, address, embedSrc };
        const { error } = await set(k, payload);
        setSaving(false);
        if (error) alert("فشل الحفظ: " + error.message);
    };

    // عرض الزائر (بدون أدوات)
    if (!canEdit) {
        return (
            <div className={className}>
                <iframe
                    src={previewSrc}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="خريطة الموقع"
                />
            </div>
        );
    }

    // وضع التحرير (أدمن)
    return (
        <div className={`${className} bg-white`}>
            <div className="p-3 bg-white/80 border-b border-neutral-200">
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

            {/* محرر الحقول */}
            <div className="p-3 grid gap-3 bg-white">
                {mode === "url" ? (
                    <div className="grid gap-2">
                        <label className="text-xs text-neutral-500">Google Maps Embed URL</label>
                        <input
                            className="w-full rounded border border-neutral-300 px-2 py-1 text-sm"
                            placeholder="ألصق رابط التضمين من خرائط جوجل"
                            value={embedSrc}
                            onChange={(e) => setEmbedSrc(e.target.value)}
                        />
                        <div className="text-xs text-neutral-500">
                            تلميح: من Google Maps ↗ زر مشاركة ↗ Embed a map ↗ انسخ رابط iframe (src).
                        </div>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-4 gap-2">
                        <div>
                            <label className="text-xs text-neutral-500">Latitude</label>
                            <input
                                type="number"
                                step="0.0000001"
                                className="w-full rounded border border-neutral-300 px-2 py-1 text-sm"
                                value={lat}
                                onChange={(e) => setLat(parseFloat(e.target.value))}
                            />
                        </div>
                        <div>
                            <label className="text-xs text-neutral-500">Longitude</label>
                            <input
                                type="number"
                                step="0.0000001"
                                className="w-full rounded border border-neutral-300 px-2 py-1 text-sm"
                                value={lng}
                                onChange={(e) => setLng(parseFloat(e.target.value))}
                            />
                        </div>
                        <div>
                            <label className="text-xs text-neutral-500">Zoom</label>
                            <input
                                type="number"
                                min={1}
                                max={21}
                                className="w-full rounded border border-neutral-300 px-2 py-1 text-sm"
                                value={zoom}
                                onChange={(e) => setZoom(parseInt(e.target.value) || 14)}
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
            <div className="h-[22rem]">
                <iframe
                    src={previewSrc}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="خريطة (معاينة)"
                />
            </div>

            {/* شريط سفلي لعرض العنوان إن وجد */}
            {address ? (
                <div className="px-4 py-2 text-sm text-neutral-700 bg-white/90 border-t border-neutral-200">
                    {address}
                </div>
            ) : null}
        </div>
    );
}
