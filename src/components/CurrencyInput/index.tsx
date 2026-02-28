import { InputAdornment, TextField } from "@mui/material";
import type { TextFieldProps } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import { useCurrency } from "src/hooks/useCurrency";
import { useNumberFormat } from "src/hooks/useNumberFormat";
import type { NumberFormatStyle } from "src/utils/numberFormat";

type CurrencyInputProps = Omit<TextFieldProps, "value" | "onChange" | "type"> & {
    value: string;
    onChange: (rawValue: string) => void;
};

function digitsFromValue(value: string): string {
    const num = parseFloat(value || "0");
    if (Number.isNaN(num) || num === 0) return "";
    return Math.round(num * 100).toString();
}

function formatDigits(digits: string, style: NumberFormatStyle): string {
    if (!digits) return "";
    const padded = digits.padStart(3, "0");
    const cents = padded.slice(-2);
    const intStr = padded.slice(0, -2).replace(/^0+/, "") || "0";
    const grouped = intStr.replace(/\B(?=(\d{3})+(?!\d))/g, style === "dot-comma" ? "." : ",");
    const decSep = style === "dot-comma" ? "," : ".";
    return `${grouped}${decSep}${cents}`;
}

function valueFromDigits(digits: string): string {
    if (!digits) return "";
    return (parseInt(digits, 10) / 100).toFixed(2);
}

export function CurrencyInput({ value, onChange, onBlur, slotProps, ...props }: CurrencyInputProps) {

    const { symbol } = useCurrency();
    const { style } = useNumberFormat();
    const [digits, setDigits] = useState(() => digitsFromValue(value));
    const isFocused = useRef(false);

    useEffect(() => {
        if (!isFocused.current) {
            setDigits(digitsFromValue(value));
        }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDigits = e.target.value.replace(/\D/g, "");
        setDigits(newDigits);
        onChange(valueFromDigits(newDigits));
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        isFocused.current = false;
        (onBlur as React.FocusEventHandler<HTMLInputElement> | undefined)?.(e);
    };

    return (
        <TextField
            {...props}
            type="text"
            slotProps={{
                ...slotProps,
                input: {
                    startAdornment: <InputAdornment position="start">{symbol}</InputAdornment>,
                },
                htmlInput: {
                    ...(slotProps?.htmlInput as object),
                    inputMode: "decimal" as const,
                },
            }}
            value={formatDigits(digits, style)}
            onChange={handleChange}
            onFocus={() => { isFocused.current = true; }}
            onBlur={handleBlur}
        />
    );
}
