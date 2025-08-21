import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
    Calendar,
    ArrowRight,
    CheckCircle,
    Users,
    Award,
    Clock,
    Scale,
    ShieldCheck,
    Star,
    Quote,
    PhoneCall,
} from "lucide-react";

export default function Home() {
    const achievements = [
        { icon: Clock, text: "12+ سنوات خبرة" },
        { icon: CheckCircle, text: "450+ ملف مكتمل" },
        { icon: Award, text: "اعتمادات نقابة المحامين" },
        { icon: Users, text: "98% معدل رضا العملاء" },
    ];

    const selectedCases = [
        {
            title: "قضية عقارية معقدة",
            challenge: "نزاع عقاري متعدد الأطراف استمر لسنوات",
            approach: "تحليل دقيق للوثائق + وساطة فعالة",
            result: "تسوية ودية في 6 أشهر",
            category: "عقاري",
        },
        {
            title: "قضية تجارية دولية",
            challenge: "خلاف تجاري عبر الحدود بقيمة مليونية",
            approach: "استراتيجية تحكيم دولي مدروسة",
            result: "استرداد 85% من المبلغ المتنازع عليه",
            category: "تجاري",
        },
        {
            title: "قضية أسرية حساسة",
            challenge: "نزاع حضانة معقد مع جوانب نفسية",
            approach: "التعامل بحساسية + خبراء نفسيين",
            result: "حل يحفظ مصلحة الأطفال",
            category: "أسري",
        },
    ];

    const services = [
        { title: "القانون التجاري", desc: "تأسيس الشركات، العقود، المنازعات" },
        { title: "القانون المدني", desc: "التعويضات، الالتزامات، النزاعات" },
        { title: "العمل والعمّال", desc: "عقود، فصل تعسفي، مستحقات" },
        { title: "العقارات", desc: "إفراغات، نزاعات ملكية، شُفعة" },
        { title: "التحكيم", desc: "تمثيل أمام هيئات التحكيم" },
        { title: "الملكية الفكرية", desc: "حماية العلامات والابتكارات" },
    ];

    const faqs = [
        {
            q: "كيف تتم الاستشارة الأولية؟",
            a: "جلسة مدتها 45–60 دقيقة لفهم الحالة وتحديد الخيارات القانونية، ويمكن أن تكون حضورية أو عبر مكالمة فيديو.",
        },
        {
            q: "ما هي الأتعاب وكيف تُحدَّد؟",
            a: "نقدّم عقود أتعاب مرنة (مقطوعة/بالساعة/مرتبطة بالنتيجة) حسب نوع القضية وتعقيدها.",
        },
        {
            q: "كم تستغرق القضايا عادة؟",
            a: "المدة تختلف حسب نوع القضية والجهة القضائية. نشاركك جدولًا تقديريًا ونحدّثك دوريًا بالتقدّم.",
        },
    ];

    return (
        <div dir="rtl" className="pt-16">
            {/* Announcement Bar */}
            <div className="bg-primary/10 text-primary text-sm">
                <div className="container-pro py-2 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4" />
                        <span>استشارة أولية مجانية خلال 24 ساعة</span>
                    </div>
                    <Link to="/booking" className="inline-flex items-center gap-1 font-semibold hover:opacity-80">
                        احجز الآن <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>

            {/* Hero */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(234,179,8,0.12),transparent_60%)]" />
                <div className="container-pro py-16 md:py-24 grid gap-12 lg:grid-cols-2 items-center">
                    <motion.div initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-neutral-900">
                            القانون بعيون إنسانية،
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-500">وخبرة تصنع فارقًا</span>
                        </h1>
                        <p className="mt-4 text-lg text-neutral-600">
                            أنا <span className="text-primary font-semibold">سارة الأحمد</span> — محامية متخصصة في المدني، التجاري،
                            والعقاري. نبدأ بالإصغاء، وننتهي بحل عملي يحفظ حقوقك.
                        </p>
                        <div className="mt-8 flex flex-wrap items-center gap-4">
                            <Link to="/booking" className="btn btn-primary btn-lg rounded-full">
                                <Calendar className="w-5 h-5 ml-2" /> احجز استشارة الآن
                            </Link>
                            <Link to="/about" className="btn btn-outline btn-lg rounded-full">تعرّف على أسلوبي</Link>
                        </div>
                        <div className="mt-6 flex flex-wrap gap-4 text-xs text-neutral-500">
                            <span className="inline-flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500" />رد خلال 24 ساعة</span>
                            <span className="inline-flex items-center gap-2"><Star className="w-4 h-4 text-accent-500" />تقييم 4.9/5</span>
                        </div>
                        {/* Trust badges */}
                        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-6 opacity-80">
                            {["وزارة العدل", "نقابة المحامين", "غرفة التجارة", "مركز التحكيم"].map((t, i) => (
                                <div key={i} className="flex items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-3 shadow-sm">
                                    <Scale className="w-4 h-4 text-primary" />
                                    <span className="text-xs font-semibold text-neutral-700">{t}</span>
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
                                        <Users className="w-24 h-24 text-white/70" />
                                    </div>
                                    <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                                        <div className="rounded-xl bg-primary/10 p-3">
                                            <div className="text-xl font-extrabold text-primary">+750</div>
                                            <div className="text-[11px] text-neutral-500">ملف ناجح</div>
                                        </div>
                                        <div className="rounded-xl bg-accent-100 p-3">
                                            <div className="text-xl font-extrabold text-accent-700">92%</div>
                                            <div className="text-[11px] text-neutral-600">نسبة كسب</div>
                                        </div>
                                        <div className="rounded-xl bg-neutral-50 p-3 border border-neutral-200">
                                            <div className="text-xl font-extrabold text-neutral-900">~24 س</div>
                                            <div className="text-[11px] text-neutral-600">زمن الرد</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Achievements */}
            <section className="section bg-white/50">
                <div className="container-pro">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {achievements.map((a, i) => (
                            <div key={i} className="text-center">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary to-accent-500 flex items-center justify-center shadow-lg">
                                    <a.icon className="w-8 h-8 text-white" />
                                </div>
                                <p className="text-neutral-900 font-semibold">{a.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Services */}
            <section className="section">
                <div className="container-pro">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-extrabold text-neutral-900">مجالات الممارسة</h2>
                        <p className="mt-2 text-neutral-600">حلول قانونية متكاملة تغطي أهم المجالات.</p>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {services.map((s, i) => (
                            <div key={i} className="card card-hover">
                                <div className="badge badge-primary">خدمة</div>
                                <h3 className="mt-3 text-lg font-extrabold text-primary">{s.title}</h3>
                                <p className="mt-2 text-sm text-neutral-600">{s.desc}</p>
                                <div className="mt-4 text-sm font-semibold text-primary opacity-70">تفاصيل أكثر →</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Selected Cases */}
            <section className="section">
                <div className="container-pro">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-extrabold text-neutral-900">مختارات من الحالات</h2>
                        <p className="text-neutral-600">نماذج من القضايا التي تعاملنا معها بنجاح</p>
                    </div>
                    <div className="grid lg:grid-cols-3 gap-8">
                        {selectedCases.map((c, index) => (
                            <motion.div
                                key={index}
                                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-primary/10"
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.15 }}
                                whileHover={{ y: -4 }}
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <h3 className="text-xl font-bold text-neutral-900">{c.title}</h3>
                                    <span className="px-3 py-1 bg-gradient-to-r from-primary to-accent-500 text-white text-xs rounded-full">{c.category}</span>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="font-semibold text-neutral-900 mb-2">التحدي:</h4>
                                        <p className="text-neutral-600 text-sm">{c.challenge}</p>
                                    </div>
                                    <div className="flex items-center justify-center my-3">
                                        <ArrowRight className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-neutral-900 mb-2">المقاربة:</h4>
                                        <p className="text-neutral-600 text-sm">{c.approach}</p>
                                    </div>
                                    <div className="flex items-center justify-center my-3">
                                        <ArrowRight className="w-5 h-5 text-accent-500" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-neutral-900 mb-2">النتيجة:</h4>
                                        <p className="text-primary font-semibold text-sm">{c.result}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Process Timeline */}
            <section className="section bg-neutral-50">
                <div className="container-pro">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-extrabold text-neutral-900">خطوتنا معك</h2>
                        <p className="text-neutral-600">من الاستشارة إلى الحل</p>
                    </div>
                    <div className="relative">
                        <div className="absolute right-1/2 translate-x-1/2 w-1 h-full bg-gradient-to-b from-primary to-accent-500 rounded-full" />
                        <div className="space-y-12">
                            {[
                                { step: "01", title: "الاستشارة الأولية", desc: "جلسة لفهم قضيتك وتحديد الخيارات", duration: "60 دقيقة" },
                                { step: "02", title: "التحليل والاستراتيجية", desc: "دراسة الحالة ووضع خطة عمل واضحة", duration: "3-5 أيام" },
                                { step: "03", title: "التنفيذ والمتابعة", desc: "تطبيق الاستراتيجية وتحديثات دورية", duration: "حسب القضية" },
                                { step: "04", title: "النتيجة والمتابعة", desc: "تنفيذ القرار ومتابعة ما بعده", duration: "مستمرة" },
                            ].map((s, i) => (
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
                                                <h3 className="text-xl font-bold text-neutral-900">{s.title}</h3>
                                                <span className="text-sm text-neutral-500 bg-neutral-50 px-3 py-1 rounded-full">{s.duration}</span>
                                            </div>
                                            <p className="text-neutral-600">{s.desc}</p>
                                        </div>
                                    </div>
                                    <div className="relative z-10 w-12 h-12 bg-gradient-to-br from-primary to-accent-500 rounded-full grid place-items-center mx-6">
                                        <span className="text-white font-bold">{s.step}</span>
                                    </div>
                                    <div className="flex-1" />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="section">
                <div className="container-pro">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-extrabold text-neutral-900">ماذا يقول عملاؤنا</h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { name: "م.", role: "رائدة أعمال", text: "تعامل احترافي وسرعة بالإنجاز، أوصي بالتعامل معهم." },
                            { name: "أ.", role: "مدير شركة", text: "فريق متمكن وفاهم تفاصيل القانون التجاري." },
                            { name: "س.", role: "موظف", text: "وضحوا لي حقوقي كاملة وتابعوا قضيتي حتى النهاية." },
                        ].map((t, i) => (
                            <figure key={i} className="card">
                                <Quote className="w-5 h-5 text-accent-500" />
                                <blockquote className="mt-3 text-neutral-700">“{t.text}”</blockquote>
                                <figcaption className="mt-4 text-xs text-neutral-500">
                                    {t.name} • {t.role}
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
                        <h2 className="text-2xl font-extrabold text-neutral-900">أسئلة شائعة</h2>
                    </div>
                    <div className="mx-auto max-w-3xl space-y-4">
                        {faqs.map((f, i) => (
                            <details key={i} className="group rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
                                <summary className="flex cursor-pointer list-none items-center justify-between">
                                    <span className="text-sm font-semibold text-neutral-900">{f.q}</span>
                                    <ArrowRight className="w-4 h-4 text-primary transition group-open:rotate-90" />
                                </summary>
                                <p className="mt-3 text-sm text-neutral-600">{f.a}</p>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact strip */}
            <section className="py-10 bg-gradient-to-r from-neutral-900 to-slate-800">
                <div className="container-pro">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8 text-center text-white shadow-soft">
                        <h3 className="text-2xl font-extrabold">موعدك الأول يهمّنا</h3>
                        <p className="mt-2 text-neutral-300">استشارة مفصلة لفهم قضيتك وتحديد أفضل الخيارات القانونية</p>
                        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                            <Link to="/booking" className="btn btn-primary btn-lg rounded-full"><Calendar className="w-5 h-5 ml-2" />احجز الآن</Link>
                            <a href="tel:+962700000000" className="btn btn-outline btn-lg rounded-full"><PhoneCall className="w-5 h-5 ml-2" />اتصال فوري</a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Floating WhatsApp */}
            <a
                href="https://wa.me/962700000000"
                target="_blank"
                rel="noreferrer"
                className="fixed bottom-6 left-6 inline-flex items-center gap-2 rounded-full bg-green-500 px-4 py-2 text-sm font-semibold text-white shadow-lg ring-1 ring-black/5"
            >
                <PhoneCall className="w-5 h-5" /> واتساب
            </a>
        </div>
    );
}
