import { useRef, useEffect } from "react";
import { Box, Chip } from "@mui/material";

type ChipTab = {
  label: string;
  index: number;
};

type ChipTabsProps = {
  tabs: ChipTab[];
  activeIndex: number;
  onChange: (index: number) => void;
};

export function ChipTabs({ tabs, activeIndex, onChange }: ChipTabsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const chipRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const activeChip = chipRefs.current[activeIndex];
    if (activeChip && scrollRef.current) {
      const container = scrollRef.current;
      const chipLeft = activeChip.offsetLeft;
      const chipWidth = activeChip.offsetWidth;
      const containerWidth = container.offsetWidth;
      const scrollLeft = chipLeft - containerWidth / 2 + chipWidth / 2;
      container.scrollTo({ left: scrollLeft, behavior: "smooth" });
    }
  }, [activeIndex]);

  return (
    <Box sx={{ width: "100%", minWidth: 0, overflowX: "clip" }}>
      <Box
        ref={scrollRef}
        sx={{
          display: "flex",
          flexWrap: "nowrap",
          gap: 1,
          pb: 1.5,
          px: 1,
          overflowX: "auto",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        {tabs.map((tab) => (
          <Chip
            key={tab.index}
            ref={(el) => { chipRefs.current[tab.index] = el; }}
            label={tab.label}
            size="medium"
            variant={activeIndex === tab.index ? "filled" : "outlined"}
            color={activeIndex === tab.index ? "primary" : "default"}
            onClick={() => onChange(tab.index)}
            sx={{ flexShrink: 0 }}
          />
        ))}
      </Box>
    </Box>
  );
}
