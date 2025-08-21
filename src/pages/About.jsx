import { motion } from "framer-motion";
import { Award, CheckCircle, Eye, Shield, Users, Zap } from "lucide-react";

export default function About() {
    const values = [
        { icon: Eye, title: "الوضوح", description: "شفافية كاملة في التواصل وتوضيح جميع الخيارات القانونية المتاحة" },
        { icon: Shield, title: "السرية", description: "حماية مطلقة لمعلومات العملاء وضمان أقصى درجات الخصوصية" },
        { icon: Zap, title: "الاستجابة", description: "رد سريع على الاستفسارات ومتابعة دورية لتطورات القضايا" },
        { icon: CheckCircle, title: "الحسم", description: "قرارات حاسمة مبنية على دراسة علمية ومعرفة عميقة بالقانون" },
    ];

    const qualifications = [
        "بكالوريوس الحقوق - جامعة الملك سعود (2012)",
        "ماجستير القانون التجاري - جامعة الملك عبدالعزيز (2015)",
        "عضو نقابة المحامين السعوديين",
        "شهادة التحكيم التجاري الدولي",
        "دبلوم القانون العقاري المتقدم",
    ];

    const awards = [
        "جائزة أفضل محامية شابة - نقابة المحامين (2019)",
        "تكريم للتميز في القضايا العقارية (2021)",
        "عضو لجنة تطوير القوانين التجارية",
        "محكم معتمد لدى المركز السعودي للتحكيم التجاري",
    ];

    return (
        <div dir="rtl" className="pt-20">
            {/* Hero */}
            <section className="py-20 bg-gradient-to-br from-neutral-50 to-white">
                <div className="container-pro">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            className="text-right"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <h1 className="text-5xl font-extrabold text-neutral-900 mb-6 leading-tight">
                                عن المحامية
                                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-500">
                                    سارة الأحمد
                                </span>
                            </h1>
                            <p className="text-xl text-neutral-600 leading-relaxed">
                                محامية متخصصة تجمع بين الخبرة العملية والمعرفة الأكاديمية العميقة، مع التزام راسخ بتحقيق أفضل النتائج
                                لعملائها من خلال نهج إنساني ومهني متميز.
                            </p>
                        </motion.div>

                        <motion.div
                            className="relative"
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent-500 rounded-3xl -rotate-3 opacity-20" />
                                <div className="relative bg-white rounded-3xl p-8 shadow-soft">
                                    <div className="w-full h-80 bg-gradient-to-br from-neutral-300 to-primary rounded-2xl grid place-items-center">
                                        <Users className="w-20 h-20 text-white/70" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Professional Vision */}
            <section className="py-20">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
                        <h2 className="text-4xl font-extrabold text-neutral-900 mb-8">الرؤية المهنية</h2>
                        <blockquote
                            className="text-2xl text-neutral-600 italic leading-relaxed border-r-4 pr-6"
                            style={{ borderImage: "linear-gradient(to bottom, var(--tw-gradient-from,#7c533a), var(--tw-gradient-to,#eab308)) 1" }}
                        >
                            "أؤمن أن القانون ليس مجرد نصوص وأحكام، بل أداة لتحقيق العدالة وحماية الحقوق. كل قضية هي قصة إنسانية تستحق
                            الاهتمام الكامل والخبرة المتخصصة لتحقيق أفضل النتائج الممكنة."
                        </blockquote>
                        <footer className="mt-6 text-primary font-semibold">— المحامية سارة الأحمد</footer>
                    </motion.div>
                </div>
            </section>

            {/* Working Style / Values */}
            <section className="py-20 bg-white/50">
                <div className="container-pro">
                    <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
                        <h2 className="text-4xl font-extrabold text-neutral-900 mb-4">أسلوبي في العمل</h2>
                        <p className="text-xl text-neutral-600">المبادئ التي توجه ممارستي المهنية</p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, i) => (
                            <motion.div
                                key={value.title}
                                className="text-center"
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: i * 0.1 }}
                            >
                                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary to-accent-500 rounded-2xl grid place-items-center shadow-soft">
                                    <value.icon className="w-10 h-10 text-white" />
                                </div>
                                <h3 className="text-xl font-extrabold text-neutral-900 mb-3">{value.title}</h3>
                                <p className="text-neutral-600 leading-relaxed">{value.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Qualifications & Awards */}
            <section className="py-20">
                <div className="container-pro">
                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Qualifications */}
                        <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
                            <div className="flex items-center mb-8">
                                <Award className="w-8 h-8 text-primary ml-3" />
                                <h3 className="text-3xl font-extrabold text-neutral-900">المؤهلات والشهادات</h3>
                            </div>
                            <ul className="space-y-4">
                                {qualifications.map((q, i) => (
                                    <motion.li
                                        key={q}
                                        className="flex items-start gap-3"
                                        initial={{ opacity: 0, x: -30 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.6, delay: i * 0.1 }}
                                    >
                                        <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                                        <p className="text-neutral-600">{q}</p>
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* Awards */}
                        <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
                            <div className="flex items-center mb-8">
                                <Shield className="w-8 h-8 text-accent-500 ml-3" />
                                <h3 className="text-3xl font-extrabold text-neutral-900">الجوائز والتكريم</h3>
                            </div>
                            <ul className="space-y-4">
                                {awards.map((a, i) => (
                                    <motion.li
                                        key={a}
                                        className="flex items-start gap-3"
                                        initial={{ opacity: 0, x: 30 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.6, delay: i * 0.1 }}
                                    >
                                        <CheckCircle className="w-5 h-5 text-accent-500 mt-0.5 flex-shrink-0" />
                                        <p className="text-neutral-600">{a}</p>
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Role in Firm */}
            <section className="py-20 bg-gradient-to-br from-neutral-900 to-slate-800">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
                        <h2 className="text-4xl font-extrabold text-white mb-8">داخل مكتب الأحمد والشركاه</h2>
                        <p className="text-xl text-neutral-300 leading-relaxed mb-8">
                            أعمل ضمن فريق متخصص من المحامين في مكتب الأحمد والشركاه، حيث أقود قسم القضايا المدنية والتجارية. دوري يتمحور
                            حول تقديم استشارات قانونية متخصصة وتمثيل العملاء في القضايا المعقدة، مع الاستفادة من الموارد والخبرات
                            المتنوعة لضمان أفضل النتائج لعملائي.
                        </p>
                        <div className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-primary to-accent-500 text-white">
                            شريك مؤسس - قسم القضايا المدنية والتجارية
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
