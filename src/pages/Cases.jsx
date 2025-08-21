import { motion } from "framer-motion";
import { Building, FileText, Gavel, Heart, Home, Scale } from "lucide-react";
import { Link } from "react-router-dom";

export default function Cases() {
    const cases = [
        {
            title: "نزاع عقاري معقد متعدد الأطراف",
            category: "عقاري",
            icon: Home,
            background:
                "خلاف حول ملكية قطعة أرض كبيرة بين ورثة وشركة تطوير، استمر النزاع لأكثر من 5 سنوات دون حل.",
            approach:
                "دراسة مكثفة للمستندات التاريخية، تحليل قانوني للحقوق، وتطبيق استراتيجية وساطة مبتكرة لتجنب التقاضي المطول.",
            result:
                "تم التوصل لاتفاق شامل يحفظ حقوق جميع الأطراف خلال 8 أشهر، مع توفير أكثر من 2 مليون ريال من تكاليف التقاضي.",
            duration: "8 أشهر",
            savings: "2M+ ريال",
        },
        {
            title: "قضية تجارية دولية كبرى",
            category: "تجاري",
            icon: Building,
            background:
                "نزاع تجاري بين شركة سعودية ومؤسسة أوروبية حول عقد توريد بقيمة 50 مليون ريال، مع تعقيدات قانونية دولية.",
            approach:
                "تكوين فريق متخصص في القانون الدولي، استخدام التحكيم التجاري الدولي، والتنسيق مع محامين في الخارج.",
            result:
                "استرداد 42 مليون ريال من أصل 50 مليون، مع تسوية شاملة تحافظ على العلاقات التجارية المستقبلية.",
            duration: "18 شهر",
            savings: "42M ريال",
        },
        {
            title: "قضية حضانة معقدة وحساسة",
            category: "أسري",
            icon: Heart,
            background:
                "نزاع حضانة معقد يتضمن جوانب نفسية واجتماعية صعبة، مع ضرورة الحفاظ على مصلحة الأطفال الفضلى.",
            approach:
                "التعاون مع خبراء نفسيين واجتماعيين، تطبيق نهج تفاوضي يركز على الحلول الودية، واستخدام الوساطة الأسرية.",
            result:
                "الوصول لاتفاق حضانة مشتركة يلبي احتياجات الأطفال النفسية والتعليمية، مع الحفاظ على علاقة صحية مع الوالدين.",
            duration: "6 أشهر",
            savings: "حل ودي",
        },
        {
            title: "قضية جنائية معقدة - دفاع",
            category: "جنائي",
            icon: Gavel,
            background:
                "قضية جنائية معقدة تتضمن اتهامات مالية جدية، مع ضرورة إثبات البراءة وحماية السمعة المهنية للموكل.",
            approach:
                "تحليل دقيق للأدلة الجنائية، الاستعانة بخبراء الطب الشرعي والمحاسبة، وبناء دفاع شامل يدحض الاتهامات.",
            result:
                "براءة كاملة من جميع التهم، مع إثبات عدم صحة الاتهامات والمحافظة على السمعة المهنية والشخصية.",
            duration: "14 شهر",
            savings: "براءة كاملة",
        },
        {
            title: "تحكيم تجاري دولي معقد",
            category: "تحكيم",
            icon: Scale,
            background:
                "نزاع تحكيم دولي في مشروع إنشائي كبير بين مطور سعودي ومقاول أجنبي، بقيمة تزيد عن 100 مليون ريال.",
            approach:
                "تطبيق قواعد التحكيم الدولي، التنسيق مع محكمين دوليين، وإعداد دفوع تقنية وقانونية متخصصة في القانون الإنشائي.",
            result:
                "قرار تحكيم لصالح الموكل بقيمة 78 مليون ريال، مع تعزيز موقفه في السوق الدولي للمقاولات.",
            duration: "24 شهر",
            savings: "78M ريال",
        },
        {
            title: "قضية مدنية - تعويضات كبرى",
            category: "مدني",
            icon: FileText,
            background:
                "قضية تعويض عن أضرار مهنية ونفسية نتيجة حادث عمل، مع تعقيدات في إثبات حجم الضرر والمسؤولية.",
            approach:
                "الاستعانة بخبراء طبيين واقتصاديين لتقدير الأضرار، وبناء ملف شامل يثبت المسؤولية ومقدار التعويض العادل.",
            result:
                "الحصول على تعويض قدره 5.2 مليون ريال، يغطي العلاج والأضرار المهنية والمعنوية مدى الحياة.",
            duration: "11 شهر",
            savings: "5.2M ريال",
        },
    ];

    const getCategoryIcon = (category) => {
        const icons = {
            عقاري: Home,
            تجاري: Building,
            أسري: Heart,
            جنائي: Gavel,
            تحكيم: Scale,
            مدني: FileText,
        };
        return icons[category] || FileText;
    };

    return (
        <div dir="rtl" className="pt-20">
            {/* Hero */}
            <section className="py-20 bg-gradient-to-br from-neutral-50 to-white">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-5xl font-extrabold text-neutral-900 mb-8">
                            أعمال مختارة
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-500 drop-shadow-sm">
                                ودراسات حالة
                            </span>


                        </h1>
                        <p className="text-xl text-neutral-600">
                            نماذج من القضايا الناجحة التي تعكس الخبرة والتميّز في التعامل مع القضايا المعقدة
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Cases Grid */}
            <section className="py-20">
                <div className="container-pro">
                    <div className="grid lg:grid-cols-2 gap-8">
                        {cases.map((c, index) => {
                            const IconComp = getCategoryIcon(c.category);
                            const headerGradient =
                                index % 2 === 0
                                    ? "from-primary to-accent-500"
                                    : "from-accent-500 to-primary";
                            return (
                                <motion.div
                                    key={c.title}
                                    className="bg-white rounded-3xl shadow-soft hover:shadow-md transition-all duration-300 overflow-hidden border border-primary/10"
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    whileHover={{ y: -6 }}
                                >
                                    {/* Header */}
                                    <div className={`bg-gradient-to-r ${headerGradient} p-6 text-white`}>
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <IconComp className="w-6 h-6" />
                                                <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full">
                                                    {c.category}
                                                </span>
                                            </div>
                                            <div className="text-left">
                                                <div className="text-[11px] opacity-90">المدة</div>
                                                <div className="font-semibold">{c.duration}</div>
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-extrabold leading-tight">{c.title}</h3>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6">
                                        <div className="space-y-6">
                                            {/* Background */}
                                            <div>
                                                <h4 className="text-xs font-extrabold text-primary mb-2 tracking-wider">
                                                    الخلفية
                                                </h4>
                                                <p className="text-neutral-600 text-sm leading-relaxed">{c.background}</p>
                                            </div>

                                            {/* Approach */}
                                            <div>
                                                <h4 className="text-xs font-extrabold text-primary mb-2 tracking-wider">
                                                    النهج المتّبع
                                                </h4>
                                                <p className="text-neutral-600 text-sm leading-relaxed">{c.approach}</p>
                                            </div>

                                            {/* Result */}
                                            <div className="rounded-2xl p-4 border border-primary/10 bg-primary/5">
                                                <div className="flex items-center justify-between mb-3">
                                                    <h4 className="text-xs font-extrabold text-primary tracking-wider">
                                                        النتيجة
                                                    </h4>
                                                    <div className="text-left">
                                                        <div className="text-[11px] text-neutral-500">الإنجاز</div>
                                                        <div
                                                            className={`font-extrabold text-sm bg-gradient-to-r ${headerGradient} bg-clip-text text-transparent`}
                                                        >
                                                            {c.savings}
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className="text-neutral-900 font-medium text-sm leading-relaxed">
                                                    {c.result}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-gradient-to-r from-neutral-900 to-slate-800">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-4xl font-extrabold text-white mb-6">
                            قضيتك تستحق نفس الاهتمام والخبرة
                        </h2>
                        <p className="text-xl text-neutral-300 mb-8">
                            كل قضية لها ظروفها الخاصة، وتحتاج لنهج مخصص يحقق أفضل النتائج
                        </p>
                        <Link
                            to="/booking"
                            className="inline-flex items-center px-8 py-4 rounded-full bg-gradient-to-r from-primary to-accent-500 text-white font-semibold text-lg hover:shadow-xl transform hover:scale-105 transition-all"
                        >
                            <FileText className="w-5 h-5 ml-3" />
                            ابدأ بمناقشة قضيتك
                        </Link>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
