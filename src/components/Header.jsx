import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Scale, Calendar, Menu, X } from "lucide-react";

export default function Header() {
    const location = useLocation();
    const [open, setOpen] = useState(false);

    const navigation = [
        { name: "الرئيسية", href: "/" },
        { name: "عن المحامية", href: "/about" },
        { name: "الخدمات", href: "/services" },
        { name: "أعمال مختارة", href: "/cases" },
        { name: "الإعلام", href: "/media" },
        { name: "تواصل", href: "/contact" },
    ];

    const isActive = (href) =>
        href === "/"
            ? location.pathname === "/"
            : location.pathname.startsWith(href);

    return (
        <motion.header
            dir="rtl"
            className="fixed inset-x-0 top-0 z-50 bg-white/70 backdrop-blur border-b border-neutral-200"
            initial={{ y: -90 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            role="navigation"
            aria-label="الرئيسية"
        >
            <div className="container-pro h-16 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2">
                    <span className="grid place-items-center rounded-xl bg-primary p-2 text-white">
                        <Scale className="w-5 h-5" />
                    </span>
                    <span className="hidden sm:block text-right">
                        <span className="block text-sm font-extrabold text-neutral-900">
                            الأحمد والشركاه
                        </span>
                        <span className="block text-[11px] text-neutral-500">
                            للمحاماة والاستشارات القانونية
                        </span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden lg:flex items-center gap-6 text-sm">
                    {navigation.map((item) => (
                        <Link
                            key={item.href}
                            to={item.href}
                            className={`relative py-1 transition-colors ${isActive(item.href)
                                    ? "text-primary"
                                    : "text-neutral-800 hover:text-primary"
                                }`}
                        >
                            {item.name}
                            {isActive(item.href) && (
                                <motion.span
                                    layoutId="activeTab"
                                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-accent-500"
                                />
                            )}
                        </Link>
                    ))}
                </nav>

                {/* CTA (Desktop) */}
                <Link
                    to="/booking"
                    className="hidden lg:inline-flex items-center rounded-full bg-gradient-to-r from-primary to-accent-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:shadow-md transition"
                >
                    <Calendar className="w-4 h-4 ml-2" />
                    احجز استشارة
                </Link>

                {/* Mobile toggler */}
                <button
                    className="lg:hidden inline-flex items-center justify-center rounded-xl border border-neutral-300 bg-white p-2 text-neutral-700"
                    onClick={() => setOpen((s) => !s)}
                    aria-label="فتح القائمة"
                    aria-expanded={open}
                >
                    {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="lg:hidden border-t border-neutral-200 bg-white/90 backdrop-blur"
                    >
                        <div className="container-pro py-3">
                            <ul className="flex flex-col gap-1">
                                {navigation.map((item) => (
                                    <li key={item.href}>
                                        <Link
                                            to={item.href}
                                            onClick={() => setOpen(false)}
                                            className={`flex items-center justify-between rounded-xl px-3 py-2 text-sm ${isActive(item.href)
                                                    ? "text-primary bg-primary/5"
                                                    : "text-neutral-800 hover:bg-neutral-100"
                                                }`}
                                        >
                                            <span>{item.name}</span>
                                            {isActive(item.href) && (
                                                <span className="h-1 w-10 rounded-full bg-gradient-to-r from-primary to-accent-500" />
                                            )}
                                        </Link>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-3">
                                <Link
                                    to="/booking"
                                    onClick={() => setOpen(false)}
                                    className="btn btn-primary w-full rounded-xl"
                                >
                                    <Calendar className="w-4 h-4 ml-2" />
                                    احجز استشارة
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
}
