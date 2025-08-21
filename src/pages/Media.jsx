import { motion } from "framer-motion";
import { Calendar, Clock, Eye, FileText, Mic, Play, ArrowRight } from "lucide-react";
import { useState } from "react";

export default function Media() {
    const [activeFilter, setActiveFilter] = useState("all");

    const mediaItems = [
        {
            id: 1,
            type: "article",
            title: "التطورات الجديدة في قانون الشركات السعودي 2024",
            excerpt: "تحليل شامل للتعديلات الجديدة على نظام الشركات وتأثيرها على القطاع الخاص...",
            date: "2024-01-15",
            readTime: "8 دقائق",
            image: "article",
            category: "قانون تجاري",
        },
        {
            id: 2,
            type: "video",
            title: "حقوق المستأجر في النظام السعودي - برنامج القانون والحياة",
            excerpt: "مقابلة تلفزيونية مع قناة الإخبارية حول التطورات في قانون الإيجار...",
            date: "2024-01-10",
            duration: "25 دقيقة",
            image: "video",
            category: "قانون عقاري",
        },
        {
            id: 3,
            type: "podcast",
            title: "بودكاست: الذكاء الاصطناعي والقانون - التحديات والفرص",
            excerpt: "حلقة نقاشية حول تأثير التقنيات الحديثة على الممارسة القانونية...",
            date: "2024-01-05",
            duration: "45 دقيقة",
            image: "podcast",
            category: "تقنية قانونية",
        },
        {
            id: 4,
            type: "interview",
            title: "تصريح صحفي: نتائج دراسة النزاعات العقارية في السعودية",
            excerpt: "تصريح لصحيفة الاقتصادية حول ارتفاع النزاعات العقارية وحلولها...",
            date: "2024-01-03",
            readTime: "5 دقائق",
            image: "interview",
            category: "قانون عقاري",
        },
        {
            id: 5,
            type: "article",
            title: "دليل المحامي للتحكيم الإلكتروني في عصر الرقمنة",
            excerpt: "مقال متخصص حول آليات التحكيم الإلكتروني وأفضل الممارسات...",
            date: "2023-12-20",
            readTime: "12 دقيقة",
            image: "article",
            category: "تحكيم",
        },
        {
            id: 6,
            type: "video",
            title: "ورشة عمل: إدارة المخاطر القانونية للشركات الناشئة",
            excerpt: "ورشة تدريبية شاملة حول الحماية القانونية للشركات الناشئة...",
            date: "2023-12-15",
            duration: "2 ساعة",
            image: "workshop",
            category: "قانون تجاري",
        },
    ];

    const filters = [
        { id: "all", label: "الكل", count: mediaItems.length },
        { id: "article", label: "مقالات", count: mediaItems.filter((i) => i.type === "article").length },
        { id: "video", label: "فيديو", count: mediaItems.filter((i) => i.type === "video").length },
        { id: "podcast", label: "بودكاست", count: mediaItems.filter((i) => i.type === "podcast").length },
        { id: "interview", label: "تصريحات", count: mediaItems.filter((i) => i.type === "interview").length },
    ];

    const filteredItems = activeFilter === "all" ? mediaItems : mediaItems.filter((i) => i.type === activeFilter);

    const getTypeIcon = (type) => {
        const icons = { article: FileText, video: Play, podcast: Mic, interview: Mic };
        return icons[type] || FileText;
    };

    const getTypeLabel = (type) => {
        const labels = { article: "مقال", video: "فيديو", podcast: "بودكاست", interview: "تصريح" };
        return labels[type] || type;
    };

    const formatDate = (dateString) =>
        new Date(dateString).toLocaleDateString("ar-SA", { year: "numeric", month: "long", day: "numeric" });

    return (
        <div dir="rtl" className="pt-20">
            {/* Hero */}
            <section className="py-20 bg-gradient-to-br from-neutral-50 to-white">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                        <h1 className="text-5xl font-extrabold text-neutral-900 mb-6">
                            الإعلام والنشر
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-500">
                                القانوني
                            </span>
                        </h1>
                        <p className="text-xl text-neutral-600">
                            مقالات متخصصة، مقابلات إعلامية، ومحتوى قانوني يساهم في نشر الوعي القانوني
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Filters */}
            <section className="py-8 bg-white/50">
                <div className="container-pro">
                    <div className="flex flex-wrap justify-center gap-3">
                        {filters.map((f) => {
                            const active = activeFilter === f.id;
                            return (
                                <motion.button
                                    key={f.id}
                                    onClick={() => setActiveFilter(f.id)}
                                    className={`flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold transition
                  ${active ? "bg-gradient-to-r from-primary to-accent-500 text-white shadow-sm"
                                            : "bg-white text-neutral-600 border border-primary/10 hover:border-primary/30 hover:text-primary"}`}
                                    whileHover={{ scale: 1.04 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {f.label}
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${active ? "bg-white/20" : "bg-primary/10 text-neutral-700"}`}>
                                        {f.count}
                                    </span>
                                </motion.button>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Media Grid */}
            <section className="py-20">
                <div className="container-pro">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredItems.map((item, index) => {
                            const TypeIcon = getTypeIcon(item.type);
                            const headerGradient = index % 2 === 0 ? "from-primary to-accent-500" : "from-accent-500 to-primary";
                            return (
                                <motion.article
                                    key={item.id}
                                    className="bg-white rounded-2xl shadow-soft hover:shadow-md transition-all duration-300 overflow-hidden border border-primary/10 group"
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.08 }}
                                    whileHover={{ y: -6 }}
                                >
                                    {/* Thumbnail */}
                                    <div className={`relative h-48 bg-gradient-to-br ${headerGradient}`}>
                                        <div className="absolute inset-0 grid place-items-center">
                                            <TypeIcon className="w-12 h-12 text-white/80" />
                                        </div>
                                        <div className="absolute top-4 left-4">
                                            <span className="px-3 py-1 rounded-full bg-white/90 text-primary text-xs font-semibold">
                                                {getTypeLabel(item.type)}
                                            </span>
                                        </div>
                                        {item.duration && (
                                            <div className="absolute top-4 right-4">
                                                <span className="px-2 py-1 rounded bg-black/70 text-white text-xs inline-flex items-center">
                                                    <Clock className="w-3 h-3 ml-1" />
                                                    {item.duration}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-xs text-primary bg-primary/5 px-3 py-1 rounded-full">{item.category}</span>
                                            <span className="flex items-center text-xs text-neutral-500">
                                                <Calendar className="w-3 h-3 ml-1" />
                                                {formatDate(item.date)}
                                            </span>
                                        </div>

                                        <h3 className="text-lg font-extrabold text-neutral-900 mb-2 leading-tight group-hover:text-primary transition">
                                            {item.title}
                                        </h3>

                                        <p className="text-neutral-600 text-sm mb-4 leading-relaxed">{item.excerpt}</p>

                                        <div className="flex items-center justify-between">
                                            <button className="inline-flex items-center gap-1 text-primary hover:text-accent-600 font-semibold text-sm transition">
                                                {item.type === "video" ? "مشاهدة" : item.type === "podcast" ? "استماع" : "قراءة المزيد"}
                                                <ArrowRight className="w-4 h-4" />
                                            </button>

                                            {item.readTime && (
                                                <span className="flex items-center text-xs text-neutral-500">
                                                    <Eye className="w-3 h-3 ml-1" />
                                                    {item.readTime}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </motion.article>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Newsletter */}
            <section className="py-20 bg-gradient-to-r from-neutral-900 to-slate-800">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
                        <h2 className="text-4xl font-extrabold text-white mb-6">ابق على اطلاع بآخر المستجدات القانونية</h2>
                        <p className="text-xl text-neutral-300 mb-8">
                            احصل على التحديثات القانونية والمقالات المتخصصة مباشرة في بريدك الإلكتروني
                        </p>
                        <form
                            onSubmit={(e) => e.preventDefault()}
                            className="mx-auto flex max-w-md gap-3"
                            aria-label="نموذج الاشتراك في النشرة البريدية"
                        >
                            <input
                                type="email"
                                placeholder="بريدك الإلكتروني"
                                className="flex-1 rounded-full bg-white/10 border border-white/20 px-4 py-3 text-right text-white placeholder-white/60 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-primary/30"
                                required
                            />
                            <button
                                type="submit"
                                className="rounded-full px-6 py-3 font-semibold text-white bg-gradient-to-r from-primary to-accent-500 shadow-sm hover:shadow-md transition"
                            >
                                اشترك
                            </button>
                        </form>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
