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
import { SelectedMonthYearStore } from "src/store/useSelectedMonthYearStore";



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

    const { month, year, setMonth, setYear } = SelectedMonthYearStore();
    const [selectedMonth, setSelectedMonth] = useState(month);
    const [selectedYear, setSelectedYear] = useState(year);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const minYear = years[0] ? years[0] : year;
    const maxYear = years[years.length - 1];

    console.log("data", data)
    console.log("years", years)

    const minMonth = years.length > 0 ? Math.min(...data[minYear]) : month;
    const maxMonth =  years.length > 0 ? Math.max(...data[maxYear]) : year;

    const isNextButtonDisabled = useCallback((): boolean => {
        if (maxMonth === 12 && selectedYear === maxYear && selectedMonth === maxMonth) return false;
        if (maxMonth === 12 && selectedYear === maxYear + 1 && selectedMonth === 1) return true;
        if (maxMonth < 12 && selectedYear === maxYear && selectedMonth === maxMonth + 1) return true;
        if (selectedYear === maxYear && selectedMonth === maxMonth) return false;
        return false;
    }, [selectedMonth, selectedYear, maxMonth, maxYear]);

    if (years.length === 0) {
        return (<Button variant="contained" color="primary" disabled>{month}/{year}</Button>)
    }


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
        const newYear = Number(event.target.value)
        if (newYear === maxYear) {
            setMonth(maxMonth as Month)
            setSelectedMonth(maxMonth as Month);
        }
        if (newYear === minYear) {
            setMonth(minMonth as Month)
            setSelectedMonth(minMonth as Month);
        }
        setYear(newYear);
        setSelectedYear(newYear);
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
            <Box display="flex" alignItems="center" gap={1}>
                {!(selectedMonth === minMonth && selectedYear === minYear) ? (
                    <IconButton onClick={handlePrevMonth}>
                        <ArrowBack />
                    </IconButton>
                ) : (
                    <Box width={40} />
                )}

                <Button variant="contained" color="primary" onClick={handleOpen}>
                    {months[selectedMonth - 1]}/{selectedYear}
                </Button>

                {!isNextButtonDisabled() ? (
                    <IconButton onClick={handleNextMonth}>
                        <ArrowForward />
                    </IconButton>
                ) : (
                    <Box width={40} />
                )}
            </Box>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                }} >
                <Box display="flex" flexDirection="column" sx={{ backgroundColor: theme.palette.background.neutral, borderRadius: '8px' }}>
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
