import type { CardProps } from "@mui/material/Card";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import { useTheme } from "@mui/material/styles";

import { fNumberToCurrency, fShortenNumber } from "src/utils/format-number";

import { varAlpha, bgGradient } from "src/theme/styles";

import { SvgColor } from "src/components/svg-color";
import { Grid2, Typography } from "@mui/material";
import { AnalyticsEnvelopesMonthOverview } from "src/types/Graph";
import { iconsMap } from "src/components/icon/iconsMap";

import { useTranslation } from "react-i18next";

// ----------------------------------------------------------------------

type Props = CardProps & {
  analyticsEnvelopesMonthOverview: AnalyticsEnvelopesMonthOverview[] | undefined
};

export function AnalyticsEnvelopesMonthOverviewCards({
  analyticsEnvelopesMonthOverview,
  sx,
  ...other
}: Props) {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Grid2 container spacing={2} sx={{ width: "100%" }}>
      {analyticsEnvelopesMonthOverview && analyticsEnvelopesMonthOverview.map((envelope, index) => {

        const IconComponent = iconsMap[envelope.icon];

        return (
          <Grid2
            key={`envelope_${index}`}
            size={{ xs: 6, sm: 6, md: 3 }}
          >
            <Card
              sx={{
                p: 3,
                position: "relative",
                backgroundColor: theme.palette.background.paper,
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
                <Box sx={{ width: 48, height: 24, mb: 3 }}>
                  <Typography color={envelope.color} variant="h5">
                    {IconComponent && <IconComponent style={{ color: envelope.color, marginRight: 8 }} />}
                  </Typography>
                </Box>
                <Box sx={{ mb: 1, }}>
                  <Typography color={envelope.color} variant="h5">
                    {t(envelope.title)}
                  </Typography>
                </Box>
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
                  <Box sx={{ textAlign: "left", }} color={envelope.color}>
                    <Typography color={envelope.color} variant="h5">
                      {fNumberToCurrency(envelope.total)}
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
                  position: "absolute",
                  color: `${envelope.color}`,
                }}
              />
            </Card>

          </Grid2>
        )
      })}
    </Grid2>
  );
}
