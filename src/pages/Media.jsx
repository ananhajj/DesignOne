// src/pages/Media.jsx
import { motion } from "framer-motion";
import { Megaphone } from "lucide-react";
import EditableText from "../cms/Editable/EditableText";
import EditableMediaGrid from "../cms/Editable/EditableMediaGrid";
import ComingSoonGate from "../components/ComingSoonGate";

function ComingSoonView() {
    return (
        <section className="py-24">
            <div className="container-pro">
                <div className="rounded-3xl border border-primary/10 bg-white p-10 shadow-soft text-center">
                    <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent-500 grid place-items-center text-white">
                        <Megaphone className="w-7 h-7" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-neutral-900 mb-3">
                        <EditableText k="media.comingSoon.title" fallback="قيد الإعداد" />
                    </h2>
                    <p className="text-neutral-600 max-w-2xl mx-auto">
                        <EditableText
                            k="media.comingSoon.subtitle"
                            fallback="نعمل حالياً على تجهيز قسم الإعلام: مقالات، فيديوهات، وبودكاست قانوني. ترقّبوا الإطلاق قريباً."
                        />
                    </p>
                </div>
            </div>
        </section>
    );
}

export default function Media() {
    return (
        <div dir="rtl" className="pt-20 bg-neutral-50">
            {/* Hero */}
            <section className="py-20 bg-gradient-to-br from-neutral-50 to-white">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                        <h1 className="text-5xl font-extrabold text-neutral-900 mb-6">
                            <EditableText k="media.hero.title.top" fallback="الإعلام والنشر" />
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-500">
                                <EditableText k="media.hero.title.bottom" fallback="القانوني" />
                            </span>
                        </h1>
                        <p className="text-xl text-neutral-600">
                            <EditableText
                                k="media.hero.subtitle"
                                fallback="مقالات متخصصة، مقابلات إعلامية، ومحتوى قانوني يساهم في نشر الوعي القانوني"
                            />
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* ✅ بوابة: الأدمِن يرى ويحرّر، الزوّار يرون «قريبًا» عند التفعيل */}
            <ComingSoonGate
                k="media.comingSoon"               // يخزن {enabled:boolean}
                className="section"
                fallback={<ComingSoonView />}      // ماذا يرى الزوّار عند التفعيل
            >
                {/* Editable Grid + Filters */}
                <EditableMediaGrid k="media.items" />

                {/* Newsletter */}
                <section className="relative py-20 bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 text-white overflow-hidden">
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_60%_at_50%_0%,theme(colors.accent.400/0.15),transparent_60%)]" />
                    <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <h2 className="text-4xl font-extrabold text-accent-300 mb-6">
                                <EditableText k="media.newsletter.title" fallback="ابق على اطلاع بآخر المستجدات القانونية" />
                            </h2>
                            <p className="text-xl text-neutral-300 mb-8">
                                <EditableText
                                    k="media.newsletter.subtitle"
                                    fallback="احصل على التحديثات القانونية والمقالات المتخصصة مباشرة في بريدك الإلكتروني"
                                />
                            </p>
                            <form onSubmit={(e) => e.preventDefault()} className="mx-auto flex max-w-md gap-3" aria-label="نموذج الاشتراك في النشرة البريدية">
                                <input
                                    type="email"
                                    placeholder="بريدك الإلكتروني"
                                    className="flex-1 rounded-full bg-white/10 border border-white/20 px-4 py-3 text-right text-white placeholder-white/60 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-accent-400/40"
                                    required
                                />
                                <button type="submit" className="rounded-full px-6 py-3 font-semibold text-white bg-gradient-to-r from-accent-500 to-primary shadow-sm hover:shadow-md transition">
                                    <EditableText k="media.newsletter.cta" fallback="اشترك" />
                                </button>
                            </form>
                        </motion.div>
                    </div>
                </section>
            </ComingSoonGate>
        </div>
    );
}
