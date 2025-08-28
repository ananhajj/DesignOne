// src/pages/TermsOfUse.jsx
import React from "react";
import PolicyLayout from "../components/PolicyLayout";
import EditableText from "../cms/Editable/EditableText";

export default function TermsOfUse() {
    // تاريخ ميلادي بالعربي (تقويم Gregorian)
    const todayAR = new Date().toLocaleDateString("ar-EG", {
        year: "numeric",
        month: "long",
        day: "numeric",
        calendar: "gregory",
    });

    return (
        <PolicyLayout
            // مرّر العنوان كسطر قابل للتعديل
            titleNode={
                <EditableText
                    k="policy.terms.title"
                    fallback="شروط الاستخدام"
                    as="span"
                />
            }
            // سطر آخر تحديث قابل للتعديل
            updatedNode={
                <EditableText
                    k="policy.terms.updated"
                    fallback={`تم آخر تحديث لهذه الصفحة بتاريخ ${todayAR}`}
                    as="span"
                />
            }
        >
            {/* الفقرات قابلة للتعديل */}
            <EditableText
                k="policy.terms.p1"
                as="p"
                fallback='باستخدامكم لموقع "مكتب الأحمد والشركاه" فإنكم توافقون على تصفح محتوياته واستخدام النماذج المتاحة فيه بشكل قانوني ومشروع.'
            />

            <EditableText
                k="policy.terms.p2"
                as="p"
                fallback="جميع المعلومات المنشورة هنا لأغراض تعريفية ولا تُعتبر استشارة قانونية إلا إذا تم التواصل المباشر والاتفاق على ذلك معنا."
            />

            <p>
                <EditableText
                    k="policy.terms.p3.prefix"
                    as="span"
                    fallback="لأي استفسار يمكنكم مراسلتنا على: "
                />
                <a
                    className="text-primary-700 underline"
                    href="mailto:sara@alahmedlaw.com"
                >
                    <EditableText
                        k="policy.terms.email"
                        as="span"
                        fallback="sara@alahmedlaw.com"
                    />
                </a>
            </p>
        </PolicyLayout>
    );
}
