// src/pages/NotFound.tsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home } from "lucide-react";

export default function NotFound() {
    return (
        <section dir="rtl" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 to-white">
            <motion.div
                className="text-center max-w-lg px-4"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                {/* 404 Number */}
                <h1 className="text-8xl font-extrabold text-primary-700 mb-4">404</h1>

                {/* Title */}
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">
                    الصفحة غير موجودة
                </h2>

                {/* Subtitle */}
                <p className="text-neutral-600 mb-8 leading-relaxed">
                    يبدو أنك وصلت إلى رابط غير صحيح أو أن الصفحة التي تبحث عنها قد تم
                    نقلها أو حذفها.
                </p>

                {/* CTA Button */}
                <Link
                    to="/"
                    className="inline-flex items-center rounded-full bg-gradient-to-r from-primary-600 to-accent-500 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:shadow-md transition"
                >
                    <Home className="w-5 h-5 ml-2" />
                    العودة إلى الرئيسية
                </Link>
            </motion.div>
        </section>
    );
}
