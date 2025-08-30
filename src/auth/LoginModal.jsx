// src/components/LoginModal.jsx
import React, { useState } from "react";
import { useAuth } from "../auth/AuthProvider";

export default function LoginModal({ open, onClose }) {
    const { signIn } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState("");

    if (!open) return null;

    const submit = async (e) => {
        e.preventDefault();
        setErr("");
        const { error } = await signIn(email, password);
        if (error) setErr(error.message);
        else onClose?.(); // ContentProvider سيحوّل editMode = true تلقائيًا
    };

    return (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/50">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Admin Login</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">✕</button>
                </div>

                <form onSubmit={submit} className="space-y-3">
                    <input
                        type="email"
                        required
                        className="w-full rounded-lg border px-3 py-2"
                        placeholder="admin@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        required
                        className="w-full rounded-lg border px-3 py-2"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {err && <p className="text-sm text-red-600">{err}</p>}
                    <button type="submit" className="w-full rounded-lg bg-[#7c533a] px-4 py-2 text-white">
                        تسجيل الدخول
                    </button>
                </form>
            </div>
        </div>
    );
}
