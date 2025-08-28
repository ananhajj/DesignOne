// src/pages/Contact.jsx
import React from "react";
import { motion } from "framer-motion";
import { MapPin, MessageCircle, Calendar, Navigation, Clock } from "lucide-react";
import { Link } from "react-router-dom";

import EditableText from "../cms/Editable/EditableText";
import EditableContactGrid from "../cms/Editable/EditableContactGrid";
import EditableWorkingHours from "../cms/Editable/EditableWorkingHours";
import EditableSocialLinks from "../cms/Editable/EditableSocialLinks";
import { useContent } from "../cms/ContentProvider";
import EditableLink from "../cms/Editable/EditableLink";
import EditableMap from "../cms/Editable/EditableMap";

export default function Contact() {
    const { editMode, isAdmin } = useContent();
    const blockNav = editMode && isAdmin;
    return (
        <div dir="rtl" className="pt-20  bg-neutral-50">
            {/* Hero */}
            <section className="py-20 bg-gradient-to-br from-neutral-50 to-white">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                        <h1 className="text-5xl font-extrabold text-neutral-900 mb-6">
                            <EditableText k="contact.hero.title" fallback="التواصل والموقع" />
                        </h1>
                        <p className="text-xl text-neutral-600">
                            <EditableText k="contact.hero.subtitle" fallback="نحن هنا لمساعدتك. تواصل معنا بالطريقة التي تناسبك" />
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

                            {/* متعدد: أرقام/واتساب/إيميل/عناوين */}
                            <EditableContactGrid k="contact.items" />

                            {/* Quick Actions */}
                            <div className="mt-8 flex flex-col sm:flex-row gap-4">
                                <EditableLink
                                    k="contact.cta.primary"
                                    fallbackText="احجز استشارة"
                                    fallbackUrl="/booking"
                                    className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-gradient-to-r from-primary to-accent-500 text-white font-semibold shadow-sm hover:shadow-md transition"
                                    blockNav={blockNav}  // ← لو مفعّل، يمنع الانتقال
                                >
                                    <Calendar className="w-4 h-4 ml-2" />
                                </EditableLink>

                                <EditableLink
                                    k="contact.cta.secondary"
                                    fallbackText="واتساب مباشر"
                                    fallbackUrl="https://wa.me/966501234567"
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
                                    <EditableText k="contact.location.title" fallback="موقع مكتب الأحمد والشركاه" />
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
                            <EditableText k="contact.map.subtitle" fallback="مكتب الأحمد والشركاه للمحاماة — الرياض" />
                        </p>
                    </motion.div>

                    <motion.div
                        className="relative h-96 rounded-3xl overflow-hidden shadow-soft border border-primary/10 bg-gradient-to-br from-primary to-accent-500"
                        initial={{ opacity: 0, scale: 0.96 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        {/* استبدل لاحقًا بـ iframe فعلي لو حبيت */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.96 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <EditableMap k="contact.map" />
                        </motion.div>



                    </motion.div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="relative py-20 bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 text-white overflow-hidden">
                {/* لمسة ضوء خفيفة زي باقي الأقسام */}
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
                            {/* الزر الأول (حجز) */}
                            <EditableLink
                                k="contact.final.primaryCta"
                                fallbackText="احجز موعدك الآن"
                                fallbackUrl="/booking"
                                className="inline-flex items-center px-8 py-4 rounded-full bg-gradient-to-r from-accent-500 to-primary text-white font-semibold text-lg hover:shadow-xl transform hover:scale-105 transition"
                                blockNav={blockNav}
                            >
                                <Calendar className="w-5 h-5 ml-3" />
                            </EditableLink>

                            {/* الزر الثاني (واتساب) */}
                            <EditableLink
                                k="contact.final.secondaryCta"
                                fallbackText="استفسار سريع عبر واتساب"
                                fallbackUrl="https://wa.me/966501234567"
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
