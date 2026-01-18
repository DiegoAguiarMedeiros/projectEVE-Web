import "./style.css";
import "swiper/css";
import "swiper/css/thumbs";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";

import {
  Grid2,
  useTheme,
  Box,
  useMediaQuery,
} from "@mui/material";

import { _users } from "src/_mock";

import { TransactionTable } from "src/sections/envelope/transactionTable";
import { Pagination } from "src/types/Pagination";
import { Envelopes } from "src/types/Envelopes";
import { Transactions } from "src/types/Transactions";
import { ITable } from "src/sections/shared/useTable";
import { TransactionList } from "src/sections/envelope/transactionList";
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

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <>
      <Box style={{ overflowX: "hidden", width: '100%', padding: '0  0 20px 0' }}>
        <Swiper
          style={{
            width: '100%',
            height: '100%',
            padding: '15px 10px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
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
              <Grid2 onClick={() => handleSlideClick(index)} sx={{ width: "100%", cursor: "pointer" }}>
                <RealEnvelopesCard
                  envelope={envelope}
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
          allEnvelopes={envelopes}
        />
      ) : (
        <TransactionTable
          transactions={transactions}
          envelopeId={envelopeActived}
          table={table}
          activeBorderColor={activeBorderColor}
          allEnvelopes={envelopes}
          typeFilter={typeFilter}
          onTypeFilterChange={onTypeFilterChange}
        />
      )}

    </>
  );
}