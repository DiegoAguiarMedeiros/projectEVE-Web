import * as React from 'react';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';


type ChipProps = {
    label: string;
    click: VoidFunction;
}
export default function Chips({ label, click }: ChipProps) {
    const theme = useTheme();
    const handleClick = () => {
        click();
    };

    return (
        <Stack direction="row" spacing={1}>
            <Chip
                sx={{ backgroundColor: label === 'Completed' ? theme.palette.success.main : theme.palette.warning.main, color: 'white' }}
                label={label === 'Completed' ? 'Pago' : 'Pendente'}
                onClick={handleClick}
            />
        </Stack>
    );
}
