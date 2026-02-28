import { useState, useEffect, useCallback } from "react";
import {
    NUMBER_FORMAT_KEY,
    type NumberFormatStyle,
    getNumberFormatStyle,
    parseFormattedNumber,
} from "src/utils/numberFormat";

export function useNumberFormat() {
    const [style, setStyleState] = useState<NumberFormatStyle>(getNumberFormatStyle);

    useEffect(() => {
        const handleStorage = (e: StorageEvent) => {
            if (e.key === NUMBER_FORMAT_KEY) {
                setStyleState(getNumberFormatStyle());
            }
        };
        window.addEventListener("storage", handleStorage);
        return () => window.removeEventListener("storage", handleStorage);
    }, []);

    const setStyle = useCallback((newStyle: NumberFormatStyle) => {
        localStorage.setItem(NUMBER_FORMAT_KEY, newStyle);
        setStyleState(newStyle);
    }, []);

    const formatNumber = useCallback(
        (value: number, decimals = 2): string => {
            const locale = style === "dot-comma" ? "pt-BR" : "en-US";
            return new Intl.NumberFormat(locale, {
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals,
            }).format(value);
        },
        [style]
    );

    const parseNumber = useCallback(
        (formatted: string): number => parseFormattedNumber(formatted, style),
        [style]
    );

    return { style, setStyle, formatNumber, parseNumber };
}
