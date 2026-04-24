import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { X, User } from "lucide-react";
import Wordmark from "./ui/Wordmark";

const iconCls = "h-4 w-4 shrink-0";
const itemBase =
    "relative flex items-center gap-3 rounded-md py-[9px] px-2.5 text-[15px] leading-none font-medium transition-colors duration-1 ease-lw xl:gap-3";
const itemIdle =
    "text-[var(--text-3)] hover:bg-[var(--bg)] hover:text-[var(--text)]";
const itemActive =
    "bg-[var(--brand-100)] font-medium text-[var(--brand-700)] dark:text-brass-400";

/**
 * Admin / staff sidebar — §6
 * ≥1280 (xl): fixed 240px, labels + section groups
 * 1024–1279 (lg): icon-only 72px rail
 * <1024: off-canvas drawer
 */
const Sidebar = ({ sections = [], role, mobileOpen = false, onClose, loginDetails }) => {
    const location = useLocation();

    useEffect(() => {
        if (mobileOpen && onClose) onClose();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname]);

    useEffect(() => {
        if (!mobileOpen) return;
        const onKey = (e) => {
            if (e.key === "Escape" && onClose) onClose();
        };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [mobileOpen, onClose]);

    const isActive = (path) =>
        location.pathname === path || (path !== "/" && location.pathname.startsWith(path));

    const initials = (loginDetails?.name || "")
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase();

    /** @param {{ variant: 'desktop' | 'drawer' }} p */
    const NavGroups = ({ variant }) => (
        <div className="flex flex-col gap-6">
            {sections.map((section) => (
                <div key={section.label}>
                    <div
                        className={
                            variant === "drawer"
                                ? "mb-2 px-2.5 font-mono text-[11px] uppercase tracking-wide text-[var(--text-3)]"
                                : "mb-2 hidden px-2.5 font-mono text-[11px] uppercase tracking-wide text-[var(--text-3)] xl:block"
                        }
                    >
                        {section.label}
                    </div>
                    <nav className="flex flex-col gap-0.5">
                        {section.items.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.path);
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    title={item.title}
                                    onClick={onClose}
                                    className={`${itemBase} ${active ? itemActive : itemIdle} ${
                                        variant === "desktop" ? "lg:justify-center xl:justify-start" : ""
                                    }`}
                                >
                                    <Icon
                                        className={iconCls}
                                        strokeWidth={1.75}
                                        aria-hidden
                                    />
                                    <span
                                        className={
                                            variant === "drawer"
                                                ? "truncate"
                                                : "hidden truncate xl:inline"
                                        }
                                    >
                                        {item.title}
                                    </span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            ))}
        </div>
    );

    const ProfileBlock = ({ drawer }) => (
        <div
            className={`mt-auto border-t border-[var(--border)] ${drawer ? "p-5" : "p-5 pt-4"}`}
        >
            <Link
                to="/account_page"
                onClick={onClose}
                className={`flex items-center gap-3 rounded-md py-2 transition-colors duration-1 ease-lw hover:bg-[var(--bg)] ${drawer ? "" : "lg:justify-center xl:justify-start px-1"}`}
            >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink-900 text-xs font-semibold text-white">
                    {initials || <User className="h-4 w-4" />}
                </div>
                <div className={`min-w-0 flex-1 ${drawer ? "" : "hidden xl:block"}`}>
                    <div className="truncate text-sm font-medium text-[var(--text)]">
                        {loginDetails?.name || "Account"}
                    </div>
                    <div className="font-mono text-[0.65rem] uppercase tracking-wider text-[var(--text-3)]">
                        {loginDetails?.role || ""}
                    </div>
                </div>
            </Link>
        </div>
    );

    const topbarH = "var(--topbar-h)";

    return (
        <>
            {/* Desktop: lg–xl icon rail 72px; xl+ full 240px */}
            <aside
                className="fixed left-0 z-40 hidden h-[calc(100vh-var(--topbar-h))] flex-col border-r border-[var(--border)] bg-[var(--surface)] lg:flex lg:w-[72px] xl:w-60"
                style={{ top: topbarH }}
                aria-label="Main navigation"
            >
                <div className="border-b border-[var(--border)] px-5 py-5">
                    <Link
                        to="/dashboard"
                        className="text-[var(--text)] transition-opacity hover:opacity-90"
                        title="LockerWise home"
                    >
                        <span className="flex justify-center xl:justify-start">
                            <Wordmark
                                size="sm"
                                className="lg:[&>span:last-child]:hidden xl:[&>span:last-child]:inline"
                            />
                        </span>
                    </Link>
                </div>
                <div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden px-3 pb-3 pt-4">
                    <NavGroups variant="desktop" />
                </div>
                {loginDetails ? <ProfileBlock drawer={false} /> : null}
            </aside>

            {/* Mobile / tablet drawer */}
            <div
                onClick={onClose}
                role="presentation"
                className={`fixed inset-0 z-40 bg-[var(--brand-900)]/40 backdrop-blur-sm transition-opacity duration-2 ease-lw lg:hidden ${mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
                style={{ top: topbarH }}
            />
            <aside
                className={`fixed left-0 z-50 flex w-[min(280px,100vw-3rem)] max-w-[280px] flex-col border-r border-[var(--border)] bg-[var(--surface)] shadow-pop transition-transform duration-2 ease-lw lg:hidden ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
                style={{ top: topbarH, height: `calc(100vh - ${topbarH})` }}
                aria-hidden={!mobileOpen}
                aria-label={role ? `${role} menu` : "Menu"}
            >
                <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
                    <Link to="/dashboard" onClick={onClose} className="text-[var(--text)]">
                        <Wordmark size="sm" />
                    </Link>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close menu"
                        className="rounded-md p-2 text-[var(--text-3)] transition-colors hover:bg-[var(--bg)] hover:text-[var(--text)]"
                    >
                        <X className="h-4 w-4" strokeWidth={1.75} />
                    </button>
                </div>
                <div className="flex flex-1 flex-col overflow-y-auto px-3 py-4">
                    <NavGroups variant="drawer" />
                </div>
                {loginDetails ? <ProfileBlock drawer /> : null}
            </aside>
        </>
    );
};

export default Sidebar;
