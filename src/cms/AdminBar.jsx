import React from "react";
import { useContent } from "./ContentProvider";
import LogoutButton from "../auth/LogoutButton";

export function AdminBar() {
    const { isAdmin, editMode, setEditMode, locale, setLocale } = useContent();
    if (!isAdmin) return null;

    return (
        <div style={{
            position: "fixed", top: 12, right: 12, zIndex: 9999,
            background: "rgba(0,0,0,0.75)", color: "#fff",
            padding: "8px 12px", borderRadius: 10, display: "flex", gap: 8, alignItems: "center"
        }}>
            <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <input type="checkbox" checked={editMode} onChange={(e) => setEditMode(e.target.checked)} />
                Edit Mode
            </label>
            <select value={locale} onChange={(e) => setLocale(e.target.value)} style={{ background: "transparent", color: "#fff" }}>
                <option value="ar">ar</option>
                <option value="en">en</option>
            </select>
            <LogoutButton className="ml-2" />
        </div>
    );
}
