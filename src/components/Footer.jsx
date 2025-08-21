import React from "react";
import { Link } from "react-router-dom";
import { Scale, Phone, Mail, MapPin, Calendar } from "lucide-react";

export default function Footer() {
    const quickLinks = [
        { name: "الرئيسية", href: "/" },
        { name: "عن المحامية", href: "/about" },
        { name: "الخدمات", href: "/services" },
        { name: "أعمال مختارة", href: "/cases" },
    ];

    const legalLinks = [
        { name: "سياسة الخصوصية", href: "#" },
        { name: "شروط الاستخدام", href: "#" },
        { name: "إخلاء المسؤولية", href: "#" },
        { name: "أخلاقيات المهنة", href: "#" },
    ];

    return (
        <footer dir="rtl" className="bg-gradient-to-br from-neutral-900 to-slate-800 text-white">
            <div className="container-pro">
                {/* Main */}
                <div className="py-14">
                    <div className="grid gap-10 lg:grid-cols-4">
                        {/* Brand */}
                        <div className="lg:col-span-2">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="grid place-items-center rounded-xl bg-primary p-2 text-white">
                                    <Scale className="w-5 h-5" />
                                </span>
                                <div className="text-right">
                                    <h3 className="text-lg font-extrabold text-white">
                                        مكتب الأحمد والشركاه
                                    </h3>
                                    <p className="text-xs text-neutral-300">
                                        للمحاماة والاستشارات القانونية
                                    </p>
                                </div>
                            </div>


                            <p className="text-neutral-300 leading-relaxed mb-6 text-sm">
                                مكتب متخصص يقدّم خدمات قانونية متميزة في المدني، التجاري، العقاري والعمل،
                                بقيادة المحامية سارة الأحمد بخبرة تتجاوز 12 عامًا.
                            </p>

                            <Link
                                to="/booking"
                                className="inline-flex items-center rounded-full bg-gradient-to-r from-primary to-accent-500 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:shadow-md transition"
                                aria-label="احجز استشارة"
                            >
                                <Calendar className="w-4 h-4 ml-2" />
                                احجز استشارة
                            </Link>
                        </div>

                        {/* Quick Links */}
                        <nav aria-label="روابط سريعة">
                            <h4 className="text-base font-extrabold mb-5">روابط سريعة</h4>
                            <ul className="space-y-3">
                                {quickLinks.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            to={link.href}
                                            className="block text-sm text-neutral-300 hover:text-accent-500 transition"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>

                        {/* Contact */}
                        <div>
                            <h4 className="text-base font-extrabold mb-5">معلومات التواصل</h4>
                            <ul className="space-y-3 text-sm text-neutral-300">
                                <li className="flex items-center gap-3">
                                    <Phone className="w-4 h-4 text-accent-500 flex-shrink-0" />
                                    <a href="tel:+966111234567" className="hover:text-accent-500 transition">
                                        +966 11 123 4567
                                    </a>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Mail className="w-4 h-4 text-accent-500 flex-shrink-0" />
                                    <a href="mailto:sara@alahmedlaw.com" className="hover:text-accent-500 transition">
                                        sara@alahmedlaw.com
                                    </a>
                                </li>
                                <li className="flex items-start gap-3">
                                    <MapPin className="w-4 h-4 text-accent-500 flex-shrink-0 mt-0.5" />
                                    <address className="not-italic leading-6">
                                        الرياض، حي العليا
                                        <br />
                                        طريق الملك فهد
                                    </address>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Legal */}
                <div className="py-5 border-t border-white/10">
                    <div className="flex flex-wrap justify-center gap-6">
                        {legalLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="text-xs text-neutral-300 hover:text-accent-500 transition"
                            >
                                {link.name}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Bottom */}
                <div className="py-6 border-t border-white/10 text-center">
                    <p className="text-sm text-neutral-300 mb-1">
                        © {new Date().getFullYear()} مكتب الأحمد والشركاه للمحاماة. جميع الحقوق محفوظة.
                    </p>
                    <p className="text-xs text-neutral-400">
                        مرخّص من نقابة المحامين السعوديين • رقم الترخيص: 12345
                    </p>
                </div>
            </div>
        </footer>
    );
}
