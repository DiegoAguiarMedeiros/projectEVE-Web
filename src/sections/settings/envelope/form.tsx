import { Box, Button, InputAdornment, Slider, Typography } from "@mui/material";
import { CurrencyInput } from "src/components/CurrencyInput";
import { useEffect, useState } from "react";
import TransitionsModal from "src/sections/shared/transitionsModal";
import { Envelopes } from "src/types/Envelopes";
import { useUpdateEnvelopes } from "src/hooks/mutations/envelopes/useUpdateEnvelopes";
import SaveIcon from '@mui/icons-material/Save';
import { useTranslation } from "react-i18next";
import { IncomeStore } from "src/store/useIncomeStore";
import { fCurrency } from "src/utils/format-number";



type EnvelopeFormProps = {
    buttonIcon?: React.ReactNode;
    buttonLabel: string;
    data: Envelopes;
    open: boolean
    handleOpen: VoidFunction
    handleClose: VoidFunction
    allEnvelopes?: Envelopes[];
}

export function EnvelopeForm({ buttonLabel, buttonIcon, data, open, handleOpen, handleClose, allEnvelopes }: EnvelopeFormProps) {
    const { t } = useTranslation();

    const [color, setColor] = useState('#4ECDC4');
    const [percentage, setPercentage] = useState(0);
    const [valueInput, setValueInput] = useState('');

    const isDebts = data?.name === 'debts';

    const income = IncomeStore((state) => state.income);

    const usedByOthers = (allEnvelopes ?? [])
        .filter(e => e.id !== data?.id)
        .reduce((s, e) => s + e.percentage, 0);
    const maxPercentage = Math.max(0, 100 - usedByOthers);
    const availablePercentage = parseFloat(maxPercentage.toFixed(2));

    const computedValue = (percentage / 100) * income;

    useEffect(() => {
        if (data) {
            setColor(data.color);
            setPercentage(data.percentage);
            if (income > 0) {
                setValueInput(((data.percentage / 100) * income).toFixed(2));
            }
        }
    }, [data, income]);

    useEffect(() => {
        if (!open && data) {
            setColor(data.color);
            setPercentage(data.percentage);
            setValueInput(income > 0 ? ((data.percentage / 100) * income).toFixed(2) : '');
            setError(null);
        }
    }, [data, open, income]);

    const handleSliderChange = (_: Event, value: number | number[]) => {
        const newPercentage = value as number;
        setPercentage(newPercentage);
        if (income > 0) {
            setValueInput(((newPercentage / 100) * income).toFixed(2));
        }
    };

    const handleValueInputChange = (rawValue: string) => {
        setValueInput(rawValue);
        const parsed = parseFloat(rawValue);
        if (!Number.isNaN(parsed) && income > 0) {
            const newPercentage = Math.min(maxPercentage, Math.max(0, (parsed / income) * 100));
            setPercentage(newPercentage);
        }
    };

    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const updateMutation = useUpdateEnvelopes();

    const submitAction = async (envelopes: Envelopes) => {
        setIsPending(true);
        setError(null);

        try {
            if (data) {
                await updateMutation.mutateAsync({
                    id: data.id,
                    name: data.name,
                    color: envelopes.color,
                    percentage: envelopes.percentage,
                });
            }
            handleClose();
        } catch (err: any) {
            setError(err);
        } finally {
            setIsPending(false);
        }
    };

    const handleSubmit = async () => {
        await submitAction({
            id: data?.id,
            name: data?.name,
            color,
            percentage,
        });
    }

    return (

        <TransitionsModal
            open={open}
            handleClose={handleClose}
            handleOpen={handleOpen}
            okButton={<Button type="submit" variant="outlined" color="primary" onClick={handleSubmit} disabled={isPending || (!isDebts && parseFloat((percentage + usedByOthers).toFixed(2)) > 100)} startIcon={<SaveIcon sx={{ fontSize: 20 }} />}>{t('settings.envelope.save')}</Button>
            }>


            <Box
                gap={1.5}
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifySelf="center"
                sx={{ width: "100%" }}
            >

                <Typography variant="h3" noWrap>
                    {t(data?.name)}
                </Typography>

                {error && <p>{error.message}</p>}

                <Box sx={{ width: '100%', display: 'flex', px: 2, pb: 4, gap: 4 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Typography variant="subtitle2" sx={{ mb: 2 }}>{t('settings.envelope.color')}</Typography>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <input
                                type="color"
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                                style={{
                                    width: '60px',
                                    height: '40px',
                                    border: '2px solid #ccc',
                                    borderRadius: '8px',
                                    cursor: 'pointer'
                                }}
                            />
                            <Typography variant="body2" color="text.secondary">
                                {color.toUpperCase()}
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ flex: '1 0 0', display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="subtitle2">{t('settings.envelope.percentage', { count: parseFloat(percentage.toFixed(2)) })}</Typography>
                            {!isDebts && <Typography variant="caption" color="text.secondary">{availablePercentage}% disponível</Typography>}
                        </Box>
                        {income > 0 && !isDebts && (
                            <CurrencyInput
                                size="small"
                                value={valueInput}
                                onChange={handleValueInputChange}
                                label={t('settings.envelope.value_input')}
                                slotProps={{
                                    input: {
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <Typography variant="caption" color="text.secondary">
                                                    {t('settings.envelope.salary_value', { value: fCurrency(income) })}
                                                </Typography>
                                            </InputAdornment>
                                        ),
                                    },
                                }}
                            />
                        )}
                        {income > 0 && isDebts && (
                            <Typography variant="caption" color="text.secondary">
                                {t('settings.envelope.salary_value', { value: fCurrency(computedValue) })}
                            </Typography>
                        )}
                        <Slider
                            value={percentage}
                            onChange={handleSliderChange}
                            min={0}
                            max={isDebts ? 100 : maxPercentage}
                            step={0.01}
                            disabled={isDebts}
                            marks={[
                                { value: 0, label: '0%' },
                                ...(isDebts ? [
                                    { value: 25, label: '25%' },
                                    { value: 50, label: '50%' },
                                    { value: 75, label: '75%' },
                                    { value: 100, label: '100%' }
                                ] : [
                                    { value: maxPercentage, label: `${availablePercentage}%` }
                                ])
                            ]}
                            valueLabelDisplay="auto"
                            valueLabelFormat={(v) => `${parseFloat(v.toFixed(2))}%`}
                            sx={{
                                '& .MuiSlider-thumb': {
                                    bgcolor: color,
                                },
                                '& .MuiSlider-track': {
                                    bgcolor: color,
                                },
                                '& .MuiSlider-rail': {
                                    opacity: 0.3,
                                }
                            }}
                        />
                    </Box>
                </Box>


            </Box >
        </TransitionsModal>
    );
}
