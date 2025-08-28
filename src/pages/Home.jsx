import { motion } from "framer-motion";
import {
    ArrowRight,
    Calendar,
    PhoneCall,
    Quote,
    Scale, Star,
    Users,
} from "lucide-react";
import EditableCases from "../cms/Editable/EditableCases";
import EditableImage from "../cms/Editable/EditableImage";
import EditableLink from "../cms/Editable/EditableLink";
import EditableText from "../cms/Editable/EditableText";
import EditableServices from "../cms/Editable/EditableServices";
import EditableTeamGrid from "../cms/Editable/EditableTeamGrid";

export default function Home() {
    // ملاحظة: أرقام/قوائم تحولت لمفاتيح نصية منفصلة لتقدر تعدل كل عنصر
    return (
        <div dir="rtl" className="pt-16">
            {/* Announcement Bar */}
            <div className="bg-primary/10 text-primary text-sm">
                <div className="container-pro py-2 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <Scale className="w-4 h-4" />
                        <span>
                            <EditableText k="announce.text" fallback="استشارة أولية مجانية خلال 24 ساعة" />
                        </span>
                    </div>

                    <EditableLink
                        k="announce.cta"
                        fallbackText="احجز الآن"
                        fallbackUrl="/booking"
                        className="inline-flex items-center gap-1 font-semibold hover:opacity-80"
                    />

                </div>
            </div>

            {/* Hero */}
            <section className="relative overflow-hidden bg-neutral-50">
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(234,179,8,0.12),transparent_60%)]" />
                <div className="container-pro py-16 md:py-24 grid gap-12 lg:grid-cols-2 items-center">
                    <motion.div initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-neutral-900">
                            <EditableText k="hero.title.line1" fallback="القانون بخبرة" />
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-500">
                                <EditableText k="hero.title.line2" fallback="تصنع الفارق" />
                            </span>
                        </h1>

                        <p className="mt-4 text-lg text-neutral-600">
                            <EditableText
                                k="hero.subtitle"
                                fallback="أنا سارة الأحمد — محامية متخصصة في المدني، التجاري، والعقاري. نبدأ بالإصغاء، وننتهي بحل عملي يحفظ حقوقك."
                            />
                        </p>

                        <div className="mt-8 flex flex-wrap items-center gap-4">
                            <EditableLink
                                k="hero.cta.primary"
                                fallbackText="احجز استشارة الآن"
                                fallbackUrl="/booking"
                                className="btn btn-primary btn-lg rounded-full inline-flex items-center"
                            >
                                <Calendar className="w-5 h-5 ml-2" />
                            </EditableLink>

                            <EditableLink
                                k="hero.cta.secondary"
                                fallbackText="تعرّف على أسلوبنا"
                                fallbackUrl="/about"
                                className="btn btn-outline btn-lg rounded-full"
                            />
                        </div>


                        <div className="mt-6 flex flex-wrap gap-4 text-xs text-neutral-500">
                            <span className="inline-flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500" />
                                <EditableText k="hero.badge.response" fallback="رد خلال 24 ساعة" />
                            </span>
                            <span className="inline-flex items-center gap-2">
                                <Star className="w-4 h-4 text-accent-500" />
                                <EditableText k="hero.badge.rating" fallback="تقييم 4.9/5" />
                            </span>
                        </div>

                        {/* Trust badges */}
                        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-6 opacity-80">
                            {[0, 1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-3 shadow-sm">
                                    <Scale className="w-4 h-4 text-primary" />
                                    <span className="text-xs font-semibold text-neutral-700">
                                        <EditableText
                                            k={`trust.${i}`}
                                            fallback={["وزارة العدل", "نقابة المحامين", "غرفة التجارة", "مركز التحكيم"][i]}
                                        />
                                    </span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Visual Card */}
                    <motion.div initial={{ opacity: 0, x: -60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
                        <div className="relative max-w-md mx-auto">
                            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary to-accent-500 -rotate-6 opacity-20" />
                            <div className="relative rounded-3xl p-1 bg-gradient-to-br from-primary to-accent-500 shadow-soft">
                                <div className="rounded-3xl bg-white p-6">
                                    <div className="rounded-2xl bg-gradient-to-br from-neutral-200 to-neutral-300 p-10 grid place-items-center">
                                        <EditableImage
                                            k="hero.visual"
                                            fallback="/assets/hero-default.png"    
                                            alt="Hero Visual"
                                            className="max-h-48 w-auto object-contain"
                                        />
                                    </div>

                                    <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                                        <div className="rounded-xl bg-primary/10 p-3">
                                            <div className="text-xl font-extrabold text-primary">
                                                <EditableText k="hero.stats.successCount" fallback="+750" />
                                            </div>
                                            <div className="text-[11px] text-neutral-500">
                                                <EditableText k="hero.stats.successLabel" fallback="ملف ناجح" />
                                            </div>
                                        </div>
                                        <div className="rounded-xl bg-accent-100 p-3">
                                            <div className="text-xl font-extrabold text-accent-700">
                                                <EditableText k="hero.stats.winRate" fallback="92%" />
                                            </div>
                                            <div className="text-[11px] text-neutral-600">
                                                <EditableText k="hero.stats.winLabel" fallback="نسبة كسب" />
                                            </div>
                                        </div>
                                        <div className="rounded-xl bg-neutral-50 p-3 border border-neutral-200">
                                            <div className="text-xl font-extrabold text-neutral-900">
                                                <EditableText k="hero.stats.responseTime" fallback="~24 س" />
                                            </div>
                                            <div className="text-[11px] text-neutral-600">
                                                <EditableText k="hero.stats.responseLabel" fallback="زمن الرد" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Achievements */}
            <section className="section bg-neutral-50">
                <div className="container-pro">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {[0, 1, 2, 3].map((i) => (
                            <div key={i} className="text-center">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary to-accent-500 flex items-center justify-center shadow-lg">
                                    {/* أيقونات ثابتة للتصميم فقط */}
                                    <Users className="w-8 h-8 text-white" />
                                </div>
                                <p className="text-neutral-900 font-semibold">
                                    <EditableText
                                        k={`achievements.${i}`}
                                        fallback={["12+ سنوات خبرة", "450+ ملف مكتمل", "اعتمادات نقابة المحامين", "98% معدل رضا العملاء"][i]}
                                    />
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Services */}
            <section className="section bg-neutral-50">
                <div className="container-pro">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-extrabold text-neutral-900">
                            <EditableText k="services.title" fallback="مجالات الممارسة" />
                        </h2>
                        <p className="mt-2 text-neutral-600">
                            <EditableText k="services.subtitle" fallback="حلول قانونية متكاملة تغطي أهم المجالات." />
                        </p>
                    </div>

                    {/* الشبكة الديناميكية: إضافة/تعديل/حذف/ترتيب + حفظ الكل */}
                    <EditableServices k="services.items" />
                </div>
            </section>

            {/* Selected Cases */}
            <section className="section bg-neutral-50">
                <div className="container-pro">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-extrabold text-neutral-900">
                            <EditableText k="cases.title" fallback="مختارات من الحالات" />
                        </h2>
                        <p className="text-neutral-600">
                            <EditableText k="cases.subtitle" fallback="نماذج من القضايا التي تعاملنا معها بنجاح" />
                        </p>
                    </div>

                    {/* ✅ الشبكة الديناميكية للحالات */}
                    <EditableCases k="cases.items" />
                </div>
            </section>


            {/* Process Timeline */}
            <section className="section bg-neutral-50">
                <div className="container-pro">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-extrabold text-neutral-900">
                            <EditableText k="process.title" fallback="خطوتنا معك" />
                        </h2>
                        <p className="text-neutral-600">
                            <EditableText k="process.subtitle" fallback="من الاستشارة إلى الحل" />
                        </p>
                    </div>

                    <div className="relative">
                        <div className="absolute right-1/2 translate-x-1/2 w-1 h-full bg-gradient-to-b from-primary to-accent-500 rounded-full" />
                        <div className="space-y-12">
                            {[0, 1, 2, 3].map((i) => (
                                <motion.div
                                    key={i}
                                    className={`flex items-center ${i % 2 === 0 ? "flex-row-reverse" : ""}`}
                                    initial={{ opacity: 0, x: i % 2 === 0 ? 50 : -50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: i * 0.1 }}
                                >
                                    <div className={`flex-1 ${i % 2 === 0 ? "text-left pr-12" : "text-right pl-12"}`}>
                                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-primary/10">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-xl font-bold text-neutral-900">
                                                    <EditableText
                                                        k={`process.${i}.title`}
                                                        fallback={["الاستشارة الأولية", "التحليل والاستراتيجية", "التنفيذ والمتابعة", "النتيجة والمتابعة"][i]}
                                                    />
                                                </h3>
                                                <span className="text-sm text-neutral-500 bg-neutral-50 px-3 py-1 rounded-full">
                                                    <EditableText
                                                        k={`process.${i}.duration`}
                                                        fallback={["60 دقيقة", "3-5 أيام", "حسب القضية", "مستمرة"][i]}
                                                    />
                                                </span>
                                            </div>
                                            <p className="text-neutral-600">
                                                <EditableText
                                                    k={`process.${i}.desc`}
                                                    fallback={[
                                                        "جلسة لفهم قضيتك وتحديد الخيارات",
                                                        "دراسة الحالة ووضع خطة عمل واضحة",
                                                        "تطبيق الاستراتيجية وتحديثات دورية",
                                                        "تنفيذ القرار ومتابعة ما بعده",
                                                    ][i]}
                                                />
                                            </p>
                                        </div>
                                    </div>
                                    <div className="relative z-10 w-12 h-12 bg-gradient-to-br from-primary to-accent-500 rounded-full grid place-items-center mx-6">
                                        <span className="text-white font-bold">
                                            <EditableText k={`process.${i}.step`} fallback={`0${i + 1}`} />
                                        </span>
                                    </div>
                                    <div className="flex-1" />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
            {/* Team Section */}
            {/* Team Section */}
            <section className="section bg-neutral-50">
                <div className="container-pro">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-extrabold text-neutral-900">
                            <EditableText k="team.title" fallback="فريق المستشارون" />
                        </h2>
                        <p className="mt-2 text-neutral-600">
                            <EditableText
                                k="team.subtitle"
                                fallback="فريقنا من المحامين والخبراء القانونيين بخبرة واسعة في مختلف المجالات"
                            />
                        </p>
                    </div>

                    {/* الشبكة الديناميكية */}
                    <EditableTeamGrid k="team.items" />
                </div>
            </section>

            {/* Testimonials */}
            <section className="section bg-neutral-50">
                <div className="container-pro">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-extrabold text-neutral-900">
                            <EditableText k="testimonials.title" fallback="ماذا يقول عملاؤنا" />
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {[0, 1, 2].map((i) => (
                            <figure key={i} className="card">
                                <Quote className="w-5 h-5 text-accent-500" />
                                <blockquote className="mt-3 text-neutral-700">
                                    “<EditableText k={`testimonials.${i}.text`} fallback={["تعامل احترافي وسرعة بالإنجاز، أوصي بالتعامل معهم.", "فريق متمكن وفاهم تفاصيل القانون التجاري.", "وضحوا لي حقوقي كاملة وتابعوا قضيتي حتى النهاية."][i]} />”
                                </blockquote>
                                <figcaption className="mt-4 text-xs text-neutral-500">
                                    <EditableText k={`testimonials.${i}.name`} fallback={["م.", "أ.", "س."][i]} /> •{" "}
                                    <EditableText k={`testimonials.${i}.role`} fallback={["رائدة أعمال", "مدير شركة", "موظف"][i]} />
                                </figcaption>
                            </figure>
                        ))}
                    </div>
                </div>
            </section>
         

            {/* FAQ */}
            <section className="section bg-neutral-50">
                <div className="container-pro">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-extrabold text-neutral-900">
                            <EditableText k="faq.title" fallback="أسئلة شائعة" />
                        </h2>
                    </div>

                    <div className="mx-auto max-w-3xl space-y-4">
                        {[0, 1, 2].map((i) => (
                            <details key={i} className="group rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
                                <summary className="flex cursor-pointer list-none items-center justify-between">
                                    <span className="text-sm font-semibold text-neutral-900">
                                        <EditableText
                                            k={`faq.${i}.q`}
                                            fallback={["كيف تتم الاستشارة الأولية؟", "ما هي الأتعاب وكيف تُحدَّد؟", "كم تستغرق القضايا عادة؟"][i]}
                                        />
                                    </span>
                                    <ArrowRight className="w-4 h-4 text-primary transition group-open:rotate-90" />
                                </summary>
                                <p className="mt-3 text-sm text-neutral-600">
                                    <EditableText
                                        k={`faq.${i}.a`}
                                        fallback={[
                                            "جلسة مدتها 45–60 دقيقة لفهم الحالة وتحديد الخيارات القانونية، ويمكن أن تكون حضورية أو عبر مكالمة فيديو.",
                                            "نقدّم عقود أتعاب مرنة (مقطوعة/بالساعة/مرتبطة بالنتيجة) حسب نوع القضية وتعقيدها.",
                                            "المدة تختلف حسب نوع القضية والجهة القضائية. نشاركك جدولًا تقديريًا ونحدّثك دوريًا بالتقدّم.",
                                        ][i]}
                                    />
                                </p>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            
            {/* Contact strip */}
            <section className="py-10 bg-neutral-50">
                <div className="container-pro">
                    <div className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 text-center shadow-soft">
                        <h3 className="text-2xl font-extrabold text-primary-900">
                            <EditableText k="contactstrip.title" fallback="موعدك الأول يهمّنا" />
                        </h3>

                        <p className="mt-2 text-neutral-600">
                            <EditableText
                                k="contactstrip.subtitle"
                                fallback="استشارة مفصلة لفهم قضيتك وتحديد أفضل الخيارات القانونية"
                            />
                        </p>

                        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                            <EditableLink
                                k="contactstrip.cta.primary"
                                fallbackText="احجز الآن"
                                fallbackUrl="/booking"
                                className="btn btn-primary btn-lg rounded-full inline-flex items-center"
                            >
                                <Calendar className="w-5 h-5 ml-2" />
                            </EditableLink>

                            <EditableLink
                                k="contactstrip.cta.phone"
                                fallbackText="اتصال فوري"
                                fallbackUrl="tel:+962700000000"
                                className="btn btn-outline btn-lg rounded-full inline-flex items-center border-primary-300 text-primary-700 hover:bg-primary-50"
                            >
                                <PhoneCall className="w-5 h-5 ml-2" />
                            </EditableLink>
                        </div>
                    </div>
                </div>
            </section>



            {/* Floating WhatsApp */}
            <EditableText
                k="floating.whatsapp"
                fallbackText="واتساب"
                fallbackUrl="https://wa.me/962700000000"
                className="fixed bottom-6 left-6 inline-flex items-center gap-2 rounded-full bg-green-500 px-4 py-2 text-sm font-semibold text-white shadow-lg ring-1 ring-black/5"
            >
                <PhoneCall className="w-5 h-5" />
            </EditableText>
        </div>
    );
}
