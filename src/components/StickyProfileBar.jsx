import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, User } from "lucide-react";

export default function StickyProfileBar() {
    return (
        <motion.div
            dir="rtl"
            className="fixed top-20 inset-x-0 z-40 bg-white/90 backdrop-blur border-b border-neutral-200 shadow-sm"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.3 }}
            role="region"
            aria-label="شريط الملف الشخصي"
        >
            <div className="container-pro">
                <div className="flex items-center justify-between h-14">
                    {/* Mini Profile */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent-500 grid place-items-center">
                            <User className="w-5 h-5 text-white" />
                        </div>
                        <div className="text-right leading-tight">
                            <h3 className="text-sm font-extrabold text-neutral-900">المحامية سارة الأحمد</h3>
                            <p className="text-[11px] text-neutral-500">متخصصة في القضايا المدنية والتجارية</p>
                        </div>
                    </div>

                    {/* Quick CTA */}
                    <Link
                        to="/booking"
                        className="inline-flex items-center rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white hover:opacity-90 transition"
                        aria-label="حجز سريع"
                    >
                        <Calendar className="w-3.5 h-3.5 ml-1.5" />
                        حجز سريع
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}
