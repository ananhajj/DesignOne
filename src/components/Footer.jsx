import React, { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    Scale, Phone, Mail, MapPin, Calendar,
    Plus, Trash2, ArrowUp, ArrowDown, Save
} from "lucide-react";

import { useContent } from "../cms/ContentProvider";
import EditableText from "../cms/Editable/EditableText";
import EditableLink from "../cms/Editable/EditableLink";

/* -------------------- Utils -------------------- */
function uid() {
    return Math.random().toString(36).slice(2, 9);
}
function asArray(stored, fallbackArr) {
    if (Array.isArray(stored?.items)) return stored.items;
    if (Array.isArray(stored)) return stored;
    return fallbackArr;
}

/* -------------------- Defaults -------------------- */
const DEFAULT_QUICK = [
    { id: uid(), name: "الرئيسية", href: "/" },
    { id: uid(), name: "عن المحامية", href: "/about" },
    { id: uid(), name: "الخدمات", href: "/services" },
    { id: uid(), name: "أعمال مختارة", href: "/cases" },
];

const DEFAULT_LEGAL = [
    { id: uid(), name: "سياسة الخصوصية", href: "/privacy" },
    { id: uid(), name: "شروط الاستخدام", href: "/terms" },
    { id: uid(), name: "إخلاء المسؤولية", href: "/disclaimer" },
    { id: uid(), name: "أخلاقيات المهنة", href: "/ethics" },
];

const DEFAULT_PHONES = [
    { id: uid(), value: "00962 7 9223 6366", link: "" },
];

const DEFAULT_EMAILS = [
    { id: uid(), value: "sara@alahmedlaw.com", link: "" },
];

const DEFAULT_ADDRESS = [
    { id: uid(), value: "الرياض، حي العليا" },
    { id: uid(), value: "طريق الملك فهد" },
];

/* -------------------- Editor Toolbar -------------------- */
function EditorToolbar({ onAdd, onSave, title, status, saving }) {
    return (
        <div className="sticky top-2 z-20 -mx-2 mb-3 px-2 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 flex flex-wrap items-center gap-2">
            {title ? <span className="text-xs font-semibold text-white/80 mr-auto">{title}</span> : null}

            <button
                onClick={onAdd}
                type="button"
                className="inline-flex items-center gap-2 rounded-lg bg-primary-500/90 text-white px-3 py-1.5 text-xs disabled:opacity-60"
                disabled={!!saving}
            >
                <Plus className="w-4 h-4" />
                إضافة
            </button>

            <button
                onClick={onSave}
                type="button"
                className="inline-flex items-center gap-2 rounded-lg bg-white/15 text-white px-3 py-1.5 text-xs disabled:opacity-60"
                disabled={!!saving}
                title={saving ? "جارٍ الحفظ..." : "حفظ"}
            >
                <Save className={`w-4 h-4 ${saving ? "animate-pulse" : ""}`} />
                {saving ? "جارٍ الحفظ..." : "حفظ"}
            </button>

            {status ? (
                <span
                    className={`text-xs font-semibold ${status.startsWith("تم") ? "text-green-400"
                            : status.startsWith("فشل") ? "text-red-400"
                                : "text-yellow-300"
                        }`}
                >
                    {status}
                </span>
            ) : null}
        </div>
    );
}

/* -------------------- Move / Delete Buttons -------------------- */
function MoveDelButtons({ onUp, onDown, onDel }) {
    return (
        <div className="flex items-center gap-1">
            <button onClick={onUp} className="p-1 rounded hover:bg-white/10" title="أعلى" type="button">
                <ArrowUp className="w-4 h-4" />
            </button>
            <button onClick={onDown} className="p-1 rounded hover:bg-white/10" title="أسفل" type="button">
                <ArrowDown className="w-4 h-4" />
            </button>
            <button onClick={onDel} className="p-1 rounded hover:bg-red-500/10 text-red-300" title="حذف" type="button">
                <Trash2 className="w-4 h-4" />
            </button>
        </div>
    );
}

/* -------------------- Phone/Email Helpers -------------------- */
// تحويل أرقام عربية -> لاتينية
function toLatinDigits(str = "") {
    const map = { "٠": "0", "١": "1", "٢": "2", "٣": "3", "٤": "4", "٥": "5", "٦": "6", "٧": "7", "٨": "8", "٩": "9" };
    return str.replace(/[٠-٩]/g, (d) => map[d] || d);
}
// تنظيف رقم الهاتف وتحويل 00 -> +
function normalizePhone(raw = "") {
    const v = toLatinDigits(raw).trim();
    // أزل كل ما عدا الأرقام و"+" (وابقِ على + في المقدمة فقط)
    let cleaned = v.replace(/[^\d+]/g, "");
    if (cleaned.startsWith("00")) cleaned = `+${cleaned.slice(2)}`;
    cleaned = cleaned.replace(/(?!^)\+/g, "");
    return cleaned;
}
// LRM mark لتثبيت اتجاه LTR
const LRM = "\u200E";

// تنسيق عرض رقمي (لا يؤثر على الرابط)
function formatPhoneDisplay(raw = "") {
    const tel = normalizePhone(raw);      // مثل +962792236366
    const m = /^\+?(\d{1,3})(\d+)$/.exec(tel.replace(/^tel:/, ""));
    if (!m) return raw.trim();

    const cc = m[1];        // country code
    const rest = m[2];      // بقية الرقم

    // تنسيق مُخصص للأردن: +962 7 XXX XXXX
    if (cc === "962" && /^7\d{8}$/.test(rest)) {
        return `+962 7 ${rest.slice(1, 4)} ${rest.slice(4)}`;
    }

    // fallback عام: +CC rest مفصول كل 3 من اليمين
    const grouped = rest.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return `+${cc} ${grouped}`;
}

function autoLink(value, link, iconName) {
    const vRaw = (value || "").trim();
    const l = (link || "").trim();
    if (l) return l;

    const v = toLatinDigits(vRaw);
    const isEmail = v.includes("@");
    const looksLikePhone = /[+\d]/.test(v);
    const isURL = /^https?:\/\//i.test(v) || /^www\./i.test(v);

    if (isEmail) return `mailto:${v}`;

    // هاتف: إن كان الأيقونة Phone أو النص يبدو رقماً، ابنِ tel:
    if (iconName === "Phone" || (!isURL && looksLikePhone)) {
        const phone = normalizePhone(v);
        if (/\d{6,}/.test(phone.replace(/\D/g, ""))) {
            return `tel:${phone}`;
        }
    }

    // واتساب مختصر
    if (/^(wa\.me|https?:\/\/wa\.me)/i.test(v)) {
        return v.startsWith("http") ? v : `https://${v}`;
    }

    if (isURL) return v.startsWith("http") ? v : `https://${v}`;
    return "";
}

/* -------------------- Editable Links (name, href) -------------------- */
function EditableLinksList({ k, fallback = [], layout = "column", className = "" }) {
    const { get, set, editMode, isAdmin } = useContent();
    const canEdit = editMode && isAdmin;

    const stored = get(k, { items: fallback });
    const initial = useMemo(() => asArray(stored, fallback), [stored, fallback]);
    const [items, setItems] = useState(initial);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState("");

    // Sync with storage updates
    useEffect(() => {
        setItems(asArray(stored, fallback));
    }, [stored, fallback]);

    const add = () => setItems(prev => [...prev, { id: uid(), name: "", href: "" }]);
    const del = (id) => setItems(prev => prev.filter(x => x.id !== id));
    const move = (i, d) => {
        const j = i + d;
        if (j < 0 || j >= items.length) return;
        const arr = [...items];
        [arr[i], arr[j]] = [arr[j], arr[i]];
        setItems(arr);
    };
    const update = (id, patch) => setItems(prev => prev.map(x => (x.id === id ? { ...x, ...patch } : x)));

    const saveAll = async () => {
        setSaving(true);
        setStatus("جارٍ الحفظ...");
        const clean = items
            .map(x => ({ id: x.id || uid(), name: (x.name || "").trim(), href: (x.href || "").trim() }))
            .filter(x => x.name || x.href);
        const { error } = await set(k, { items: clean });
        if (error) {
            setStatus("فشل الحفظ: " + error.message);
        } else {
            setStatus("تم الحفظ");
            setItems(clean);
            setTimeout(() => setStatus(""), 2000);
        }
        setSaving(false);
    };

    if (!canEdit) {
        if (layout === "row") {
            return (
                <div className={`flex flex-wrap justify-center gap-6 min-w-0 ${className}`}>
                    {items.map(link => (
                        <Link
                            key={link.id || link.href}
                            to={link.href || "#"}
                            className="inline-flex text-xs text-primary-200 hover:text-accent-500 transition"
                            title={link.name}
                        >
                            {link.name || "—"}
                        </Link>
                    ))}
                </div>
            );
        }
        return (
            <ul className={`space-y-3 min-w-0 ${className}`}>
                {items.map(link => (
                    <li key={link.id || link.href} className="min-w-0">
                        <Link
                            to={link.href || "#"}
                            className="block text-sm text-primary-100 hover:text-accent-500 transition"
                            title={link.name}
                        >
                            {link.name || "—"}
                        </Link>
                    </li>
                ))}
            </ul>
        );
    }

    return (
        <div className={`rounded-xl p-3 bg-white/5 border border-white/10 ${className}`}>
            <EditorToolbar onAdd={add} onSave={saveAll} saving={saving} status={status} />
            <div className="space-y-2">
                {items.map((it, idx) => (
                    <div key={it.id} className="grid grid-cols-1 md:grid-cols-[1fr,1fr,auto] gap-2 items-center min-w-0">
                        <input
                            className="w-full rounded px-2 py-1 text-sm text-neutral-900"
                            placeholder="الاسم"
                            value={it.name}
                            onChange={(e) => update(it.id, { name: e.target.value })}
                        />
                        <input
                            className="w-full rounded px-2 py-1 text-sm text-neutral-900"
                            placeholder="/path أو https://"
                            value={it.href}
                            onChange={(e) => update(it.id, { href: e.target.value })}
                        />
                        <div className="justify-self-start md:justify-self-end">
                            <MoveDelButtons
                                onUp={() => move(idx, -1)}
                                onDown={() => move(idx, +1)}
                                onDel={() => del(it.id)}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* -------------------- Editable Text List ({value}) -------------------- */
function EditableTextList({ k, fallback = [], className = "" }) {
    const { get, set, editMode, isAdmin } = useContent();
    const canEdit = editMode && isAdmin;

    const stored = get(k, { items: fallback });
    const initial = useMemo(() => asArray(stored, fallback), [stored, fallback]);
    const [items, setItems] = useState(initial);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState("");

    useEffect(() => {
        setItems(asArray(stored, fallback));
    }, [stored, fallback]);

    const add = () => setItems(prev => [...prev, { id: uid(), value: "" }]);
    const del = (id) => setItems(prev => prev.filter(x => x.id !== id));
    const move = (i, d) => {
        const j = i + d;
        if (j < 0 || j >= items.length) return;
        const arr = [...items];
        [arr[i], arr[j]] = [arr[j], arr[i]];
        setItems(arr);
    };
    const update = (id, patch) => setItems(prev => prev.map(x => (x.id === id ? { ...x, ...patch } : x)));

    const saveAll = async () => {
        setSaving(true);
        setStatus("جارٍ الحفظ...");
        const clean = items
            .map(x => ({ id: x.id || uid(), value: (x.value || "").trim() }))
            .filter(x => x.value);
        const { error } = await set(k, { items: clean });
        if (error) {
            setStatus("فشل الحفظ: " + error.message);
        } else {
            setStatus("تم الحفظ");
            setItems(clean);
            setTimeout(() => setStatus(""), 2000);
        }
        setSaving(false);
    };

    if (!canEdit) {
        return (
            <address className={`not-italic leading-6 min-w-0 ${className}`}>
                {items.map((l, i) => (
                    <span key={l.id || i} className="block truncate" title={l.value}>
                        {l.value || "—"}
                    </span>
                ))}
            </address>
        );
    }

    return (
        <div className={`rounded-xl p-3 bg-white/5 border border-white/10 ${className}`}>
            <EditorToolbar onAdd={add} onSave={saveAll} saving={saving} status={status} />
            <div className="space-y-2">
                {items.map((it, idx) => (
                    <div key={it.id} className="grid grid-cols-1 md:grid-cols-[1fr,auto] gap-2 items-center min-w-0">
                        <input
                            className="w-full rounded px-2 py-1 text-sm text-neutral-900"
                            placeholder="سطر العنوان…"
                            value={it.value}
                            onChange={(e) => update(it.id, { value: e.target.value })}
                        />
                        <div className="justify-self-start md:justify-self-end">
                            <MoveDelButtons
                                onUp={() => move(idx, -1)}
                                onDown={() => move(idx, +1)}
                                onDel={() => del(it.id)}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* -------------------- Editable Contact List ({value, link}) -------------------- */
function EditableContactList({ k, fallback = [], icon: Icon, kind, className = "" }) {
    const { get, set, editMode, isAdmin } = useContent();
    const canEdit = editMode && isAdmin;

    const stored = get(k, { items: fallback });
    const initial = useMemo(() => asArray(stored, fallback), [stored, fallback]);
    const [items, setItems] = useState(initial);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState("");

    useEffect(() => {
        setItems(asArray(stored, fallback));
    }, [stored, fallback]);

    const add = () => setItems(prev => [...prev, { id: uid(), value: "", link: "" }]);
    const del = (id) => setItems(prev => prev.filter(x => x.id !== id));
    const move = (i, d) => {
        const j = i + d;
        if (j < 0 || j >= items.length) return;
        const arr = [...items];
        [arr[i], arr[j]] = [arr[j], arr[i]];
        setItems(arr);
    };
    const update = (id, patch) => setItems(prev => prev.map(x => (x.id === id ? { ...x, ...patch } : x)));

    const saveAll = async () => {
        setSaving(true);
        setStatus("جارٍ الحفظ...");
        const clean = items
            .map(x => {
                const link = autoLink(x.value, x.link, kind);
                return { id: x.id || uid(), value: (x.value || "").trim(), link: (link || "").trim() };
            })
            .filter(x => x.value);
        const { error } = await set(k, { items: clean });
        if (error) {
            setStatus("فشل الحفظ: " + error.message);
        } else {
            setStatus("تم الحفظ");
            setItems(clean);
            setTimeout(() => setStatus(""), 2000);
        }
        setSaving(false);
    };

    if (!canEdit) {
        return (
            <ul className={`space-y-3 text-sm text-primary-100 min-w-0 ${className}`}>
                {items.map((it) => {
                    const href = autoLink(it.value, it.link, kind);
                    const display =
                        kind === "Phone" ? formatPhoneDisplay(it.value) : (it.value || "—");

                    return (
                        <li key={it.id} className="flex items-center gap-3 min-w-0">
                            <Icon className="w-4 h-4 text-accent-500 flex-shrink-0" />
                            {href ? (
                                <a
                                    href={href}
                                    className="text-white hover:text-accent-500 transition truncate inline-flex items-center"
                                    title={display}
                                >
                                    {/* bdi + LRM لتثبيت اتجاه LTR */}
                                    <bdi dir="ltr" className="inline-block">{display}{LRM}</bdi>
                                </a>
                            ) : (
                                <span
                                    className="truncate inline-flex items-center"
                                    title={display}
                                >
                                    <bdi dir="ltr" className="inline-block">{display}{LRM}</bdi>
                                </span>
                            )}
                        </li>
                    );
                })}

            </ul>
        );
    }

    return (
        <div className={`rounded-xl p-3 bg-white/5 border border-white/10 ${className}`}>
            <EditorToolbar onAdd={add} onSave={saveAll} saving={saving} status={status} />
            <div className="space-y-2">
                {items.map((it, idx) => (
                    <div key={it.id} className="grid grid-cols-1 md:grid-cols-[minmax(10rem,18rem),1fr,auto] gap-2 items-center min-w-0">
                        <input
                            className="w-full rounded px-2 py-1 text-sm text-neutral-900"
                            placeholder="القيمة المعروضة (مثلاً رقم/إيميل)"
                            value={it.value}
                            onChange={(e) => update(it.id, { value: e.target.value })}
                        />
                        <input
                            className="w-full rounded px-2 py-1 text-sm text-neutral-900"
                            placeholder="الرابط (tel: / mailto: / https:)"
                            value={it.link}
                            onChange={(e) => update(it.id, { link: e.target.value })}
                        />
                        <div className="justify-self-start md:justify-self-end">
                            <MoveDelButtons
                                onUp={() => move(idx, -1)}
                                onDown={() => move(idx, +1)}
                                onDel={() => del(it.id)}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* -------------------- Footer -------------------- */
export default function Footer() {
    const { editMode, isAdmin } = useContent();
    const canEdit = editMode && isAdmin;

    return (
        <footer dir="rtl" className="bg-gradient-to-br from-primary-900 to-primary-700 text-white">
            <div className="container-pro">
                {/* Main */}
                <div className="py-14">
                    <div className="grid gap-10 lg:grid-cols-4">
                        {/* Brand */}
                        <div className="lg:col-span-2">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="grid place-items-center rounded-xl bg-primary-500 p-2 text-white shadow-md">
                                    <Scale className="w-5 h-5" />
                                </span>
                                <div className="text-right">
                                    <h3 className="text-lg font-extrabold text-white">
                                        <EditableText k="footer.brand.title" fallback="مكتب الأحمد والشركاه" />
                                    </h3>
                                    <p className="text-xs text-primary-100">
                                        <EditableText k="footer.brand.subtitle" fallback="للمحاماة والاستشارات القانونية" />
                                    </p>
                                </div>
                            </div>

                            <p className="text-primary-100 leading-relaxed mb-6 text-sm">
                                <EditableText
                                    k="footer.brand.description"
                                    fallback="مكتب متخصص يقدّم خدمات قانونية متميزة في المدني، التجاري، العقاري والعمل، بقيادة المحامية سارة الأحمد بخبرة تتجاوز 12 عامًا."
                                />
                            </p>

                            <EditableLink
                                k="footer.cta.booking"
                                fallbackText="احجز استشارة"
                                fallbackUrl="/booking"
                                className="inline-flex items-center rounded-full bg-gradient-to-r from-primary-400 to-accent-500 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:shadow-lg transition"
                            >
                                <Calendar className="w-4 h-4 ml-2" />
                            </EditableLink>
                        </div>

                        {/* Quick Links */}
                        <nav aria-label="روابط سريعة">
                            <h4 className="text-base font-extrabold mb-5 text-white">
                                <EditableText k="footer.quick.title" fallback="روابط سريعة" />
                            </h4>
                            <EditableLinksList
                                k="footer.quick"
                                fallback={DEFAULT_QUICK}
                                layout="column"
                            />
                        </nav>

                        {/* Contact */}
                        <div>
                            <h4 className="text-base font-extrabold mb-5 text-white">
                                <EditableText k="footer.contact.title" fallback="معلومات التواصل" />
                            </h4>

                            <EditableContactList
                                k="footer.phones"
                                fallback={DEFAULT_PHONES}
                                icon={Phone}
                                kind="Phone"
                            />

                            <div className="mt-4 text-white">
                                <EditableContactList
                                    k="footer.emails"
                                    fallback={DEFAULT_EMAILS}
                                    icon={Mail}
                                    kind="Mail"
                                />
                            </div>

                            <div className="mt-4 flex items-start gap-3">
                                <MapPin className="w-4 h-4 text-accent-500 flex-shrink-0 mt-0.5" />
                                <EditableTextList
                                    k="footer.address"
                                    fallback={DEFAULT_ADDRESS}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Legal row */}
                <div className="py-5 border-t border-white/10">
                    <div className="flex flex-wrap justify-center gap-6">
                        <EditableLinksList
                            k="footer.legal"
                            fallback={DEFAULT_LEGAL}
                            layout="row"
                            className="text-xs text-primary-200"
                        />
                    </div>
                </div>

                {/* Bottom */}
                <div className="py-6 border-t border-white/10 text-center">
                    <p className="text-sm text-primary-200 mb-1">
                        © {new Date().getFullYear()}{" "}
                        <EditableText k="footer.bottom.name" fallback="مكتب المستشارون للمحاماة" />{" "}
                        <EditableText k="footer.bottom.rights" fallback="جميع الحقوق محفوظة." />
                    </p>
                    <p className="text-xs text-primary-300">
                        <EditableText k="footer.bottom.license" fallback="" />
                    </p>
                </div>
            </div>
        </footer>
    );
}
