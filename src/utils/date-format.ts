export const DATE_FORMAT_STORAGE_KEY = "eve-date-format";

export type DateFormatCode = "DD/MM/YYYY" | "MM/DD/YYYY";

export type DateFormatConfig = {
    code: DateFormatCode;
    label: string;
    example: string;
};

export const dateFormats: DateFormatConfig[] = [
    { code: "DD/MM/YYYY", label: "profile.date_format.dd_mm_yyyy", example: "31/12/2025" },
    { code: "MM/DD/YYYY", label: "profile.date_format.mm_dd_yyyy", example: "12/31/2025" },
];

export function getDateFormatConfig(): DateFormatConfig {
    const saved = localStorage.getItem(DATE_FORMAT_STORAGE_KEY) as DateFormatCode | null;
    return dateFormats.find((f) => f.code === saved) || dateFormats[0];
}
