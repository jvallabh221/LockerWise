import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export const THEME_STORAGE_KEY = "lw-theme";

const ThemeContext = createContext(null);

function readStoredPreference() {
    try {
        const v = localStorage.getItem(THEME_STORAGE_KEY);
        if (v === "light" || v === "dark" || v === "system") return v;
    } catch {
        /* ignore */
    }
    return "system";
}

function systemPrefersDark() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

/** @param {'light' | 'dark'} effective */
function applyDomTheme(effective) {
    document.documentElement.setAttribute("data-theme", effective);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
        meta.setAttribute("content", effective === "dark" ? "#080E1D" : "#0B1D3F");
    }
}

function effectiveFromPreference(pref) {
    if (pref === "system") return systemPrefersDark() ? "dark" : "light";
    return pref;
}

export function ThemeProvider({ children }) {
    const [preference, setPreferenceState] = useState(() => readStoredPreference());

    const [effective, setEffective] = useState(() =>
        typeof window !== "undefined" ? effectiveFromPreference(readStoredPreference()) : "light"
    );

    const setPreference = useCallback((next) => {
        if (next !== "light" && next !== "dark" && next !== "system") return;
        try {
            localStorage.setItem(THEME_STORAGE_KEY, next);
        } catch {
            /* ignore */
        }
        setPreferenceState(next);
        const eff = effectiveFromPreference(next);
        setEffective(eff);
        applyDomTheme(eff);
    }, []);

    useEffect(() => {
        const eff = effectiveFromPreference(preference);
        setEffective(eff);
        applyDomTheme(eff);
    }, [preference]);

    useEffect(() => {
        if (preference !== "system") return;
        const mq = window.matchMedia("(prefers-color-scheme: dark)");
        const onChange = () => {
            const eff = systemPrefersDark() ? "dark" : "light";
            setEffective(eff);
            applyDomTheme(eff);
        };
        mq.addEventListener("change", onChange);
        return () => mq.removeEventListener("change", onChange);
    }, [preference]);

    useEffect(() => {
        const onStorage = (e) => {
            if (e.key !== THEME_STORAGE_KEY || e.storageArea !== localStorage) return;
            const raw = e.newValue;
            const next = raw === "light" || raw === "dark" || raw === "system" ? raw : "system";
            setPreferenceState(next);
            const eff = effectiveFromPreference(next);
            setEffective(eff);
            applyDomTheme(eff);
        };
        window.addEventListener("storage", onStorage);
        return () => window.removeEventListener("storage", onStorage);
    }, []);

    const value = useMemo(
        () => ({ preference, effective, setPreference }),
        [preference, effective, setPreference]
    );

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx) {
        throw new Error("useTheme must be used within ThemeProvider");
    }
    return ctx;
}

export default ThemeProvider;
