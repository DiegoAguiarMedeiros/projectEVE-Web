import * as React from "react";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";


type ChipProps = {
    label: string;
    labels: string[] ;
    fieldName: string;
    click: VoidFunction;
    nonMatchColor?: "warning" | "error";
}
export default function Chips({ label, labels, fieldName, click, nonMatchColor = "warning" }: ChipProps) {
    const theme = useTheme();
      const { t } = useTranslation();
    const handleClick = () => {
        click();
    };
    const isMatch = label === t(fieldName);
    return (
        <Stack direction="row" spacing={1}>
            <Chip
                sx={{ backgroundColor: isMatch ? theme.palette.success.main : theme.palette[nonMatchColor].main, color: "white" }}
                label={isMatch ? labels[0] : labels[1]}
                onClick={handleClick}
            />
        </Stack>
    );
}
