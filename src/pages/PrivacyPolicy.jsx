import React from "react";
import PolicyLayout from "../components/PolicyLayout";
import EditableText from "../cms/Editable/EditableText";

export default function PrivacyPolicy() {
    const todayAR = new Date().toLocaleDateString("ar-EG", {
        year: "numeric",
        month: "long",
        day: "numeric",
        calendar: "gregory",
    });

    return (
        <PolicyLayout
            titleNode={
                <EditableText
                    k="policy.privacy.title"
                    fallback="سياسة الخصوصية"
                    as="span"
                />
            }
            updatedNode={
                <EditableText
                    k="policy.privacy.updated"
                    fallback={`تم آخر تحديث لهذه الصفحة بتاريخ ${todayAR}`}
                    as="span"
                />
            }
        >
            {/* فقرة 1 */}
            <EditableText
                k="policy.privacy.p1"
                as="p"
                fallback='نحن في "مكتب الأحمد والشركاه" نلتزم باحترام خصوصيتكم. أي بيانات تقدمونها عبر الموقع (مثل الاسم أو البريد أو الهاتف عند التواصل معنا) نستخدمها فقط لغرض الرد على استفساراتكم أو حجز المواعيد.'
            />

            {/* فقرة 2 */}
            <EditableText
                k="policy.privacy.p2"
                as="p"
                fallback="لا نقوم بمشاركة بياناتكم مع أي طرف آخر إلا في حدود ما يتطلبه تقديم الخدمة."
            />

            {/* فقرة 3 مع إيميل قابل للتعديل كنص ورابط */}
            <p>
                <EditableText
                    k="policy.privacy.p3.prefix"
                    as="span"
                    fallback="إذا كان لديكم أي سؤال حول خصوصيتكم يمكنكم مراسلتنا على: "
                />
                <a
                    className="text-primary-700 underline"
                    href={
                        // لو بدك تخلي href نفسه قابل للتعديل، استعمل EditableText منفصل لمجرد href واحصل قيمته من الـ CMS
                        // لكن EditableText بيرجع نص للعرض فقط. فالأبسط الآن خليه ثابت mailto:
                        "mailto:sara@alahmedlaw.com"
                    }
                >
                    <EditableText
                        k="policy.privacy.email"
                        as="span"
                        fallback="sara@alahmedlaw.com"
                    />
                </a>
            </p>

            {/* (اختياري) عناوين فرعية وأقسام إضافية */}
            <h2 className="!mt-10">
                <EditableText
                    k="policy.privacy.section1.title"
                    as="span"
                    fallback="كيف نستخدم بياناتكم"
                />
            </h2>
            <EditableText
                k="policy.privacy.section1.body"
                as="p"
                fallback="نستخدم البيانات لتقديم الخدمة وتحسين تجربة الاستخدام والالتزام بالمتطلبات النظامية."
            />
        </PolicyLayout>
    );
}
