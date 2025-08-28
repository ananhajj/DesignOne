import React from "react";

export default function PolicyLayout({
    titleNode,              // JSX (مثلاً <EditableText .../>)
    updatedNode,            // JSX (مثلاً <EditableText .../>)
    children,
}) {
    return (
        <section dir="rtl" className="py-20 bg-neutral-50">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="rounded-3xl bg-white border border-neutral-200 shadow-soft p-8 lg:p-10">
                    <h1 className="text-3xl lg:text-4xl font-extrabold text-primary-900 mb-4">
                        {titleNode}
                    </h1>
                    <p className="text-neutral-600">
                        {updatedNode}
                    </p>
                </div>

                {/* Content */}
                <article className="mt-8 rounded-3xl bg-white border border-neutral-200 shadow-soft p-8 lg:p-10 prose prose-neutral max-w-none">
                    {children}
                </article>
            </div>
        </section>
    );
}
