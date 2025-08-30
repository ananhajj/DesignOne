// src/pages/Contact.jsx
import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
    Calendar,
    Clock,
    MessageCircle,
    Navigation,
    Phone,
    Mail,
    MapPin,
    Trash2,
    Plus,
    Save,
    ArrowUp,
    ArrowDown,
} from "lucide-react";
import { Link } from "react-router-dom";

import EditableText from "../cms/Editable/EditableText";
import EditableWorkingHours from "../cms/Editable/EditableWorkingHours";
import EditableSocialLinks from "../cms/Editable/EditableSocialLinks";
import EditableLink from "../cms/Editable/EditableLink";
import EditableMap from "../cms/Editable/EditableMap";
import { useContent } from "../cms/ContentProvider";

// 📞 أدوات الهاتف (إدخال/عرض + تحويل E.164)
import { TelDisplay, TelInput, TelUtils } from "../components/Tel";

/* =====================================================================================
   جريد تواصل جديد يدعم: هاتف، واتساب، إيميل، عنوان… مع تحكم كامل وحفظ للـ CMS
   ===================================================================================== */
function EditableContactGridPlus({ k = "contact.items" }) {
    const { get, set, editMode, isAdmin } = useContent();
    const canEdit = editMode && isAdmin;

    // الداتا المخزّنة (مصوفة مباشرة). بدون قيم افتراضية: لو فارغة خلّيها []
    const stored = get(k, []);
    const initial = useMemo(() => (Array.isArray(stored) ? stored : []), [stored]);

    const [items, setItems] = useState(initial);
    const [saving, setSaving] = useState(false);

    const uid = () => Math.random().toString(36).slice(2, 9);

    const addItem = (type = "phone") =>
        setItems((prev) => [
            ...prev,
            {
                id: uid(),
                type, // phone | whatsapp | email | address | link
                label: "",
                value: "", // للهواتف: يخزن E.164
                note: "",  // سطر توضيحي اختياري
            },
        ]);

    const delItem = (id) => setItems((p) => p.filter((x) => x.id !== id));
    const move = (i, d) => {
        const j = i + d;
        if (j < 0 || j >= items.length) return;
        const arr = [...items];
        [arr[i], arr[j]] = [arr[j], arr[i]];
        setItems(arr);
    };

    const update = (id, patch) =>
        setItems((prev) => prev.map((x) => (x.id === id ? { ...x, ...patch } : x)));

    const saveAll = async () => {
        try {
            setSaving(true);
            // تنظيف/توحيد قبل التخزين
            const clean = items
                .map((x) => {
                    let value = (x.value || "").trim();

                    if (x.type === "phone" || x.type === "whatsapp") {
                        value = TelUtils.toE164(value); // +9627xxxx…
                    }
                    if (x.type === "email") {
                        // فلترة بسيطة
                        value = value.replace(/\s/g, "");
                    }

                    return {
                        id: x.id || uid(),
                        type: x.type || "phone",
                        label: x.label || "",
                        value,
                        note: x.note || "",
                    };
                })
                // احذف العناصر الفارغة بالكامل
                .filter((x) => x.label || x.value || x.note);

            const { error } = await set(k, clean);
            if (error) throw error;
        } finally {
            setSaving(false);
        }
    };

    /* ======= عرض للزوار ======= */
    if (!canEdit) {
        if (!items.length) {
            return (
                <div className="rounded-2xl border border-primary/10 bg-primary/5 p-6 text-center text-neutral-600">
                    لا توجد وسائل تواصل مضافة حاليًا.
                </div>
            );
        }
        return (
            <div className="grid sm:grid-cols-2 gap-4">
                {items.map((it) => {
                    const Icon =
                        it.type === "email" ? Mail : it.type === "address" ? MapPin : Phone;

                    let content = null;

                    if (it.type === "phone") {
                        content = (
                            <TelDisplay
                                value={it.value}
                                className="text-white/90"
                                title={it.label}
                            />
                        );
                    } else if (it.type === "whatsapp") {
                        const e164 = TelUtils.toE164(it.value);
                        const digits = e164.replace(/^\+/, "");
                        const wa = digits ? `https://wa.me/${digits}` : undefined;
                        content = wa ? (
                            <a
                                href={wa}
                                target="_blank"
                                rel="noreferrer"
                                dir="ltr"
                                className="font-mono tracking-wide [unicode-bidi:plaintext] text-right text-white/90"
                                title={it.label}
                            >
                                {TelUtils.formatDisplay(e164)}
                            </a>
                        ) : (
                            <span dir="ltr" className="font-mono [unicode-bidi:plaintext]">
                                —
                            </span>
                        );
                    } else if (it.type === "email") {
                        content = (
                            <a href={`mailto:${it.value}`} className="text-white/90">
                                {it.value}
                            </a>
                        );
                    } else if (it.type === "address") {
                        content = <span className="text-white/90">{it.value}</span>;
                    } else {
                        content = (
                            <a href={it.value} target="_blank" rel="noreferrer" className="text-white/90">
                                {it.label || it.value}
                            </a>
                        );
                    }

                    return (
                        <div
                            key={it.id}
                            className="rounded-xl bg-[#1d3d99] p-4 text-white shadow-sm ring-1 ring-white/10"
                        >
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <div className="text-sm opacity-80">{it.label || "—"}</div>
                                    <div className="text-base">{content}</div>
                                    {it.note ? (
                                        <div className="text-xs opacity-70">{it.note}</div>
                                    ) : null}
                                </div>
                                <Icon className="w-5 h-5 opacity-60" />
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }

    /* ======= وضع التحرير (أدمن) ======= */
    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2">
                <button
                    onClick={() => addItem("phone")}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary/90 text-white px-3 py-1.5 text-sm"
                >
                    <Plus className="w-4 h-4" /> إضافة هاتف
                </button>
                <button
                    onClick={() => addItem("whatsapp")}
                    className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 text-white px-3 py-1.5 text-sm"
                >
                    <Plus className="w-4 h-4" /> إضافة واتساب
                </button>
                <button
                    onClick={() => addItem("email")}
                    className="inline-flex items-center gap-2 rounded-lg bg-neutral-800 text-white px-3 py-1.5 text-sm"
                >
                    <Plus className="w-4 h-4" /> إضافة إيميل
                </button>
                <button
                    onClick={() => addItem("address")}
                    className="inline-flex items-center gap-2 rounded-lg bg-sky-700 text-white px-3 py-1.5 text-sm"
                >
                    <Plus className="w-4 h-4" /> إضافة عنوان
                </button>

                <button
                    onClick={saveAll}
                    disabled={saving}
                    className="ml-auto inline-flex items-center gap-2 rounded-lg bg-neutral-900 text-white px-3 py-1.5 text-sm disabled:opacity-60"
                >
                    <Save className="w-4 h-4" />
                    حفظ الكل
                </button>
            </div>

            {!items.length && (
                <div className="rounded-lg border border-dashed p-6 text-sm text-neutral-600">
                    لا توجد بنود. ابدأ بإضافة “هاتف” أو “واتساب”…
                </div>
            )}

            <div className="space-y-4">
                {items.map((it, idx) => (
                    <div
                        key={it.id}
                        className="rounded-xl border bg-white p-4 shadow-sm relative"
                    >
                        <div className="absolute left-3 top-3 text-xs text-neutral-500">
                            #{idx + 1}
                        </div>
                        <div className="flex items-center justify-end gap-1 mb-2">
                            <button
                                onClick={() => move(idx, -1)}
                                className="p-1.5 rounded hover:bg-neutral-100"
                                title="أعلى"
                            >
                                <ArrowUp className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => move(idx, 1)}
                                className="p-1.5 rounded hover:bg-neutral-100"
                                title="أسفل"
                            >
                                <ArrowDown className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => delItem(it.id)}
                                className="p-1.5 rounded hover:bg-red-50 text-red-600"
                                title="حذف"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="grid lg:grid-cols-4 gap-3">
                            <div>
                                <label className="text-xs text-neutral-500">النوع</label>
                                <select
                                    className="border rounded-lg px-2 py-1 text-sm w-full"
                                    value={it.type}
                                    onChange={(e) => update(it.id, { type: e.target.value })}
                                >
                                    <option value="phone">هاتف</option>
                                    <option value="whatsapp">واتساب</option>
                                    <option value="email">إيميل</option>
                                    <option value="address">عنوان</option>
                                    <option value="link">رابط</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-xs text-neutral-500">الوصف/الوسم</label>
                                <input
                                    className="border rounded-lg px-2 py-1 text-sm w-full"
                                    value={it.label || ""}
                                    onChange={(e) => update(it.id, { label: e.target.value })}
                                    placeholder="مثلاً: رقم الاستعلامات"
                                />
                            </div>

                            {/* القيمة (تختلف حسب النوع) */}
                            <div className="lg:col-span-2">
                                <label className="text-xs text-neutral-500">القيمة</label>
                                {it.type === "phone" || it.type === "whatsapp" ? (
                                    <TelInput
                                        value={it.value}
                                        onChange={(e164) => update(it.id, { value: e164 })}
                                        placeholder="+962 7 …"
                                        className="w-full"
                                    />
                                ) : it.type === "email" ? (
                                    <input
                                        type="email"
                                        dir="ltr"
                                        className="border rounded-lg px-2 py-1 text-sm w-full"
                                        value={it.value || ""}
                                        onChange={(e) => update(it.id, { value: e.target.value })}
                                        placeholder="name@example.com"
                                    />
                                ) : (
                                    <input
                                        className="border rounded-lg px-2 py-1 text-sm w-full"
                                        value={it.value || ""}
                                        onChange={(e) => update(it.id, { value: e.target.value })}
                                        placeholder={
                                            it.type === "address"
                                                ? "العنوان التفصيلي…"
                                                : "https://example.com"
                                        }
                                    />
                                )}
                            </div>

                            <div className="lg:col-span-4">
                                <label className="text-xs text-neutral-500">ملاحظة (اختياري)</label>
                                <input
                                    className="border rounded-lg px-2 py-1 text-sm w-full"
                                    value={it.note || ""}
                                    onChange={(e) => update(it.id, { note: e.target.value })}
                                    placeholder="سطر توضيحي قصير…"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* =====================================================================================
   صفحة Contact
   ===================================================================================== */
export default function Contact() {
    const { editMode, isAdmin } = useContent();
    const blockNav = editMode && isAdmin;

    return (
        <div dir="rtl" className="pt-20 bg-neutral-50">
            {/* Hero */}
            <section className="py-20 bg-gradient-to-br from-neutral-50 to-white">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-5xl font-extrabold text-neutral-900 mb-6">
                            <EditableText k="contact.hero.title" fallback="التواصل والموقع" />
                        </h1>
                        <p className="text-xl text-neutral-600">
                            <EditableText
                                k="contact.hero.subtitle"
                                fallback="نحن هنا لمساعدتك. تواصل معنا بالطريقة التي تناسبك"
                            />
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Contact Information */}
            <section className="py-20">
                <div className="container-pro">
                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Contact Details */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <h2 className="text-3xl font-extrabold text-neutral-900 mb-8">
                                <EditableText k="contact.details.title" fallback="معلومات التواصل" />
                            </h2>

                            {/* ✅ الجريد الجديدة */}
                            <EditableContactGridPlus k="contact.items" />

                            {/* Quick Actions */}
                            <div className="mt-8 flex flex-col sm:flex-row gap-4">
                                <EditableLink
                                    k="contact.cta.primary"
                                    fallbackText="احجز استشارة"
                                    fallbackUrl="/booking"
                                    className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-gradient-to-r from-primary to-accent-500 text-white font-semibold shadow-sm hover:shadow-md transition"
                                    blockNav={blockNav}
                                >
                                    <Calendar className="w-4 h-4 ml-2" />
                                </EditableLink>

                                <EditableLink
                                    k="contact.cta.secondary"
                                    fallbackText="واتساب مباشر"
                                    fallbackUrl="https://wa.me/962700000000"
                                    className="inline-flex items-center justify-center px-6 py-3 rounded-full border-2 border-primary text-primary font-semibold hover:bg-primary hover:text-white transition"
                                    blockNav={blockNav}
                                >
                                    <MessageCircle className="w-4 h-4 ml-2" />
                                </EditableLink>
                            </div>
                        </motion.div>

                        {/* Working Hours & Social */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="space-y-8"
                        >
                            {/* Working Hours */}
                            <div>
                                <h3 className="text-2xl font-extrabold text-neutral-900 mb-6 flex items-center">
                                    <Clock className="w-6 h-6 text-primary ml-3" />
                                    <EditableText k="contact.hours.title" fallback="ساعات العمل" />
                                </h3>
                                <EditableWorkingHours k="contact.hours" />
                            </div>

                            {/* Social */}
                            <div>
                                <h3 className="text-2xl font-extrabold text-neutral-900 mb-6">
                                    <EditableText k="contact.social.title" fallback="تابعني على" />
                                </h3>
                                <EditableSocialLinks k="contact.social" />
                            </div>

                            {/* Location Note */}
                            <div className="rounded-2xl p-6 text-white bg-gradient-to-r from-neutral-900 to-slate-800">
                                <h4 className="text-lg font-extrabold mb-3 flex items-center">
                                    <Navigation className="w-5 h-5 ml-2 text-accent-500" />
                                    <EditableText
                                        k="contact.location.title"
                                        fallback="موقع مكتب الأحمد والشركاه"
                                    />
                                </h4>
                                <p className="text-neutral-300 text-sm leading-relaxed">
                                    <EditableText
                                        k="contact.location.note"
                                        fallback="مكتبنا يقع في قلب الرياض في حي العليا، مع مواقف مجانية ووصول سهل عبر المواصلات العامة. نستقبل الزوار بموعد مسبق لضمان أفضل خدمة."
                                    />
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Map Section */}
            <section className="py-20 bg-white/50">
                <div className="container-pro">
                    <motion.div
                        id="map"
                        className="text-center mb-8"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-4xl font-extrabold text-neutral-900 mb-4">
                            <EditableText k="contact.map.title" fallback="الموقع على الخريطة" />
                        </h2>
                        <p className="text-xl text-neutral-600">
                            <EditableText
                                k="contact.map.subtitle"
                                fallback="مكتب الأحمد والشركاه للمحاماة — الرياض"
                            />
                        </p>
                    </motion.div>

                    <motion.div
                        className="relative h-96 rounded-3xl overflow-hidden shadow-soft border border-primary/10 bg-gradient-to-br from-primary to-accent-500"
                        initial={{ opacity: 0, scale: 0.96 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <EditableMap k="contact.map" />
                    </motion.div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="relative py-20 bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 text-white overflow-hidden">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_60%_at_50%_0%,theme(colors.accent.400/0.15),transparent_60%)]" />
                <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-4xl font-extrabold text-accent-300 mb-6">
                            <EditableText k="contact.final.title" fallback="جاهزة للاستماع إلى قصتك" />
                        </h2>
                        <p className="text-xl text-neutral-300 mb-8">
                            <EditableText
                                k="contact.final.subtitle"
                                fallback="كل قضية لها قصة، وأنا هنا للاستماع إليها ومساعدتك في إيجاد الحل المناسب"
                            />
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <EditableLink
                                k="contact.final.primaryCta"
                                fallbackText="احجز موعدك الآن"
                                fallbackUrl="/booking"
                                className="inline-flex items-center px-8 py-4 rounded-full bg-gradient-to-r from-accent-500 to-primary text-white font-semibold text-lg hover:shadow-xl transform hover:scale-105 transition"
                                blockNav={blockNav}
                            >
                                <Calendar className="w-5 h-5 ml-3" />
                            </EditableLink>

                            <EditableLink
                                k="contact.final.secondaryCta"
                                fallbackText="استفسار سريع عبر واتساب"
                                fallbackUrl="https://wa.me/962700000000"
                                className="inline-flex items-center px-8 py-4 rounded-full border-2 border-white text-white font-semibold text-lg hover:bg-white hover:text-neutral-900 transition"
                                blockNav={blockNav}
                            >
                                <MessageCircle className="w-5 h-5 ml-3" />
                            </EditableLink>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
