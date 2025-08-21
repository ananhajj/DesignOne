import React from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, MessageCircle, Calendar, Navigation } from "lucide-react";
import { Link } from "react-router-dom";

export default function Contact() {
    const contactInfo = [
        { icon: Phone, label: "هاتف المكتب", value: "+966 11 123 4567", link: "tel:+966111234567" },
        { icon: MessageCircle, label: "واتساب", value: "+966 50 123 4567", link: "https://wa.me/966501234567" },
        { icon: Mail, label: "البريد الإلكتروني", value: "sara@alahmedlaw.com", link: "mailto:sara@alahmedlaw.com" },
        { icon: MapPin, label: "عنوان المكتب", value: "الرياض، حي العليا، طريق الملك فهد", link: "#map" },
    ];

    const workingHours = [
        { day: "الأحد - الخميس", hours: "9:00 ص - 5:00 م" },
        { day: "الجمعة", hours: "1:00 م - 5:00 م" },
        { day: "السبت", hours: "مغلق" },
    ];

    const socialLinks = [
        { name: "LinkedIn", url: "#" },
        { name: "X", url: "#" },
        { name: "Instagram", url: "#" },
    ];

    return (
        <div dir="rtl" className="pt-20">
            {/* Hero */}
            <section className="py-20 bg-gradient-to-br from-neutral-50 to-white">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                        <h1 className="text-5xl font-extrabold text-neutral-900 mb-6">التواصل والموقع</h1>
                        <p className="text-xl text-neutral-600">نحن هنا لمساعدتك. تواصل معنا بالطريقة التي تناسبك</p>
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
                            <h2 className="text-3xl font-extrabold text-neutral-900 mb-8">معلومات التواصل</h2>

                            <div className="space-y-4">
                                {contactInfo.map((info, i) => (
                                    <motion.a
                                        key={info.label}
                                        href={info.link}
                                        className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-soft hover:shadow-md transition border border-primary/10"
                                        initial={{ opacity: 0, y: 24 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: i * 0.08 }}
                                        whileHover={{ scale: 1.01 }}
                                    >
                                        <span className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary to-accent-500 grid place-items-center">
                                            <info.icon className="w-6 h-6 text-white" />
                                        </span>
                                        <span className="text-right">
                                            <span className="block text-xs font-semibold text-primary mb-0.5">{info.label}</span>
                                            <span className="block text-sm text-neutral-900 hover:text-primary transition">{info.value}</span>
                                        </span>
                                    </motion.a>
                                ))}
                            </div>

                            {/* Quick Actions */}
                            <div className="mt-8 flex flex-col sm:flex-row gap-4">
                                <Link
                                    to="/booking"
                                    className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-gradient-to-r from-primary to-accent-500 text-white font-semibold shadow-sm hover:shadow-md transition"
                                >
                                    <Calendar className="w-4 h-4 ml-2" />
                                    احجز استشارة
                                </Link>
                                <a
                                    href="https://wa.me/966501234567"
                                    className="inline-flex items-center justify-center px-6 py-3 rounded-full border-2 border-primary text-primary font-semibold hover:bg-primary hover:text-white transition"
                                >
                                    <MessageCircle className="w-4 h-4 ml-2" />
                                    واتساب مباشر
                                </a>
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
                                    ساعات العمل
                                </h3>
                                <div className="bg-white rounded-2xl shadow-soft p-6 border border-primary/10">
                                    <div className="space-y-3">
                                        {workingHours.map((s) => (
                                            <div key={s.day} className="flex items-center justify-between py-2">
                                                <span className="text-neutral-600">{s.hours}</span>
                                                <span className="font-semibold text-neutral-900">{s.day}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Social */}
                            <div>
                                <h3 className="text-2xl font-extrabold text-neutral-900 mb-6">تابعني على</h3>
                                <div className="flex gap-3">
                                    {socialLinks.map((s) => (
                                        <a
                                            key={s.name}
                                            href={s.url}
                                            className="inline-flex items-center justify-center rounded-xl border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-800 hover:border-primary hover:text-primary transition"
                                        >
                                            {s.name}
                                        </a>
                                    ))}
                                </div>
                            </div>

                            {/* Location Note */}
                            <div className="rounded-2xl p-6 text-white bg-gradient-to-r from-neutral-900 to-slate-800">
                                <h4 className="text-lg font-extrabold mb-3 flex items-center">
                                    <Navigation className="w-5 h-5 ml-2 text-accent-500" />
                                    موقع مكتب الأحمد والشركاه
                                </h4>
                                <p className="text-neutral-300 text-sm leading-relaxed">
                                    مكتبنا يقع في قلب الرياض في حي العليا، مع مواقف مجانية ووصول سهل عبر المواصلات العامة. نستقبل
                                    الزوار بموعد مسبق لضمان أفضل خدمة.
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
                        <h2 className="text-4xl font-extrabold text-neutral-900 mb-4">الموقع على الخريطة</h2>
                        <p className="text-xl text-neutral-600">مكتب الأحمد والشركاه للمحاماة — الرياض</p>
                    </motion.div>

                    <motion.div
                        className="relative h-96 rounded-3xl overflow-hidden shadow-soft border border-primary/10 bg-gradient-to-br from-primary to-accent-500"
                        initial={{ opacity: 0, scale: 0.96 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        {/* Google Maps embed (اختياري): استبدل الـdiv التالي بـ iframe فعلي */}
                        {/* <iframe
              src=\"https://www.google.com/maps?q=Riyadh+Olaya&output=embed\"
              title=\"Map\"
              className=\"absolute inset-0 w-full h-full\"
              loading=\"lazy\"
              referrerPolicy=\"no-referrer-when-downgrade\"
            /> */}
                        <div className="absolute inset-0 grid place-items-center text-white">
                            <div className="text-center">
                                <MapPin className="w-16 h-16 mx-auto mb-4 opacity-90" />
                                <p className="text-lg font-semibold">خريطة الموقع</p>
                                <p className="text-sm opacity-95">حي العليا، طريق الملك فهد، الرياض</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-20 bg-gradient-to-r from-neutral-900 to-slate-800">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-4xl font-extrabold text-white mb-6">جاهزة للاستماع إلى قصتك</h2>
                        <p className="text-xl text-neutral-300 mb-8">
                            كل قضية لها قصة، وأنا هنا للاستماع إليها ومساعدتك في إيجاد الحل المناسب
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/booking"
                                className="inline-flex items-center px-8 py-4 rounded-full bg-gradient-to-r from-primary to-accent-500 text-white font-semibold text-lg hover:shadow-xl transform hover:scale-105 transition"
                            >
                                <Calendar className="w-5 h-5 ml-3" />
                                احجز موعدك الآن
                            </Link>
                            <a
                                href="https://wa.me/966501234567"
                                className="inline-flex items-center px-8 py-4 rounded-full border-2 border-white text-white font-semibold text-lg hover:bg-white hover:text-neutral-900 transition"
                            >
                                <MessageCircle className="w-5 h-5 ml-3" />
                                استفسار سريع عبر واتساب
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
