import React, { useCallback, useEffect, useState } from "react";
import {
    Box,
    Button,
    Menu,
    MenuItem,
    IconButton,
    Select,
    MenuItem as SelectItem,
    Typography,
    FormControl,
    InputLabel,
    useTheme,
} from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { Month, ProcessedIncomesMonthResponse } from "src/types/ProcessedIncomes";
import { useSelectedMonthYearStore } from "src/store/useSelectedMonthYearStore";



const months = [
    "Janeiro", "Fevereiro", "Março", "Abril",
    "Maio", "Junho", "Julho", "Agosto",
    "Setembro", "Outubro", "Novembro", "Dezembro",
];


interface MonthYearPickerButtonProps {
    data: ProcessedIncomesMonthResponse;
}
export const MonthYearPickerButton: React.FC<MonthYearPickerButtonProps> = ({ data }) => {

    const years = Object.keys(data).map(Number).sort((a, b) => a - b);
    const theme = useTheme();

    const { month, year, setMonth, setYear } = useSelectedMonthYearStore();
    const [selectedMonth, setSelectedMonth] = useState(month);
    const [selectedYear, setSelectedYear] = useState(year);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    if (years.length === 0) {
        return (<Button variant="contained" color="primary" disabled>{month}/{year}</Button>)
    }

    const minYear = years[0];
    const maxYear = years[years.length - 1];

    const minMonth = Math.min(...data[minYear]);
    const maxMonth = Math.max(...data[maxYear]);

    const getYearsAvailable = (): number[] => (Object.keys(data).map(Number))


    const handleClose = () => setAnchorEl(null);

    const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMonthSelect = (monthSelected: Month) => {
        setMonth(monthSelected)
        setSelectedMonth(monthSelected);
        handleClose();

    };

    const handleYearChange = (event: any) => {
        setYear(Number(event.target.value));
        setSelectedYear(Number(event.target.value));
    };

    const handlePrevMonth = () => {
        if (selectedMonth === 1) {
            setMonth(12)
            setSelectedMonth(12);
            setYear(year - 1);
            setSelectedYear((prev) => prev - 1);
        } else {
            setMonth(month - 1 as Month)
            setSelectedMonth((prev) => prev - 1 as Month);
        }

    };

    const handleNextMonth = () => {
        if (selectedMonth === 12) {
            setMonth(1)
            setSelectedMonth(1);
            setYear(year + 1);
            setSelectedYear((prev) => prev + 1);
        } else {
            setMonth(month + 1 as Month)
            setSelectedMonth((prev) => prev + 1 as Month);
        }

    };
    const getTextColor = (isAvailable: boolean, monthSelected: boolean): string => {
        if (isAvailable) {
            if (monthSelected) return "var(--layout-nav-item-active-color)"
            return "var(--layout-nav-item-color)"
        }
        return "text.disabled"
    };

    return (
        <Box display="flex" alignItems="center" gap={1} >
            <IconButton onClick={handlePrevMonth} disabled={selectedMonth === minMonth && selectedYear === minYear}>
                <ArrowBack />
            </IconButton>

            <Button variant="contained" color="primary" onClick={handleOpen}>
                {months[selectedMonth - 1]}/{selectedYear}
            </Button>

            <IconButton onClick={handleNextMonth} disabled={selectedMonth === maxMonth && selectedYear === maxYear}>
                <ArrowForward />
            </IconButton>

            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose} >
                <Box display="flex" flexDirection="column" sx={{ backgroundColor: theme.palette.background.neutral, borderRadius: '8px', margin: -1 }}>
                    <Box display="flex" flexDirection="column" p={2} >
                        <FormControl fullWidth>
                            <InputLabel id="year-select-label">Ano</InputLabel>
                            <Select
                                labelId="year-select-label"
                                id="year-select"
                                label="Ano"
                                value={selectedYear}
                                onChange={handleYearChange}
                                sx={{ mb: 2 }}
                                size="small"
                            >
                                {getYearsAvailable().map((y) => (
                                    <SelectItem key={y} value={y}>
                                        {y}
                                    </SelectItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={1}>
                            {months.map((m, i) => {
                                const availableMonths = data[selectedYear] || [];
                                const isAvailable = availableMonths.includes(i + 1 as Month);
                                return (
                                    <MenuItem
                                        key={m}
                                        selected={i + 1 === selectedMonth}
                                        onClick={() => isAvailable && handleMonthSelect(i + 1 as Month)}
                                        disabled={!isAvailable}
                                        sx={{
                                            border: '1px solid var(--layout-nav-item-hover-bg)',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            borderRadius: 0.75,
                                        }}
                                    >
                                        <Typography variant="body2" color={getTextColor(isAvailable, i + 1 === selectedMonth)}>
                                            {m}
                                        </Typography>
                                    </MenuItem>
                                );
                            })}
                        </Box>
                    </Box>
                </Box>
            </Menu>
        </Box>
    );
};
