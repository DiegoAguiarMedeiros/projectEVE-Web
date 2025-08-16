import type { CardProps } from "@mui/material/Card";
import type { ColorType } from "src/theme/core/palette";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import { useTheme } from "@mui/material/styles";

import { fNumberToCurrency, fShortenNumber } from "src/utils/format-number";

import { SvgColor } from "src/components/svg-color";

// ----------------------------------------------------------------------

type Props = CardProps & {
  title: string;
  total: number;
  percent: number;
  color?: string;
  icon: React.ReactNode;
  activeCard: boolean
};

export function EnvelopeSwiperBody({
  icon,
  title,
  total,
  percent,
  color = "primary",
  activeCard,
  sx,
  ...other
}: Props) {
  const theme = useTheme();
  return (
    <Card
      sx={{
        p: 3,
        position: "relative",
        color: activeCard ? 'var(--layout-nav-item-active-color)' : 'var(--layout-nav-item-color)',
        backgroundColor: activeCard ? 'var(--layout-nav-item-active-bg)' : theme.palette.background.paper,
        ...sx,
      }}
      {...other}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "flex-start",
        }}
      >
        <Box sx={{ width: 48, height: 48, mb: 3 }}>{icon} </Box>
        <Box sx={{ mb: 1, typography: "h5" }}>{title}</Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-end",
          justifyContent: "flex-end",
        }}
      >
        <Box sx={{ flexGrow: 1, minWidth: 112 }}>
          <Box sx={{ typography: "h5", textAlign: "left" }}>{fNumberToCurrency(total)}</Box>
        </Box>
      </Box>

      <SvgColor
        src="/assets/background/shape-square.svg"
        sx={{
          top: 0,
          right: 20,
          width: 420,
          zIndex: -1,
          height: 320,
          opacity: 0.5,
          position: "absolute",
          backgroundColor: `${color}`,
        }}
      />
    </Card>
  );
}
