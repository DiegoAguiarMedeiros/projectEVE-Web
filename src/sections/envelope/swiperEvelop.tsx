import './style.css';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import React, { useState, useCallback } from 'react';
// import required modules
import { Thumbs, FreeMode, Navigation } from 'swiper/modules';

import {
  Card,
  Grid2,
  Table,
  useTheme,
  TableBody,
  TableContainer,
  TablePagination,
} from '@mui/material';

import { _users, _envelopes } from 'src/_mock';

import { TableNoData } from './table-no-data';
import { UserTableRow } from './user-table-row';
import { UserTableHead } from './user-table-head';
import { TableEmptyRows } from './table-empty-rows';
import { UserTableToolbar } from './user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from './utils';
import { AnalyticsWidgetSummary } from '../overview/analytics-widget-summary';

import type { UserProps } from './user-table-row';
import { useTable } from '../shared/useTable';

export default function SwiperEnvelop() {
  const theme = useTheme();
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const table = useTable();

  const [filterName, setFilterName] = useState('');

  const dataFiltered: UserProps[] = applyFilter({
    inputData: _users,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });
  const notFound = !dataFiltered.length && !!filterName;

  return (
    <>
      <Swiper
        style={{ padding: '0 25px', margin: '0 -35px' }}
        spaceBetween={10} // Espaço entre os slides
        slidesPerView={1} // Quantos slides por vez
        loop // Habilitando o loop
        breakpoints={{
          600: { slidesPerView: 2 }, // Para telas pequenas
          900: { slidesPerView: 3 }, // Para telas médias
          1200: { slidesPerView: 5 }, // Para telas grandes
        }}
        watchSlidesProgress
        modules={[FreeMode, Navigation, Thumbs]}
        // @ts-ignore
        onProgress={setThumbsSwiper}
        className="mySwiper"
      >
        {_envelopes.map((envelope, index) => (
          <SwiperSlide key={index}>
            <Grid2 sx={{ padding: 2, width: '100%' }}>
              <AnalyticsWidgetSummary
                title={envelope.title}
                percent={envelope.percent}
                total={envelope.total}
                icon={<envelope.icon />}
                color={envelope.color}
              />
            </Grid2>
          </SwiperSlide>
        ))}
      </Swiper>
      <Swiper
        simulateTouch={false}
        spaceBetween={10}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[FreeMode, Navigation, Thumbs]}
      >
        {_envelopes.map((envelope, index) => (
          <SwiperSlide key={index}>
            <Card sx={{ width: '100%' }}>
              <UserTableToolbar
                numSelected={table.selected.length}
                filterName={filterName}
                onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setFilterName(event.target.value);
                  table.onResetPage();
                }}
              />
              <TableContainer sx={{ overflow: 'unset' }}>
                <Table sx={{ minWidth: 800 }}>
                  <UserTableHead
                    order={table.order}
                    orderBy={table.orderBy}
                    rowCount={_users.length}
                    numSelected={table.selected.length}
                    onSort={table.onSort}
                    onSelectAllRows={(checked) =>
                      table.onSelectAllRows(
                        checked,
                        _users.map((user) => user.id)
                      )
                    }
                    headLabel={[
                      { id: 'name', label: 'Name' },
                      { id: 'company', label: 'Company' },
                      { id: 'role', label: 'Role' },
                      { id: 'isVerified', label: 'Verified', align: 'center' },
                      { id: 'status', label: 'Status' },
                      { id: '' },
                    ]}
                  />
                  <TableBody>
                    {dataFiltered
                      .slice(
                        table.page * table.rowsPerPage,
                        table.page * table.rowsPerPage + table.rowsPerPage
                      )
                      .map((row) => (
                        <UserTableRow
                          key={row.id}
                          row={row}
                          selected={table.selected.includes(row.id)}
                          onSelectRow={() => table.onSelectRow(row.id)}
                        />
                      ))}

                    <TableEmptyRows
                      height={68}
                      emptyRows={emptyRows(table.page, table.rowsPerPage, _users.length)}
                    />

                    {notFound && <TableNoData searchQuery={filterName} />}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                component="div"
                page={table.page}
                count={_users.length}
                rowsPerPage={table.rowsPerPage}
                onPageChange={table.onChangePage}
                rowsPerPageOptions={[5, 10, 25]}
                onRowsPerPageChange={table.onChangeRowsPerPage}
              />
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}