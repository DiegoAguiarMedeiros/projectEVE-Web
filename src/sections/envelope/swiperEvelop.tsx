import './style.css';

import { useQuery, useQueryClient } from '@tanstack/react-query';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import React, { useState, useCallback, useEffect } from 'react';
// import required modules
import { Controller, FreeMode, Navigation, Thumbs } from 'swiper/modules';

import {
  Card,
  Grid2,
  Table,
  useTheme,
  TableBody,
  TableContainer,
  TablePagination,
} from '@mui/material';

import { _users } from 'src/_mock';

import EnvelopesService from 'src/services/implementation/EnvelopesService';
import DeleteIcon from "@mui/icons-material/Delete";
import { EnvelopeSwiperBody } from './EnvelopeSwiperBody';
import { useTable } from '../shared/useTable';
import { TransactionTable } from './transactionTable';

export default function SwiperEnvelop() {
  const theme = useTheme();
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const queryClient = useQueryClient();
  const [active, setActive] = useState<string>('');


  const { data: envelopes } = useQuery({
    queryKey: ['envelope'],
    queryFn: () => EnvelopesService.list(),
    staleTime: 5000,
    gcTime: 60000,
    placeholderData: (previousData) => previousData,
  });


  useEffect(() => {
    if (envelopes && envelopes.length > 0) {
      setActive(envelopes[0].id);
      queryClient.invalidateQueries({ queryKey: ["transaction-by-envelope"] });
    }
  }, [queryClient,envelopes]);
  useEffect(() => {
      queryClient.invalidateQueries({ queryKey: ["transaction-by-envelope"] });
  }, [queryClient,active]);

  return (
    <>
      <Swiper
        style={{  cursor: 'pointer' }}
        spaceBetween={10}
        slidesPerView={1}
        loop
        breakpoints={{
          600: { slidesPerView: 2 },
          900: { slidesPerView: 3 },
          1200: { slidesPerView: 5 },
        }}
        watchSlidesProgress
        thumbs={{ swiper: thumbsSwiper }}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper"
      >
        {envelopes && envelopes.map((envelope, index) => (
          <SwiperSlide key={index}>
            <Grid2 onClick={() => setActive(envelope.id)} >
              <EnvelopeSwiperBody
                sx={active === envelope.id ? { backgroundColor: envelope.color, padding: 2, width: '100%', } : { padding: 2, width: '100%', }}
                title={envelope.name}
                percent={envelope.percentage}
                total={0}
                icon={<DeleteIcon />}
                color={envelope.color}
              />
            </Grid2>
          </SwiperSlide>
        ))}
      </Swiper>
      <TransactionTable envelopeId={active}/>
    </>
  );
}