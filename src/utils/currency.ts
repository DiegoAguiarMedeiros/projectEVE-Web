export const CURRENCY_STORAGE_KEY = "eve-currency";

export type CurrencyCode = "BRL" | "USD" | "EUR";

export type CurrencyConfig = {
    code: CurrencyCode;
    symbol: string;
    locale: string;
    label: string;
};

export const currencies: CurrencyConfig[] = [
    { code: "BRL", symbol: "R$", locale: "pt-BR", label: "Real Brasileiro" },
    { code: "USD", symbol: "$", locale: "en-US", label: "US Dollar" },
    { code: "EUR", symbol: "\u20AC", locale: "de-DE", label: "Euro" },
];

export function getCurrencyConfig(): CurrencyConfig {
    const saved = localStorage.getItem(CURRENCY_STORAGE_KEY) as CurrencyCode | null;
    return currencies.find((c) => c.code === saved) || currencies[0];
}
