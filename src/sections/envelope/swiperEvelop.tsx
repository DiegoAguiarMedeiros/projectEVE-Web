import "./style.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

import { useRef, useEffect } from "react";
import {
  Grid,
  Box,
  useMediaQuery,
} from "@mui/material";

import { Pagination } from "src/types/Pagination";
import { Envelopes } from "src/types/Envelopes";
import { Transactions } from "src/types/Transactions";
import { ITable } from "src/sections/shared/useTable";
import { TransactionDisplay } from "src/sections/envelope/TransactionDisplay";
import { RealEnvelopesCard } from "src/components/realEnvelopeCard";

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

  // On mobile, move carousel to the correct slide when currentIndex changes (e.g. loaded from storage)
  useEffect(() => {
    if (isMobile && swiperRef.current && swiperRef.current.activeIndex !== currentIndex) {
      swiperRef.current.slideTo(currentIndex, 0);
    }
    table.onResetPage();
  }, [currentIndex, isMobile]);

  return (
    <Box sx={{
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      minHeight: 0,
    }}>
      <Box sx={{ overflowX: "hidden", width: '100%', flexShrink: 0, pt: 1, px: 1, mb: 2 }}>
        <Swiper
          style={{
            width: '100%',
            height: '100%',
            padding: '15px 10px',
            marginLeft: 'auto'
          }}
          spaceBetween={8}
          slidesPerView={1.3}
          centeredSlides
          centeredSlidesBounds
          breakpoints={{
            440: { slidesPerView: 1.5, centeredSlides: true, centeredSlidesBounds: true, spaceBetween: 8 },
            520: { slidesPerView: 1.8, centeredSlides: true, centeredSlidesBounds: true, spaceBetween: 8 },
            600: { slidesPerView: 2.5, centeredSlides: true, centeredSlidesBounds: true, spaceBetween: 8 },
            900: { slidesPerView: 3.5, centeredSlides: true, centeredSlidesBounds: true, spaceBetween: 8 },
            1200: { slidesPerView: 4.5, centeredSlides: true, centeredSlidesBounds: true, spaceBetween: 8 },
            1600: { slidesPerView: 5.5, centeredSlides: true, centeredSlidesBounds: true, spaceBetween: 8 },
          }}
          modules={[FreeMode, Navigation, Thumbs]}
          initialSlide={currentIndex}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
            
          }}
          onSlideChange={(swiper) => {
            if (window.innerWidth < 900) {
              handleSlideClick(swiper.activeIndex);
            }
          }}
        >
          {envelopes.map((envelope, index) => (
            <SwiperSlide key={index}>
              <Grid onClick={() => handleSlideClick(index)} sx={{ width: "100%", cursor: "pointer" }}>
                <RealEnvelopesCard
                  envelope={envelope}
                  activeCard={envelopeActived === envelope.id}
                  fullWidth={isMobile}
                />
              </Grid>
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