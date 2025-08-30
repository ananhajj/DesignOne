import { motion } from "framer-motion";
import { Award, CheckCircle, Eye, Shield, Zap } from "lucide-react";
import EditableImage from "../cms/Editable/EditableImage";
import EditableValuesIcons from "../cms/Editable/EditableValuesIcons";
import EditableText from "../cms/Editable/EditableText";
import EditableLongText from "../cms/Editable/EditableLongText";
import EditableParagraphsWithBadge from "../cms/Editable/EditableParagraphsWithBadge";
import EditableBulletList from "../cms/Editable/EditableBulletList";
import HideableSection from "../components/HideableSection";


export default function About() {
    // أيقونات قيم العمل (ثابتة)، النصوص قابلة للتعديل عبر مفاتيح منفصلة
    const valueIcons = [Eye, Shield, Zap, CheckCircle];

    // أطوال ثابتة للقوائم؛ كل عنصر نصه يتعدل عبر مفتاح مستقل
    const QUAL_LEN = 5;
    const AWARD_LEN = 4;

    const qualFallbacks = [
        "بكالوريوس الحقوق - جامعة الملك سعود (2012)",
        "ماجستير القانون التجاري - جامعة الملك عبدالعزيز (2015)",
        "عضو نقابة المحامين السعوديين",
        "شهادة التحكيم التجاري الدولي",
        "دبلوم القانون العقاري المتقدم",
    ];

    const awardFallbacks = [
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
                        {/* نص الهيرو */}
                        <motion.div
                            className="text-right"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <h1 className="text-5xl font-extrabold text-neutral-900 mb-6 leading-tight">
                                <EditableText k="about.hero.title.top" fallback="عن المحامية" />
                                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-500">
                                    <EditableText k="about.hero.title.name" fallback="سارة الأحمد" />
                                </span>
                            </h1>
                            <p className="text-xl text-neutral-600 leading-relaxed">
                                <EditableLongText
                                    k="about.hero.subtitle"
                                    fallback="محامية متخصصة تجمع بين الخبرة العملية والمعرفة الأكاديمية العميقة..."
                                    rows={4}
                                    maxLength={800}
                                />
                            </p>
                        </motion.div>

                        {/* صورة/فيجوال الهيرو داخل نفس الكارد (الستايل محفوظ) */}
                        <motion.div
                            className="relative"
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent-500 rounded-3xl -rotate-3 opacity-20" />
                                <div className="relative bg-white rounded-3xl p-8 shadow-soft">
                                    <div className="w-full h-80 rounded-2xl overflow-hidden border border-neutral-200 bg-white grid place-items-center">
                                        <EditableImage
                                            k="about.hero.image"
                                            fallback="/assets/hero-default.png"
                                            alt="Hero Visual"
                                            className="max-h-64 w-auto object-contain"
                                        />
                                    </div>

                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>


             <HideableSection k="about.work"> 
            {/* الرؤية المهنية */}
            <section className="py-20 bg-neutral-50">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-4xl font-extrabold text-neutral-900 mb-8">
                            <EditableText k="about.vision.title" fallback="الرؤية المهنية" />
                        </h2>
                            <blockquote
                                className="text-2xl text-neutral-700 italic leading-relaxed border-r-4 pr-6 border-transparent"
                                style={{
                                    borderImage:
                                        "linear-gradient(to bottom, var(--tw-gradient-from, #1e3a8a), var(--tw-gradient-to, #3b82f6)) 1",
                                }}
                            >
                            “
                            <EditableLongText
                                k="about.vision.quote"
                                fallback="أؤمن أن القانون ليس مجرد نصوص وأحكام، بل أداة لتحقيق العدالة وحماية الحقوق. كل قضية هي قصة إنسانية تستحق الاهتمام الكامل والخبرة المتخصصة لتحقيق أفضل النتائج الممكنة."
                            />
                            ”
                        </blockquote>
                        <footer className="mt-6 text-primary font-semibold">
                            — <EditableText k="about.vision.author" fallback="المحامية سارة الأحمد" />
                        </footer>
                    </motion.div>
                </div>
            </section>
            </HideableSection>
            <HideableSection k="about.ourApproach"> 
            <section className="py-20 bg-neutral-50">
                <div className="container-pro">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-4xl font-extrabold text-neutral-900 mb-4">
                            <EditableText k="about.values.title" fallback="أسلوبي في العمل" />
                        </h2>
                        <p className="text-xl text-neutral-600">
                            <EditableText k="about.values.subtitle" fallback="المبادئ التي توجه ممارستي المهنية" />
                        </p>
                    </motion.div>

                    {/* 🔥 شبكة كروت ديناميكية مع اختيار أيقونة */}
                    <EditableValuesIcons k="about.values.items" />
                </div>
            </section>
            </HideableSection>

            <HideableSection k="about.qualifications"> 
            <section className="py-20 bg-neutral-50">
                <div className="container-pro">
                    <div className="grid lg:grid-cols-2 gap-12">
                  
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="flex items-center mb-8">
                                <Award className="w-8 h-8 text-primary ml-3" />
                                <h3 className="text-3xl font-extrabold text-neutral-900">
                                    <EditableText k="about.qualifications.title" fallback="المؤهلات والشهادات" />
                                </h3>
                            </div>

                            <EditableBulletList
                                kBase="about.qualifications"
                                fallbackItems={[
                                    "بكالوريوس الحقوق - جامعة الملك سعود (2012)",
                                    "ماجستير القانون التجاري - جامعة الملك عبدالعزيز (2015)",
                                    "عضو نقابة المحامين السعوديين",
                                    "شهادة التحكيم التجاري الدولي",
                                    "دبلوم القانون العقاري المتقدم",
                                ]}
                                iconClass="text-primary"
                            />
                        </motion.div>


                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="flex items-center mb-8">
                                <Shield className="w-8 h-8 text-accent-500 ml-3" />
                                <h3 className="text-3xl font-extrabold text-neutral-900">
                                    <EditableText k="about.awards.title" fallback="الجوائز والتكريم" />
                                </h3>
                            </div>

                            <EditableBulletList
                                kBase="about.awards"
                                fallbackItems={[
                                    "جائزة أفضل محامية شابة - نقابة المحامين (2019)",
                                    "تكريم للتميز في القضايا العقارية (2021)",
                                    "عضو لجنة تطوير القوانين التجارية",
                                    "محكم معتمد لدى المركز السعودي للتحكيم التجاري",
                                ]}
                                iconClass="text-accent-500"
                            />
                        </motion.div>

                 
                    </div>
                </div>
            </section>
            </HideableSection>
            {/* الدور داخل المكتب */}
            <HideableSection k="about.workinoffice"> 
            <section className="py-20 bg-neutral-50">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="rounded-3xl bg-white shadow-soft border border-neutral-200 p-10"
                    >
                        <h2 className="text-4xl font-extrabold text-primary-900 mb-8">
                            <EditableText k="about.role.title" fallback="داخل مكتب الأحمد والشركاه" />
                        </h2>

                        {/* ✅ هنا التحكم بالفقرات + زر البادج */}
                        <EditableParagraphsWithBadge
                            kBase="about.role"
                            fallbackBody="أعمل ضمن فريق متخصص من المحامين في مكتب الأحمد والشركاه، حيث أقود قسم القضايا المدنية والتجارية..."
                            fallbackBadgeText="شريك مؤسس - قسم القضايا المدنية والتجارية"
                        />
                    </motion.div>
                </div>
            </section>
            </HideableSection>
        </div>
    );
}
