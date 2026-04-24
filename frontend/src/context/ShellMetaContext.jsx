import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

const defaultValue = {
    primaryAction: null,
    setPrimaryAction: () => {},
};

const ShellMetaContext = createContext(defaultValue);

export function ShellMetaProvider({ children }) {
    const [primaryAction, setPrimaryActionState] = useState(null);
    const location = useLocation();

    useEffect(() => {
        setPrimaryActionState(null);
    }, [location.pathname]);

    const setPrimaryAction = useCallback((node) => {
        setPrimaryActionState(() => node);
    }, []);

    const value = useMemo(
        () => ({ primaryAction, setPrimaryAction }),
        [primaryAction, setPrimaryAction]
    );

    return <ShellMetaContext.Provider value={value}>{children}</ShellMetaContext.Provider>;
}

export function useShellMeta() {
    return useContext(ShellMetaContext);
}
