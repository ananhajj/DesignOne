import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, User, Phone, Mail, MessageCircle, CheckCircle } from "lucide-react";

export default function Booking() {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        caseType: "",
        preferredDate: "",
        preferredTime: "",
        message: "",
        contactMethod: "phone",
    });

    const [isSubmitted, setIsSubmitted] = useState(false);

    const caseTypes = [
        "قضايا مدنية",
        "قضايا تجارية",
        "قضايا عقارية",
        "أحوال شخصية",
        "قضايا جنائية",
        "تحكيم ووساطة",
        "استشارة عامة",
    ];

    const timeSlots = [
        "09:00 صباحاً",
        "10:00 صباحاً",
        "11:00 صباحاً",
        "12:00 ظهراً",
        "02:00 مساءً",
        "03:00 مساءً",
        "04:00 مساءً",
        "05:00 مساءً",
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: إرسال البيانات للسيرفر / البريد
        setIsSubmitted(true);
    };

    const handleInputChange = (e) => {
        setFormData((s) => ({ ...s, [e.target.name]: e.target.value }));
    };

    if (isSubmitted) {
        return (
            <div dir="rtl" className="pt-20 min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 to-white">
                <motion.div
                    className="text-center max-w-2xl mx-auto px-4"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="w-20 h-20 bg-gradient-to-r from-primary to-accent-500 rounded-full grid place-items-center mx-auto mb-8">
                        <CheckCircle className="w-12 h-12 text-white" />
                    </div>
                    <h1 className="text-4xl font-extrabold text-neutral-900 mb-6">تم استلام طلبك بنجاح</h1>
                    <p className="text-xl text-neutral-600 mb-8 leading-relaxed">
                        شكرًا لاختيارك خدماتنا القانونية. سنتواصل معك خلال 24 ساعة لتأكيد موعد الاستشارة ومناقشة التفاصيل.
                    </p>
                    <div className="bg-white rounded-2xl p-6 shadow-soft border border-primary/10 mb-8 text-right">
                        <h3 className="text-lg font-extrabold text-neutral-900 mb-4">الخطوات التالية:</h3>
                        <ul className="space-y-3 text-neutral-600 text-sm">
                            <li className="flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-primary inline-block" />
                                <span>مراجعة طلبك وإعداد ملف أولي</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-primary inline-block" />
                                <span>التواصل معك لتأكيد الموعد</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-primary inline-block" />
                                <span>إرسال تفاصيل الموعد والتحضيرات المطلوبة</span>
                            </li>
                        </ul>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="https://wa.me/966501234567"
                            className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-primary to-accent-500 text-white font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                        >
                            <MessageCircle className="w-4 h-4 ml-2" />
                            تواصل عبر واتساب
                        </a>
                        <button
                            onClick={() => setIsSubmitted(false)}
                            className="px-6 py-3 text-primary font-semibold hover:text-accent-600 transition-colors duration-300"
                        >
                            العودة للصفحة الرئيسية
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div dir="rtl" className="pt-20">
            {/* Hero */}
            <section className="py-20 bg-gradient-to-br from-neutral-50 to-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                        <h1 className="text-5xl font-extrabold text-neutral-900 mb-6">
                            احجز استشارة
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-500">
                                مع المحامية سارة الأحمد
                            </span>
                        </h1>
                        <p className="text-xl text-neutral-600 leading-relaxed">
                            استشارة شاملة لفهم قضيتك وتحديد أفضل الخيارات القانونية المتاحة
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Booking Form */}
            <section className="py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-3xl shadow-soft overflow-hidden">
                        <div className="grid lg:grid-cols-2">
                            {/* Form */}
                            <div className="p-8 lg:p-12">
                                <div className="mb-8">
                                    <h2 className="text-3xl font-extrabold text-neutral-900 mb-2">بيانات الحجز</h2>
                                    <p className="text-neutral-600 text-sm">يرجى ملء البيانات التالية لحجز موعد استشارتك</p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Name & Phone */}
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-neutral-900 mb-2">
                                                الاسم الكامل <span className="text-accent-600">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                required
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 rounded-xl border border-neutral-300 text-right focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                                                placeholder="اكتب اسمك الكامل"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-neutral-900 mb-2">
                                                رقم الهاتف <span className="text-accent-600">*</span>
                                            </label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                required
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 rounded-xl border border-neutral-300 text-right focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                                                placeholder="05xxxxxxxx"
                                            />
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="block text-sm font-semibold text-neutral-900 mb-2">البريد الإلكتروني</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl border border-neutral-300 text-right focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                                            placeholder="example@email.com"
                                        />
                                    </div>

                                    {/* Case Type */}
                                    <div>
                                        <label className="block text-sm font-semibold text-neutral-900 mb-2">
                                            نوع القضية <span className="text-accent-600">*</span>
                                        </label>
                                        <select
                                            name="caseType"
                                            required
                                            value={formData.caseType}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl border border-neutral-300 text-right focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                                        >
                                            <option value="">اختر نوع القضية</option>
                                            {caseTypes.map((type) => (
                                                <option key={type} value={type}>
                                                    {type}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Date & Time */}
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-neutral-900 mb-2">
                                                التاريخ المفضل <span className="text-accent-600">*</span>
                                            </label>
                                            <input
                                                type="date"
                                                name="preferredDate"
                                                required
                                                value={formData.preferredDate}
                                                onChange={handleInputChange}
                                                min={new Date().toISOString().split("T")[0]}
                                                className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-neutral-900 mb-2">
                                                الوقت المفضل <span className="text-accent-600">*</span>
                                            </label>
                                            <select
                                                name="preferredTime"
                                                required
                                                value={formData.preferredTime}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 rounded-xl border border-neutral-300 text-right focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                                            >
                                                <option value="">اختر الوقت</option>
                                                {timeSlots.map((slot) => (
                                                    <option key={slot} value={slot}>
                                                        {slot}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Contact Method */}
                                    <div>
                                        <label className="block text-sm font-semibold text-neutral-900 mb-2">طريقة التواصل المفضلة</label>
                                        <div className="flex gap-6 text-sm">
                                            <label className="inline-flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name="contactMethod"
                                                    value="phone"
                                                    checked={formData.contactMethod === "phone"}
                                                    onChange={handleInputChange}
                                                    className="text-primary focus:ring-primary"
                                                />
                                                <Phone className="w-4 h-4" />
                                                مكالمة هاتفية
                                            </label>
                                            <label className="inline-flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name="contactMethod"
                                                    value="whatsapp"
                                                    checked={formData.contactMethod === "whatsapp"}
                                                    onChange={handleInputChange}
                                                    className="text-primary focus:ring-primary"
                                                />
                                                <MessageCircle className="w-4 h-4" />
                                                واتساب
                                            </label>
                                            <label className="inline-flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name="contactMethod"
                                                    value="email"
                                                    checked={formData.contactMethod === "email"}
                                                    onChange={handleInputChange}
                                                    className="text-primary focus:ring-primary"
                                                />
                                                <Mail className="w-4 h-4" />
                                                بريد إلكتروني
                                            </label>
                                        </div>
                                    </div>

                                    {/* Message */}
                                    <div>
                                        <label className="block text-sm font-semibold text-neutral-900 mb-2">تفاصيل القضية أو الاستشارة</label>
                                        <textarea
                                            name="message"
                                            rows={4}
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl border border-neutral-300 text-right focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all resize-none"
                                            placeholder="اكتب تفاصيل موجزة عن قضيتك أو الاستشارة المطلوبة..."
                                        />
                                    </div>

                                    {/* Submit Button */}
                                    <motion.button
                                        type="submit"
                                        className="w-full inline-flex items-center justify-center px-8 py-4 rounded-full bg-gradient-to-r from-primary to-accent-500 text-white font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition-all"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <Calendar className="w-5 h-5 ml-3" />
                                        تأكيد الحجز
                                    </motion.button>
                                </form>
                            </div>

                            {/* Side Info */}
                            <div className="bg-gradient-to-br from-neutral-900 to-slate-800 p-8 lg:p-12 text-white">
                                <div className="mb-8">
                                    <h3 className="text-2xl font-extrabold mb-4 text-white" >معلومات الاستشارة</h3>
                                    <p className="text-neutral-300 leading-relaxed">
                                        استشارة مفصلة لفهم قضيتك وتقديم النصح القانوني المناسب — حضوريًا أو عن بُعد.
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <Clock className="w-6 h-6 text-accent-500" />
                                        <div>
                                            <div className="font-semibold">مدة الاستشارة</div>
                                            <div className="text-sm text-neutral-300">60 دقيقة شاملة</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <User className="w-6 h-6 text-accent-500" />
                                        <div>
                                            <div className="font-semibold">نوع الاستشارة</div>
                                            <div className="text-sm text-neutral-300">مقابلة شخصية أو عن بُعد</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <CheckCircle className="w-6 h-6 text-accent-500" />
                                        <div>
                                            <div className="font-semibold">ما يشمله</div>
                                            <div className="text-sm text-neutral-300">تحليل قانوني + خطة عمل مقترحة</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 p-4 rounded-xl border border-white/10 bg-white/5 text-center">
                                    <p className="text-sm">
                                        <strong>سياسة الخصوصية:</strong> جميع المعلومات محفوظة ومحمية وفقًا لأعلى معايير السرية المهنية.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* WhatsApp floater (اختياري) */}
                    {/* <a href="https://wa.me/966501234567" target="_blank" rel="noreferrer" className="fixed bottom-6 left-6 inline-flex items-center gap-2 rounded-full bg-green-500 px-4 py-2 text-sm font-semibold text-white shadow-lg ring-1 ring-black/5">
            <MessageCircle className="w-5 h-5" /> واتساب
          </a> */}
                </div>
            </section>
        </div>
    );
}
