import React, { useCallback, useState } from "react";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
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
import { useDeleteProcessedIncomesByMonth } from "src/hooks/mutations/processed-incomes/useDeleteProcessedIncomesByMonth";

import { useTranslation } from "react-i18next";

interface MonthYearPickerButtonProps {
    data: ProcessedIncomesMonthResponse;
}
export const MonthYearPickerButton: React.FC<MonthYearPickerButtonProps> = ({ data }) => {
    const { t } = useTranslation();

    const months = [
        t('months.january'), t('months.february'), t('months.march'), t('months.april'),
        t('months.may'), t('months.june'), t('months.july'), t('months.august'),
        t('months.september'), t('months.october'), t('months.november'), t('months.december'),
    ];

    const processedYears = Object.keys(data).map(Number).sort((a, b) => a - b);
    const theme = useTheme();

    const { month, year, setMonth, setYear } = SelectedMonthYearStore();
    const [selectedMonth, setSelectedMonth] = useState(month);
    const [selectedYear, setSelectedYear] = useState(year);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const deleteByMonthMutation = useDeleteProcessedIncomesByMonth();

    const currentYear = new Date().getFullYear();
    const yearRangeStart = processedYears.length > 0 ? processedYears[0] : year;
    const yearRangeEnd = processedYears.length > 0
        ? Math.max(processedYears[processedYears.length - 1] + 1, currentYear)
        : year;
    const allYears = Array.from({ length: yearRangeEnd - yearRangeStart + 1 }, (_, i) => yearRangeStart + i);

    const isMonthProcessed = useCallback((y: number, m: number): boolean => {
        return (data[y] || []).includes(m as Month);
    }, [data]);

    const isSelectedMonthProcessed = isMonthProcessed(selectedYear, selectedMonth);

    const isPrevDisabled = selectedYear === yearRangeStart && selectedMonth === 1;
    const isNextDisabled = selectedYear === yearRangeEnd && selectedMonth === 12;

    if (processedYears.length === 0) {
        return (<Button variant="contained" color="primary" disabled>{months[month - 1]}/{year}</Button>)
    }

    const handleClose = () => setAnchorEl(null);

    const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMonthSelect = (monthSelected: Month) => {
        setMonth(monthSelected);
        setSelectedMonth(monthSelected);
        handleClose();
    };

    const handleYearChange = (event: any) => {
        const newYear = Number(event.target.value);
        setYear(newYear);
        setSelectedYear(newYear);
    };

    const handlePrevMonth = () => {
        if (selectedMonth === 1) {
            setMonth(12);
            setSelectedMonth(12);
            setYear(selectedYear - 1);
            setSelectedYear(selectedYear - 1);
        } else {
            const newMonth = (selectedMonth - 1) as Month;
            setMonth(newMonth);
            setSelectedMonth(newMonth);
        }
    };

    const handleNextMonth = () => {
        if (selectedMonth === 12) {
            setMonth(1);
            setSelectedMonth(1);
            setYear(selectedYear + 1);
            setSelectedYear(selectedYear + 1);
        } else {
            const newMonth = (selectedMonth + 1) as Month;
            setMonth(newMonth);
            setSelectedMonth(newMonth);
        }
    };

    return (
        <Box display="flex" alignItems="center" gap={1} >
            <Box display="flex" alignItems="center" gap={1}>
                {!isPrevDisabled ? (
                    <IconButton onClick={handlePrevMonth}>
                        <ArrowBack />
                    </IconButton>
                ) : (
                    <Box width={40} />
                )}

                <Button variant="contained" color="primary" onClick={handleOpen}>
                    {months[selectedMonth - 1]}/{selectedYear}
                </Button>

                {!isNextDisabled ? (
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
                            <InputLabel id="year-select-label">{t('common.year')}</InputLabel>
                            <Select
                                labelId="year-select-label"
                                id="year-select"
                                label={t('common.year')}
                                value={selectedYear}
                                onChange={handleYearChange}
                                sx={{ mb: 2 }}
                                size="small"
                            >
                                {allYears.map((y) => (
                                    <SelectItem key={y} value={y}>
                                        {y}
                                    </SelectItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={1}>
                            {months.map((m, i) => {
                                const processed = isMonthProcessed(selectedYear, i + 1);
                                const isSelected = i + 1 === selectedMonth;
                                return (
                                    <MenuItem
                                        key={m}
                                        selected={isSelected}
                                        onClick={() => handleMonthSelect(i + 1 as Month)}
                                        sx={{
                                            border: processed
                                                ? `1px solid var(--layout-nav-item-active-color)`
                                                : '1px solid var(--layout-nav-item-hover-bg)',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            borderRadius: 0.75,
                                            opacity: processed ? 1 : 0.55,
                                        }}
                                    >
                                        <Typography
                                            variant="body2"
                                            color={
                                                isSelected
                                                    ? 'var(--layout-nav-item-active-color)'
                                                    : processed
                                                        ? 'var(--layout-nav-item-color)'
                                                        : 'text.secondary'
                                            }
                                        >
                                            {m}
                                        </Typography>
                                    </MenuItem>
                                );
                            })}
                        </Box>
                    </Box>

                    <Divider />
                    <Box p={2}>
                        <Button
                            fullWidth
                            variant="outlined"
                            color="error"
                            size="small"
                            disabled={!isSelectedMonthProcessed}
                            onClick={() => setConfirmOpen(true)}
                        >
                            {t('overview.delete_month.button')} {months[selectedMonth - 1]}/{selectedYear}
                        </Button>
                    </Box>
                </Box>
            </Menu>

            <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
                <DialogTitle>{t('overview.delete_month.confirm_title')}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {t('overview.delete_month.confirm_message', { month: selectedMonth, year: selectedYear })}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmOpen(false)}>
                        {t('overview.delete_month.cancel')}
                    </Button>
                    <Button
                        color="error"
                        variant="contained"
                        disabled={deleteByMonthMutation.isPending}
                        onClick={() => {
                            deleteByMonthMutation.mutate(
                                { year: selectedYear, month: selectedMonth },
                                { onSuccess: () => { setConfirmOpen(false); handleClose(); } }
                            );
                        }}
                    >
                        {t('overview.delete_month.confirm')}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
