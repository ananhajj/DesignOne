import React, { useMemo, useState, useEffect, useRef } from "react";
import { ArrowDown, ArrowUp, CheckCircle, Loader2, Plus, Save, Trash2, XCircle } from "lucide-react";
import { useContent } from "../ContentProvider";

function uid() { return Math.random().toString(36).slice(2, 9); }
function asArray(x) { return Array.isArray(x) ? x : []; }

function autoResize(el) {
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
}

export default function EditableParagraphsWithBadge({
    kBase = "about.role",
    // مفاتيح التخزين (تحافظ على التوافق):
    keyParagraphs = "paragraphs",   // Array<string>
    keyBody = "body",               // string قديم (fallback)
    keyBadgeText = "badge",         // string
    keyBadgeVisible = "badgeVisible", // boolean
    // الفولباكات:
    fallbackBody = "",
    fallbackBadgeText = "",
    defaultBadgeVisible = true,
    // تنسيقات العرض:
    paragraphClass = "text-xl text-neutral-600 leading-relaxed mb-6",
    badgeClass = "inline-block px-6 py-3 rounded-full bg-gradient-to-r from-primary to-accent-500 text-white font-semibold shadow-md",
}) {
    const { get, set, editMode, isAdmin } = useContent();
    const canEdit = editMode && isAdmin;

    // اقرأ المخزّن
    const storedParagraphs = get(`${kBase}.${keyParagraphs}`, null);
    const storedBody = get(`${kBase}.${keyBody}`, fallbackBody);
    const storedBadgeText = get(`${kBase}.${keyBadgeText}`, fallbackBadgeText);
    const storedBadgeVisible = get(`${kBase}.${keyBadgeVisible}`, defaultBadgeVisible);

    // جهّز القيم الأولية مع الحفاظ على التوافق:
    const initialParas = useMemo(() => {
        if (Array.isArray(storedParagraphs)) return storedParagraphs;
        const body = (storedBody || "").trim();
        if (body) {
            // نحاول تقسيم على فواصل الأسطر المزدوجة كفقرات
            const parts = body.split(/\n\s*\n/).map(s => s.trim()).filter(Boolean);
            return parts.length ? parts : [body];
        }
        return [];
    }, [storedParagraphs, storedBody]);

    const [items, setItems] = useState(initialParas.map((t) => ({ id: uid(), text: t })));
    const [badgeText, setBadgeText] = useState(storedBadgeText || "");
    const [badgeVisible, setBadgeVisible] = useState(Boolean(storedBadgeVisible));
    const [saveStatus, setSaveStatus] = useState(null);

    useEffect(() => {
        // لو تغيرت الداتا من الـ CMS (مثلاً بعد حفظ خارجي)
        const freshParas = Array.isArray(storedParagraphs) ? storedParagraphs
            : ((storedBody || "").trim() ? (storedBody || "").split(/\n\s*\n/).map(s => s.trim()).filter(Boolean) : []);
        setItems(asArray(freshParas).map((t) => ({ id: uid(), text: t })));
        setBadgeText(storedBadgeText || "");
        setBadgeVisible(Boolean(storedBadgeVisible));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [storedParagraphs, storedBody, storedBadgeText, storedBadgeVisible]);

    // أزرار الإدارة
    const addPara = () => setItems(prev => [...prev, { id: uid(), text: "" }]);
    const delPara = (id) => setItems(prev => prev.filter(x => x.id !== id));
    const movePara = (i, d) => {
        const j = i + d; if (j < 0 || j >= items.length) return;
        const arr = [...items];[arr[i], arr[j]] = [arr[j], arr[i]]; setItems(arr);
    };
    const updatePara = (id, text) => setItems(prev => prev.map(x => x.id === id ? ({ ...x, text }) : x));

    const saveAll = async () => {
        try {
            setSaveStatus("loading");
            const cleanParas = items.map(x => (x.text || "").trim()).filter(Boolean);

            // نخزّن الشكل الجديد (paragraphs) + نحدّث body (توافق للخلف) كنص موحّد بفواصل أسطر مزدوجة
            const promises = [
                set(`${kBase}.${keyParagraphs}`, cleanParas),
                set(`${kBase}.${keyBody}`, cleanParas.join("\n\n")),
                set(`${kBase}.${keyBadgeText}`, (badgeText || "").trim()),
                set(`${kBase}.${keyBadgeVisible}`, Boolean(badgeVisible)),
            ];

            const results = await Promise.all(promises);
            const hasError = results.some(res => res?.error);
            setSaveStatus(hasError ? "error" : "success");
            if (!hasError) setTimeout(() => setSaveStatus(null), 2000);
        } catch {
            setSaveStatus("error");
        }
    };

    // عرض الزوّار
    if (!canEdit) {
        const clean = items.map(x => x.text).filter(Boolean);
        return (
            <>
                {clean.length === 0 ? null : clean.map((p, i) => (
                    <p key={i} className={paragraphClass}>{p}</p>
                ))}
                {badgeVisible && (badgeText || "").trim() ? (
                    <div className={badgeClass}>{badgeText}</div>
                ) : null}
            </>
        );
    }

    // وضع التحرير (أدمن)
    return (
        <div className="space-y-4">
            {/* شريط تحكم */}
            <div className="flex flex-wrap items-center gap-2">
                <button
                    onClick={addPara}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary/90 text-white px-3 py-1.5 text-xs"
                    type="button"
                >
                    <Plus className="w-4 h-4" /> إضافة فقرة
                </button>

                <div className="inline-flex items-center gap-2 rounded-lg bg-neutral-100 px-3 py-1.5 text-xs">
                    <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            className="accent-primary"
                            checked={badgeVisible}
                            onChange={(e) => setBadgeVisible(e.target.checked)}
                        />
                        إظهار البادج
                    </label>
                    <input
                        type="text"
                        value={badgeText}
                        onChange={(e) => setBadgeText(e.target.value)}
                        placeholder="نص البادج…"
                        className="border rounded px-2 py-1 text-xs w-64"
                    />
                </div>

                <button
                    onClick={saveAll}
                    className="inline-flex items-center gap-2 rounded-lg bg-neutral-800 text-white px-3 py-1.5 text-xs"
                    type="button"
                >
                    {saveStatus === "loading" && <Loader2 className="w-4 h-4 animate-spin" />}
                    {saveStatus === "success" && <CheckCircle className="w-4 h-4 text-green-400" />}
                    {saveStatus === "error" && <XCircle className="w-4 h-4 text-red-400" />}
                    <Save className="w-4 h-4" /> حفظ الكل
                </button>
            </div>

            {/* الفقرات */}
            <div className="space-y-3">
                {items.map((p, idx) => (
                    <div key={p.id} className="rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-neutral-500">#{idx + 1}</span>
                            <div className="flex items-center gap-1">
                                <button onClick={() => movePara(idx, -1)} className="p-1.5 rounded hover:bg-neutral-100" title="أعلى"><ArrowUp className="w-4 h-4" /></button>
                                <button onClick={() => movePara(idx, 1)} className="p-1.5 rounded hover:bg-neutral-100" title="أسفل"><ArrowDown className="w-4 h-4" /></button>
                                <button onClick={() => delPara(p.id)} className="p-1.5 rounded hover:bg-red-50 text-red-600" title="حذف"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        </div>

                        <TextareaAuto
                            value={p.text}
                            onChange={(v) => updatePara(p.id, v)}
                            placeholder="اكتب فقرة…"
                        />
                    </div>
                ))}
                {items.length === 0 && (
                    <div className="rounded-lg border border-dashed border-neutral-300 p-4 text-center text-sm text-neutral-500">
                        لا توجد فقرات بعد — أضف أول فقرة.
                    </div>
                )}
            </div>
        </div>
    );
}

/* Textarea مع أوتو-ريسايز */
function TextareaAuto({ value, onChange, placeholder }) {
    const ref = useRef(null);
    useEffect(() => { if (ref.current) autoResize(ref.current); }, []);
    return (
        <textarea
            ref={ref}
            dir="rtl"
            className="w-full border rounded-lg px-3 py-2 text-sm leading-7 focus:outline-none focus:ring-2 focus:ring-primary/30"
            value={value}
            onChange={(e) => { onChange(e.target.value); autoResize(ref.current); }}
            placeholder={placeholder}
            rows={2}
        />
    );
}
