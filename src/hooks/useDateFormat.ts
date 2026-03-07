import { useState, useEffect, useCallback } from "react";
import { DATE_FORMAT_STORAGE_KEY, dateFormats, getDateFormatConfig, type DateFormatCode, type DateFormatConfig } from "src/utils/date-format";
import dayjs, { type Dayjs } from "dayjs";

export function useDateFormat() {
    const [config, setConfig] = useState<DateFormatConfig>(getDateFormatConfig);

    useEffect(() => {
        const handleStorage = (e: StorageEvent) => {
            if (e.key === DATE_FORMAT_STORAGE_KEY) {
                setConfig(getDateFormatConfig());
            }
        };
        window.addEventListener("storage", handleStorage);
        return () => window.removeEventListener("storage", handleStorage);
    }, []);

    const setDateFormat = useCallback((code: DateFormatCode) => {
        const found = dateFormats.find((f) => f.code === code) || dateFormats[0];
        localStorage.setItem(DATE_FORMAT_STORAGE_KEY, code);
        setConfig(found);
    }, []);

    const formatDate = useCallback((date: string | Date | Dayjs | null) => {
        return dayjs(date).format(config.code);
    }, [config.code]);

    return { ...config, setDateFormat, dateFormats, formatDate };
}
