import './style.css';

import { useQuery, useQueryClient } from '@tanstack/react-query';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import React, { useState, useCallback, useEffect, useRef } from 'react';
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

import DeleteIcon from "@mui/icons-material/Delete";
import EnvelopesService from 'src/services/implementation/EnvelopesService';
import { useSelectedMonthYearStore } from 'src/store/useSelectedMonthYearStore';
import { EnvelopeSwiperBody } from './EnvelopeSwiperBody';
import { useTable } from '../shared/useTable';
import { TransactionTable } from './transactionTable';

export default function SwiperEnvelop() {
  const [active, setActive] = useState<string>('');
  const [currentIndex, setCurrentIndex] = useState(0);

  const queryClient = useQueryClient();
  const { month, year } = useSelectedMonthYearStore();

  const { data: envelopes } = useQuery({
    queryKey: ['envelope'],
    queryFn: () => EnvelopesService.listWithAmount(year, month),
    staleTime: 5000,
    placeholderData: (prev) => prev,
  });

  useEffect(() => {
    if (envelopes && envelopes.length > 0) {
      const saved = localStorage.getItem('lastSlideIndex');
      const index = saved ? parseInt(saved, 10) : 0;
      const envelope = envelopes[index];
      if (envelope) {
        setActive(envelope.id);
      }
    }
  }, [envelopes]);

  const handleSlideClick = (index: number) => {
    localStorage.setItem('lastSlideIndex', index.toString());

    const selected = envelopes?.[index];
    if (selected) {
      setActive(selected.id);
      queryClient.invalidateQueries({ queryKey: ["transaction-by-envelope"] });
    }
  };


  return (
    <>
      <Swiper
        style={{ cursor: 'pointer' }}
        spaceBetween={10}
        slidesPerView={1}
        loop
        breakpoints={{
          600: { slidesPerView: 2 },
          900: { slidesPerView: 3 },
          1200: { slidesPerView: 5 },
        }}
        modules={[FreeMode, Navigation, Thumbs]}
        initialSlide={currentIndex}
      >
        {envelopes && envelopes.map((envelope, index) => (
          <SwiperSlide key={index}>
            <Grid2 onClick={() => handleSlideClick(index)} sx={{ width: '100%' }}>
              <EnvelopeSwiperBody
                sx={active === envelope.id ? { backgroundColor: envelope.color, padding: 2, width: '100%', } : { padding: 2, width: '100%', }}
                title={envelope.name}
                percent={envelope.percentage}
                total={envelope.amount || 0}
                icon={<DeleteIcon />}
                color={envelope.color}
              />
            </Grid2>
          </SwiperSlide>
        ))}
      </Swiper>
      <TransactionTable envelopeId={active} />
    </>
  );
}