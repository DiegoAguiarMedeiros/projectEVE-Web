import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import { Chip } from '@mui/material';


type BadgeProps = {
    text: string;
    bgColor: string;
}
export default function Badges({ text, bgColor }: BadgeProps) {
    const theme = useTheme();

    return (
        <Chip sx={{
            width: '200px',
            backgroundColor: bgColor,
            color: 'white',
        }} label={text} />
    );
}
