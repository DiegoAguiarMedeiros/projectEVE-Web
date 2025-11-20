import "./style.css";

import { useQuery, useQueryClient } from "@tanstack/react-query";
// Import Swiper styles
import "swiper/css";
import "swiper/css/thumbs";
import "swiper/css/free-mode";
import "swiper/css/navigation";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// import required modules
import { Controller, FreeMode, Navigation, Thumbs } from "swiper/modules";

import {
  Card,
  Grid2,
  Table,
  useTheme,
  TableBody,
  TableContainer,
  TablePagination,
  Box,
  useMediaQuery,
} from "@mui/material";

import { _users } from "src/_mock";

import DeleteIcon from "@mui/icons-material/Delete";
import { EnvelopeSwiperBody } from "src/sections/envelope/EnvelopeSwiperBody";
import { TransactionTable } from "src/sections/envelope/transactionTable";
import { Pagination } from "src/types/Pagination";
import { Envelopes } from "src/types/Envelopes";
import { Transactions } from "src/types/Transactions";
import { ITable } from "src/sections/shared/useTable";
import { TransactionList } from "src/sections/envelope/transactionList";

type SwiperEnvelopProps = {
  envelopes: Envelopes[]
  currentIndex: number
  handleSlideClick: (index: number) => void
  envelopeActived: string;
  transactions: Pagination<Transactions> | undefined
  table: ITable
}
export default function SwiperEnvelop({
  envelopes,
  currentIndex,
  handleSlideClick,
  envelopeActived,
  transactions,
  table
}: SwiperEnvelopProps) {

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));


  return (
    <>
      <Box style={{ overflowX: "hidden", width: '100%', padding: '0  0 20px 0' }}>
        <Swiper
          style={{ overflow: "visible", cursor: "pointer" }}
          spaceBetween={10}
          slidesPerView={1}
          breakpoints={{
            600: { slidesPerView: 2 },
            900: { slidesPerView: 3 },
            1200: { slidesPerView: 5 },
          }}
          modules={[FreeMode, Navigation, Thumbs]}
          initialSlide={currentIndex}
          onSlideChange={(swiper) => {
            // quando for mobile (apenas 1 slide visível)
            if (window.innerWidth < 600) {
              handleSlideClick(swiper.activeIndex);
            }
          }}
        >
          {envelopes.map((envelope, index) => (
            <SwiperSlide key={index}>
              <Grid2 onClick={() => handleSlideClick(index)} sx={{ width: "100%" }}>
                <EnvelopeSwiperBody
                  sx={{ padding: 2, width: "100%" }}
                  title={envelope.name}
                  percent={envelope.percentage}
                  total={envelope.amount || 0}
                  icon={<DeleteIcon />}
                  color={envelope.color}
                  activeCard={envelopeActived === envelope.id}
                />
              </Grid2>
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>
      {isMobile ? (
        <TransactionList
          transactions={transactions}
          envelopeId={envelopeActived}
          table={table}
        />
      ) : (
        <TransactionTable
          transactions={transactions}
          envelopeId={envelopeActived}
          table={table}
        />
      )}

    </>
  );
}