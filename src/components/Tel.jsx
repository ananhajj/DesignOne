// src/components/Tel.jsx
import React, { useMemo, useState } from "react";

/* =========================
   Helpers
   ========================= */
// نسمح فقط بـ + والأرقام
const onlyPlusDigits = (s = "") => String(s).replace(/[^\d+]/g, "");

// نحول لأي قيمة إلى تنسيق E.164 موحّد للتخزين: +<digits>
const toE164 = (raw = "") => {
    if (!raw) return "";
    // أبقي + الأولى فقط، ثم احذف أي رموز غير أرقام
    const cleaned = onlyPlusDigits(raw).replace(/(?!^)\+/g, "");
    if (!cleaned) return "";
    const digits = cleaned.startsWith("+") ? cleaned.slice(1) : cleaned;
    // أضف + في بداية السلسلة
    return digits ? `+${digits}` : "";
};

// تنسيق مخصص للعرض (pretty print)
// - يدعم الأردن (+962) بنمط قريب من الصورة
// - لباقي الدول: تجميع 3-3-3…
const formatDisplay = (e164 = "") => {
    const s = onlyPlusDigits(e164);
    if (!s) return "";
    const plus = "+";
    const digits = s.replace(/^\+/, "");

    // الأردن: +962 7 9xx xxx xx/xxx (تقسيم مرن)
    if (digits.startsWith("962")) {
        const cc = "962";
        let rest = digits.slice(cc.length);
        let out = `${plus}${cc}`;

        // افصل أول خانة (غالبًا 7 للخلوي)
        if (rest.length) {
            const first = rest.slice(0, 1);
            rest = rest.slice(1);
            out += ` ${first}`;
        }
        // بعدها مجموعات ثلاثية
        const groups = [];
        while (rest.length > 0) {
            groups.push(rest.slice(0, 3));
            rest = rest.slice(3);
        }
        if (groups.length) out += " " + groups.join(" ");

        return out;
    }

    // افتراضي: +CCC 333 333 333 …
    const cc = digits.slice(0, 3);
    let rest = digits.slice(3);
    const chunks = [];
    while (rest.length) {
        chunks.push(rest.slice(0, 3));
        rest = rest.slice(3);
    }
    return `${plus}${cc}${chunks.length ? " " + chunks.join(" ") : ""}`;
};

/* =========================
   Display-only
   ========================= */
export function TelDisplay({ value, className = "", title }) {
    const e164 = toE164(value);
    const disp = useMemo(() => formatDisplay(e164), [e164]);

    return (
        <a
            href={e164 ? `tel:${e164}` : undefined}
            dir="ltr"
            title={title || e164}
            // unicode-bidi:plaintext يمنع انعكاس الرموز داخل RTL
            className={`font-mono tracking-wide [unicode-bidi:plaintext] text-right ${className}`}
        >
            {disp || "—"}
        </a>
    );
}

/* =========================
   Input (للأدمن)
   ========================= */
export function TelInput({
    value,                 // ممكن E.164 أو خام
    onChange,              // (e164, pretty) => void
    placeholder = "+962 7 …",
    className = "",
    inputProps = {},
}) {
    const [local, setLocal] = useState(formatDisplay(toE164(value)));

    const handleChange = (e) => {
        // نسمح بالأرقام والمسافات و +
        let v = e.target.value.replace(/[^\d+\s]/g, "");
        // نمنع أكثر من +
        v = v.replace(/(?!^)\+/g, "");
        setLocal(v);
        const e164 = toE164(v);
        onChange?.(e164, formatDisplay(e164));
    };

    const handleBlur = () => {
        const e164 = toE164(local);
        const pretty = formatDisplay(e164);
        setLocal(pretty);
        onChange?.(e164, pretty);
    };

    return (
        <input
            dir="ltr"
            inputMode="tel"
            autoComplete="tel"
            placeholder={placeholder}
            value={local}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`font-mono text-right border rounded-lg px-3 py-2 ${className}`}
            {...inputProps}
        />
    );
}

/* =========================
   Utilities للتخزين/الفرز
   ========================= */
export const TelUtils = { toE164, formatDisplay, onlyPlusDigits };

/* =========================
   استخدام سريع (كمثال)
   =========================
   // للعرض:
   <TelDisplay value={item.phone} className="text-white/90" />

   // للتحرير:
   <TelInput
     value={form.phone}
     onChange={(e164) => setForm((f) => ({ ...f, phone: e164 }))}
   />

   // عند الحفظ:
   const clean = { ...form, phone: TelUtils.toE164(form.phone) };
*/
