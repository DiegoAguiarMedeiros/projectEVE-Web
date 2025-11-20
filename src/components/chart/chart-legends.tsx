import { LinearProgress, linearProgressClasses, Typography } from "@mui/material";
import type { BoxProps } from "@mui/material/Box";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import useTheme from "src/hooks/useTheme";
import { fNumberToPercentage } from "src/utils/format-number";

// ----------------------------------------------------------------------

export const StyledLegend = styled(Box)(({ theme }) => ({
  alignItems: "center",
  display: "flex",
  flexDirection: 'column',
  justifyContent: "flex-start",
  fontSize: theme.typography.pxToRem(13),
  fontWeight: theme.typography.fontWeightMedium
}));

export const StyledDot = styled(Box)(() => ({
  width: 12,
  height: 12,
  flexShrink: 0,
  display: "flex",
  borderRadius: "50%",
  position: "relative",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "currentColor",
}));

// ----------------------------------------------------------------------

type Props = BoxProps & {
  labels?: string[];
  colors?: string[];
  values?: string[];
  subValues?: number[];
  sublabels?: string[];
  icons?: React.ReactNode[];
};

interface ProgressWithLabelProps {
  value: number;
  color?: string;
}


export function ProgressWithLabel({ value, color }: ProgressWithLabelProps) {
  const safe = Math.max(0, Math.min(100, value));
  const { mode } = useTheme();
  return (
    <Box position="relative" width="100%">
      <LinearProgress
        variant="determinate"
        value={safe}
        sx={{
          height: 15,
          borderRadius: 10,
          backgroundColor: theme => theme.palette.linearProgress.primaryBg,
          [`& .${linearProgressClasses.bar}`]: {
            background: color,
            borderRadius: 10,
          },
        }}
      />


      <Box
        sx={{
          position: "absolute",
          inset: 0,
          width: `${safe}%`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        <Typography
          variant="caption"
          sx={{ color: "common.white", fontWeight: 700 }}
        >
          {Number(value) > 10 ? `${safe}%` : <></>}
        </Typography>
      </Box>
    </Box>
  );
}

export function ChartLegends({
  icons,
  values,
  subValues,
  sublabels,
  labels = [],
  colors = [],
  ...other
}: Props) {
  return (
    <Box {...other}>
      {labels?.map((series, index) => (
        <Stack key={series} spacing={1}>
          <StyledLegend>

            <Box component="span" sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
              {icons?.length ? icons?.[0] : null}
              <Typography variant="caption" color={colors[index]}>{series}</Typography>
              <Typography variant="caption" color={colors[index]}>{sublabels && sublabels[index]}</Typography>
            </Box>
            {subValues && <ProgressWithLabel value={subValues[index]} color={colors[index]} />}
          </StyledLegend>

          {values && <Box sx={{ typography: "h6" }}>{values[index]}</Box>}
        </Stack>
      ))}
    </Box>
  );
}
