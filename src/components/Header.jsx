import { AnimatePresence, motion } from "framer-motion";
import { Calendar, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { useContent } from "../cms/ContentProvider"; // غيّر المسار لو لزم
import EditableImage from "../cms/Editable/EditableImage";
import EditableText from "../cms/Editable/EditableText"; // غيّر المسار لو لزم

export default function Header() {
    const location = useLocation();
    const [open, setOpen] = useState(false);

    // blockNav يمنع التنقل أثناء وضع التحرير
    const { editMode, isAdmin } = useContent();
    const blockNav = editMode && isAdmin;

    const navItems = [
        { key: "nav.home", href: "/", fallback: "الرئيسية" },
        { key: "nav.about", href: "/about", fallback: "عن المحامية" },
        { key: "nav.services", href: "/services", fallback: "الخدمات" },
        { key: "nav.cases", href: "/cases", fallback: "أعمال مختارة" },
        { key: "nav.media", href: "/media", fallback: "الإعلام" },
        { key: "nav.contact", href: "/contact", fallback: "تواصل" },
    ];

    const isActive = (href) =>
        href === "/" ? location.pathname === "/" : location.pathname.startsWith(href);

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
            {/* هيدر أعلى على الموبايل لحتى ياخذ اللوجو راحته */}
            <div className="container-pro h-[72px] sm:h-16 flex items-center justify-between">
                {/* Logo */}
                <Link
                    to="/"
                    onClick={(e) => {
                        if (blockNav) {
                            e.preventDefault();
                            e.stopPropagation();
                        }
                    }}
                    className="flex items-center gap-2"
                >
                    <EditableImage
                        k="brand.logo"
                        fallback="/assets/brand/logo-icon.png"
                        alt="الشعار"
               
                        className="h-[56px] sm:h-14 md:h-16 w-auto object-contain shrink-0"
                    />
                </Link>




                {/* Desktop Nav */}
                <nav className="hidden lg:flex items-center gap-6 text-sm">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            to={item.href}
                            onClick={(e) => { if (blockNav) { e.preventDefault(); e.stopPropagation(); } }}
                            className={`relative py-1 transition-colors ${isActive(item.href) ? "text-primary" : "text-neutral-800 hover:text-primary"
                                } ${blockNav ? "cursor-not-allowed" : ""}`}
                            aria-disabled={blockNav}
                        >
                            <EditableText k={item.key} fallback={item.fallback} />
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
                    onClick={(e) => { if (blockNav) { e.preventDefault(); e.stopPropagation(); } }}
                    className={`hidden lg:inline-flex items-center rounded-full bg-gradient-to-r from-primary to-accent-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:shadow-md transition ${blockNav ? "cursor-not-allowed" : ""
                        }`}
                    aria-disabled={blockNav}
                >
                    <Calendar className="w-4 h-4 ml-2" />
                    <EditableText k="cta.book" fallback="احجز استشارة" />
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
                                {navItems.map((item) => (
                                    <li key={item.href}>
                                        <Link
                                            to={item.href}
                                            onClick={(e) => {
                                                if (blockNav) { e.preventDefault(); e.stopPropagation(); }
                                                else setOpen(false);
                                            }}
                                            className={`flex items-center justify-between rounded-xl px-3 py-2 text-sm ${isActive(item.href) ? "text-primary bg-primary/5" : "text-neutral-800 hover:bg-neutral-100"
                                                } ${blockNav ? "cursor-not-allowed" : ""}`}
                                            aria-disabled={blockNav}
                                        >
                                            <span>
                                                <EditableText k={item.key} fallback={item.fallback} />
                                            </span>
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
                                    onClick={(e) => {
                                        if (blockNav) { e.preventDefault(); e.stopPropagation(); }
                                        else setOpen(false);
                                    }}
                                    className={`btn btn-primary w-full rounded-xl ${blockNav ? "cursor-not-allowed" : ""}`}
                                    aria-disabled={blockNav}
                                >
                                    <Calendar className="w-4 h-4 ml-2" />
                                    <EditableText k="cta.book" fallback="احجز استشارة" />
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
}
