import type { CardProps } from '@mui/material/Card';
import type { ColorType } from 'src/theme/core/palette';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { useTheme } from '@mui/material/styles';

import { fShortenNumber } from 'src/utils/format-number';

import { varAlpha, bgGradient } from 'src/theme/styles';

import { SvgColor } from 'src/components/svg-color';
import { Typography } from '@mui/material';

// ----------------------------------------------------------------------

type Props = CardProps & {
  title: string;
  total: number;
  percent: number;
  color?: string;
  icon: React.ReactNode;
};

export function AnalyticsWidgetSummary({
  icon,
  title,
  total,
  percent,
  color = 'primary',
  sx,
  ...other
}: Props) {
  const theme = useTheme();
  console.log('color', color);
  return (
    <Card
      sx={{
        p: 3,
        position: 'relative',
        backgroundColor: theme.palette.background.paper,
        ...sx,
      }}
      {...other}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
        }}
      >
        <Box sx={{ width: 48, height: 48, mb: 3 }}>
          <Typography color={color} variant="h5">
            {icon}
          </Typography>
        </Box>
        <Box sx={{ mb: 1, }}>
          <Typography color={color} variant="h5">
            {title}
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-end',
          justifyContent: 'flex-end',
        }}
      >
        <Box sx={{ flexGrow: 1, minWidth: 112 }}>
          <Box sx={{  textAlign: 'left', }} color={color}>
            <Typography color={color} variant="h5">
              R$ {fShortenNumber(total)}
            </Typography>
          </Box>
        </Box>
      </Box>

      <SvgColor
        src="/assets/background/shape-square.svg"
        sx={{
          top: 0,
          left: -20,
          width: 320,
          zIndex: -1,
          height: 320,
          opacity: 0.09,
          position: 'absolute',
          color: `${color}`,
        }}
      />
    </Card>
  );
}
