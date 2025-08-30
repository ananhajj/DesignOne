import React from "react";
import { motion } from "framer-motion";
import EditableText from "../cms/Editable/EditableText";
import EditableServicesTabs from "../cms/Editable/EditableServicesTabs";

export default function Services() {
    return (
        <div dir="rtl" className="pt-20 bg-neutral-50">
            {/* Hero */}
            <section className="py-20 bg-gradient-to-br from-neutral-50 to-white">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                        <h1 className="text-5xl font-extrabold text-neutral-900 mb-6">
                            <EditableText k="services.hero.title.top" fallback="الخدمات القانونية" />
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-500">
                                <EditableText k="services.hero.title.bottom" fallback="المتخصصة" />
                            </span>
                        </h1>
                        <p className="text-xl text-neutral-600">
                            <EditableText
                                k="services.hero.subtitle"
                                fallback="خدمات شاملة تغطي التخصصات الرئيسية بخبرة عملية تتجاوز 12 عامًا"
                            />
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Tabs مصدرها services.data */}
            <EditableServicesTabs k="services.data" />
        </div>
    );
}
