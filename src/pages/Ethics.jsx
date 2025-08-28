// src/pages/Ethics.jsx
import React from "react";
import PolicyLayout from "../components/PolicyLayout";
import EditableText from "../cms/Editable/EditableText";

export default function Ethics() {
    // تاريخ ميلادي بالعربي (تقويم Gregorian)
    const todayAR = new Date().toLocaleDateString("ar-EG", {
        year: "numeric",
        month: "long",
        day: "numeric",
        calendar: "gregory",
    });

    return (
        <PolicyLayout
            // العنوان قابل للتعديل
            titleNode={
                <EditableText
                    k="policy.ethics.title"
                    fallback="أخلاقيات المهنة"
                    as="span"
                />
            }
            // سطر آخر تحديث قابل للتعديل
            updatedNode={
                <EditableText
                    k="policy.ethics.updated"
                    fallback={`تم آخر تحديث لهذه الصفحة بتاريخ ${todayAR}`}
                    as="span"
                />
            }
        >
            {/* الفقرة 1 */}
            <EditableText
                k="policy.ethics.p1"
                as="p"
                fallback='نلتزم في "مكتب الأحمد والشركاه" بأعلى معايير السرية والنزاهة في التعامل مع عملائنا، ونحرص على توضيح الإجراءات والرسوم بكل شفافية.'
            />

            {/* الفقرة 2 */}
            <EditableText
                k="policy.ethics.p2"
                as="p"
                fallback="كما نلتزم بتجنّب تضارب المصالح، وباتباع الأنظمة واللوائح المهنية المعمول بها، مع الاستمرار في تطوير خبراتنا القانونية لضمان تقديم خدمة عالية الجودة."
            />
        </PolicyLayout>
    );
}
