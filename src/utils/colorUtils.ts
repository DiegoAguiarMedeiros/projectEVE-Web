export function getContrastColor(hexColor: string): string {
    const r = parseInt(hexColor.substring(1, 3), 16);
    const g = parseInt(hexColor.substring(3, 5), 16);
    const b = parseInt(hexColor.substring(5, 7), 16);

    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;

    return yiq >= 128 ? "#1F2937" : "#FFFFFF";
}

export function adjustBrightness(hexColor: string, percent: number): string {
    const num = parseInt(hexColor.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);

    // Extrair RGB sem usar bitwise
    const r = Math.floor(num / 65536);
    const g = Math.floor((num % 65536) / 256);
    const b = num % 256;

    const R = Math.min(255, Math.max(0, r + amt));
    const G = Math.min(255, Math.max(0, g + amt));
    const B = Math.min(255, Math.max(0, b + amt));

    return `#${(
        0x1000000 +
        R * 0x10000 +
        G * 0x100 +
        B
    ).toString(16).slice(1)}`;
}

