import { motion } from "framer-motion";
import { Building, Calendar, FileText, Gavel, Heart, Home, Scale } from "lucide-react";
import { Link } from "react-router-dom";
 import EditableText from "../cms/Editable/EditableText";
import EditableLink from "../cms/Editable/EditableLink";
import EditableCasesPage from "../cms/Editable/EditableCasesPage";
export default function Cases() {
 

    return (
        <div dir="rtl" className="pt-20  bg-neutral-50">
            {/* Hero */}
            <section className="py-20 bg-gradient-to-br from-neutral-50 to-white">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-5xl font-extrabold text-neutral-900 mb-8">
                            <EditableText k="cases.hero.title.top" fallback="أعمال مختارة" />  
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-500 drop-shadow-sm">
                                <EditableText k="cases.hero.title.bottom" fallback=" ودراسات حالة" />   
                            </span>


                        </h1>
                        <p className="text-xl text-neutral-600">
                            <EditableText k="cases.hero.subtitle" fallback=" نماذج من القضايا الناجحة التي تعكس الخبرة والتميّز في التعامل مع القضايا المعقدة" />  
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Cases Grid */}
            {/* الشبكة الديناميكية */}
            <section className="py-20">
                <div className="container-pro">
                    {/* ✅ الشبكة الكاملة + CRUD */}
                    <EditableCasesPage k="cases.data" />
                </div>
            </section>


            {/* CTA */}
            <section className="relative py-20 bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 text-white overflow-hidden">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_60%_at_50%_0%,theme(colors.accent.400/0.18),transparent_60%)]" />

                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-4xl font-extrabold text-accent-300 mb-6">
                            <EditableText k="cases.cta.title" fallback="قضيتك تستحق نفس الاهتمام والخبرة" />   
                        </h2>
                        <p className="text-xl text-neutral-300 mb-8">
                            <EditableText
                                k="cases.cta.subtitle"
                                fallback=" كل قضية لها ظروفها الخاصة، وتحتاج لنهج مخصص يحقق أفضل النتائج"
                            />  
                        </p>
                   
                        <EditableLink
                            k="cases.cta.primary"
                            fallbackText="ابدأ بمناقشة قضيتك"
                            fallbackUrl="/booking"
                            className="btn btn-primary btn-lg rounded-full inline-flex items-center"
                        >
                            <Calendar className="w-5 h-5 ml-2" />
                        </EditableLink>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
