import type { CardProps } from "@mui/material/Card";

import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import { Box, Slider, Typography } from "@mui/material";

// ----------------------------------------------------------------------

type Props = CardProps & {
  title?: string;
  subheader?: string;
  list: {
    title: string;
    value: number;
    valueMax: number;
    color: "primary" | "secondary" | "error" | "info" | "success" | "warning";
  }[];
};

export function AnalyticsOrderTimeline({ title, subheader, list, ...other }: Props) {
  const marks = [
    {
      value: 0,
      label: "0%",
    },
    {
      value: 500,
      label: "100%",
    },
  ];

  const valuetext = (value: number) => `${value}%`;

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />
      <Box sx={{ padding: 5 }}>
        {list.map((item, index) => (
          <Box sx={{ margin: 2 }} key={`AnalyticsOrderTimeline${index}`}>
            <Typography id="input-slider" gutterBottom>
              {item.title}
            </Typography>
            <Slider
              key={`SliderItem${index}`}
              aria-label="Gastos"
              value={item.value}
              getAriaValueText={valuetext}
              step={10}
              min={0}
              max={item.valueMax}
              valueLabelDisplay="auto"
              marks={marks}
              color={item.color}
              sx={{
                "& .MuiSlider-thumb": {
                  // Mantenha a cor do thumb (ponto de controle)
                  backgroundColor: `${item.color}.main`,
                },
                "& .MuiSlider-rail": {
                  // Mantenha a cor do rail (trilho)
                  backgroundColor: "gray",
                },
                "& .MuiSlider-track": {
                  // Mantenha a cor do track (faixa)
                  backgroundColor: `${item.color}.main`,
                },
              }}
            />
          </Box>
        ))}
      </Box>
    </Card>
  );
}
