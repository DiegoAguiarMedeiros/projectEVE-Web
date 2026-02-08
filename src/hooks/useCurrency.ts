import { useState, useEffect, useCallback } from "react";
import { CURRENCY_STORAGE_KEY, currencies, getCurrencyConfig, type CurrencyCode, type CurrencyConfig } from "src/utils/currency";

export function useCurrency() {
    const [config, setConfig] = useState<CurrencyConfig>(getCurrencyConfig);

    useEffect(() => {
        const handleStorage = (e: StorageEvent) => {
            if (e.key === CURRENCY_STORAGE_KEY) {
                setConfig(getCurrencyConfig());
            }
        };
        window.addEventListener("storage", handleStorage);
        return () => window.removeEventListener("storage", handleStorage);
    }, []);

    const setCurrency = useCallback((code: CurrencyCode) => {
        const found = currencies.find((c) => c.code === code) || currencies[0];
        localStorage.setItem(CURRENCY_STORAGE_KEY, code);
        setConfig(found);
    }, []);

    return { ...config, setCurrency, currencies };
}
