import "./style.css";
import "swiper/css";
import "swiper/css/thumbs";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

import { useRef, useEffect } from "react";
import {
  Grid2,
  Box,
  useMediaQuery,
} from "@mui/material";

import { Pagination } from "src/types/Pagination";
import { Envelopes } from "src/types/Envelopes";
import { Transactions } from "src/types/Transactions";
import { ITable } from "src/sections/shared/useTable";
import { TransactionDisplay } from "src/sections/envelope/TransactionDisplay";
import { RealEnvelopesCard } from "src/sections/envelope/RealEnvelopeCard";

type SwiperEnvelopProps = {
  envelopes: Envelopes[]
  currentIndex: number
  handleSlideClick: (index: number) => void
  envelopeActived: string;
  transactions: Pagination<Transactions> | undefined
  table: ITable,
  activeBorderColor: string
  typeFilter?: string;
  onTypeFilterChange?: (type: string) => void;
}
export default function SwiperEnvelop({
  envelopes,
  currentIndex,
  handleSlideClick,
  envelopeActived,
  transactions,
  table,
  activeBorderColor,
  typeFilter = "both",
  onTypeFilterChange = () => { },
}: SwiperEnvelopProps) {

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const swiperRef = useRef<SwiperType | null>(null);

  // Move carousel to the correct slide when currentIndex changes (e.g. loaded from storage)
  useEffect(() => {
    if (swiperRef.current && swiperRef.current.activeIndex !== currentIndex) {
      swiperRef.current.slideTo(currentIndex, 0);
    }
  }, [currentIndex]);

  return (
    <Box sx={{
      width: '100%',
      ...(isMobile && {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        minHeight: 0,
        overflow: 'hidden',
      }),
    }}>
      <Box sx={{ overflowX: "hidden", width: '100%', flexShrink: 0, pb: isMobile ? 0 : '20px' }}>
        <Swiper
          style={{
            width: '100%',
            height: '100%',
            padding: '15px 10px',
            marginLeft: 'auto'
          }}
          spaceBetween={10}
          slidesPerView={1}
          breakpoints={{
            400: { slidesPerView: 1 },
            600: { slidesPerView: 2 },
            900: { slidesPerView: 3 },
            1200: { slidesPerView: 4 },
            1600: { slidesPerView: 5 },
          }}
          modules={[FreeMode, Navigation, Thumbs]}
          initialSlide={currentIndex}
          onSwiper={(swiper) => { swiperRef.current = swiper; }}
          onSlideChange={(swiper) => {
            if (window.innerWidth < 900) {
              handleSlideClick(swiper.activeIndex);
            }
          }}
        >
          {envelopes.map((envelope, index) => (
            <SwiperSlide key={index}>
              <Grid2 onClick={() => handleSlideClick(index)} sx={{ width: "100%", cursor: "pointer" }}>
                <RealEnvelopesCard
                  envelope={envelope}
                  activeCard={envelopeActived === envelope.id}
                  fullWidth={isMobile}
                />
              </Grid2>
            </SwiperSlide>
          ))}
        </Swiper>
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