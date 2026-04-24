import React from "react";

export const Input = ({ className = "", error, id, ...props }) => (
    <input
        id={id}
        className={`lw-input ${error ? "is-error" : ""} ${className}`}
        aria-invalid={error ? "true" : undefined}
        {...props}
    />
);

export const Textarea = ({ className = "", error, id, ...props }) => (
    <textarea
        id={id}
        className={`lw-input min-h-[100px] resize-y ${error ? "is-error" : ""} ${className}`}
        aria-invalid={error ? "true" : undefined}
        {...props}
    />
);

export const Select = ({ className = "", error, id, children, ...props }) => (
    <select
        id={id}
        className={`lw-input ${error ? "is-error" : ""} ${className}`}
        aria-invalid={error ? "true" : undefined}
        {...props}
    >
        {children}
    </select>
);

export default Input;
