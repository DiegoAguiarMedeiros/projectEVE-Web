export const NUMBER_FORMAT_KEY = "eve-number-format";

export type NumberFormatStyle = "dot-comma" | "comma-dot";

export function getNumberFormatStyle(): NumberFormatStyle {
    return (localStorage.getItem(NUMBER_FORMAT_KEY) as NumberFormatStyle) || "dot-comma";
}

export function getNumberFormatLocale(): string {
    return getNumberFormatStyle() === "dot-comma" ? "pt-BR" : "en-US";
}

export function parseFormattedNumber(formatted: string, style: NumberFormatStyle): number {
    if (style === "dot-comma") {
        return parseFloat(formatted.replace(/\./g, "").replace(",", "."));
    }
    return parseFloat(formatted.replace(/,/g, ""));
}
