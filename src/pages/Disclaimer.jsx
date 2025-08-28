// src/pages/Disclaimer.jsx
import React from "react";
import PolicyLayout from "../components/PolicyLayout";
import EditableText from "../cms/Editable/EditableText";

export default function Disclaimer() {
    // تاريخ ميلادي بالعربي
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
                    k="policy.disclaimer.title"
                    fallback="إخلاء المسؤولية"
                    as="span"
                />
            }
            updatedNode={
                <EditableText
                    k="policy.disclaimer.updated"
                    fallback={`تم آخر تحديث لهذه الصفحة بتاريخ ${todayAR}`}
                    as="span"
                />
            }
        >
            {/* فقرة 1 */}
            <EditableText
                k="policy.disclaimer.p1"
                as="p"
                fallback="جميع المعلومات الواردة في هذا الموقع لأغراض عامة وتعريفية فقط، ولا تُعد استشارة قانونية مخصّصة لحالتكم."
            />

            {/* فقرة 2 */}
            <EditableText
                k="policy.disclaimer.p2"
                as="p"
                fallback="استخدامكم للموقع أو التواصل معنا عبر النماذج لا ينشئ علاقة محامٍ–عميل إلا بعد اتفاقية مكتوبة. يُنصح دائمًا باستشارة متخصصة قبل اتخاذ أي إجراء قانوني."
            />
        </PolicyLayout>
    );
}
