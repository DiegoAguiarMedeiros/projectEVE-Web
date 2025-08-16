import { LinearProgress, linearProgressClasses, Typography } from "@mui/material";
import type { BoxProps } from "@mui/material/Box";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";

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
  sublabels?: string[];
  icons?: React.ReactNode[];
};

interface ProgressWithLabelProps {
  value: number;          // 0–100
  label?: string;         // ex: "75%"
  color?: string;         // pode ser cor ou gradient CSS
}

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 15,
  borderRadius: 10,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[200],
    ...theme.applyStyles("dark", { backgroundColor: theme.palette.grey[800] }),
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 10,
    background: "linear-gradient(90deg,#19d3a2,#0ea5e9)", // fallback
  },
}));

export function ProgressWithLabel({ value, label, color }: ProgressWithLabelProps) {
  const safe = Math.max(0, Math.min(100, value));

  return (
    <Box position="relative" width="100%">
      <BorderLinearProgress
        variant="determinate"
        value={safe}
        sx={{
          [`& .${linearProgressClasses.bar}`]: {
            background: color || "linear-gradient(90deg,#19d3a2,#0ea5e9)",
          },
        }}
      />

      {/* Contêiner do label com largura igual ao fill */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          width: `${safe}%`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none", // não bloquear cliques
        }}
      >
        <Typography
          variant="caption"
          sx={{ color: "common.white", fontWeight: 700, textShadow: "0 1px 2px rgba(0,0,0,.35)" }}
        >
          {label ?? `${safe}%`}
        </Typography>
      </Box>
    </Box>
  );
}

export function ChartLegends({
  icons,
  values,
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
              <Typography variant="caption">{series}</Typography>
              <Typography variant="caption">{sublabels && sublabels[index]}</Typography>
            </Box>
            <ProgressWithLabel value={50} color={colors[index]} label="50%" />
          </StyledLegend>

          {values && <Box sx={{ typography: "h6" }}>{values[index]}</Box>}
        </Stack>
      ))}
    </Box>
  );
}
