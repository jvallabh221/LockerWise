import React, { useEffect, useRef, useId } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

const maxW = {
    sm: "max-w-md",
    md: "max-w-[560px]",
    lg: "max-w-[720px]",
    xl: "max-w-[900px]",
};

/**
 * Modal — §7.10
 * Backdrop, focus trap, Esc, scroll lock, role="dialog".
 */
export const Modal = ({
    open,
    onClose,
    title,
    children,
    footer,
    size = "md",
    className = "",
}) => {
    const panelRef = useRef(null);
    const titleId = useId();
    const prevOverflow = useRef("");

    useEffect(() => {
        if (!open) return;
        prevOverflow.current = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prevOverflow.current;
        };
    }, [open]);

    useEffect(() => {
        if (!open) return;
        const node = panelRef.current;
        if (!node) return;

        const focusables = node.querySelectorAll(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        const list = Array.from(focusables);
        const first = list[0];
        const last = list[list.length - 1];
        const t = window.setTimeout(() => first?.focus(), 0);

        const onKey = (e) => {
            if (e.key === "Escape") {
                e.stopPropagation();
                onClose?.();
                return;
            }
            if (e.key !== "Tab" || list.length === 0) return;
            if (e.shiftKey) {
                if (document.activeElement === first) {
                    e.preventDefault();
                    last?.focus();
                }
            } else if (document.activeElement === last) {
                e.preventDefault();
                first?.focus();
            }
        };
        document.addEventListener("keydown", onKey);
        return () => {
            window.clearTimeout(t);
            document.removeEventListener("keydown", onKey);
        };
    }, [open, onClose]);

    if (!open) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6"
            role="presentation"
        >
            <button
                type="button"
                className="absolute inset-0 bg-[rgba(11,29,63,0.45)] backdrop-blur-[4px]"
                aria-label="Close dialog"
                onClick={onClose}
            />
            <div
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby={title ? titleId : undefined}
                className={`relative flex max-h-[min(90vh,800px)] w-full flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-xl ${maxW[size] || maxW.md} ${className}`}
            >
                {title ? (
                    <header className="flex shrink-0 items-start justify-between gap-4 border-b border-[var(--border)] px-6 py-4">
                        <h2
                            id={titleId}
                            className="font-display text-[22px] font-medium leading-7 tracking-tight text-[var(--text)]"
                        >
                            {title}
                        </h2>
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-md p-1.5 text-[var(--text-3)] transition-colors hover:bg-[var(--bg)] hover:text-[var(--text)] focus-visible:outline-none focus-visible:shadow-[0_0_0_3px_rgba(14,165,233,0.15)]"
                            aria-label="Close"
                        >
                            <X className="h-5 w-5" strokeWidth={1.75} />
                        </button>
                    </header>
                ) : null}
                <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">{children}</div>
                {footer ? (
                    <footer className="flex shrink-0 flex-wrap items-center justify-end gap-3 border-t border-[var(--border)] px-6 py-4">
                        {footer}
                    </footer>
                ) : null}
            </div>
        </div>,
        document.body
    );
};

export default Modal;
