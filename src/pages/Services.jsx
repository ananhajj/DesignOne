import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
    Building,
    FileText,
    Gavel,
    Heart,
    Home,
    Scale,
    Calendar,
    ChevronDown,
    ChevronUp,
} from "lucide-react";

export default function Services() {
    const [activeTab, setActiveTab] = useState(0);
    const [openFAQ, setOpenFAQ] = useState(null);

    const services = [
        {
            id: 0,
            title: "القضايا التجارية والشركات",
            icon: Building,
            description: "استشارات شاملة في القانون التجاري وقضايا الشركات وحل النزاعات التجارية",
            whenNeeded: [
                "تأسيس الشركات والمؤسسات",
                "النزاعات التجارية بين الشركاء",
                "عقود التوريد والتوزيع",
                "قضايا الإفلاس والتصفية",
                "حماية الملكية الفكرية",
            ],
            howIWork:
                "أبدأ بدراسة مفصلة للوضع التجاري والقانوني، ثم أضع استراتيجية واضحة تهدف لحماية مصالحك وتحقيق أهدافك التجارية بأقل التكاليف والمخاطر.",
            faqs: [
                { question: "كم تستغرق إجراءات تأسيس الشركة؟", answer: "عادة 2–4 أسابيع حسب النوع والمتطلبات." },
                {
                    question: "ما هي تكلفة الاستشارة القانونية للشركات؟",
                    answer: "تعتمد على حجم وتعقيد العمل، مع إمكانية رسوم شهرية للاشتراكات الاستشارية.",
                },
            ],
        },
        {
            id: 1,
            title: "القضايا المدنية",
            icon: Scale,
            description: "تمثيل في القضايا المدنية والتعويضات ونزاعات المسؤولية المدنية",
            whenNeeded: ["قضايا التعويضات والأضرار", "النزاعات المدنية العامة", "المسؤولية التقصيرية", "تنفيذ الأحكام", "القضايا التأمينية"],
            howIWork:
                "تحليل شامل للوقائع والأدلة وإعداد دفوع دقيقة، مع التركيز على أفضل تعويض ممكن أو دفاع فعّال حسب الموقف.",
            faqs: [
                { question: "كيف يتم تقدير قيمة التعويض؟", answer: "وفق الضرر المادي والمعنوي وبمساعدة خبراء مختصين." },
                { question: "ما مدة التقادم؟", answer: "تختلف بنوع القضية؛ الأصل العام 3 سنوات من تاريخ العلم بالضرر." },
            ],
        },
        {
            id: 2,
            title: "القضايا الجزائية",
            icon: Gavel,
            description: "دفاع وتمثيل في القضايا الجزائية وحقوق الإنسان",
            whenNeeded: ["التحقيقات الجنائية", "القضايا الجزائية العامة", "جرائم الأموال", "القضايا الأمنية", "الطعون والاستئناف"],
            howIWork:
                "دفاع قوي ومدروس يعتمد على تحليل الأدلة والشهادات، مع ضمان احترام حقوقك القانونية والدستورية.",
            faqs: [
                { question: "متى أستعين بمحامٍ؟", answer: "فور بدء التحقيق أو الاتهام لحماية حقوقك مبكرًا." },
                { question: "هل يمكن تجنب السجن؟", answer: "أحيانًا عبر استراتيجيات دفاع مناسبة والتفاوض مع النيابة." },
            ],
        },
        {
            id: 3,
            title: "الأحوال الشخصية",
            icon: Heart,
            description: "قضايا الأسرة والأحوال الشخصية بحساسية ومهنية عالية",
            whenNeeded: ["الطلاق والخلع", "الحضانة والنفقة", "تقسيم الممتلكات", "النسب والولاية", "الوصية والإرث"],
            howIWork:
                "تعامل حسّاس مع أولوية الحل الودي كلما أمكن، مع تقديم مصلحة الأطفال على ما سواها.",
            faqs: [
                { question: "كيف تحدَّد نفقة الأطفال؟", answer: "حسب دخل المعيل ومستوى المعيشة واحتياجات الأطفال." },
                { question: "ما حقوق الأم في الحضانة؟", answer: "للأم أولوية حضانة الصغار وفق الضوابط الشرعية والنظامية." },
            ],
        },
        {
            id: 4,
            title: "القضايا العقارية",
            icon: Home,
            description: "نزاعات عقارية وعقود بيع/تأجير واستثمار عقاري",
            whenNeeded: ["نزاعات الملكية", "عقود البيع والشراء", "النزاعات الإيجارية", "التطوير العقاري", "الاستثمار العقاري"],
            howIWork:
                "بحث شامل في تاريخ العقار وحالته القانونية، وضمان سلامة المعاملات وحماية الاستثمارات.",
            faqs: [
                { question: "كيف أتأكد من سلامة العقار؟", answer: "بمراجعة السجلات والتأكد من خلوّه من الرهون والنزاعات." },
                { question: "حقوق المستأجر؟", answer: "الانتفاع وفق العقد وحماية من الإخلاء التعسفي ضمن النظام." },
            ],
        },
        {
            id: 5,
            title: "التحكيم والوساطة",
            icon: FileText,
            description: "حلول بديلة لفض النزاعات خارج المحاكم",
            whenNeeded: ["نزاعات تجارية دولية", "نزاعات الاستثمار", "النزاعات الإنشائية", "الملكية الفكرية", "خلافات الشراكة"],
            howIWork:
                "اختيار أنسب آلية (تحكيم/وساطة) مع حماية حقوقك وتقليل الزمن والتكلفة.",
            faqs: [
                { question: "الفرق بين التحكيم والقضاء؟", answer: "التحكيم أسرع وأكثر مرونة وسرية وحكمه ملزم." },
                { question: "الطعن في حكم التحكيم؟", answer: "محدود جدًا ولأسباب إجرائية." },
            ],
        },
    ];

    const activeService = services[activeTab];
    const tabGradient = (i) => (i % 2 === 0 ? "from-primary to-accent-500" : "from-accent-500 to-primary");

    return (
        <div dir="rtl" className="pt-20">
            {/* Hero */}
            <section className="py-20 bg-gradient-to-br from-neutral-50 to-white">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                        <h1 className="text-5xl font-extrabold text-neutral-900 mb-6">
                            الخدمات القانونية
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-500">
                                المتخصصة
                            </span>
                        </h1>
                        <p className="text-xl text-neutral-600">
                            خدمات شاملة تغطي التخصصات الرئيسية بخبرة عملية تتجاوز 12 عامًا
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Tabs */}
            <section className="py-20">
                <div className="container-pro">
                    {/* Tab Navigation */}
                    <div className="flex flex-wrap justify-center gap-3 mb-12">
                        {services.map((s, i) => {
                            const ActiveIcon = s.icon;
                            const active = activeTab === i;
                            return (
                                <motion.button
                                    key={s.id}
                                    onClick={() => {
                                        setActiveTab(i);
                                        setOpenFAQ(null);
                                    }}
                                    className={`inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold transition
                    ${active ? `bg-gradient-to-r ${tabGradient(i)} text-white shadow-sm`
                                            : "bg-white text-neutral-600 border border-primary/10 hover:border-primary/30 hover:text-primary"}`}
                                    whileHover={{ scale: 1.04 }}
                                    whileTap={{ scale: 0.98 }}
                                    aria-pressed={active}
                                >
                                    <ActiveIcon className="w-4 h-4 ml-1" />
                                    {s.title}
                                </motion.button>
                            );
                        })}
                    </div>

                    {/* Tab Content */}
                    <motion.div
                        key={activeTab}
                        className="bg-white rounded-3xl shadow-soft p-8 lg:p-12 border border-primary/10"
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45 }}
                    >
                        <div className="grid lg:grid-cols-3 gap-12">
                            {/* Icon & Title */}
                            <div className="text-center lg:text-right">
                                <div className={`w-20 h-20 mx-auto lg:mx-0 mb-6 rounded-2xl grid place-items-center bg-gradient-to-r ${tabGradient(activeTab)}`}>
                                    <activeService.icon className="w-10 h-10 text-white" />
                                </div>
                                <h2 className="text-3xl font-extrabold text-neutral-900 mb-3">{activeService.title}</h2>
                                <p className="text-neutral-600">{activeService.description}</p>

                                <div className="mt-8">
                                    <Link
                                        to="/booking"
                                        className={`inline-flex items-center rounded-full bg-gradient-to-r ${tabGradient(activeTab)} px-6 py-3 text-sm font-semibold text-white shadow-sm hover:shadow-md transition`}
                                    >
                                        <Calendar className="w-4 h-4 ml-2" />
                                        احجز استشارة
                                    </Link>
                                </div>
                            </div>

                            {/* When Needed + How I Work */}
                            <div className="lg:col-span-2 space-y-8">
                                <div>
                                    <h3 className="text-2xl font-extrabold text-neutral-900 mb-4">متى تحتاج هذه الخدمة؟</h3>
                                    <ul className="space-y-3">
                                        {activeService.whenNeeded.map((item, i) => (
                                            <li key={i} className="flex items-center gap-3">
                                                <span className={`inline-block w-2 h-2 rounded-full bg-gradient-to-r ${tabGradient(activeTab)}`} />
                                                <span className="text-neutral-600">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-2xl font-extrabold text-neutral-900 mb-3">كيف أعمل</h3>
                                    <p className="text-neutral-600 leading-relaxed">{activeService.howIWork}</p>
                                </div>
                            </div>
                        </div>

                        {/* FAQ */}
                        <div className="mt-12 pt-8 border-t border-primary/10">
                            <h3 className="text-2xl font-extrabold text-neutral-900 mb-6">أسئلة شائعة</h3>
                            <div className="space-y-3">
                                {activeService.faqs.map((faq, i) => {
                                    const open = openFAQ === i;
                                    return (
                                        <div key={i} className="rounded-xl border border-primary/10 overflow-hidden">
                                            <button
                                                onClick={() => setOpenFAQ(open ? null : i)}
                                                className="w-full px-5 py-4 text-right bg-neutral-50 hover:bg-neutral-100 transition flex items-center justify-between"
                                                aria-expanded={open}
                                            >
                                                <span className="font-semibold text-neutral-900">{faq.question}</span>
                                                {open ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
                                            </button>
                                            {open && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    transition={{ duration: 0.25 }}
                                                    className="px-5 py-4 bg-white"
                                                >
                                                    <p className="text-neutral-600">{faq.answer}</p>
                                                </motion.div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
