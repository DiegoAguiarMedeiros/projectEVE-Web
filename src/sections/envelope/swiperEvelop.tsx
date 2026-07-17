import React, { useEffect, useRef, useState } from "react";
import { Box, Grid, useMediaQuery } from "@mui/material";

import { Pagination } from "src/types/Pagination";
import { Envelopes } from "src/types/Envelopes";
import { Transactions } from "src/types/Transactions";
import { ITable } from "src/sections/shared/useTable";
import { TransactionDisplay } from "src/sections/envelope/TransactionDisplay";
import { RealEnvelopesCard } from "src/components/realEnvelopeCard";

type SwiperEnvelopProps = {
  envelopes: Envelopes[];
  currentIndex: number;
  handleSlideClick: (index: number) => void;
  envelopeActived: string;
  transactions: Pagination<Transactions> | undefined;
  table: ITable;
  activeBorderColor: string;
  typeFilter?: string;
  onTypeFilterChange?: (type: string) => void;
};

export default function SwiperEnvelop({
  envelopes,
  currentIndex,
  handleSlideClick,
  envelopeActived,
  transactions,
  table,
  activeBorderColor,
  typeFilter = "both",
  onTypeFilterChange = () => {},
}: SwiperEnvelopProps) {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));

  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const dragDistance = useRef(0);
  const lastActiveIndex = useRef(currentIndex);

  useEffect(() => {
    lastActiveIndex.current = currentIndex;
  }, [currentIndex]);

  const handleScrollNative = () => {
    if (!isMobile || !containerRef.current) return;
    
    const container = containerRef.current;
    const containerCenter = container.scrollLeft + container.clientWidth / 2;
    
    let closestIndex = lastActiveIndex.current;
    let minDistance = Infinity;

    cardRefs.current.forEach((card, index) => {
      if (card) {
        const cardCenter = card.offsetLeft + card.clientWidth / 2;
        const distance = Math.abs(containerCenter - cardCenter);
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = index;
        }
      }
    });

    if (closestIndex !== lastActiveIndex.current) {
      lastActiveIndex.current = closestIndex;
      handleSlideClick(closestIndex);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
    dragDistance.current = 0;
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    dragDistance.current = Math.abs(x - startX);
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  useEffect(() => {
    table.onResetPage();

    const card = cardRefs.current[currentIndex];

    if (!card) return;

    const container = containerRef.current;
    if (container && isMobile) {
      const containerCenter = container.scrollLeft + container.clientWidth / 2;
      const cardCenter = card.offsetLeft + card.clientWidth / 2;
      
      if (Math.abs(containerCenter - cardCenter) > 30) {
        card.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest",
        });
      }
    } else {
      card.scrollIntoView({
        behavior: "smooth",
        inline: "nearest",
        block: "nearest",
      });
    }
  }, [currentIndex, isMobile]);

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        flex: 1,
        minHeight: 0,
      }}
    >
      <Box
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onScroll={handleScrollNative}
        sx={{
          display: "flex",
          gap: { xs: 2, md: 1 },
          overflowX: "auto",
          overflowY: "hidden",
          px: { xs: "12.5%", sm: "22.5%", md: 1 },
          pt: 1,
          pb: 2,
          scrollSnapType: isDragging ? "none" : {
            xs: "x mandatory",
            md: "none",
          },
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
          cursor: isDragging ? "grabbing" : "grab",
        }}
      >
        {envelopes.map((envelope, index) => (
          <Box
            key={envelope.id}
            ref={(el: HTMLDivElement | null) => {
              cardRefs.current[index] = el;
            }}
            onClick={(e) => {
              if (dragDistance.current > 5) {
                e.stopPropagation();
                e.preventDefault();
                return;
              }
              handleSlideClick(index);
            }}
            sx={{
              cursor: isDragging ? "grabbing" : "pointer",
              flex: {
                xs: "0 0 75%",
                sm: "0 0 55%",
                md: "0 0 220px",
                lg: "0 0 240px",
              },
              scrollSnapAlign: "center",
              userSelect: "none",
            }}
          >
            <Grid sx={{ width: "100%" }}>
              <RealEnvelopesCard
                envelope={envelope}
                activeCard={envelopeActived === envelope.id}
                fullWidth
              />
            </Grid>
          </Box>
        ))}
      </Box>

      <TransactionDisplay
        transactions={transactions}
        envelopeId={envelopeActived}
        table={table}
        activeBorderColor={activeBorderColor}
        allEnvelopes={envelopes}
        typeFilter={typeFilter}
        onTypeFilterChange={onTypeFilterChange}
      />
    </Box>
  );
}