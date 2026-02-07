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
}
export default function Chips({ label, labels, fieldName, click }: ChipProps) {
    const theme = useTheme();
      const { t } = useTranslation();
    const handleClick = () => {
        click();
    };
    return (
        <Stack direction="row" spacing={1}>
            <Chip
                sx={{ backgroundColor: label === t(fieldName) ? theme.palette.success.main : theme.palette.warning.main, color: "white" }}
                label={label === t(fieldName) ? labels[0] : labels[1]}
                onClick={handleClick}
            />
        </Stack>
    );
}
